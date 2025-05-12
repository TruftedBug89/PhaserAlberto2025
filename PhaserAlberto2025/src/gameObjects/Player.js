import ASSETS from '../assets.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    velocityIncrement = 50;
    velocityMax = 500;
    drag = 1000;
    fireRate = 70;
    fireCounter = 0;
    health = 1;

    constructor(scene, x, y, shipId) {
        super(scene, x, y, ASSETS.spritesheet.ships.key, shipId);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true); // prevent ship from leaving the screen
        this.setDepth(100); // make ship appear on top of other game objects
        this.scene = scene;
        this.setMaxVelocity(this.velocityMax); // limit maximum speed of ship
        this.setDrag(this.drag);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.fireCounter > 0) this.fireCounter--;

        this.checkInput();
    }

    checkInput() {
        const cursors = this.scene.cursors; // get cursors object from Game scenea
        const mouse = this.scene.input.activePointer;

        //afegim wasd 
        const leftKey = cursors.left.isDown || cursors.a.isDown;
        const rightKey = cursors.right.isDown || cursors.d.isDown;
        const upKey = cursors.up.isDown || cursors.w.isDown;
        const downKey = cursors.down.isDown || cursors.s.isDown;
        const spaceKey = cursors.space.isDown || mouse.isDown;

        const moveDirection = { x: 0, y: 0 }; // default move direction

        if (leftKey) {moveDirection.x--; this.setRotation(-Math.PI / 2);}
        if (rightKey) {moveDirection.x++; this.setRotation(Math.PI / 2)}
        if (upKey) {moveDirection.y--; this.setRotation(0)}
        if (downKey) {moveDirection.y++;this.setRotation(Math.PI)}
        if (spaceKey) this.fire();

        this.body.velocity.x += moveDirection.x * this.velocityIncrement; // increase horizontal velocity
        this.body.velocity.y += moveDirection.y * this.velocityIncrement; // increase vertical velocity
    }

    fire() {
        if (this.fireCounter > 0) return;

        this.fireCounter = this.fireRate;

        //afegim el mouse per poder apuntar
        const mouse = this.scene.input.activePointer;

        const objectiu = new Phaser.Math.Vector2(mouse.worldX, mouse.worldY);
        const origen = new Phaser.Math.Vector2(this.x, this.y);
        const vectordedireccio = objectiu.subtract(origen).normalize();

        this.scene.fireBullet(this.x, this.y, vectordedireccio);
    }

    hit(damage) {
        this.health -= damage;

        if (this.health <= 0) this.die();
    }

    die() {
        this.scene.addExplosion(this.x, this.y);
        this.destroy(); // destroy sprite so it is no longer updated
    }
}