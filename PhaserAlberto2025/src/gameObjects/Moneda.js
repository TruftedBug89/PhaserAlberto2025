import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';

export default class Moneda extends Phaser.Physics.Arcade.Sprite {

  constructor(scene,x,y,multiplyer) {
    

    super(scene, x, y, ASSETS.spritesheet.moneda.key, 2);
    this.score = multiplyer * 50;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this
      .setDepth(10)             // davant de tot
      .setFlipY(true)           // gir vertical si cal
      .setDisplaySize(60, 60)   // mida visible 60×60
      .anims.play(ANIMATION.moneda.key);  // arrenca l’animació

    this.scene = scene;
  }

}