extends Node
## SaveManager - Handles game saving and loading
##
## Manages persistent save data and temporary state storage.

signal save_completed
signal load_completed
signal save_error(message: String)

const SAVE_PATH = "user://save_game.json"
const SETTINGS_PATH = "user://settings.json"

var temp_state: Dictionary = {}


func _ready() -> void:
	pass


## Save the current game state
func save_game() -> bool:
	var save_data = {
		"version": "1.0",
		"timestamp": Time.get_unix_time_from_system(),
		"party": PartyManager.get_save_data(),
		"story_flags": GameManager.story_flags.duplicate(),
		"current_scene": GameManager.current_scene_path,
		"player_position": _get_player_position()
	}
	
	var json_string = JSON.stringify(save_data, "\t")
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	
	if file == null:
		var error = FileAccess.get_open_error()
		save_error.emit("Failed to open save file: " + str(error))
		return false
	
	file.store_string(json_string)
	file.close()
	
	save_completed.emit()
	return true


## Load game from save file
func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		save_error.emit("No save file found")
		return false
	
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		save_error.emit("Failed to open save file")
		return false
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var parse_result = json.parse(json_string)
	
	if parse_result != OK:
		save_error.emit("Failed to parse save file")
		return false
	
	var save_data = json.get_data()
	
	# Restore party data
	PartyManager.load_save_data(save_data.get("party", {}))
	
	# Restore story flags
	GameManager.story_flags = save_data.get("story_flags", {})
	
	# Store position for scene to use
	temp_state["load_position"] = save_data.get("player_position", Vector2.ZERO)
	
	# Change to saved scene
	var scene_path = save_data.get("current_scene", GameManager.SCENES["village"])
	GameManager.change_scene_to_path(scene_path)
	
	load_completed.emit()
	return true


## Check if a save file exists
func has_save_file() -> bool:
	return FileAccess.file_exists(SAVE_PATH)


## Delete save file
func delete_save() -> bool:
	if FileAccess.file_exists(SAVE_PATH):
		var error = DirAccess.remove_absolute(SAVE_PATH)
		return error == OK
	return true


## Get save file info without loading
func get_save_info() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return {}
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	if json.parse(json_string) != OK:
		return {}
	
	var save_data = json.get_data()
	
	return {
		"timestamp": save_data.get("timestamp", 0),
		"version": save_data.get("version", "unknown")
	}


## Store temporary state (used before combat, etc.)
func store_temp_state() -> void:
	temp_state = {
		"scene_path": GameManager.current_scene_path,
		"player_position": _get_player_position(),
		"game_state": GameManager.current_state
	}


## Get temporary state
func get_temp_state() -> Dictionary:
	return temp_state


## Clear temporary state
func clear_temp_state() -> void:
	temp_state.clear()


func _get_player_position() -> Dictionary:
	# Try to find player node in current scene
	var player = get_tree().get_first_node_in_group("player")
	if player and player is Node2D:
		return {"x": player.position.x, "y": player.position.y}
	return {"x": 0, "y": 0}


## Save game settings
func save_settings(settings: Dictionary) -> bool:
	var json_string = JSON.stringify(settings, "\t")
	var file = FileAccess.open(SETTINGS_PATH, FileAccess.WRITE)
	
	if file == null:
		return false
	
	file.store_string(json_string)
	file.close()
	return true


## Load game settings
func load_settings() -> Dictionary:
	if not FileAccess.file_exists(SETTINGS_PATH):
		return get_default_settings()
	
	var file = FileAccess.open(SETTINGS_PATH, FileAccess.READ)
	if file == null:
		return get_default_settings()
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	if json.parse(json_string) != OK:
		return get_default_settings()
	
	return json.get_data()


func get_default_settings() -> Dictionary:
	return {
		"master_volume": 1.0,
		"music_volume": 0.8,
		"sfx_volume": 1.0,
		"text_speed": 1.0,
		"screen_shake": true
	}
