import { IPosition } from './interfaces';

export function * mainWallIndexGenerator(width: number, height: number): Generator<IPosition> {

    const isMainWall = (i, j) => {
        return i === 0 || j === 0 || i === width - 1 || j === height - 1;
    };

    const isGridWall = (i, j) => {
        return i % 2 === 0 && j % 2 === 0;
    };

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (isMainWall(i, j) || isGridWall(i, j)) {
                yield {x: i, y: j };
            }
        }
    }
}

export function * getRandomFreePosition(width: number, height: number): Generator<IPosition> {
    const map = new Map();
    const getKey = (x: number, y: number): string => `${x}-${y}`;

    // Ячейки по стены, они уже заняты
    const it = mainWallIndexGenerator(width, height);
    let result = it.next();
    while (!result.done) {
        map.set(getKey(result.value.x, result.value.y), true);
        result = it.next();
    }

    const random = (max: number): number => Math.floor(Math.random() * max);

    // Ячейки под игрока
    map.set(getKey(1,1), true);
    map.set(getKey(1,2), true);
    map.set(getKey(2,1), true);

    const getPosition = (): IPosition => {
        let x, y;
        let maxTryCount = width * height;
        do {
            x = random(width);
            y = random(height);
            if (maxTryCount-- < 0) {
                throw new Error('нет свободных ячеек');
            }
        } while (map.get(getKey(x, y)));

        map.set(getKey(x, y), true);
        return { x, y };
    };

    while (true) {
        yield getPosition();
    }
}

