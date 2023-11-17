import { Spooks } from './enums';

export function getSpookScore(type: Spooks): number {
    switch (type) {
    case Spooks.Balloom:
        return 100;
    case Spooks.Oneal:
        return 200;
    case Spooks.Doll:
        return 400;
    case Spooks.Minvo:
        return 800;
    case Spooks.Kondoria:
        return 1000;
    case Spooks.Ovapi:
        return 2000;
    case Spooks.Pass:
        return 4000;
    case Spooks.Pontan:
        return 8000;
    }
}

export function getSpookSpeed(type: Spooks): number {
    switch (type) {
    case Spooks.Balloom:
    case Spooks.Ovapi:
        // медленно
        return 40;
    case Spooks.Oneal:
    case Spooks.Doll:
        // Средне
        return 50;
    case Spooks.Minvo:
    case Spooks.Pass:
    case Spooks.Pontan:
        // Быстро
        return 60;
    case Spooks.Kondoria:
        // Оч. медленно
        return 30;
    }
}

export function getSpookWallPass(type: Spooks): boolean {
    switch (type) {
    case Spooks.Kondoria:
    case Spooks.Ovapi:
    case Spooks.Pontan:
        return true;
    default:
        return false;
    }
}

export function getSpookLeftAnimation(type: Spooks): number[] {
    switch (type) {
    case Spooks.Balloom:
        return [3, 4, 5];
    case Spooks.Oneal:
        return [0, 1, 2, 1];
    case Spooks.Doll:
        return [3, 4, 5, 4];
    case Spooks.Minvo:
        return [0, 1, 2, 3];
    case Spooks.Kondoria:
        return [3, 4, 5, 4];
    case Spooks.Ovapi:
        return [3, 4, 5, 4];
    case Spooks.Pass:
        return [3, 4, 5, 4];
    case Spooks.Pontan:
        return [0, 1, 2, 3];
    }
}

export function getSpookRightAnimation(type: Spooks): number[] {
    switch (type) {
    case Spooks.Balloom:
        return [0, 1, 2];
    case Spooks.Oneal:
        return [3, 4, 5, 4];
    case Spooks.Doll:
        return [0, 1, 2, 1];
    case Spooks.Minvo:
        return [0, 1, 4, 3];
    case Spooks.Kondoria:
        return [0, 1, 2, 1];
    case Spooks.Ovapi:
        return [0, 1, 2, 1];
    case Spooks.Pass:
        return [0, 1, 2, 1];
    case Spooks.Pontan:
        return [0, 1, 4, 3];
    }
}

export function getSpookDieAnimation(type: Spooks): number[] {
    switch (type) {
    case Spooks.Balloom:
        return [7, 8, 9, 10];
    case Spooks.Oneal:
        return [6, 7, 8, 9, 10];
    case Spooks.Doll:
        return [6, 7, 8, 9, 10];
    case Spooks.Minvo:
        return [5, 6, 7, 8];
    case Spooks.Kondoria:
        return [6, 7, 8, 9, 10];
    case Spooks.Ovapi:
        return [6, 7, 8, 9, 10];
    case Spooks.Pass:
        return [6, 7, 8, 9, 10];
    case Spooks.Pontan:
        return [5, 6, 7, 8];
    }
}

export function getSpooksByLevel(level: number): Spooks[] {
    const index = (level - 1) % levelSpookList.length;
    return levelSpookList[index];
}

const { Balloom, Oneal, Doll, Minvo, Kondoria, Ovapi, Pass, Pontan } = Spooks;

const levelSpookList: Spooks[][] = [
    // 1-5
    [Balloom, Balloom, Balloom, Balloom, Balloom, Balloom],
    [Balloom, Balloom, Balloom, Oneal, Oneal, Oneal],
    [Balloom, Balloom, Oneal, Oneal, Doll, Doll],
    [Balloom, Oneal, Doll, Doll, Minvo, Minvo],
    [Oneal, Oneal, Oneal, Oneal, Doll, Doll, Doll],
    // 6-10
    [Oneal, Oneal, Doll, Doll, Doll, Minvo, Minvo],
    [Oneal, Oneal, Doll, Doll, Doll, Kondoria, Kondoria],
    [Oneal, Doll, Doll, Minvo, Minvo, Minvo, Minvo],
    [Oneal, Doll, Minvo, Minvo, Minvo, Minvo, Kondoria],
    [Oneal, Doll, Minvo, Kondoria, Kondoria, Kondoria, Ovapi],
    // 11-15
    [Oneal, Doll, Doll, Minvo, Minvo, Minvo, Kondoria, Ovapi],
    [Oneal, Doll, Minvo, Kondoria, Kondoria, Kondoria, Kondoria, Ovapi],
    [Doll, Doll, Doll, Minvo, Minvo, Minvo, Kondoria, Kondoria, Kondoria],
    [Ovapi, Ovapi, Ovapi, Ovapi, Ovapi, Ovapi, Ovapi, Pass],
    [Doll, Minvo, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Pass],
    // 16-20
    [Minvo, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Kondoria, Pass],
    [Doll, Doll, Doll, Doll, Doll, Kondoria, Kondoria, Pass],
    [Balloom, Balloom, Balloom, Oneal, Oneal, Oneal, Pass, Pass],
    [Balloom, Oneal, Doll, Doll, Doll, Ovapi, Pass, Pass],
    [Oneal, Doll, Minvo, Kondoria, Kondoria, Ovapi, Pass, Pass],
    // 21-25
    [Kondoria, Kondoria, Kondoria, Kondoria, Ovapi, Ovapi, Ovapi, Pass, Pass],
    [Doll, Doll, Doll, Doll, Minvo, Minvo, Minvo, Kondoria, Pass],
    [Doll, Doll, Minvo, Minvo, Kondoria, Kondoria, Ovapi, Ovapi, Pass],
    [Doll, Minvo, Kondoria, Kondoria, Kondoria, Kondoria, Ovapi, Ovapi, Pass],
    [Oneal, Oneal, Doll, Minvo, Kondoria, Kondoria, Ovapi, Ovapi, Pass],
    // 26-30
    [Balloom, Oneal, Doll, Minvo, Kondoria, Kondoria, Ovapi, Pass],
    [Balloom, Oneal, Kondoria, Kondoria, Kondoria, Kondoria, Kondoria, Ovapi, Pass],
    [Oneal, Doll, Doll, Doll, Minvo, Minvo, Minvo, Kondoria, Pass],
    [Kondoria, Kondoria, Ovapi, Ovapi, Ovapi, Ovapi, Ovapi, Pass, Pass],
    [Doll, Doll, Doll, Minvo, Minvo, Kondoria, Ovapi, Ovapi, Pass],
    // 31-35
    [Oneal, Oneal, Doll, Doll, Minvo, Minvo, Kondoria, Kondoria, Ovapi, Ovapi],
    [Oneal, Doll, Minvo, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Kondoria, Pass],
    [Doll, Doll, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Ovapi, Pass, Pass],
    [Doll, Doll, Minvo, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Pass, Pass],
    [Doll, Doll, Minvo, Kondoria, Kondoria, Kondoria, Ovapi, Pass, Pass],
    // 36-40
    [Doll, Doll, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Pass, Pass, Pass],
    [Doll, Doll, Minvo, Kondoria, Kondoria, Kondoria, Ovapi, Pass, Pass, Pass],
    [Doll, Doll, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Pass, Pass, Pass],
    [Doll, Minvo, Kondoria, Kondoria, Ovapi, Ovapi, Pass, Pass, Pass, Pass],
    [Doll, Minvo, Minvo, Kondoria, Kondoria, Kondoria, Pass, Pass, Pass, Pass],
    // 41-45
    [Doll, Minvo, Kondoria, Kondoria, Kondoria, Ovapi, Pass, Pass, Pass, Pass],
    [Minvo, Kondoria, Kondoria, Kondoria, Ovapi, Pass, Pass, Pass, Pass, Pass],
    [Minvo, Kondoria, Kondoria, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass],
    [Minvo, Kondoria, Kondoria, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass],
    [Kondoria, Kondoria, Ovapi, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass],
    // 46-50
    [Kondoria, Kondoria, Ovapi, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass],
    [Kondoria, Kondoria, Ovapi, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass],
    [Kondoria, Kondoria, Ovapi, Pass, Pass, Pass, Pass, Pass, Pass, Pontan],
    [Kondoria, Ovapi, Ovapi,, Pass, Pass, Pass, Pass, Pass, Pass, Pontan],
    [Kondoria, Ovapi, Ovapi,, Pass, Pass, Pass, Pass, Pass, Pontan, Pontan]
];
