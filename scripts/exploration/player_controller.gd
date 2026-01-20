extends CharacterBody2D
class_name PlayerController
## PlayerController - Handles player movement and interaction in exploration mode

signal interact_pressed
signal menu_pressed

@export var move_speed: float = 200.0
@export var touch_controls_enabled: bool = true

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var interaction_area: Area2D = $InteractionArea
@onready var collision_shape: CollisionShape2D = $CollisionShape2D

var input_direction: Vector2 = Vector2.ZERO
var is_moving: bool = false
var facing_direction: Vector2 = Vector2.DOWN
var can_move: bool = true

# Touch joystick reference (set by exploration scene)
var virtual_joystick: Control = null


func _ready() -> void:
	add_to_group("player")


func _physics_process(delta: float) -> void:
	if not can_move:
		velocity = Vector2.ZERO
		return
	
	# Get input
	input_direction = _get_input_direction()
	
	# Apply movement
	if input_direction != Vector2.ZERO:
		velocity = input_direction.normalized() * move_speed
		is_moving = true
		facing_direction = input_direction.normalized()
		_update_animation()
	else:
		velocity = Vector2.ZERO
		is_moving = false
		_play_idle_animation()
	
	move_and_slide()


func _get_input_direction() -> Vector2:
	var direction = Vector2.ZERO
	
	# Keyboard input
	direction.x = Input.get_axis("move_left", "move_right")
	direction.y = Input.get_axis("move_up", "move_down")
	
	# Virtual joystick input (if available)
	if virtual_joystick and touch_controls_enabled:
		var joystick_input = virtual_joystick.get_input()
		if joystick_input.length() > 0.1:
			direction = joystick_input
	
	return direction


func _input(event: InputEvent) -> void:
	if not can_move:
		return
	
	if event.is_action_pressed("interact"):
		_try_interact()
	elif event.is_action_pressed("menu"):
		menu_pressed.emit()


func _try_interact() -> void:
	var interactables = interaction_area.get_overlapping_areas()
	
	for area in interactables:
		if area.has_method("interact"):
			area.interact()
			return
		elif area.get_parent().has_method("interact"):
			area.get_parent().interact()
			return
	
	interact_pressed.emit()


func _update_animation() -> void:
	if not sprite:
		return
	
	# Determine animation based on facing direction
	var anim_name = "walk_"
	
	if abs(facing_direction.x) > abs(facing_direction.y):
		if facing_direction.x > 0:
			anim_name += "right"
		else:
			anim_name += "left"
	else:
		if facing_direction.y > 0:
			anim_name += "down"
		else:
			anim_name += "up"
	
	if sprite.sprite_frames and sprite.sprite_frames.has_animation(anim_name):
		sprite.play(anim_name)


func _play_idle_animation() -> void:
	if not sprite:
		return
	
	var anim_name = "idle_"
	
	if abs(facing_direction.x) > abs(facing_direction.y):
		if facing_direction.x > 0:
			anim_name += "right"
		else:
			anim_name += "left"
	else:
		if facing_direction.y > 0:
			anim_name += "down"
		else:
			anim_name += "up"
	
	if sprite.sprite_frames and sprite.sprite_frames.has_animation(anim_name):
		sprite.play(anim_name)
	elif sprite.sprite_frames and sprite.sprite_frames.has_animation("idle_down"):
		sprite.play("idle_down")


## Set position (used when loading saves or transitioning scenes)
func set_spawn_position(pos: Vector2) -> void:
	global_position = pos


## Disable player movement (for cutscenes, dialogue, etc.)
func disable_movement() -> void:
	can_move = false
	velocity = Vector2.ZERO
	_play_idle_animation()


## Enable player movement
func enable_movement() -> void:
	can_move = true


## Face a specific direction
func face_direction(direction: Vector2) -> void:
	facing_direction = direction.normalized()
	_play_idle_animation()


## Face a specific position
func face_position(target_pos: Vector2) -> void:
	var dir = (target_pos - global_position).normalized()
	face_direction(dir)
