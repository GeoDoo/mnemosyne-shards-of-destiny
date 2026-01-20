extends Resource
class_name CharacterData
## CharacterData - Data container for character stats and progression

@export var id: String = ""
@export var display_name: String = ""
@export var character_class: String = ""
@export var portrait_path: String = ""
@export var sprite_path: String = ""

# Level and experience
@export var level: int = 1
@export var experience: int = 0
@export var skill_points: int = 0

# Core stats
@export var max_hp: int = 100
@export var current_hp: int = 100
@export var max_mp: int = 30
@export var current_mp: int = 30

# Combat stats
@export var attack: int = 10
@export var defense: int = 10
@export var magic: int = 10
@export var speed: int = 10
@export var luck: int = 5

# Skills
@export var skills: Array[String] = []
@export var equipped_skills: Array[String] = []  # Skills set in battle menu

# Equipment slots (item IDs)
@export var equipment: Dictionary = {
	"weapon": "",
	"armor": "",
	"accessory": ""
}

# Status effects in battle
var status_effects: Array[Dictionary] = []


## Check if character is alive
func is_alive() -> bool:
	return current_hp > 0


## Take damage and return actual damage dealt
func take_damage(amount: int, ignore_defense: bool = false) -> int:
	var actual_defense = 0 if ignore_defense else defense
	var damage = max(1, amount - actual_defense / 2)
	current_hp = max(0, current_hp - damage)
	return damage


## Heal HP
func heal(amount: int) -> int:
	var old_hp = current_hp
	current_hp = min(max_hp, current_hp + amount)
	return current_hp - old_hp


## Use MP
func use_mp(amount: int) -> bool:
	if current_mp < amount:
		return false
	current_mp -= amount
	return true


## Restore MP
func restore_mp(amount: int) -> int:
	var old_mp = current_mp
	current_mp = min(max_mp, current_mp + amount)
	return current_mp - old_mp


## Get total attack power (base + equipment bonuses)
func get_total_attack() -> int:
	var total = attack
	# TODO: Add equipment bonuses
	return total


## Get total defense (base + equipment bonuses)
func get_total_defense() -> int:
	var total = defense
	# TODO: Add equipment bonuses
	return total


## Get total magic (base + equipment bonuses)
func get_total_magic() -> int:
	var total = magic
	# TODO: Add equipment bonuses
	return total


## Check if character knows a skill
func has_skill(skill_id: String) -> bool:
	return skill_id in skills


## Add a status effect
func add_status(effect_id: String, duration: int, potency: float = 1.0) -> void:
	# Check if already has this status
	for effect in status_effects:
		if effect["id"] == effect_id:
			# Refresh duration
			effect["duration"] = max(effect["duration"], duration)
			return
	
	status_effects.append({
		"id": effect_id,
		"duration": duration,
		"potency": potency
	})


## Remove a status effect
func remove_status(effect_id: String) -> void:
	for i in range(status_effects.size() - 1, -1, -1):
		if status_effects[i]["id"] == effect_id:
			status_effects.remove_at(i)
			return


## Check if has a status effect
func has_status(effect_id: String) -> bool:
	for effect in status_effects:
		if effect["id"] == effect_id:
			return true
	return false


## Tick status effects (call at start/end of turn)
func tick_status_effects() -> Array[Dictionary]:
	var expired = []
	for i in range(status_effects.size() - 1, -1, -1):
		status_effects[i]["duration"] -= 1
		if status_effects[i]["duration"] <= 0:
			expired.append(status_effects[i])
			status_effects.remove_at(i)
	return expired


## Serialize to dictionary
func to_dict() -> Dictionary:
	return {
		"id": id,
		"display_name": display_name,
		"character_class": character_class,
		"portrait_path": portrait_path,
		"sprite_path": sprite_path,
		"level": level,
		"experience": experience,
		"skill_points": skill_points,
		"max_hp": max_hp,
		"current_hp": current_hp,
		"max_mp": max_mp,
		"current_mp": current_mp,
		"attack": attack,
		"defense": defense,
		"magic": magic,
		"speed": speed,
		"luck": luck,
		"skills": skills.duplicate(),
		"equipped_skills": equipped_skills.duplicate(),
		"equipment": equipment.duplicate()
	}


## Deserialize from dictionary
static func from_dict(data: Dictionary) -> CharacterData:
	var character = CharacterData.new()
	character.id = data.get("id", "")
	character.display_name = data.get("display_name", "")
	character.character_class = data.get("character_class", "")
	character.portrait_path = data.get("portrait_path", "")
	character.sprite_path = data.get("sprite_path", "")
	character.level = data.get("level", 1)
	character.experience = data.get("experience", 0)
	character.skill_points = data.get("skill_points", 0)
	character.max_hp = data.get("max_hp", 100)
	character.current_hp = data.get("current_hp", 100)
	character.max_mp = data.get("max_mp", 30)
	character.current_mp = data.get("current_mp", 30)
	character.attack = data.get("attack", 10)
	character.defense = data.get("defense", 10)
	character.magic = data.get("magic", 10)
	character.speed = data.get("speed", 10)
	character.luck = data.get("luck", 5)
	character.skills.assign(data.get("skills", []))
	character.equipped_skills.assign(data.get("equipped_skills", []))
	character.equipment = data.get("equipment", {"weapon": "", "armor": "", "accessory": ""})
	return character
