extends Area2D
class_name Interactable
## Interactable - Base class for objects the player can interact with

signal interacted

@export var interaction_text: String = "Interact"
@export var one_time_only: bool = false
@export var required_flag: String = ""  # Story flag required to interact
@export var sets_flag: String = ""  # Story flag to set after interaction

var has_been_used: bool = false


func _ready() -> void:
	add_to_group("interactables")
	collision_layer = 0
	collision_mask = 0
	# Set to interactable layer
	set_collision_layer_value(5, true)


## Called when player interacts with this object
func interact() -> void:
	if one_time_only and has_been_used:
		return
	
	if required_flag != "" and not GameManager.get_story_flag(required_flag):
		return
	
	has_been_used = true
	
	if sets_flag != "":
		GameManager.set_story_flag(sets_flag)
	
	_on_interact()
	interacted.emit()


## Override this in subclasses to define interaction behavior
func _on_interact() -> void:
	pass


## Check if this interactable can be used
func can_interact() -> bool:
	if one_time_only and has_been_used:
		return false
	if required_flag != "" and not GameManager.get_story_flag(required_flag):
		return false
	return true
