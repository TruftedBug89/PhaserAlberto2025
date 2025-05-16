export class GameOver extends Phaser.Scene {
    constructor(reason) {
        super('GameOver');
        this.reason = reason;
    }
    preload(){
        this.load.image('background', 'assets/finalbg.png');

    }
    init(data) {
        //agafem el score final de l'altra escena
        this.finalScore = data.score !== undefined ? data.score : 0;
    }
    create() {
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.5);

        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 - 50, this.reason, { 
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

 
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 + 30, `Puntuació final: ${this.finalScore}`, { 
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        // "Tornar a l'inici" (Return to Home) Button
        const restartButton = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 + 120, 'Tornar a l\'inici', { 
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffff00',
            stroke: '#000000', strokeThickness: 7,
            align: 'center',
            // backgroundColor: '#555555', // Optional: background for button
            // padding: { x: 20, y: 10 } // Optional: padding for button
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Action when the button is clicked
        restartButton.on('pointerdown', () => {
            // Optional: Stop this scene if you want to be explicit, though scene.start usually handles it.
            // this.scene.stop('GameOver');
            this.scene.start('Game'); // Restart the Game scene
        });

        // Optional: Add hover effect for the button
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ff8c00' }); // Darker yellow/orange on hover
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#ffff00' }); // Back to original yellow
        });
    }
}
