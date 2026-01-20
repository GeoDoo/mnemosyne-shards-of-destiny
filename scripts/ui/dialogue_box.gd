extends Control
class_name DialogueBox
## DialogueBox - Displays dialogue text with typewriter effect

signal dialogue_finished
signal line_finished

@export var text_speed: float = 0.03  # Seconds per character
@export var auto_advance: bool = false
@export var auto_advance_delay: float = 2.0

@onready var name_label: Label = $Panel/MarginContainer/VBoxContainer/NameLabel
@onready var text_label: RichTextLabel = $Panel/MarginContainer/VBoxContainer/TextLabel
@onready var portrait: TextureRect = $Panel/Portrait
@onready var continue_indicator: Label = $Panel/ContinueIndicator

var is_typing: bool = false
var current_text: String = ""
var displayed_characters: int = 0
var type_timer: float = 0.0


func _ready() -> void:
	add_to_group("dialogue_box")
	hide()
	if continue_indicator:
		continue_indicator.hide()


func _process(delta: float) -> void:
	if not is_typing:
		return
	
	type_timer += delta
	if type_timer >= text_speed:
		type_timer = 0.0
		displayed_characters += 1
		text_label.visible_characters = displayed_characters
		
		if displayed_characters >= current_text.length():
			_finish_typing()


func _input(event: InputEvent) -> void:
	if not visible:
		return
	
	if event.is_action_pressed("interact") or event.is_action_pressed("ui_accept"):
		if is_typing:
			# Skip to end of current line
			_skip_typing()
		else:
			# Signal that player wants to continue
			line_finished.emit()


## Show dialogue with speaker name and text
func show_dialogue(speaker_name: String, text: String, portrait_path: String = "") -> void:
	show()
	
	name_label.text = speaker_name
	current_text = text
	text_label.text = text
	text_label.visible_characters = 0
	displayed_characters = 0
	
	# Load portrait if provided
	if portrait_path != "" and portrait:
		var texture = load(portrait_path)
		if texture:
			portrait.texture = texture
			portrait.show()
		else:
			portrait.hide()
	elif portrait:
		portrait.hide()
	
	is_typing = true
	if continue_indicator:
		continue_indicator.hide()


## Show dialogue without speaker (narration)
func show_narration(text: String) -> void:
	show_dialogue("", text, "")
	name_label.hide()


func _skip_typing() -> void:
	displayed_characters = current_text.length()
	text_label.visible_characters = displayed_characters
	_finish_typing()


func _finish_typing() -> void:
	is_typing = false
	if continue_indicator:
		continue_indicator.show()
	
	if auto_advance:
		await get_tree().create_timer(auto_advance_delay).timeout
		if not is_typing:  # Make sure we haven't started new dialogue
			line_finished.emit()
