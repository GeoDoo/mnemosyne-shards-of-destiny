extends CharacterBody2D
class_name PlayerController
## PlayerController - Handles player movement and interaction in exploration mode

signal interact_pressed
signal menu_pressed

@export var move_speed: float = 200.0
@export var touch_controls_enabled: bool = true

var sprite: CanvasItem = null
var interaction_area: Area2D = null
var collision_shape: CollisionShape2D = null

var input_direction: Vector2 = Vector2.ZERO
var is_moving: bool = false
var facing_direction: Vector2 = Vector2.DOWN
var can_move: bool = true

# Touch joystick reference (set by exploration scene)
var virtual_joystick: Control = null

# Tap-to-move
var tap_target: Vector2 = Vector2.ZERO
var is_tap_moving: bool = false
var tap_arrive_distance: float = 20.0


func _ready() -> void:
	add_to_group("player")
	
	# Get nodes (support both AnimatedSprite2D and simple Sprite/ColorRect)
	sprite = get_node_or_null("AnimatedSprite2D")
	if sprite == null:
		sprite = get_node_or_null("Sprite")
	interaction_area = get_node_or_null("InteractionArea")
	collision_shape = get_node_or_null("CollisionShape2D")


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
			is_tap_moving = false  # Cancel tap movement when using joystick
	
	# Tap-to-move
	if is_tap_moving and direction == Vector2.ZERO:
		var to_target = tap_target - global_position
		if to_target.length() > tap_arrive_distance:
			direction = to_target.normalized()
		else:
			# Arrived at destination
			is_tap_moving = false
			# Try to interact if we're near something
			_try_interact()
	
	# Cancel tap movement on keyboard input
	if direction != Vector2.ZERO and (Input.is_action_pressed("move_up") or Input.is_action_pressed("move_down") or Input.is_action_pressed("move_left") or Input.is_action_pressed("move_right")):
		is_tap_moving = false
	
	return direction


func _input(event: InputEvent) -> void:
	if not can_move:
		return
	
	if event.is_action_pressed("interact"):
		_try_interact()
	elif event.is_action_pressed("menu"):
		menu_pressed.emit()
	
	# Tap-to-move for touch screens
	if event is InputEventScreenTouch and event.pressed:
		_handle_tap(event.position)
	elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_handle_tap(event.position)


func _handle_tap(screen_pos: Vector2) -> void:
	# Convert screen position to world position
	var camera = get_viewport().get_camera_2d()
	var world_pos: Vector2
	
	if camera:
		world_pos = camera.get_global_mouse_position()
	else:
		# No camera, use viewport transform
		var canvas_transform = get_canvas_transform()
		world_pos = canvas_transform.affine_inverse() * screen_pos
	
	# Check if we tapped on an interactable first
	if _check_tap_interaction(world_pos):
		return
	
	# Set tap target for movement
	tap_target = world_pos
	is_tap_moving = true


func _check_tap_interaction(world_pos: Vector2) -> bool:
	# Check if tap is near an interactable
	var space_state = get_world_2d().direct_space_state
	var query = PhysicsPointQueryParameters2D.new()
	query.position = world_pos
	query.collision_mask = 32  # Interactables layer
	
	var results = space_state.intersect_point(query, 1)
	if results.size() > 0:
		var collider = results[0].collider
		# Move towards interactable, then interact when close
		tap_target = collider.global_position
		is_tap_moving = true
		return false  # Still move towards it
	
	return false


func _try_interact() -> void:
	if interaction_area == null:
		interact_pressed.emit()
		return
	
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
	if sprite == null:
		return
	
	# Only animate if it's an AnimatedSprite2D
	if sprite is AnimatedSprite2D:
		var anim_name = "walk_"
		
		if abs(facing_direction.x) > abs(facing_direction.y):
			anim_name += "right" if facing_direction.x > 0 else "left"
		else:
			anim_name += "down" if facing_direction.y > 0 else "up"
		
		if sprite.sprite_frames and sprite.sprite_frames.has_animation(anim_name):
			sprite.play(anim_name)


func _play_idle_animation() -> void:
	if sprite == null:
		return
	
	# Only animate if it's an AnimatedSprite2D
	if sprite is AnimatedSprite2D:
		var anim_name = "idle_"
		
		if abs(facing_direction.x) > abs(facing_direction.y):
			anim_name += "right" if facing_direction.x > 0 else "left"
		else:
			anim_name += "down" if facing_direction.y > 0 else "up"
		
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
