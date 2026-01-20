extends CharacterBody2D
class_name NPC
## NPC - Non-player character with dialogue and optional movement

signal dialogue_started
signal dialogue_ended

@export var npc_name: String = "Villager"
@export var portrait_path: String = ""
@export var dialogue_lines: Array[String] = []
@export var dialogue_after_flag: Array[String] = []  # Alternate dialogue after a flag is set
@export var flag_for_alternate: String = ""

@export var wanders: bool = false
@export var wander_radius: float = 50.0
@export var wander_speed: float = 50.0

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var interaction_area: Area2D = $InteractionArea

var home_position: Vector2
var is_talking: bool = false
var current_dialogue_index: int = 0


func _ready() -> void:
	add_to_group("npcs")
	home_position = global_position
	
	# Setup interaction area
	if interaction_area:
		interaction_area.set_collision_layer_value(5, true)


func interact() -> void:
	if is_talking:
		_advance_dialogue()
	else:
		_start_dialogue()


func _start_dialogue() -> void:
	is_talking = true
	current_dialogue_index = 0
	
	# Face the player
	var player = get_tree().get_first_node_in_group("player")
	if player:
		var dir = (player.global_position - global_position).normalized()
		_face_direction(dir)
		if player.has_method("face_position"):
			player.face_position(global_position)
		if player.has_method("disable_movement"):
			player.disable_movement()
	
	dialogue_started.emit()
	_show_current_dialogue()


func _advance_dialogue() -> void:
	current_dialogue_index += 1
	var lines = _get_current_dialogue_lines()
	
	if current_dialogue_index >= lines.size():
		_end_dialogue()
	else:
		_show_current_dialogue()


func _end_dialogue() -> void:
	is_talking = false
	
	var player = get_tree().get_first_node_in_group("player")
	if player and player.has_method("enable_movement"):
		player.enable_movement()
	
	# Hide dialogue box
	var dialogue_box = get_tree().get_first_node_in_group("dialogue_box")
	if dialogue_box:
		dialogue_box.hide()
	
	dialogue_ended.emit()


func _show_current_dialogue() -> void:
	var lines = _get_current_dialogue_lines()
	if current_dialogue_index >= lines.size():
		return
	
	var dialogue_box = get_tree().get_first_node_in_group("dialogue_box")
	if dialogue_box:
		dialogue_box.show_dialogue(npc_name, lines[current_dialogue_index], portrait_path)


func _get_current_dialogue_lines() -> Array[String]:
	if flag_for_alternate != "" and GameManager.get_story_flag(flag_for_alternate):
		return dialogue_after_flag if dialogue_after_flag.size() > 0 else dialogue_lines
	return dialogue_lines


func _face_direction(direction: Vector2) -> void:
	if not sprite:
		return
	
	# Simple left/right flip for now
	if direction.x < 0:
		sprite.flip_h = true
	elif direction.x > 0:
		sprite.flip_h = false


func _physics_process(delta: float) -> void:
	if not wanders or is_talking:
		return
	
	# Simple wander AI - TODO: implement proper wandering
	pass
