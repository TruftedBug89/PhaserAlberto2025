import ASSETS from '../assets.js';

export default class EnemyFlying extends Phaser.Physics.Arcade.Sprite {
    health = 1; // enemy health
    fireCounterMin = 100; // minimum fire rate
    fireCounterMax = 300; // maximum fire rate
    fireCounter;
    power = 1; // enemy strength

    // path coordinates for enemy to follow
    /*
    paths = [
        [[200, -50], [1080, 160], [200, 340], [1080, 520], [200, 700], [1080, 780]],
        [[-50, 200], [1330, 200], [1330, 400], [-50, 400], [-50, 600], [1330, 600]],
        [[-50, 360], [640, 50], [1180, 360], [640, 670], [50, 360], [640, 50], [1180, 360], [640, 670], [-50, 360]],
        [[1330, 360], [640, 50], [50, 360], [640, 670], [1180, 360], [640, 50], [50, 360], [640, 670], [1330, 360]],
    ]*/
    //canviem els paths per a que vinguen de totes direccions, no nomes de costat, hi han 0,7 opcions
    paths = [
    // de dalt cap al centre
    [[640, -100], [640, 360]],

    // de baix cap al centre
    [[640, 820], [640, 360]],

    // de l'esquerra cap al centre
    [[-100, 360], [640, 360]],

    // de la dreta cap al centre
    [[1380, 360], [640, 360]],

    // de la dalt esquerra  al centre
    [[-100, -100], [640, 360]],

    // de la dalt dreta  al centre
    [[1380, -100], [640, 360]],

    // de la baix esquerra  al centre
    [[-100, 820], [640, 360]],

    // de la baix dreta  al centre
    [[1380, 820], [640, 360]],
    ];



    constructor(scene, shipId, pathId, speed, power, player) {
        const startingId = 12;
        super(scene, 500, 500, ASSETS.spritesheet.ships.key, startingId + shipId);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.power = power;
        this.fireCounter = Phaser.Math.RND.between(this.fireCounterMin, this.fireCounterMax); // random firing interval
        this.setFlipY(true); // flip image vertically
        this.setDepth(10);
        this.scene = scene;
        this.player = player;

        this.initPath(pathId, speed); // choose path to follow
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        //els zombies van cap al jugador no al path
        this.scene.physics.moveToObject(this, this.player, this.moveSpeed);
        if (this.pathIndex > 1) return; // stop updating if reached end of path
     
        //this.path.getPoint(this.pathIndex, this.pathVector); // get current coordinate based on percentage moved

        //this.setPosition(this.pathVector.x, this.pathVector.y); // set position of this enemy

        //this.pathIndex += this.pathSpeed; // increment percentage moved by pathSpeed

        if (this.pathIndex > 1) this.die();
        this.lookatplayer()
        // update firing interval
        if (this.fireCounter > 0) this.fireCounter--;
        else {
            //this.fire();
        }
    }
    lookatplayer(){
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.player.x, this.player.y
        );
        //  +Math.PI per a girar-ho 180 graus (bug)
        this.setRotation(angle + Math.PI / 2 + Math.PI);
    }
    hit(damage) {
        this.health -= damage;

        if (this.health <= 0) this.die();
    }

    die() {
        this.scene.addExplosion(this.x, this.y);
        this.scene.removeEnemy(this);
    }

    initPath(pathId, speed) {
        const points = this.paths[pathId];

        this.path = new Phaser.Curves.Spline(points);
        this.pathVector = new Phaser.Math.Vector2(); // current coordinates along path in pixels
        this.pathIndex = 0; // percentage of position moved along path, 0 = beginning, 1 = end
        this.pathSpeed = speed; // speed of movement

        this.path.getPoint(0, this.pathVector); // get coordinates based on pathIndex

        this.setPosition(this.pathVector.x, this.pathVector.y);
    }

    getPower() {
        return this.power;
    }

    remove() {
        this.scene.removeEnemy(this);
    }
}