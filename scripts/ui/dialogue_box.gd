extends Control
class_name DialogueBox
## DialogueBox - Displays dialogue text with typewriter effect

signal dialogue_finished
signal line_finished

@export var text_speed: float = 0.03  # Seconds per character
@export var auto_advance_delay: float = 1.0  # Delay before auto-continuing

var name_label: Label = null
var text_label: RichTextLabel = null
var portrait: TextureRect = null
var continue_indicator: Label = null

var is_typing: bool = false
var current_text: String = ""
var displayed_characters: int = 0
var type_timer: float = 0.0
var _auto_continue: bool = false  # Whether to auto-emit line_finished when typing completes


func _ready() -> void:
	add_to_group("dialogue_box")
	
	# Get UI nodes (flexible paths)
	name_label = get_node_or_null("Panel/MarginContainer/VBoxContainer/NameLabel")
	text_label = get_node_or_null("Panel/MarginContainer/VBoxContainer/TextLabel")
	portrait = get_node_or_null("Panel/Portrait")
	continue_indicator = get_node_or_null("Panel/ContinueIndicator")
	
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
		if text_label:
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
## Set auto_continue=true to automatically emit line_finished when typing completes (for cutscenes/visions)
func show_dialogue(speaker_name: String, text: String, portrait_path: String = "", auto_continue: bool = false) -> void:
	show()
	_auto_continue = auto_continue
	
	if name_label:
		name_label.text = speaker_name
		name_label.visible = speaker_name != ""
	
	current_text = text
	
	if text_label:
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


## Show dialogue with a pre-loaded texture
func show_dialogue_with_texture(speaker_name: String, text: String, texture: Texture2D, auto_continue: bool = false) -> void:
	show()
	_auto_continue = auto_continue
	
	if name_label:
		name_label.text = speaker_name
		name_label.visible = speaker_name != ""
	
	current_text = text
	
	if text_label:
		text_label.text = text
		text_label.visible_characters = 0
	
	displayed_characters = 0
	
	# Use provided texture directly
	if texture and portrait:
		portrait.texture = texture
		portrait.show()
	elif portrait:
		portrait.hide()
	
	is_typing = true
	if continue_indicator:
		continue_indicator.hide()


## Show dialogue without speaker (narration)
## Set auto_continue=true to automatically emit line_finished when typing completes
func show_narration(text: String, auto_continue: bool = false) -> void:
	show_dialogue("", text, "", auto_continue)


func _skip_typing() -> void:
	displayed_characters = current_text.length()
	if text_label:
		text_label.visible_characters = displayed_characters
	_finish_typing()


func _finish_typing() -> void:
	is_typing = false
	
	if _auto_continue:
		# Auto-continue mode: emit signal after a brief delay for reading
		if continue_indicator:
			continue_indicator.hide()
		await get_tree().create_timer(auto_advance_delay).timeout
		line_finished.emit()
	else:
		# Manual mode: show indicator and wait for player input
		if continue_indicator:
			continue_indicator.show()
