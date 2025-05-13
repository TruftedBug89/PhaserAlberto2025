import ASSETS from '../assets.js';

export default class Portal extends Phaser.Physics.Arcade.Sprite {
    


    constructor(scene, pathId, speed, power) {
        super(scene, 500, 500, ASSETS.spritesheet.ships.key);

        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.setFlipY(true); // flip image vertically
        this.setDepth(10);
        this.scene = scene;

        this.initPath(pathId, speed); // choose path to follow
    }

}