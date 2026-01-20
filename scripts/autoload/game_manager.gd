extends Node
## GameManager - Central game state and scene management singleton
##
## Handles scene transitions, game state, and global game events.

signal scene_changed(scene_name: String)
signal game_paused(is_paused: bool)
signal vision_started
signal vision_ended

enum GameState {
	MAIN_MENU,
	EXPLORATION,
	COMBAT,
	DIALOGUE,
	VISION,
	PAUSED
}

var current_state: GameState = GameState.MAIN_MENU
var previous_state: GameState = GameState.MAIN_MENU
var current_scene_path: String = ""

# Story progression flags
var story_flags: Dictionary = {}

# Scene paths
const SCENES = {
	"main_menu": "res://scenes/main/main_menu.tscn",
	"village": "res://scenes/exploration/village.tscn",
	"temple_ruins": "res://scenes/exploration/temple_ruins.tscn",
	"battle": "res://scenes/combat/battle_scene.tscn"
}


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS


func _input(event: InputEvent) -> void:
	if event.is_action_pressed("menu") and current_state == GameState.EXPLORATION:
		toggle_pause()


## Change to a new scene with optional transition
func change_scene(scene_key: String, transition: bool = true) -> void:
	if not SCENES.has(scene_key):
		push_error("GameManager: Unknown scene key: " + scene_key)
		return
	
	var scene_path = SCENES[scene_key]
	await _transition_to_scene(scene_path, transition)
	scene_changed.emit(scene_key)


## Change scene by direct path
func change_scene_to_path(path: String, transition: bool = true) -> void:
	await _transition_to_scene(path, transition)


func _transition_to_scene(path: String, use_transition: bool) -> void:
	if use_transition:
		await _fade_out()
	
	current_scene_path = path
	get_tree().change_scene_to_file(path)
	
	if use_transition:
		await _fade_in()


func _fade_out() -> void:
	# TODO: Implement actual fade transition with CanvasLayer
	await get_tree().create_timer(0.3).timeout


func _fade_in() -> void:
	# TODO: Implement actual fade transition with CanvasLayer
	await get_tree().create_timer(0.3).timeout


## Set game state
func set_state(new_state: GameState) -> void:
	previous_state = current_state
	current_state = new_state
	
	match new_state:
		GameState.PAUSED:
			get_tree().paused = true
			game_paused.emit(true)
		GameState.VISION:
			vision_started.emit()
		_:
			if previous_state == GameState.PAUSED:
				get_tree().paused = false
				game_paused.emit(false)
			if previous_state == GameState.VISION:
				vision_ended.emit()


## Toggle pause state
func toggle_pause() -> void:
	if current_state == GameState.PAUSED:
		set_state(previous_state)
	else:
		set_state(GameState.PAUSED)


## Story flag management
func set_story_flag(flag: String, value: bool = true) -> void:
	story_flags[flag] = value


func get_story_flag(flag: String) -> bool:
	return story_flags.get(flag, false)


func has_story_flag(flag: String) -> bool:
	return story_flags.has(flag)


## Start a combat encounter
func start_combat(enemy_group: Array, background: String = "default") -> void:
	# Store current exploration state for return
	SaveManager.store_temp_state()
	
	# Pass enemy data to combat scene
	var combat_data = {
		"enemies": enemy_group,
		"background": background,
		"return_scene": current_scene_path
	}
	
	set_state(GameState.COMBAT)
	# Combat scene will be loaded and receive this data
	change_scene("battle")


## Return from combat to exploration
func end_combat(victory: bool) -> void:
	if victory:
		set_state(GameState.EXPLORATION)
		var return_path = SaveManager.get_temp_state().get("scene_path", SCENES["village"])
		change_scene_to_path(return_path)
	else:
		# Game over - return to main menu or show game over screen
		set_state(GameState.MAIN_MENU)
		change_scene("main_menu")


## Start a vision sequence
func start_vision(vision_id: String) -> void:
	set_state(GameState.VISION)
	# Vision controller will handle the actual vision playback


## End vision sequence
func end_vision() -> void:
	set_state(GameState.EXPLORATION)
