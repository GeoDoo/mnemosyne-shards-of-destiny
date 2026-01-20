extends Resource
class_name SkillData
## SkillData - Data container for skills and abilities

enum TargetType {
	SINGLE_ENEMY,
	ALL_ENEMIES,
	SINGLE_ALLY,
	ALL_ALLIES,
	SELF,
	SINGLE_ANY
}

enum DamageType {
	PHYSICAL,
	MAGICAL,
	TRUE,  # Ignores defense
	HEALING
}

enum Element {
	NONE,
	FIRE,
	LIGHT,
	SHADOW,
	WATER,
	EARTH
}

@export var id: String = ""
@export var display_name: String = ""
@export var description: String = ""
@export var icon_path: String = ""

# Targeting
@export var target_type: TargetType = TargetType.SINGLE_ENEMY
@export var damage_type: DamageType = DamageType.PHYSICAL
@export var element: Element = Element.NONE

# Cost
@export var mp_cost: int = 0
@export var hp_cost: int = 0

# Power and scaling
@export var base_power: int = 10
@export var attack_scaling: float = 1.0  # Multiplier for user's attack stat
@export var magic_scaling: float = 0.0   # Multiplier for user's magic stat

# Status effects
@export var inflicts_status: String = ""  # Status effect ID to inflict
@export var status_chance: float = 0.0    # 0.0 to 1.0
@export var status_duration: int = 3

# Special flags
@export var is_basic_attack: bool = false
@export var is_defend: bool = false
@export var can_crit: bool = true
@export var crit_multiplier: float = 1.5

# Skill tree position (for UI)
@export var skill_tree_position: Vector2i = Vector2i.ZERO
@export var prerequisites: Array[String] = []  # Skill IDs required to unlock


## Calculate damage dealt
func calculate_damage(user: CharacterData, target: CharacterData) -> int:
	var power = base_power
	power += int(user.get_total_attack() * attack_scaling)
	power += int(user.get_total_magic() * magic_scaling)
	
	# Apply defense if not healing or true damage
	if damage_type == DamageType.PHYSICAL:
		power = max(1, power - target.get_total_defense() / 2)
	elif damage_type == DamageType.MAGICAL:
		power = max(1, power - target.get_total_defense() / 4)
	
	return power


## Check if skill can be used
func can_use(user: CharacterData) -> bool:
	if user.current_mp < mp_cost:
		return false
	if user.current_hp <= hp_cost:
		return false
	return true


## Serialize to dictionary
func to_dict() -> Dictionary:
	return {
		"id": id,
		"display_name": display_name,
		"description": description,
		"icon_path": icon_path,
		"target_type": target_type,
		"damage_type": damage_type,
		"element": element,
		"mp_cost": mp_cost,
		"hp_cost": hp_cost,
		"base_power": base_power,
		"attack_scaling": attack_scaling,
		"magic_scaling": magic_scaling,
		"inflicts_status": inflicts_status,
		"status_chance": status_chance,
		"status_duration": status_duration,
		"is_basic_attack": is_basic_attack,
		"is_defend": is_defend,
		"can_crit": can_crit,
		"crit_multiplier": crit_multiplier
	}


## Create from dictionary
static func from_dict(data: Dictionary) -> SkillData:
	var skill = SkillData.new()
	skill.id = data.get("id", "")
	skill.display_name = data.get("display_name", "")
	skill.description = data.get("description", "")
	skill.icon_path = data.get("icon_path", "")
	skill.target_type = data.get("target_type", TargetType.SINGLE_ENEMY)
	skill.damage_type = data.get("damage_type", DamageType.PHYSICAL)
	skill.element = data.get("element", Element.NONE)
	skill.mp_cost = data.get("mp_cost", 0)
	skill.hp_cost = data.get("hp_cost", 0)
	skill.base_power = data.get("base_power", 10)
	skill.attack_scaling = data.get("attack_scaling", 1.0)
	skill.magic_scaling = data.get("magic_scaling", 0.0)
	skill.inflicts_status = data.get("inflicts_status", "")
	skill.status_chance = data.get("status_chance", 0.0)
	skill.status_duration = data.get("status_duration", 3)
	skill.is_basic_attack = data.get("is_basic_attack", false)
	skill.is_defend = data.get("is_defend", false)
	skill.can_crit = data.get("can_crit", true)
	skill.crit_multiplier = data.get("crit_multiplier", 1.5)
	return skill
