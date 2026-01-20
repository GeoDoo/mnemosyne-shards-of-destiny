extends Node2D
## TempleRuins - Temple of Apollo exploration scene with visions and encounters

@onready var player: PlayerController = $Player
@onready var altar: Area2D = $Altar
@onready var vision_overlay: ColorRect = $UI/VisionOverlay
@onready var dialogue_box: DialogueBox = $UI/DialogueBox
@onready var encounter_zone: Area2D = $EncounterZones/Zone1

var has_triggered_first_vision: bool = false
var encounter_cooldown: float = 0.0
const ENCOUNTER_RATE: float = 0.15  # 15% chance per step in encounter zone
const ENCOUNTER_COOLDOWN_TIME: float = 3.0


func _ready() -> void:
	# Connect signals
	altar.interacted.connect(_on_altar_interacted)
	encounter_zone.body_entered.connect(_on_encounter_zone_entered)
	
	# Check for spawn point
	var spawn_point_name = SaveManager.temp_state.get("spawn_point", "Default")
	var spawn_points = $SpawnPoints
	for child in spawn_points.get_children():
		if child.name == spawn_point_name:
			player.global_position = child.global_position
			break
	
	# Trigger first vision if this is the first visit
	if not GameManager.get_story_flag("temple_first_visit"):
		GameManager.set_story_flag("temple_first_visit")
		await get_tree().create_timer(1.0).timeout
		_trigger_first_vision()


func _process(delta: float) -> void:
	if encounter_cooldown > 0:
		encounter_cooldown -= delta


func _on_encounter_zone_entered(body: Node2D) -> void:
	if body.is_in_group("player") and encounter_cooldown <= 0:
		_check_random_encounter()


func _check_random_encounter() -> void:
	if randf() < ENCOUNTER_RATE:
		encounter_cooldown = ENCOUNTER_COOLDOWN_TIME
		_start_encounter()


func _start_encounter() -> void:
	# Create enemy group
	var enemies = []
	
	var spirit = {
		"id": "temple_spirit",
		"display_name": "Temple Spirit",
		"max_hp": 35,
		"current_hp": 35,
		"attack": 7,
		"defense": 3,
		"magic": 8,
		"speed": 6,
		"skills": ["basic_attack"],
		"experience_reward": 12,
		"currency_reward": 8,
		"is_enemy": true
	}
	enemies.append(spirit)
	
	# 30% chance for second enemy
	if randf() < 0.3:
		var shade = {
			"id": "corrupted_shade",
			"display_name": "Corrupted Shade",
			"max_hp": 25,
			"current_hp": 25,
			"attack": 9,
			"defense": 2,
			"magic": 5,
			"speed": 9,
			"skills": ["basic_attack"],
			"experience_reward": 10,
			"currency_reward": 5,
			"is_enemy": true
		}
		enemies.append(shade)
	
	GameManager.start_combat(enemies, "temple")


func _on_altar_interacted() -> void:
	if GameManager.get_story_flag("altar_vision_seen"):
		# Already seen the altar vision
		dialogue_box.show_narration("The altar stands silent, its divine presence dormant.")
		return
	
	GameManager.set_story_flag("altar_vision_seen")
	_trigger_altar_vision()


func _trigger_first_vision() -> void:
	has_triggered_first_vision = true
	player.disable_movement()
	
	# Vision sequence - use auto_continue for cinematic flow
	await _flash_screen(Color.WHITE, 0.3)
	
	dialogue_box.show_narration("As you step among the shattered pillars, a flash sears through your mind...", true)
	await dialogue_box.line_finished
	
	await _flash_screen(Color.WHITE, 0.5)
	
	dialogue_box.show_narration("Visions of a forgotten past blaze across your thoughts...", true)
	await dialogue_box.line_finished
	
	dialogue_box.show_narration("Images both alien and unmistakably your own.", true)
	await dialogue_box.line_finished
	
	dialogue_box.hide()
	player.enable_movement()


func _trigger_altar_vision() -> void:
	player.disable_movement()
	GameManager.set_state(GameManager.GameState.VISION)
	
	# Intense vision sequence - use auto_continue for cinematic flow
	await _flash_screen(Color.WHITE, 0.5)
	await _flash_screen(Color(1, 0.8, 0.8), 0.3)
	
	dialogue_box.show_narration("You touch the cold stone of the altar...", true)
	await dialogue_box.line_finished
	
	await _flash_screen(Color.WHITE, 1.0)
	
	dialogue_box.show_narration("A surge of divine energy courses through you!", true)
	await dialogue_box.line_finished
	
	dialogue_box.show_narration("You see a great temple, whole and magnificent, filled with worshippers...", true)
	await dialogue_box.line_finished
	
	dialogue_box.show_narration("A figure in golden robes turns to face you — Apollo himself.", true)
	await dialogue_box.line_finished
	
	dialogue_box.show_dialogue("???", "Child of Memory... the Shards call to you.", "", true)
	await dialogue_box.line_finished
	
	dialogue_box.show_dialogue("???", "Gather them, before the Red Moon rises complete.", "", true)
	await dialogue_box.line_finished
	
	await _flash_screen(Color.WHITE, 0.5)
	
	dialogue_box.show_narration("The vision fades, leaving you breathless but somehow... stronger.", true)
	await dialogue_box.line_finished
	
	# Unlock new skill
	var alexios = PartyManager.get_character("alexios")
	if alexios and not alexios.has_skill("memory_flash"):
		alexios.skills.append("memory_flash")
		dialogue_box.show_narration("You have learned Memory Flash!", true)
		await dialogue_box.line_finished
	
	dialogue_box.hide()
	GameManager.set_state(GameManager.GameState.EXPLORATION)
	player.enable_movement()


func _flash_screen(color: Color, duration: float) -> void:
	vision_overlay.color = color
	vision_overlay.show()
	
	var tween = create_tween()
	tween.tween_property(vision_overlay, "color:a", 0.0, duration)
	await tween.finished
	
	vision_overlay.hide()
