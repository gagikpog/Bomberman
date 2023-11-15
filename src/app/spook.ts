import { Spooks } from './enums';

export function getSpookScore(type: Spooks): number {
    switch (type) {
    case Spooks.Balloom:
        return 100;
    case Spooks.Oneal:
        return 200;
    case Spooks.Doll:
        return 400;
    case Spooks.Minyo:
        return 800;
    case Spooks.Kandoria:
        return 1000;
    case Spooks.Oyapi:
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
    case Spooks.Oyapi:
        // медленно
        return 40;
    case Spooks.Oneal:
    case Spooks.Doll:
        // Средне
        return 50;
    case Spooks.Minyo:
    case Spooks.Pass:
    case Spooks.Pontan:
        // Быстро
        return 60;
    case Spooks.Kandoria:
        // Оч. быстро
        return 70;
    }
}

export function getSpookWallPass(type: Spooks): boolean {
    switch (type) {
    case Spooks.Kandoria:
    case Spooks.Oyapi:
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
        return [0, 1, 2];
    case Spooks.Doll:
        return [];
    case Spooks.Minyo:
        return [];
    case Spooks.Kandoria:
        return [];
    case Spooks.Oyapi:
        return [];
    case Spooks.Pass:
        return [];
    case Spooks.Pontan:
        return [];
    }
}

export function getSpookRightAnimation(type: Spooks): number[] {
    switch (type) {
    case Spooks.Balloom:
        return [0, 1, 2];
    case Spooks.Oneal:
        return [3, 4, 5];
    case Spooks.Doll:
        return [];
    case Spooks.Minyo:
        return [];
    case Spooks.Kandoria:
        return [];
    case Spooks.Oyapi:
        return [];
    case Spooks.Pass:
        return [];
    case Spooks.Pontan:
        return [];
    }
}

export function getSpookDieAnimation(type: Spooks): number[] {
    switch (type) {
    case Spooks.Balloom:
        return [7, 8, 9, 10];
    case Spooks.Oneal:
        return [6];
    case Spooks.Doll:
        return [];
    case Spooks.Minyo:
        return [];
    case Spooks.Kandoria:
        return [];
    case Spooks.Oyapi:
        return [];
    case Spooks.Pass:
        return [];
    case Spooks.Pontan:
        return [];
    }
}

