extends Resource
class_name EnemyData
## EnemyData - Data container for enemy definitions

@export var id: String = ""
@export var display_name: String = ""
@export var description: String = ""
@export var sprite_path: String = ""

# Classification
@export var tier: int = 1  # 1-4 for common enemies
@export var chapters: Array[int] = []  # Which chapters this enemy appears in
@export var boss_type: String = ""  # "", "mini_boss", "chapter_boss", "final_boss"
@export var phases: int = 1  # Number of phases for boss fights

# Stats
@export var level: int = 1
@export var max_hp: int = 50
@export var attack: int = 8
@export var defense: int = 5
@export var magic: int = 5
@export var speed: int = 8

# Skills this enemy can use
@export var skills: Array[String] = ["basic_attack"]

# AI behavior weights (higher = more likely to use)
@export var skill_weights: Dictionary = {}  # skill_id: weight

# Rewards
@export var experience_reward: int = 10
@export var currency_reward: int = 5
@export var drop_table: Array[Dictionary] = []  # [{item_id: String, chance: float}]

# Elemental affinities (multipliers, 1.0 = normal, 2.0 = weak, 0.5 = resistant, 0 = immune)
@export var element_modifiers: Dictionary = {
	"fire": 1.0,
	"light": 1.0,
	"shadow": 1.0,
	"water": 1.0,
	"earth": 1.0
}


## Create a combatant instance from this enemy data
func create_instance() -> Dictionary:
	return {
		"id": id,
		"display_name": display_name,
		"description": description,
		"sprite_path": sprite_path,
		"tier": tier,
		"boss_type": boss_type,
		"phases": phases,
		"level": level,
		"max_hp": max_hp,
		"current_hp": max_hp,
		"attack": attack,
		"defense": defense,
		"magic": magic,
		"speed": speed,
		"skills": skills.duplicate(),
		"skill_weights": skill_weights.duplicate(),
		"element_modifiers": element_modifiers.duplicate(),
		"experience_reward": experience_reward,
		"currency_reward": currency_reward,
		"status_effects": [],
		"is_enemy": true,
		"current_phase": 1
	}


## Check if this is a boss enemy
func is_boss() -> bool:
	return boss_type != ""


## Serialize to dictionary
func to_dict() -> Dictionary:
	return {
		"id": id,
		"display_name": display_name,
		"description": description,
		"sprite_path": sprite_path,
		"tier": tier,
		"chapters": chapters.duplicate(),
		"boss_type": boss_type,
		"phases": phases,
		"level": level,
		"max_hp": max_hp,
		"attack": attack,
		"defense": defense,
		"magic": magic,
		"speed": speed,
		"skills": skills.duplicate(),
		"skill_weights": skill_weights.duplicate(),
		"experience_reward": experience_reward,
		"currency_reward": currency_reward,
		"drop_table": drop_table.duplicate(true),
		"element_modifiers": element_modifiers.duplicate()
	}


## Create from dictionary
static func from_dict(data: Dictionary) -> EnemyData:
	var enemy = EnemyData.new()
	enemy.id = data.get("id", "")
	enemy.display_name = data.get("display_name", "")
	enemy.description = data.get("description", "")
	enemy.sprite_path = data.get("sprite_path", "")
	enemy.tier = data.get("tier", 1)
	enemy.boss_type = data.get("boss_type", "")
	enemy.phases = data.get("phases", 1)
	enemy.level = data.get("level", 1)
	enemy.max_hp = data.get("max_hp", 50)
	enemy.attack = data.get("attack", 8)
	enemy.defense = data.get("defense", 5)
	enemy.magic = data.get("magic", 5)
	enemy.speed = data.get("speed", 8)
	enemy.skills.assign(data.get("skills", ["basic_attack"]))
	enemy.skill_weights = data.get("skill_weights", {})
	enemy.experience_reward = data.get("experience_reward", 10)
	enemy.currency_reward = data.get("currency_reward", 5)
	enemy.drop_table = data.get("drop_table", [])
	enemy.element_modifiers = data.get("element_modifiers", {})
	
	# Handle chapters array
	var chapters_data = data.get("chapters", [])
	if chapters_data is Array:
		for ch in chapters_data:
			enemy.chapters.append(int(ch))
	
	return enemy
