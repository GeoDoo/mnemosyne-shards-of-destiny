extends Control
class_name VirtualJoystick
## VirtualJoystick - Touch-based virtual joystick for mobile controls

signal joystick_pressed
signal joystick_released

@export var dead_zone: float = 0.2
@export var clamp_zone: float = 1.0
@export var visibility_mode: int = 0  # 0: always, 1: touchscreen only, 2: when touched

@onready var base: TextureRect = $Base
@onready var tip: TextureRect = $Base/Tip

var is_pressed: bool = false
var output: Vector2 = Vector2.ZERO
var touch_index: int = -1
var base_default_position: Vector2


func _ready() -> void:
	base_default_position = base.position
	
	# Setup visibility based on mode
	match visibility_mode:
		0:  # Always visible
			show()
		1:  # Touchscreen only
			if DisplayServer.is_touchscreen_available():
				show()
			else:
				hide()
		2:  # When touched
			modulate.a = 0.5


func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		_handle_touch(event)
	elif event is InputEventScreenDrag:
		_handle_drag(event)


func _handle_touch(event: InputEventScreenTouch) -> void:
	if event.pressed:
		if _is_point_inside_base(event.position):
			touch_index = event.index
			is_pressed = true
			tip.global_position = event.position - tip.size / 2
			_calculate_output()
			
			if visibility_mode == 2:
				modulate.a = 1.0
			
			joystick_pressed.emit()
	else:
		if event.index == touch_index:
			_reset()
			joystick_released.emit()


func _handle_drag(event: InputEventScreenDrag) -> void:
	if event.index != touch_index:
		return
	
	var base_radius = base.size.x / 2
	var center = base.global_position + base.size / 2
	var vector = event.position - center
	
	if vector.length() > base_radius * clamp_zone:
		vector = vector.normalized() * base_radius * clamp_zone
	
	tip.global_position = center + vector - tip.size / 2
	_calculate_output()


func _calculate_output() -> void:
	var base_radius = base.size.x / 2
	var center = base.global_position + base.size / 2
	var tip_center = tip.global_position + tip.size / 2
	
	var vector = (tip_center - center) / base_radius
	
	if vector.length() < dead_zone:
		output = Vector2.ZERO
	else:
		output = vector.normalized() * ((vector.length() - dead_zone) / (1 - dead_zone))
		output = output.clampf(-1.0, 1.0)


func _is_point_inside_base(point: Vector2) -> bool:
	var center = base.global_position + base.size / 2
	var radius = base.size.x / 2
	return point.distance_to(center) <= radius * 1.5  # Slightly larger touch area


func _reset() -> void:
	is_pressed = false
	output = Vector2.ZERO
	touch_index = -1
	tip.position = (base.size - tip.size) / 2
	
	if visibility_mode == 2:
		modulate.a = 0.5


## Get the current joystick input
func get_input() -> Vector2:
	return output


## Check if joystick is being touched
func is_active() -> bool:
	return is_pressed
