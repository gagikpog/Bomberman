
/**
* @function buildMob Конструктор бота
* @param {*} _mob
*/
export function buildMob(_mob) {
    _mob.body.onCollide = new Phaser.Signal();
    _mob.body.onCollide.add(mobCollide, this);
    _mob.name = 'mob';
    _mob.die = false;
    _mob.score = 100;
    // Создается свойство speed. Максимальное значение 3, минимальное 0.5.
    Object.defineProperty(_mob, 'speed', {
        set(val) {
            this._speed = val;
            if (val < 40) {
                this._speed = 40;
            };
            if (val > 70) {
                this._speed = 70;
            };
        },
        get() {
            return this._speed || (this._speed = 40);
        }
    });

    // Анимация которая будут рисоваться при каждом действии.
    _mob.animations.add('mobWalkLeft', [3, 4, 5]);
    _mob.animations.add('mobWalkRight', [0, 1, 2]);
    _mob.animations.add('mobDie', [7, 8, 9, 10]);

    // Загрузка изначальной кортики.
    _mob.animations.play('mobWalkLeft', 8, true);
    // Движение в каждую сторону и запуск соответствующей анимации.
    _mob.goLeft = function() {
        _mob.body.velocity.setTo(-_mob.speed, 0);
        _mob.animations.play('mobWalkLeft', 8, true);
    };

    _mob.goRight = function() {
        _mob.body.velocity.setTo(_mob.speed, 0);
        _mob.animations.play('mobWalkRight', 8, true);
    };

    _mob.goDown = function() {
        _mob.body.velocity.setTo(0, _mob.speed);
    };

    _mob.goUp = function() {
        _mob.body.velocity.setTo(0, -_mob.speed);
    };

    _mob.update = function() {
        if(_mob.die){
            return;
        }
        const probability = 0.001;
        if (Math.random() < probability) {
            _mob.goLeft();
        } else if (Math.random() < probability) {
            _mob.goRight();
        } else if (Math.random() < probability) {
            _mob.goUp();
        } else if (Math.random() < probability) {
            _mob.goDown();
        }
    };

    _mob.collide = function() {
        if(_mob.die){
            return;
        }
        if (Math.random() < 0.4) {
            _mob.goLeft();
        } else if (Math.random() < 0.4) {
            _mob.goRight();
        } else if (Math.random() < 0.4) {
            _mob.goUp();
        } else {
            _mob.goDown();
        }
    };

    // Умирает
    _mob.Die = function() {
        if (_mob.die) {
            return;
        }
        _mob.die = true;
        _mob.animations.play('mobDie', 10, false);
        _mob.die = true;
        _mob.body.velocity.setTo(0, 0);
        myGame.score += _mob.score;
        setTimeout(()=>{
            _mob.destroy();
        }, 1000);
    };

    _mob.goRight();
    return _mob;

}

function mobCollide(_mob, spr) {
    _mob.collide();
    switch(spr.name) {
    case 'bum0':
        _mob.Die();
        break;
    }
}
