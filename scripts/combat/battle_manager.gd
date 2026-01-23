extends Node
class_name BattleManager
## BattleManager - Controls the flow of turn-based combat

signal battle_started
signal turn_started(combatant: Dictionary)
signal turn_ended(combatant: Dictionary)
signal action_executed(action: Dictionary)
signal battle_ended(victory: bool)
signal combatant_defeated(combatant: Dictionary)
signal experience_gained(amount: int)

enum BattleState {
	INACTIVE,
	STARTING,
	PLAYER_TURN,
	ENEMY_TURN,
	EXECUTING_ACTION,
	VICTORY,
	DEFEAT
}

var current_state: BattleState = BattleState.INACTIVE
var party_combatants: Array[Dictionary] = []
var enemy_combatants: Array[Dictionary] = []
var turn_order: Array[Dictionary] = []
var current_turn_index: int = 0

var selected_action: Dictionary = {}
var selected_targets: Array = []

# Loaded skill data
var skill_database: Dictionary = {}


func _ready() -> void:
	_load_skill_database()


func _load_skill_database() -> void:
	# Load skills from JSON
	var file = FileAccess.open("res://data/skills.json", FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			var data = json.get_data()
			var skills_data = data.get("skills", {})
			
			# Load player skills
			for skill_data in skills_data.get("player", []):
				skill_database[skill_data["id"]] = SkillData.from_dict(skill_data)
			
			# Load enemy skills
			for skill_data in skills_data.get("enemy", []):
				skill_database[skill_data["id"]] = SkillData.from_dict(skill_data)
			
			# Load boss skills
			for skill_data in skills_data.get("boss", []):
				skill_database[skill_data["id"]] = SkillData.from_dict(skill_data)
		file.close()
	
	# Add default skills if database is empty
	if skill_database.is_empty():
		_create_default_skills()


func _create_default_skills() -> void:
	var basic_attack = SkillData.new()
	basic_attack.id = "basic_attack"
	basic_attack.display_name = "Attack"
	basic_attack.description = "A basic physical attack."
	basic_attack.target_type = SkillData.TargetType.SINGLE_ENEMY
	basic_attack.damage_type = SkillData.DamageType.PHYSICAL
	basic_attack.base_power = 10
	basic_attack.attack_scaling = 1.0
	basic_attack.is_basic_attack = true
	skill_database["basic_attack"] = basic_attack
	
	var defend = SkillData.new()
	defend.id = "defend"
	defend.display_name = "Defend"
	defend.description = "Reduce incoming damage this turn."
	defend.target_type = SkillData.TargetType.SELF
	defend.is_defend = true
	skill_database["defend"] = defend
	
	var heal = SkillData.new()
	heal.id = "heal"
	heal.display_name = "Heal"
	heal.description = "Restore HP to an ally."
	heal.target_type = SkillData.TargetType.SINGLE_ALLY
	heal.damage_type = SkillData.DamageType.HEALING
	heal.base_power = 30
	heal.magic_scaling = 0.5
	heal.mp_cost = 8
	skill_database["heal"] = heal
	
	var memory_flash = SkillData.new()
	memory_flash.id = "memory_flash"
	memory_flash.display_name = "Memory Flash"
	memory_flash.description = "Strike with a flash of divine memory."
	memory_flash.target_type = SkillData.TargetType.SINGLE_ENEMY
	memory_flash.damage_type = SkillData.DamageType.MAGICAL
	memory_flash.element = SkillData.Element.LIGHT
	memory_flash.base_power = 25
	memory_flash.magic_scaling = 1.2
	memory_flash.mp_cost = 12
	skill_database["memory_flash"] = memory_flash


## Start a new battle
func start_battle(enemies: Array) -> void:
	current_state = BattleState.STARTING
	
	# Setup party combatants from PartyManager
	party_combatants.clear()
	for character in PartyManager.get_active_party():
		party_combatants.append(_character_to_combatant(character))
	
	# Setup enemy combatants
	enemy_combatants.clear()
	for enemy_data in enemies:
		if enemy_data is EnemyData:
			enemy_combatants.append(enemy_data.create_instance())
		elif enemy_data is Dictionary:
			enemy_combatants.append(enemy_data.duplicate(true))
	
	battle_started.emit()
	_calculate_turn_order()
	_start_next_turn()


func _character_to_combatant(character: CharacterData) -> Dictionary:
	return {
		"id": character.id,
		"display_name": character.display_name,
		"character_ref": character,
		"sprite_path": character.sprite_path,
		"portrait_path": character.portrait_path,
		"max_hp": character.max_hp,
		"current_hp": character.current_hp,
		"max_mp": character.max_mp,
		"current_mp": character.current_mp,
		"attack": character.get_total_attack(),
		"defense": character.get_total_defense(),
		"magic": character.get_total_magic(),
		"speed": character.speed,
		"luck": character.luck,
		"skills": character.skills.duplicate(),
		"status_effects": [],
		"is_enemy": false,
		"is_defending": false
	}


func _calculate_turn_order() -> void:
	turn_order.clear()
	
	# Combine all combatants
	var all_combatants = party_combatants.duplicate()
	all_combatants.append_array(enemy_combatants)
	
	# Sort by speed (descending)
	all_combatants.sort_custom(func(a, b): return a["speed"] > b["speed"])
	
	# Filter out defeated combatants
	for combatant in all_combatants:
		if combatant["current_hp"] > 0:
			turn_order.append(combatant)
	
	current_turn_index = 0


func _start_next_turn() -> void:
	# Check for battle end conditions
	if _check_battle_end():
		return
	
	# Reset defending status at start of each combatant's turn
	var current = get_current_combatant()
	if current:
		current["is_defending"] = false
	
	# Recalculate turn order if needed (after defeats)
	if current_turn_index >= turn_order.size():
		_calculate_turn_order()
	
	var combatant = get_current_combatant()
	if combatant == null:
		return
	
	turn_started.emit(combatant)
	
	if combatant["is_enemy"]:
		current_state = BattleState.ENEMY_TURN
		_execute_enemy_turn(combatant)
	else:
		current_state = BattleState.PLAYER_TURN
		# Wait for player input via UI


func get_current_combatant() -> Dictionary:
	if current_turn_index < turn_order.size():
		return turn_order[current_turn_index]
	return {}


## Called by UI when player selects an action
func select_action(skill_id: String) -> void:
	if current_state != BattleState.PLAYER_TURN:
		return
	
	var skill = skill_database.get(skill_id)
	if skill == null:
		return
	
	selected_action = {
		"skill": skill,
		"user": get_current_combatant()
	}
	
	# Determine valid targets
	match skill.target_type:
		SkillData.TargetType.SINGLE_ENEMY:
			# UI should show enemy selection
			pass
		SkillData.TargetType.ALL_ENEMIES:
			selected_targets = enemy_combatants.filter(func(e): return e["current_hp"] > 0)
			execute_selected_action()
		SkillData.TargetType.SINGLE_ALLY:
			# UI should show ally selection
			pass
		SkillData.TargetType.ALL_ALLIES:
			selected_targets = party_combatants.filter(func(p): return p["current_hp"] > 0)
			execute_selected_action()
		SkillData.TargetType.SELF:
			selected_targets = [get_current_combatant()]
			execute_selected_action()


## Called by UI when player selects a target
func select_target(target: Dictionary) -> void:
	selected_targets = [target]
	execute_selected_action()


func execute_selected_action() -> void:
	if selected_action.is_empty() or selected_targets.is_empty():
		return
	
	current_state = BattleState.EXECUTING_ACTION
	await _execute_action(selected_action["user"], selected_action["skill"], selected_targets)
	
	_end_current_turn()


func _execute_action(user: Dictionary, skill: SkillData, targets: Array) -> void:
	var action_result = {
		"user": user,
		"skill": skill,
		"targets": [],
		"total_damage": 0
	}
	
	# Deduct costs
	if skill.mp_cost > 0:
		user["current_mp"] = max(0, user["current_mp"] - skill.mp_cost)
		if user.has("character_ref"):
			user["character_ref"].current_mp = user["current_mp"]
	
	# Handle defend
	if skill.is_defend:
		user["is_defending"] = true
		action_result["targets"].append({
			"target": user,
			"effect": "defending"
		})
		action_executed.emit(action_result)
		return
	
	# Execute on each target
	for target in targets:
		var target_result = {"target": target}
		
		if skill.damage_type == SkillData.DamageType.HEALING:
			var heal_amount = skill.base_power + int(user["magic"] * skill.magic_scaling)
			target["current_hp"] = min(target["max_hp"], target["current_hp"] + heal_amount)
			target_result["heal"] = heal_amount
			
			if target.has("character_ref"):
				target["character_ref"].current_hp = target["current_hp"]
		else:
			# Calculate damage
			var damage = skill.calculate_damage(
				user.get("character_ref", _dict_to_temp_character(user)),
				_dict_to_temp_character(target)
			)
			
			# Apply defending reduction
			if target.get("is_defending", false):
				damage = int(damage * 0.5)
			
			# Check for critical hit
			var is_crit = false
			if skill.can_crit and randf() < (user.get("luck", 5) / 100.0):
				damage = int(damage * skill.crit_multiplier)
				is_crit = true
			
			# Apply damage
			target["current_hp"] = max(0, target["current_hp"] - damage)
			target_result["damage"] = damage
			target_result["is_crit"] = is_crit
			action_result["total_damage"] += damage
			
			# Update character reference if it's a party member
			if target.has("character_ref"):
				target["character_ref"].current_hp = target["current_hp"]
			
			# Check for defeat
			if target["current_hp"] <= 0:
				target_result["defeated"] = true
				combatant_defeated.emit(target)
		
		action_result["targets"].append(target_result)
	
	action_executed.emit(action_result)
	
	# Small delay for animation
	await get_tree().create_timer(0.5).timeout


func _dict_to_temp_character(dict: Dictionary) -> CharacterData:
	var temp = CharacterData.new()
	temp.attack = dict.get("attack", 10)
	temp.defense = dict.get("defense", 10)
	temp.magic = dict.get("magic", 10)
	return temp


func _execute_enemy_turn(enemy: Dictionary) -> void:
	# Simple AI: pick a random skill and random target
	var available_skills = enemy.get("skills", ["basic_attack"])
	var skill_id = available_skills[randi() % available_skills.size()]
	var skill = skill_database.get(skill_id, skill_database["basic_attack"])
	
	# Pick target based on skill type
	var targets = []
	match skill.target_type:
		SkillData.TargetType.SINGLE_ENEMY, SkillData.TargetType.SINGLE_ALLY:
			# Enemy targeting party = SINGLE_ENEMY from their perspective
			var alive_party = party_combatants.filter(func(p): return p["current_hp"] > 0)
			if alive_party.size() > 0:
				targets = [alive_party[randi() % alive_party.size()]]
		SkillData.TargetType.ALL_ENEMIES, SkillData.TargetType.ALL_ALLIES:
			targets = party_combatants.filter(func(p): return p["current_hp"] > 0)
		SkillData.TargetType.SELF:
			targets = [enemy]
	
	if targets.is_empty():
		_end_current_turn()
		return
	
	current_state = BattleState.EXECUTING_ACTION
	await _execute_action(enemy, skill, targets)
	_end_current_turn()


func _end_current_turn() -> void:
	var combatant = get_current_combatant()
	turn_ended.emit(combatant)
	
	# Move to next turn
	current_turn_index += 1
	if current_turn_index >= turn_order.size():
		# New round
		_calculate_turn_order()
	
	# Small delay between turns
	await get_tree().create_timer(0.3).timeout
	_start_next_turn()


func _check_battle_end() -> bool:
	var party_alive = party_combatants.filter(func(p): return p["current_hp"] > 0)
	var enemies_alive = enemy_combatants.filter(func(e): return e["current_hp"] > 0)
	
	if party_alive.is_empty():
		current_state = BattleState.DEFEAT
		battle_ended.emit(false)
		return true
	
	if enemies_alive.is_empty():
		current_state = BattleState.VICTORY
		_award_victory_rewards()
		battle_ended.emit(true)
		return true
	
	return false


func _award_victory_rewards() -> void:
	var total_xp = 0
	var total_currency = 0
	
	for enemy in enemy_combatants:
		total_xp += enemy.get("experience_reward", 10)
		total_currency += enemy.get("currency_reward", 5)
	
	PartyManager.award_experience(total_xp)
	PartyManager.add_currency(total_currency)
	
	experience_gained.emit(total_xp)


## Get skill data by ID
func get_skill(skill_id: String) -> SkillData:
	return skill_database.get(skill_id)


## Get all available skills for a combatant
func get_available_skills(combatant: Dictionary) -> Array[SkillData]:
	var skills: Array[SkillData] = []
	for skill_id in combatant.get("skills", []):
		var skill = skill_database.get(skill_id)
		if skill and skill.can_use(_dict_to_temp_character(combatant)):
			skills.append(skill)
	return skills


## Check if a skill can be used by combatant
func can_use_skill(combatant: Dictionary, skill_id: String) -> bool:
	var skill = skill_database.get(skill_id)
	if skill == null:
		return false
	return combatant["current_mp"] >= skill.mp_cost
