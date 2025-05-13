import ASSETS from '../assets.js';

export default class Moneda extends Phaser.Physics.Arcade.Sprite {
    
    
    SCORE_MONEDA = 200;//100 punts si toques una moneda
    
    constructor(scene) {
        super(scene, 500, 500, ASSETS.spritesheet.ships.key);

        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.setFlipY(true); // flip image vertically
        this.setDepth(10);
        this.scene = scene;

     
    }

}