extends Area2D
class_name SceneTransition
## SceneTransition - Triggers scene change when player enters

@export var target_scene: String = ""  # Scene key from GameManager.SCENES
@export var target_scene_path: String = ""  # Or direct path
@export var spawn_point_name: String = "default"  # Name of spawn point in target scene
@export var transition_direction: Vector2 = Vector2.ZERO  # For smooth transitions
@export var requires_interaction: bool = false  # If true, player must press interact
@export var required_flag: String = ""  # Story flag required to use

var player_in_area: bool = false


func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)


func _on_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		player_in_area = true
		if not requires_interaction:
			_trigger_transition()


func _on_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		player_in_area = false


func _input(event: InputEvent) -> void:
	if requires_interaction and player_in_area and event.is_action_pressed("interact"):
		_trigger_transition()


func _trigger_transition() -> void:
	if required_flag != "" and not GameManager.get_story_flag(required_flag):
		return
	
	# Store spawn point for target scene
	SaveManager.temp_state["spawn_point"] = spawn_point_name
	SaveManager.temp_state["transition_direction"] = {
		"x": transition_direction.x,
		"y": transition_direction.y
	}
	
	# Change scene
	if target_scene != "":
		GameManager.change_scene(target_scene)
	elif target_scene_path != "":
		GameManager.change_scene_to_path(target_scene_path)
