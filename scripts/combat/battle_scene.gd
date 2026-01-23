extends Node2D
## BattleScene - Main battle scene controller

@onready var battle_manager: BattleManager = $BattleManager
@onready var command_menu: VBoxContainer = $CanvasLayer/BattleUI/CommandMenu
@onready var skills_menu: VBoxContainer = $CanvasLayer/BattleUI/SkillsMenu
@onready var target_menu: HBoxContainer = $CanvasLayer/BattleUI/TargetMenu
@onready var party_status: VBoxContainer = $CanvasLayer/BattleUI/PartyStatus
@onready var turn_indicator: Label = $CanvasLayer/BattleUI/TurnIndicator
@onready var victory_screen: Control = $CanvasLayer/VictoryScreen
@onready var xp_label: Label = $CanvasLayer/VictoryScreen/ContentPanel/VBoxContainer/XPLabel
@onready var currency_label: Label = $CanvasLayer/VictoryScreen/ContentPanel/VBoxContainer/CurrencyLabel
@onready var gameover_screen: Control = $CanvasLayer/GameOverScreen
@onready var damage_numbers: Node2D = $DamageNumbers

@onready var enemy_positions: Node2D = $EnemyPositions
@onready var party_positions: Node2D = $PartyPositions

var enemy_sprites: Array[Node2D] = []
var party_sprites: Array[Node2D] = []
var current_target_type: SkillData.TargetType

# Button references
@onready var attack_button: Button = $CanvasLayer/BattleUI/CommandMenu/AttackButton
@onready var skills_button: Button = $CanvasLayer/BattleUI/CommandMenu/SkillsButton
@onready var defend_button: Button = $CanvasLayer/BattleUI/CommandMenu/DefendButton
@onready var items_button: Button = $CanvasLayer/BattleUI/CommandMenu/ItemsButton
@onready var continue_button: Button = $CanvasLayer/VictoryScreen/ContentPanel/VBoxContainer/ContinueButton
@onready var retry_button: Button = $CanvasLayer/GameOverScreen/ContentPanel/VBoxContainer/RetryButton
@onready var quit_button: Button = $CanvasLayer/GameOverScreen/ContentPanel/VBoxContainer/QuitButton


func _ready() -> void:
	# Connect battle manager signals
	battle_manager.battle_started.connect(_on_battle_started)
	battle_manager.turn_started.connect(_on_turn_started)
	battle_manager.action_executed.connect(_on_action_executed)
	battle_manager.battle_ended.connect(_on_battle_ended)
	battle_manager.experience_gained.connect(_on_experience_gained)
	battle_manager.combatant_defeated.connect(_on_combatant_defeated)
	
	# Connect UI buttons
	attack_button.pressed.connect(_on_attack_pressed)
	skills_button.pressed.connect(_on_skills_pressed)
	defend_button.pressed.connect(_on_defend_pressed)
	items_button.pressed.connect(_on_items_pressed)
	continue_button.pressed.connect(_on_continue_pressed)
	
	# Connect game over buttons
	retry_button.pressed.connect(_on_retry_pressed)
	quit_button.pressed.connect(_on_quit_pressed)
	
	# Hide menus initially
	command_menu.hide()
	skills_menu.hide()
	target_menu.hide()
	victory_screen.hide()
	gameover_screen.hide()
	
	# Start battle with test enemies if no data provided
	_start_test_battle()


func _start_test_battle() -> void:
	# Create test enemies from real enemy data
	var enemies = []
	
	# Load a real enemy - Eidolon (Tier 1)
	var eidolon = {
		"id": "eidolon",
		"display_name": "Eidolon",
		"sprite_path": "res://assets/sprites/enemies/common/eidolon_spritesheet.png",
		"max_hp": 35,
		"current_hp": 35,
		"attack": 8,
		"defense": 4,
		"magic": 10,
		"speed": 9,
		"skills": ["spectral_touch", "basic_attack"],
		"experience_reward": 12,
		"currency_reward": 8,
		"is_enemy": true
	}
	enemies.append(eidolon)
	
	battle_manager.start_battle(enemies)


func _on_battle_started() -> void:
	_setup_combatant_sprites()
	_update_party_status()


func _setup_combatant_sprites() -> void:
	# Clear existing sprites
	for sprite in enemy_sprites:
		sprite.queue_free()
	enemy_sprites.clear()
	
	for sprite in party_sprites:
		sprite.queue_free()
	party_sprites.clear()
	
	# Create enemy sprites
	var positions = enemy_positions.get_children()
	for i in range(battle_manager.enemy_combatants.size()):
		var enemy = battle_manager.enemy_combatants[i]
		var sprite = _create_combatant_sprite(enemy, true)
		if i < positions.size():
			sprite.global_position = positions[i].global_position
		add_child(sprite)
		enemy_sprites.append(sprite)
	
	# Create party sprites
	positions = party_positions.get_children()
	for i in range(battle_manager.party_combatants.size()):
		var member = battle_manager.party_combatants[i]
		var sprite = _create_combatant_sprite(member, false)
		if i < positions.size():
			sprite.global_position = positions[i].global_position
		add_child(sprite)
		party_sprites.append(sprite)


func _create_combatant_sprite(combatant: Dictionary, is_enemy: bool) -> Node2D:
	var container = Node2D.new()
	container.name = combatant["display_name"]
	
	# Try to load actual sprite texture
	var sprite_path = combatant.get("sprite_path", "")
	var has_sprite = false
	
	if sprite_path != "" and ResourceLoader.exists(sprite_path):
		var texture = load(sprite_path)
		if texture:
			var sprite = Sprite2D.new()
			sprite.texture = texture
			sprite.name = "Sprite"
			# Assume sprite sheet, use first frame (top-left)
			sprite.hframes = 4  # 4 columns
			sprite.vframes = 3  # 3 rows (idle, walk/attack, hurt)
			sprite.frame = 0    # First frame of idle
			# Scale for visibility (sprites are large, scale down)
			sprite.scale = Vector2(0.4, 0.4)
			# Flip enemies to face left (toward party)
			if is_enemy:
				sprite.flip_h = true
			container.add_child(sprite)
			has_sprite = true
	
	# Fallback to colored rectangle if no sprite
	if not has_sprite:
		var placeholder = ColorRect.new()
		placeholder.size = Vector2(64, 64)
		placeholder.position = Vector2(-32, -32)
		placeholder.color = Color.CRIMSON if is_enemy else Color.DODGER_BLUE
		placeholder.name = "Sprite"
		container.add_child(placeholder)
	
	# Add name label
	var label = Label.new()
	label.text = combatant["display_name"]
	label.position = Vector2(-40, -70)
	label.add_theme_font_size_override("font_size", 14)
	label.add_theme_color_override("font_color", Color.WHITE)
	label.add_theme_color_override("font_outline_color", Color.BLACK)
	label.add_theme_constant_override("outline_size", 2)
	container.add_child(label)
	
	# Add HP bar background
	var hp_bg = ColorRect.new()
	hp_bg.size = Vector2(64, 10)
	hp_bg.position = Vector2(-32, 50)
	hp_bg.color = Color(0.2, 0.2, 0.2, 0.8)
	container.add_child(hp_bg)
	
	# Add HP bar
	var hp_bar = ProgressBar.new()
	hp_bar.size = Vector2(60, 8)
	hp_bar.position = Vector2(-30, 51)
	hp_bar.max_value = combatant["max_hp"]
	hp_bar.value = combatant["current_hp"]
	hp_bar.show_percentage = false
	hp_bar.name = "HPBar"
	container.add_child(hp_bar)
	
	# Store reference to combatant data
	container.set_meta("combatant", combatant)
	
	return container


func _on_turn_started(combatant: Dictionary) -> void:
	turn_indicator.text = "Turn: " + combatant["display_name"]
	
	if not combatant["is_enemy"]:
		command_menu.show()
		attack_button.grab_focus()
	else:
		command_menu.hide()


func _on_attack_pressed() -> void:
	command_menu.hide()
	battle_manager.select_action("basic_attack")
	_show_target_selection(SkillData.TargetType.SINGLE_ENEMY)


func _on_skills_pressed() -> void:
	command_menu.hide()
	_populate_skills_menu()
	skills_menu.show()


func _on_defend_pressed() -> void:
	command_menu.hide()
	battle_manager.select_action("defend")


func _on_items_pressed() -> void:
	# TODO: Implement items menu
	pass


func _populate_skills_menu() -> void:
	# Clear existing buttons
	for child in skills_menu.get_children():
		child.queue_free()
	
	var combatant = battle_manager.get_current_combatant()
	var skills = battle_manager.get_available_skills(combatant)
	
	for skill in skills:
		if skill.is_basic_attack or skill.is_defend:
			continue
		
		var button = Button.new()
		button.text = "%s (%d MP)" % [skill.display_name, skill.mp_cost]
		button.disabled = not battle_manager.can_use_skill(combatant, skill.id)
		button.pressed.connect(_on_skill_selected.bind(skill.id))
		skills_menu.add_child(button)
	
	# Add back button
	var back_button = Button.new()
	back_button.text = "Back"
	back_button.pressed.connect(_on_skills_back)
	skills_menu.add_child(back_button)


func _on_skill_selected(skill_id: String) -> void:
	skills_menu.hide()
	var skill = battle_manager.get_skill(skill_id)
	battle_manager.select_action(skill_id)
	
	if skill.target_type == SkillData.TargetType.SELF or \
	   skill.target_type == SkillData.TargetType.ALL_ALLIES or \
	   skill.target_type == SkillData.TargetType.ALL_ENEMIES:
		# Auto-execute for these target types
		pass
	else:
		_show_target_selection(skill.target_type)


func _on_skills_back() -> void:
	skills_menu.hide()
	command_menu.show()


func _show_target_selection(target_type: SkillData.TargetType) -> void:
	current_target_type = target_type
	
	# Clear existing buttons
	for child in target_menu.get_children():
		child.queue_free()
	
	var targets = []
	if target_type == SkillData.TargetType.SINGLE_ENEMY:
		targets = battle_manager.enemy_combatants.filter(func(e): return e["current_hp"] > 0)
	else:
		targets = battle_manager.party_combatants.filter(func(p): return p["current_hp"] > 0)
	
	for target in targets:
		var button = Button.new()
		button.text = target["display_name"]
		button.pressed.connect(_on_target_selected.bind(target))
		target_menu.add_child(button)
	
	target_menu.show()
	if target_menu.get_child_count() > 0:
		target_menu.get_child(0).grab_focus()


func _on_target_selected(target: Dictionary) -> void:
	target_menu.hide()
	battle_manager.select_target(target)


func _on_action_executed(action: Dictionary) -> void:
	for target_result in action["targets"]:
		var target = target_result["target"]
		
		# Find sprite for this target
		var sprite_list = enemy_sprites if target.get("is_enemy", false) else party_sprites
		for sprite in sprite_list:
			if sprite.get_meta("combatant") == target:
				# Update HP bar
				var hp_bar = sprite.get_node_or_null("HPBar")
				if hp_bar:
					hp_bar.value = target["current_hp"]
				
				# Show damage number
				if target_result.has("damage"):
					_spawn_damage_number(sprite.global_position, target_result["damage"], target_result.get("is_crit", false))
				elif target_result.has("heal"):
					_spawn_damage_number(sprite.global_position, target_result["heal"], false, true)
				
				break
	
	_update_party_status()


func _spawn_damage_number(pos: Vector2, amount: int, is_crit: bool, is_heal: bool = false) -> void:
	var label = Label.new()
	label.text = str(amount)
	label.position = pos + Vector2(-20, -40)
	
	if is_heal:
		label.add_theme_color_override("font_color", Color.LIME_GREEN)
	elif is_crit:
		label.add_theme_color_override("font_color", Color.GOLD)
		label.add_theme_font_size_override("font_size", 24)
	else:
		label.add_theme_color_override("font_color", Color.WHITE)
	
	damage_numbers.add_child(label)
	
	# Animate and remove
	var tween = create_tween()
	tween.tween_property(label, "position:y", label.position.y - 30, 0.5)
	tween.parallel().tween_property(label, "modulate:a", 0.0, 0.5)
	tween.tween_callback(label.queue_free)


func _on_combatant_defeated(combatant: Dictionary) -> void:
	# Find and hide the defeated sprite
	var sprite_list = enemy_sprites if combatant.get("is_enemy", false) else party_sprites
	for sprite in sprite_list:
		if sprite.get_meta("combatant") == combatant:
			sprite.modulate = Color(0.3, 0.3, 0.3, 0.5)
			break


func _on_battle_ended(victory: bool) -> void:
	command_menu.hide()
	skills_menu.hide()
	target_menu.hide()
	
	if victory:
		victory_screen.show()
		continue_button.grab_focus()
	else:
		# Show game over screen
		await get_tree().create_timer(1.0).timeout
		gameover_screen.show()
		retry_button.grab_focus()


func _on_experience_gained(amount: int) -> void:
	xp_label.text = "EXP Gained: " + str(amount)


func _on_continue_pressed() -> void:
	victory_screen.hide()
	GameManager.end_combat(true)


func _on_retry_pressed() -> void:
	gameover_screen.hide()
	# Reload the current battle
	get_tree().reload_current_scene()


func _on_quit_pressed() -> void:
	gameover_screen.hide()
	GameManager.end_combat(false)


func _update_party_status() -> void:
	# Clear existing status
	for child in party_status.get_children():
		child.queue_free()
	
	# Create status for each party member
	for member in battle_manager.party_combatants:
		var container = HBoxContainer.new()
		
		var name_label = Label.new()
		name_label.text = member["display_name"]
		name_label.custom_minimum_size = Vector2(100, 0)
		container.add_child(name_label)
		
		var hp_label = Label.new()
		hp_label.text = "HP: %d/%d" % [member["current_hp"], member["max_hp"]]
		hp_label.custom_minimum_size = Vector2(100, 0)
		container.add_child(hp_label)
		
		var mp_label = Label.new()
		mp_label.text = "MP: %d/%d" % [member["current_mp"], member["max_mp"]]
		container.add_child(mp_label)
		
		party_status.add_child(container)
