/*
* Asset from: https://kenney.nl/assets/pixel-platformer
*
*/
import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import Player from '../gameObjects/Player.js';
import PlayerBullet from '../gameObjects/PlayerBullet.js';
import EnemyFlying from '../gameObjects/EnemyFlying.js';
import Portal from '../gameObjects/Portal.js';
import Punxa from '../gameObjects/Punxa.js';
import Moneda from '../gameObjects/Moneda.js';
import Explosion from '../gameObjects/Explosion.js';


export class Game extends Phaser.Scene {
    static NEXT_LEVEL_POINTS = 2000;
    static END_GAME_POINTS = 6000;
    constructor() {
        super('Game');
    }
    preload(){
        this.load.image('titleimg', 'assets/titleimg.png');
        this.load.image('background', 'assets/startbg.png');
        this.load.image('tutorialimg','assets/tutorialimg.png');
        this.load.image('portalgif', 'assets/portal.gif');
        this.load.image('punxa','assets/punxa.png')
        this.load.audio('audiobg','assets/music.mp3')
    
    }
    create() {
        this.initVariables();
        this.initGameUi();
        this.updateLives(3);
        this.initAnimations();
        this.initPlayer();
        this.initInput();
        this.initPhysics();
        this.initMap();
        this.bgMusic = this.sound.add('audiobg', {
            volume: 0.5,  // adjust volume 0 to 1
            loop: true    // loop music
        });
        this.addMoneda(1);
        this.addPunxa();
        this.bgMusic.play();
    }

    update() {
        //deshabilitem aixo per a que sigue una pantalla sense
        //this.updateMap();

        if (!this.gameStarted) return;

        this.player.update();
        if (this.spawnEnemyCounter > 0) this.spawnEnemyCounter--;
        else this.addFlyingGroup();
        
    }

    initVariables() {
        this.level1score = 0;
        this.level = 1;
        this.score = 0;
        
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;
        this.moneda;
        this.punxa;
        this.portal;

        // list of tile ids in tiles.png
        // items nearer to the beginning of the array have a higher chance of being randomly chosen when using weighted()
        this.tiles = [50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 36, 48, 60, 72, 84];
        this.tileSize = 32; // width and height of a tile in pixels

        this.mapOffset = 10; // offset (in tiles) to move the map above the top of the screen
        this.mapTop = -this.mapOffset * this.tileSize; // offset (in pixels) to move the map above the top of the screen
        this.mapHeight = Math.ceil(this.scale.height / this.tileSize) + this.mapOffset + 1; // height of the tile map (in tiles)
        this.mapWidth = Math.ceil(this.scale.width / this.tileSize); // width of the tile map (in tiles)
        this.scrollSpeed = 1; // background scrolling speed (in pixels)
        this.scrollMovement = 0; // current scroll amount
        this.spawnEnemyCounter = 0; // timer before spawning next group of enemies

        this.map; // rference to tile map
        this.groundLayer; // reference to ground layer of tile map
    }

    initGameUi() {
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0).setDepth(100).setScale(1.5);

        // Create tutorial text
        this.tutorialText = this.add.text(this.centreX, this.centreY+200, 'Prem espai per començar!', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);

        // Create score text
        this.scoreText = this.add.text(20, 20, 'Puntuació: 0', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        })
            .setDepth(100).setVisible(false);

        this.livesText = this.add.text(500, 20, '❤️❤️❤️', {
            fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        })
            .setDepth(100).setVisible(false);

        // Create game over text
        //no cal, canviem d'escena
        /*
        this.gameOverText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Has mort', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);
*/
        this.titleimage = this.add.image(20, 20, 'titleimg');  // l'he precarregat manualment per aquesta escena ja que nomes cal aquí

        this.titleimage.setOrigin(0, 0);
        this.titleimage.setDepth(100);
        this.titleimage.setScale(0.5);

        this.tutorialimg = this.add.image(750, 70, 'tutorialimg');  
        this.tutorialimg.setOrigin(0, 0);
        this.tutorialimg.setDepth(100);
        this.tutorialimg.setScale(0.5);
        

    }

    initAnimations() {
        this.anims.create({
            key: ANIMATION.explosion.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.explosion.texture, ANIMATION.explosion.config),
            frameRate: ANIMATION.explosion.frameRate,
            repeat: ANIMATION.explosion.repeat
        });
        this.anims.create({
            key: ANIMATION.moneda.key,
            frames: this.anims.generateFrameNumbers(
                ANIMATION.moneda.texture,
                ANIMATION.moneda.config
            ),
            frameRate: ANIMATION.moneda.frameRate,
            repeat: ANIMATION.moneda.repeat
            });
    }

    initPhysics() {
        this.portals = this.add.group();
        this.punxes = this.add.group();
        this.monedes = this.add.group();
        this.enemyGroup = this.add.group();
        this.enemyBulletGroup = this.add.group();
        this.playerBulletGroup = this.add.group();

        this.physics.add.overlap(this.player, this.portals, this.hitPortal, null, this);
        this.physics.add.overlap(this.player,this.punxes,this.hitPunxa,null,this);
        this.physics.add.overlap(this.player, this.monedes, this.hitMoneda, null, this);
        this.physics.add.overlap(this.player, this.enemyBulletGroup, this.hitPlayer, null, this);
        this.physics.add.overlap(this.playerBulletGroup, this.enemyGroup, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemyGroup, this.hitPlayer, null, this);
    }

    initPlayer() {
        this.player = new Player(this, this.centreX, this.scale.height/2, 8);
    }
    initLevelTwo() {
        const mapData = [];

        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];

            for (let x = 0; x < this.mapWidth; x++) {
                // randomly choose a tile id from this.tiles
                // weightedPick favours items earlier in the array
                const tileIndex = Phaser.Math.RND.weightedPick(this.tiles);

                row.push(tileIndex);
            }

            mapData.push(row);
        }
        this.map = this.make.tilemap({ data: mapData, tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileset = this.map.addTilesetImage(ASSETS.spritesheet.tiles2.key);
        this.groundLayer = this.map.createLayer(0, tileset, 0, this.mapTop);

        //reset a nivell 2
        this.removeEnemyAll()
        this.player.x = this.centreX;
        this.player.y = this.scale.height/2;
        this.updateLives(5);
        this.level = 2;
        this.level1score = this.score;
        this.score = 0; 
        this.updateScore(0);
        this.monedes.remove(this.moneda, true, true);
        this.addMoneda(1)

    }
    initInput() {
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // check for spacebar press only once
        this.cursors.space.once('down', (key, event) => {
            this.gameStarted = true;
            this.score = 0; // Reset puntuació
            this.updateScore(0); // Update puntuació
            this.titleimage.setVisible(false);
            this.tutorialimg.setVisible(false);
            this.scoreText.setVisible(true);
            this.livesText.setVisible(true);
            this.startGame();
            
        });
    }

    // create tile map data
    initMap() {
        const mapData = [];

        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];

            for (let x = 0; x < this.mapWidth; x++) {
                // randomly choose a tile id from this.tiles
                // weightedPick favours items earlier in the array
                const tileIndex = Phaser.Math.RND.weightedPick(this.tiles);

                row.push(tileIndex);
            }

            mapData.push(row);
        }
        this.map = this.make.tilemap({ data: mapData, tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileset = this.map.addTilesetImage(ASSETS.spritesheet.tiles.key);
        this.groundLayer = this.map.createLayer(0, tileset, 0, this.mapTop);
    }

    // scroll the tile map
    updateMap() {
        this.scrollMovement += this.scrollSpeed;

        if (this.scrollMovement >= this.tileSize) {
            //  Create new row on top
            let tile;
            let prev;

            // loop through map from bottom to top row
            for (let y = this.mapHeight - 2; y > 0; y--) {
                // loop through map from left to right column
                for (let x = 0; x < this.mapWidth; x++) {
                    tile = this.map.getTileAt(x, y - 1);
                    prev = this.map.getTileAt(x, y);

                    prev.index = tile.index;

                    if (y === 1) { // if top row
                        // randomly choose a tile id from this.tiles
                        // weightedPick favours items earlier in the array
                        tile.index = Phaser.Math.RND.weightedPick(this.tiles);
                    }
                }
            }

            this.scrollMovement -= this.tileSize; // reset to 0
        }

        this.groundLayer.y = this.mapTop + this.scrollMovement; // move one tile up
    }

    startGame() {


        this.gameStarted = true;
        this.tutorialText.setVisible(false);
        this.background1.setVisible(false);
        
        this.addFlyingGroup();
    }

    fireBullet(x, y,direccio) {
        //afegim direccio
        const bullet = new PlayerBullet(this, x, y, direccio);
        this.playerBulletGroup.add(bullet);
    }

    removeBullet(bullet) {
        this.playerBulletGroup.remove(bullet, true, true);
    }


    addPortal(){
        // nomes un
        if (this.portal && this.portal.active) return;
        const maxX = this.scale.width-50;   // amplada viewport
        const maxY = this.scale.height-50;  // altura viewport
        this.portal = new Portal(this,Phaser.Math.Between(0, maxX+30),Phaser.Math.Between(0, maxY+30),'portalgif');
        this.portals.add(this.portal);
    }
    addPunxa(){
        if (this.punxa && this.punxa.active) return;
        const maxX = this.scale.width-50;   // amplada viewport
        const maxY = this.scale.height-50;  // altura viewport
        this.punxa = new Punxa(this,Phaser.Math.Between(0, maxX+30),Phaser.Math.Between(0, maxY+30),'punxa');
        this.punxes.add(this.punxa);
    }
    addMoneda(score) {
          // nomes una
        if (this.moneda && this.moneda.active) return;
        const maxX = this.scale.width-50;   // amplada viewport
        const maxY = this.scale.height-50;  // altura viewport
        this.moneda = new Moneda(this,Phaser.Math.Between(0, maxX+10),Phaser.Math.Between(0, maxY+10),score);
        this.monedes.add(this.moneda);
    }
    // add a group of flying enemies
    addFlyingGroup() {
        this.spawnEnemyCounter = Phaser.Math.RND.between(5, 8) * 60; // spawn next group after x seconds
        const randomId = Phaser.Math.RND.between(0, 11); // id to choose image in tiles.png
        const randomCount = Phaser.Math.RND.between(5, 15); // number of enemies to spawn
        const randomInterval = Phaser.Math.RND.between(8, 12) * 100; // delay between spawning of each enemy
        //const randomPath = Phaser.Math.RND.between(0, 3); // choose a path, a group follows the same path
        const randomPath = Phaser.Math.RND.between(0, 7); // canviem aixo a 0,7 perque a EnemyFlying.js hem canviat a 7 paths
        const randomPower = Phaser.Math.RND.between(1, 4); // strength of the enemy to determine damage to inflict and selecting bullet image
        const randomSpeed = Phaser.Math.RND.realInRange(0.0001, 0.001); // increment of pathSpeed in enemy

        this.timedEvent = this.time.addEvent(
            {
                delay: randomInterval,
                callback: this.addEnemy,
                args: [randomId, randomPath, randomSpeed, randomPower,this.player], // parameters passed to addEnemy()
                callbackScope: this,
                repeat: randomCount
            }
        );
    }

    addEnemy(shipId, pathId, speed, power,player) {
        const enemy = new EnemyFlying(this, shipId, pathId, speed, power,player);
        this.enemyGroup.add(enemy);
    }

    removeEnemy(enemy) {
        this.enemyGroup.remove(enemy, true, true);
    }
    removeEnemyAll() {
       this.enemyGroup.clear(true, true);
 
    }
    addExplosion(x, y) {
        new Explosion(this, x, y);
    }
    hitPortal(player,obstacle){
        this.addExplosion(this.x, this.y);
        if (this.level == 2){

            this.GameOver("GG! Victoria!");
        }else{
             this.initLevelTwo();
        }
        this.portals.remove(obstacle, true, true);
       
    }
    hitPunxa(player,obstacle){
        this.addExplosion(this.x, this.y);
        if (this.hp > 1){
            this.hp--;
            this.updateLives(this.hp);
            this.punxes.remove(obstacle, true, true);
        this.addPunxa();
        }else{
            this.bgMusic.stop();

            this.GameOver("Has mort");
        }
        
    }
    hitMoneda(player,obstacle){ 
        this.addExplosion(this.x, this.y);
        this.monedes.remove(obstacle, true, true);
        this.addMoneda(obstacle.score/50+1)
        this.updateScore(obstacle.score)
    }

    hitPlayer(player, obstacle) {
        obstacle.die()
        this.addExplosion(player.x, player.y);
        this.removeEnemyAll()
        this.player.x = this.centreX;
        this.player.y = this.scale.height/2;
        //fem que les vides reseteen la partida
        if (this.hp > 1){
            this.hp--;
            this.updateLives(this.hp);
            this.monedes.remove(this.moneda, true, true);
            this.addMoneda(1);
        }
        else{
            player.hit(obstacle.getPower());
            this.bgMusic.stop();
            this.GameOver("Has mort");
        }
        
    }

    hitEnemy(bullet, enemy) {
        this.updateScore(13);
        bullet.remove();
        enemy.hit(bullet.getPower());
    }

    updateScore(points) {
        this.score += points;
        if (this.level == 1){

            this.scoreText.setText(`Puntuació: ${this.score}/${Game.NEXT_LEVEL_POINTS}`);
        }else{
            this.scoreText.setText(`Puntuació: ${this.score}/${Game.END_GAME_POINTS}`);
        }

        if (this.score > Game.NEXT_LEVEL_POINTS && this.level == 1){
            this.score -= points;
            this.addPortal();
        }else if(this.score > Game.END_GAME_POINTS && this.level == 2){
            this.score -= points;    
            this.addPortal();
        }

    }
    updateLives(hp) {
        this.hp = hp;
        this.livesText.setText("❤️".repeat(this.hp));//Uncaught TypeError: Cannot read properties of undefined (reading 'setText')
    }

    GameOver(reason) {
        this.gameStarted = false;
        this.scene.start('GameOver', { score: this.score, level1score: this.level1score, reason: reason}); // Add this line
    }
}
