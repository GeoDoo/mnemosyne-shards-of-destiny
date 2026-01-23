Audit this file for Phaser performance bottlenecks:
- Identify any object instantiation inside `update()`.
- Suggest `object pooling` for frequently created/destroyed entities.
- Check for redundant physics calculations or unused bodies.
- Recommend `BitmapText` if static text is updated frequently.
