extends Node
## PartyManager - Manages party members, stats, and inventory
##
## Handles all party-related data including characters, inventory, and currency.

signal party_changed
signal character_joined(character: CharacterData)
signal character_left(character: CharacterData)
signal level_up(character: CharacterData)
signal item_added(item_id: String, amount: int)
signal item_removed(item_id: String, amount: int)

# Party data
var party: Array[CharacterData] = []
var reserve: Array[CharacterData] = []  # Characters not in active party
var inventory: Dictionary = {}  # item_id: amount
var currency: int = 0

const MAX_PARTY_SIZE = 3
const MAX_INVENTORY_STACK = 99


func _ready() -> void:
	_initialize_starting_party()


func _initialize_starting_party() -> void:
	# Create the protagonist - Alkmaeon
	var alkmaeon = CharacterData.new()
	alkmaeon.id = "alkmaeon"
	alkmaeon.display_name = "Alkmaeon"
	alkmaeon.character_class = "Memory Seeker"
	alkmaeon.level = 1
	alkmaeon.experience = 0
	alkmaeon.max_hp = 100
	alkmaeon.current_hp = 100
	alkmaeon.max_mp = 30
	alkmaeon.current_mp = 30
	alkmaeon.attack = 12
	alkmaeon.defense = 10
	alkmaeon.magic = 8
	alkmaeon.speed = 10
	alkmaeon.luck = 5
	alkmaeon.skills = ["basic_attack", "defend"]
	alkmaeon.skill_points = 0
	
	add_to_party(alkmaeon)


## Add a character to the active party
func add_to_party(character: CharacterData) -> bool:
	if party.size() >= MAX_PARTY_SIZE:
		# Move to reserve instead
		reserve.append(character)
		return false
	
	party.append(character)
	character_joined.emit(character)
	party_changed.emit()
	return true


## Remove a character from party
func remove_from_party(character_id: String) -> CharacterData:
	for i in range(party.size()):
		if party[i].id == character_id:
			var character = party[i]
			party.remove_at(i)
			character_left.emit(character)
			party_changed.emit()
			return character
	return null


## Get a party member by ID
func get_character(character_id: String) -> CharacterData:
	for character in party:
		if character.id == character_id:
			return character
	for character in reserve:
		if character.id == character_id:
			return character
	return null


## Get all active party members
func get_active_party() -> Array[CharacterData]:
	return party


## Heal all party members
func heal_party(hp_percent: float = 1.0, mp_percent: float = 1.0) -> void:
	for character in party:
		character.current_hp = min(character.max_hp, character.current_hp + int(character.max_hp * hp_percent))
		character.current_mp = min(character.max_mp, character.current_mp + int(character.max_mp * mp_percent))


## Award XP to all party members
func award_experience(xp: int) -> void:
	for character in party:
		_add_experience(character, xp)


func _add_experience(character: CharacterData, xp: int) -> void:
	character.experience += xp
	
	# Check for level up
	var xp_needed = _calculate_xp_for_level(character.level + 1)
	while character.experience >= xp_needed:
		_level_up(character)
		xp_needed = _calculate_xp_for_level(character.level + 1)


func _calculate_xp_for_level(level: int) -> int:
	# Simple exponential curve: 100 * level^1.5
	return int(100 * pow(level, 1.5))


func _level_up(character: CharacterData) -> void:
	character.level += 1
	character.skill_points += 1
	
	# Stat increases (can be customized per character class later)
	character.max_hp += 10 + randi() % 5
	character.max_mp += 3 + randi() % 3
	character.attack += 2 + randi() % 2
	character.defense += 2 + randi() % 2
	character.magic += 1 + randi() % 2
	character.speed += 1 + randi() % 2
	
	# Restore HP/MP on level up
	character.current_hp = character.max_hp
	character.current_mp = character.max_mp
	
	level_up.emit(character)


## Inventory management
func add_item(item_id: String, amount: int = 1) -> bool:
	var current = inventory.get(item_id, 0)
	if current + amount > MAX_INVENTORY_STACK:
		return false
	
	inventory[item_id] = current + amount
	item_added.emit(item_id, amount)
	return true


func remove_item(item_id: String, amount: int = 1) -> bool:
	var current = inventory.get(item_id, 0)
	if current < amount:
		return false
	
	inventory[item_id] = current - amount
	if inventory[item_id] <= 0:
		inventory.erase(item_id)
	
	item_removed.emit(item_id, amount)
	return true


func has_item(item_id: String, amount: int = 1) -> bool:
	return inventory.get(item_id, 0) >= amount


func get_item_count(item_id: String) -> int:
	return inventory.get(item_id, 0)


## Currency management
func add_currency(amount: int) -> void:
	currency += amount


func spend_currency(amount: int) -> bool:
	if currency < amount:
		return false
	currency -= amount
	return true


## Learn a new skill for a character
func learn_skill(character_id: String, skill_id: String) -> bool:
	var character = get_character(character_id)
	if character == null:
		return false
	
	if skill_id in character.skills:
		return false  # Already known
	
	if character.skill_points <= 0:
		return false  # No skill points
	
	character.skills.append(skill_id)
	character.skill_points -= 1
	return true


## Get serializable party data for saving
func get_save_data() -> Dictionary:
	var party_data = []
	for character in party:
		party_data.append(character.to_dict())
	
	var reserve_data = []
	for character in reserve:
		reserve_data.append(character.to_dict())
	
	return {
		"party": party_data,
		"reserve": reserve_data,
		"inventory": inventory.duplicate(),
		"currency": currency
	}


## Load party data from save
func load_save_data(data: Dictionary) -> void:
	party.clear()
	reserve.clear()
	
	for char_data in data.get("party", []):
		var character = CharacterData.from_dict(char_data)
		party.append(character)
	
	for char_data in data.get("reserve", []):
		var character = CharacterData.from_dict(char_data)
		reserve.append(character)
	
	inventory = data.get("inventory", {})
	currency = data.get("currency", 0)
	
	party_changed.emit()
