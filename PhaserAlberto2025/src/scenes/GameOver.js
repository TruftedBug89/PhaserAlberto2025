export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    preload(){
        this.load.image('background', 'assets/finalbg.png');

    }
    init(data) {
        this.finalScore = data.score !== undefined ? data.score : 0;
        this.reason = data.reason;
        this.level1score = data.level1score;
    }
    create() {
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.5);
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 - 100, this.reason, { 
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        if (this.level1score == 0){
            this.level1score = this.finalScore;
            this.finalScore = 0;
        }
        const puntuacio = `Puntuació fase 1: ${this.level1score}\nPuntuació fase 2: ${this.finalScore}\nPuntuació final: ${this.finalScore+this.level1score}`;
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 + 30, puntuacio, { 
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        // "Tornar a l'inici" (Return to Home) Button
        const restartButton = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5 + 320, 'Tornar a l\'inici', { 
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
