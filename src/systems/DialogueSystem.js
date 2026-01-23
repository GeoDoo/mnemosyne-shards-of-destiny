import Phaser from 'phaser';

export default class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.dialogueLines = [];
    this.currentLineIndex = 0;
    this.currentPortrait = null;
    
    // UI elements
    this.container = null;
    this.background = null;
    this.portrait = null;
    this.nameText = null;
    this.dialogueText = null;
    this.continueIndicator = null;
    
    // Typewriter effect
    this.typewriterTimer = null;
    this.currentCharIndex = 0;
    this.isTyping = false;
    this.fullText = '';

    this.createUI();
  }

  createUI() {
    const { width, height } = this.scene.cameras.main;
    
    // Create container
    this.container = this.scene.add.container(0, height - 200);
    this.container.setDepth(1000);
    this.container.setVisible(false);

    // Background panel
    this.background = this.scene.add.rectangle(width / 2, 100, width - 40, 180, 0x1a1a2e, 0.95);
    this.background.setStrokeStyle(3, 0xd4af37);
    this.container.add(this.background);

    // Portrait background
    const portraitBg = this.scene.add.rectangle(70, 100, 90, 90, 0x2a2a4a);
    portraitBg.setStrokeStyle(2, 0xd4af37);
    this.container.add(portraitBg);

    // Portrait placeholder (will be replaced with actual portrait)
    this.portrait = this.scene.add.rectangle(70, 100, 80, 80, 0x4a4a6a);
    this.container.add(this.portrait);

    // Speaker name
    this.nameText = this.scene.add.text(130, 30, '', {
      fontSize: '22px',
      fontFamily: 'Georgia, serif',
      fill: '#d4af37',
      fontStyle: 'bold'
    });
    this.container.add(this.nameText);

    // Dialogue text
    this.dialogueText = this.scene.add.text(130, 60, '', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      fill: '#ffffff',
      wordWrap: { width: width - 180 },
      lineSpacing: 6
    });
    this.container.add(this.dialogueText);

    // Continue indicator
    this.continueIndicator = this.scene.add.text(width - 70, 160, '▼', {
      fontSize: '20px',
      fill: '#d4af37'
    });
    this.continueIndicator.setVisible(false);
    this.container.add(this.continueIndicator);

    // Blinking animation for continue indicator
    this.scene.tweens.add({
      targets: this.continueIndicator,
      alpha: { from: 1, to: 0.3 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Click/tap to advance
    this.background.setInteractive();
    this.background.on('pointerdown', () => this.advance());

    // Keyboard to advance
    this.scene.input.keyboard.on('keydown-SPACE', () => this.advance());
    this.scene.input.keyboard.on('keydown-ENTER', () => this.advance());
  }

  startDialogue(lines, portraitKey = null) {
    this.dialogueLines = lines;
    this.currentLineIndex = 0;
    this.currentPortrait = portraitKey;
    this.active = true;
    
    this.container.setVisible(true);
    this.showCurrentLine();
  }

  showCurrentLine() {
    if (this.currentLineIndex >= this.dialogueLines.length) {
      this.endDialogue();
      return;
    }

    const line = this.dialogueLines[this.currentLineIndex];
    
    // Update speaker name
    this.nameText.setText(line.speaker || '');

    // Update portrait if specified
    if (line.portrait || this.currentPortrait) {
      const portraitKey = line.portrait || this.currentPortrait;
      if (this.scene.textures.exists(portraitKey)) {
        // Replace rectangle with actual portrait
        this.portrait.destroy();
        this.portrait = this.scene.add.image(70, 100, portraitKey);
        this.portrait.setDisplaySize(80, 80);
        this.container.add(this.portrait);
      }
    }

    // Start typewriter effect
    this.fullText = line.text;
    this.currentCharIndex = 0;
    this.isTyping = true;
    this.continueIndicator.setVisible(false);
    this.dialogueText.setText('');

    // Clear any existing timer
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
    }

    // Create typewriter effect
    this.typewriterTimer = this.scene.time.addEvent({
      delay: 30, // milliseconds per character
      callback: this.typeNextChar,
      callbackScope: this,
      repeat: this.fullText.length - 1
    });
  }

  typeNextChar() {
    this.currentCharIndex++;
    this.dialogueText.setText(this.fullText.substring(0, this.currentCharIndex));

    if (this.currentCharIndex >= this.fullText.length) {
      this.isTyping = false;
      this.continueIndicator.setVisible(true);
    }
  }

  advance() {
    if (!this.active) return;

    if (this.isTyping) {
      // Skip to end of current line
      if (this.typewriterTimer) {
        this.typewriterTimer.remove();
      }
      this.dialogueText.setText(this.fullText);
      this.isTyping = false;
      this.continueIndicator.setVisible(true);
    } else {
      // Go to next line
      this.currentLineIndex++;
      this.showCurrentLine();
    }
  }

  endDialogue() {
    this.active = false;
    this.container.setVisible(false);
    this.dialogueLines = [];
    this.currentLineIndex = 0;
  }

  isActive() {
    return this.active;
  }
}
