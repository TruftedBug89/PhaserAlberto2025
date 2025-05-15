import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';

export default class Moneda extends Phaser.Physics.Arcade.Sprite {
  preload(){
    this.load.image('portalgif', 'assets/portal.gif');
  }
  constructor(scene,x,y) {
    

    super(scene, x, y, , 2);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this
      .setDepth(10)             // davant de tot
      .setFlipY(true)           // gir vertical si cal
      .setDisplaySize(60, 60)   // mida visible 60×60
      

    this.scene = scene;
  }

}