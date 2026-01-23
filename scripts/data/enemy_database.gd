extends Node
class_name EnemyDatabase
## EnemyDatabase - Loads and provides access to enemy data from JSON

static var _enemies_common: Dictionary = {}
static var _enemies_bosses: Dictionary = {}
static var _loaded: bool = false


## Load enemy data from JSON file
static func load_database() -> void:
	if _loaded:
		return
	
	var file = FileAccess.open("res://data/enemies.json", FileAccess.READ)
	if file == null:
		push_error("EnemyDatabase: Could not open enemies.json")
		return
	
	var json = JSON.new()
	if json.parse(file.get_as_text()) != OK:
		push_error("EnemyDatabase: Failed to parse enemies.json")
		file.close()
		return
	
	var data = json.get_data()
	var enemies_data = data.get("enemies", {})
	
	# Load common enemies
	for enemy_data in enemies_data.get("common", []):
		var enemy = EnemyData.from_dict(enemy_data)
		_enemies_common[enemy.id] = enemy
	
	# Load boss enemies
	for enemy_data in enemies_data.get("bosses", []):
		var enemy = EnemyData.from_dict(enemy_data)
		_enemies_bosses[enemy.id] = enemy
	
	file.close()
	_loaded = true
	print("EnemyDatabase: Loaded %d common enemies, %d bosses" % [_enemies_common.size(), _enemies_bosses.size()])


## Get a common enemy by ID
static func get_enemy(enemy_id: String) -> EnemyData:
	if not _loaded:
		load_database()
	return _enemies_common.get(enemy_id)


## Get a boss enemy by ID
static func get_boss(boss_id: String) -> EnemyData:
	if not _loaded:
		load_database()
	return _enemies_bosses.get(boss_id)


## Get any enemy (common or boss) by ID
static func get_any(enemy_id: String) -> EnemyData:
	if not _loaded:
		load_database()
	
	if _enemies_common.has(enemy_id):
		return _enemies_common[enemy_id]
	if _enemies_bosses.has(enemy_id):
		return _enemies_bosses[enemy_id]
	return null


## Get all common enemies for a specific chapter
static func get_enemies_for_chapter(chapter: int) -> Array[EnemyData]:
	if not _loaded:
		load_database()
	
	var result: Array[EnemyData] = []
	for enemy in _enemies_common.values():
		if chapter in enemy.get("chapters", []):
			result.append(enemy)
	return result


## Get random enemies for an encounter
static func get_random_encounter(chapter: int, count: int = 1) -> Array[Dictionary]:
	if not _loaded:
		load_database()
	
	var available: Array = []
	for enemy_id in _enemies_common:
		var enemy = _enemies_common[enemy_id]
		# Check if this enemy appears in this chapter (using the raw dict data)
		var enemy_dict = enemy.to_dict()
		var chapters = enemy_dict.get("chapters", [])
		if chapter in chapters:
			available.append(enemy)
	
	if available.is_empty():
		push_warning("EnemyDatabase: No enemies available for chapter %d" % chapter)
		return []
	
	var result: Array[Dictionary] = []
	for i in range(count):
		var enemy = available[randi() % available.size()] as EnemyData
		result.append(enemy.create_instance())
	
	return result


## Get the boss for a specific chapter
static func get_chapter_boss(chapter: int) -> EnemyData:
	if not _loaded:
		load_database()
	
	for boss in _enemies_bosses.values():
		var boss_dict = boss.to_dict()
		if boss_dict.get("chapter", -1) == chapter:
			return boss
	return null


## Get all enemy IDs
static func get_all_enemy_ids() -> Array[String]:
	if not _loaded:
		load_database()
	
	var ids: Array[String] = []
	ids.append_array(_enemies_common.keys())
	ids.append_array(_enemies_bosses.keys())
	return ids
