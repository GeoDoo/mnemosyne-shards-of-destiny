extends Node
## AudioManager - Handles all game audio
##
## Manages background music, sound effects, and audio settings.

var music_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []

var current_music: String = ""
var music_volume: float = 0.8
var sfx_volume: float = 1.0
var master_volume: float = 1.0

const MAX_SFX_PLAYERS = 8
const MUSIC_FADE_TIME = 1.0


func _ready() -> void:
	# Create music player
	music_player = AudioStreamPlayer.new()
	music_player.bus = "Music"
	add_child(music_player)
	
	# Create SFX player pool
	for i in range(MAX_SFX_PLAYERS):
		var player = AudioStreamPlayer.new()
		player.bus = "SFX"
		add_child(player)
		sfx_players.append(player)
	
	# Load saved settings
	_apply_settings(SaveManager.load_settings())


func _apply_settings(settings: Dictionary) -> void:
	master_volume = settings.get("master_volume", 1.0)
	music_volume = settings.get("music_volume", 0.8)
	sfx_volume = settings.get("sfx_volume", 1.0)
	
	_update_bus_volumes()


func _update_bus_volumes() -> void:
	# Note: Requires audio buses to be set up in Godot
	# AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Master"), linear_to_db(master_volume))
	# AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), linear_to_db(music_volume))
	# AudioServer.set_bus_volume_db(AudioServer.get_bus_index("SFX"), linear_to_db(sfx_volume))
	pass


## Play background music
func play_music(music_path: String, fade_in: bool = true) -> void:
	if current_music == music_path and music_player.playing:
		return
	
	var stream = load(music_path) as AudioStream
	if stream == null:
		push_warning("AudioManager: Could not load music: " + music_path)
		return
	
	if music_player.playing and fade_in:
		await _fade_out_music()
	
	current_music = music_path
	music_player.stream = stream
	music_player.volume_db = linear_to_db(music_volume * master_volume) if not fade_in else -80.0
	music_player.play()
	
	if fade_in:
		await _fade_in_music()


## Stop background music
func stop_music(fade_out: bool = true) -> void:
	if not music_player.playing:
		return
	
	if fade_out:
		await _fade_out_music()
	
	music_player.stop()
	current_music = ""


func _fade_out_music() -> void:
	var tween = create_tween()
	tween.tween_property(music_player, "volume_db", -80.0, MUSIC_FADE_TIME)
	await tween.finished


func _fade_in_music() -> void:
	var target_db = linear_to_db(music_volume * master_volume)
	var tween = create_tween()
	tween.tween_property(music_player, "volume_db", target_db, MUSIC_FADE_TIME)
	await tween.finished


## Play a sound effect
func play_sfx(sfx_path: String, volume_scale: float = 1.0) -> void:
	var stream = load(sfx_path) as AudioStream
	if stream == null:
		push_warning("AudioManager: Could not load SFX: " + sfx_path)
		return
	
	# Find available player
	var player = _get_available_sfx_player()
	if player == null:
		return
	
	player.stream = stream
	player.volume_db = linear_to_db(sfx_volume * master_volume * volume_scale)
	player.play()


func _get_available_sfx_player() -> AudioStreamPlayer:
	for player in sfx_players:
		if not player.playing:
			return player
	# All players busy, return the first one (will interrupt)
	return sfx_players[0]


## Play UI sound effect
func play_ui_sound(sound_type: String) -> void:
	var sounds = {
		"select": "res://assets/audio/ui_select.wav",
		"confirm": "res://assets/audio/ui_confirm.wav",
		"cancel": "res://assets/audio/ui_cancel.wav",
		"cursor": "res://assets/audio/ui_cursor.wav"
	}
	
	if sounds.has(sound_type):
		play_sfx(sounds[sound_type], 0.7)


## Set volume levels
func set_master_volume(value: float) -> void:
	master_volume = clamp(value, 0.0, 1.0)
	_update_bus_volumes()


func set_music_volume(value: float) -> void:
	music_volume = clamp(value, 0.0, 1.0)
	_update_bus_volumes()
	if music_player.playing:
		music_player.volume_db = linear_to_db(music_volume * master_volume)


func set_sfx_volume(value: float) -> void:
	sfx_volume = clamp(value, 0.0, 1.0)
	_update_bus_volumes()
