import ASSETS from '../assets.js';

export default class Punxa extends Phaser.Physics.Arcade.Sprite {

  constructor(scene,x,y,img) {
    

    super(scene, x, y,img);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this
      .setDepth(10)             // davant de tot
      .setDisplaySize(60, 60);   // mida visible 60×60
      

    this.scene = scene;
  }

}