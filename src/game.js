class Game {

    constructor() {

        this.player = null;
        this.time = 180;
        this.mobsCount = 10;
        this.score = 0;
        this.isGame = true;
        this.stage = 1;
        this.bombs = [];
        this.blocks = [];
        this.mobs = [];
        this.bonus = null;

        this.groups = {
            walls: null,
            door: null,
            mobGroup: null,
            bombsGroup: null,
            bumGroup: null,
            wallsBrocken: null
        };

        this.engine = new Phaser.Game(496, 240, Phaser.AUTO, null, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });

        this._rect = new Phaser.Rectangle( 0, 0, 500, 500 );
    }

    
    preload = () => {
        this.engine.stage.backgroundColor = '#1F8B00';
        if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1){
            // Do Firefox-related activities
            this.engine.load.baseURL = 'https://raw.githubusercontent.com/gagikpog/Bomberman/master/';
            this.engine.load.crossOrigin = 'anonymous';
        }
        this.engine.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.engine.scale.pageAlignHorizontally = true;
        this.engine.scale.pageAlignVertically = true;
        this.engine.load.spritesheet('man', 'imgs/man.png', 16, 16, 21);
        this.engine.load.spritesheet('mob1', 'imgs/mob1.png', 16, 16, 11);
        this.engine.load.spritesheet('bomb', 'imgs/bomb.png', 16, 16, 3);
        this.engine.load.spritesheet('bum', 'imgs/bum.png', 48, 48, 4);
        this.engine.load.spritesheet('bum1', 'imgs/b1.png', 36, 12, 1);
        this.engine.load.spritesheet('bum2', 'imgs/b2.png', 12, 36, 1);
        this.engine.load.spritesheet('block1','imgs/block1.png', 16,16, 1);
        this.engine.load.spritesheet('block2','imgs/block2.png', 16,16, 1);
        this.engine.load.spritesheet('block3','imgs/block3.png', 16, 16, 7);
        this.engine.load.spritesheet('bonuses','imgs/bonuses.png', 16, 16, 14);
        this.engine.load.spritesheet('door','imgs/door.png', 16, 16, 14);
    }

    render = () => {
        if (this.isGame) {
            this.engine.debug.text( `TIME  ${this.time}            ${this.score}             LEFT  ${this.player.lives}`, 60, 20 );
        } else {
            this.engine.debug.geom(this._rect, 'rgba(0, 0, 0, 1)');
            this.engine.debug.text(`STAGE ${this.stage}`, 210, 120);
        }
    }

    create = () => {
        setInterval(()=> {
            if (this.time-- == 0) {
                this.player.Die();
                this.time = 180;
            }
        }, 1000);

        this.engine.physics.startSystem(Phaser.Physics.ARCADE);
        this.groups.walls = this.engine.add.group();
        this.groups.walls.enableBody = true;
    
        this.groups.wallsBrocken = this.engine.add.group();
        this.groups.wallsBrocken.enableBody = true;
    
        this.groups.bombsGroup = this.engine.add.group();
        this.groups.bombsGroup.enableBody = true;
    
        this.groups.bumGroup = this.engine.add.group();
        this.groups.bumGroup.enableBody = true;
    
        this.groups.mobGroup = this.engine.add.group();
        this.groups.mobGroup.enableBody = true;
    
        this.engine.add.sprite(-100, -5, 'block1').scale.set(45, 2.6);
        this.groups.door = this.engine.add.sprite(0, 0, 'door');
        this.groups.door.name = 'door';
        this.engine.physics.enable(this.groups.door, Phaser.Physics.ARCADE);
        this.groups.door.body.setCircle(1);
        this.groups.door.body.collideWorldBounds = true;
        this.groups.door.body.immovable = true;
        this.engine.world.sendToBack(this.groups.door);
    
        this.bonus = this.engine.add.sprite(0, 0, 'bonuses');
        this.bonus.name = 'bonus';
        this.engine.physics.enable(this.bonus, Phaser.Physics.ARCADE);
        this.bonus.body.collideWorldBounds = true;
        this.bonus.body.setCircle(1);
        this.engine.world.sendToBack(this.bonus);
        this.bonus.score = 1000;

        // FIXME: global functions
        initWalls(this.groups.walls);
        newGame();
    }
    
    update = () => {
        this.engine.physics.arcade.collide(this.player.target, this.groups.walls);
        this.engine.physics.arcade.collide(this.player.target, this.groups.wallsBrocken);
        this.engine.physics.arcade.collide(this.player.target, this.groups.bombsGroup);
        this.engine.physics.arcade.collide(this.player.target, this.groups.bumGroup);
        this.engine.physics.arcade.collide(this.player.target, this.bonus);
        this.engine.physics.arcade.collide(this.player.target, this.groups.door);
        this.engine.physics.arcade.collide(this.player.target, this.groups.mobGroup);

        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.walls);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.wallsBrocken);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bombsGroup);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bumGroup);

        this.engine.physics.arcade.collide(this.groups.bumGroup, this.groups.wallsBrocken);
        this.player.update();
    }
}
