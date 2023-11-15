export enum BonusType {
    /** Добавляет +1 запас бомб */
    Bombs,
    /** Добавляет +1 ячейку в радиус взрыва */
    Flames,
    /** Увеличивает скорость игрока */
    Speed,
    /** Способность прохождение сквозь кирпичные стены */
    WallPass,
    /** Способность самому взрывать бомбу */
    Detonator,
    /** Способность прохождение сквозь бомбу */
    BombPass,
    /** Способность не получать уран от бомбы */
    FlamePass,
    /** Бессмертие */
    Mystery
}

export enum Spooks {
    Balloom = 'balloom',
    Oneal = 'oneal',
    Doll = 'doll',
    Minyo = 'minyo',
    Kandoria = 'kandoria',
    Oyapi = 'oyapi',
    Pass = 'pass',
    Pontan = 'pontan'
}
