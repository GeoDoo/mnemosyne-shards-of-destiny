extends Control
## MainMenu - Main menu screen controller

@onready var continue_button: Button = $VBoxContainer/ContinueButton


func _ready() -> void:
	# Check if save exists
	continue_button.visible = SaveManager.has_save_file()
	
	# Focus first button
	$VBoxContainer/NewGameButton.grab_focus()


func _on_new_game_pressed() -> void:
	# Start new game
	GameManager.set_state(GameManager.GameState.EXPLORATION)
	GameManager.change_scene("village")


func _on_continue_pressed() -> void:
	SaveManager.load_game()


func _on_settings_pressed() -> void:
	# TODO: Open settings menu
	pass


func _on_quit_pressed() -> void:
	get_tree().quit()
