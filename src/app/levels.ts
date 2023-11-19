import { PowerUpType, Spooks } from './enums';
import { IStageConfig } from './interfaces';
const { Balloom, Oneal, Doll, Minvo, Kondoria, Ovapi, Pass, Pontan } = Spooks;

export function getStageData(level: number): IStageConfig {
    const index = level % stageList.length;
    return stageList[index];
}

const stageList: IStageConfig[] = [
    {
        id: '1',
        name: 'Stage 1',
        spooks: { [Balloom]: 6 },
        powerUp: PowerUpType.Flames,
        isBonusStage: false
    },
    {
        id: '2',
        name: 'Stage 2',
        spooks: { [Balloom]: 3, [Oneal]: 3 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '3',
        name: 'Stage 3',
        spooks: { [Balloom]: 2, [Oneal]: 2, [Doll]: 2 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '4',
        name: 'Stage 4',
        spooks: { [Balloom]: 1, [Oneal]: 1, [Doll]: 2, [Minvo]: 2 },
        powerUp: PowerUpType.Speed,
        isBonusStage: false
    },
    {
        id: '5',
        name: 'Stage 5',
        spooks: { [Oneal]: 4, [Doll]: 3 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: 'A',
        name: 'Bonus stage',
        spooks: { [Balloom]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '6',
        name: 'Stage 6',
        spooks: { [Oneal]: 2, [Doll]: 3, [Minvo]: 2 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '7',
        name: 'Stage 7',
        spooks: { [Oneal]: 2, [Doll]: 3, [Kondoria]: 2 },
        powerUp: PowerUpType.Flames,
        isBonusStage: false
    },  {
        id: '8',
        name: 'Stage 8',
        spooks: { [Oneal]: 1, [Doll]: 2, [Minvo]: 4 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '9',
        name: 'Stage 9',
        spooks: { [Oneal]: 1, [Doll]: 1, [Minvo]: 4, [Kondoria]: 1 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '10',
        name: 'Stage 10',
        spooks: { [Oneal]: 1, [Doll]: 1, [Minvo]: 1, [Kondoria]: 3, [Ovapi]: 1 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: 'B',
        name: 'Bonus stage',
        spooks: { [Oneal]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '11',
        name: 'Stage 11',
        spooks: { [Oneal]: 1, [Doll]: 2, [Minvo]: 3, [Kondoria]: 1, [Ovapi]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '12',
        name: 'Stage 12',
        spooks: { [Oneal]: 1, [Doll]: 1, [Minvo]: 1, [Kondoria]: 4, [Ovapi]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '13',
        name: 'Stage 13',
        spooks: { [Doll]: 3, [Minvo]: 3, [Kondoria]: 3 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '14',
        name: 'Stage 14',
        spooks: { [Ovapi]: 7, [Pass]: 1 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '15',
        name: 'Stage 15',
        spooks: { [Doll]: 1, [Minvo]: 3, [Kondoria]: 3, [Pass]: 1 },
        powerUp: PowerUpType.Flames,
        isBonusStage: false
    },
    {
        id: 'C',
        name: 'Bonus stage',
        spooks: { [Doll]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '16',
        name: 'Stage 16',
        spooks: { [Minvo]: 3, [Kondoria]: 4, [Pass]: 1 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: '17',
        name: 'Stage 17',
        spooks: { [Doll]: 5, [Kondoria]: 2, [Pass]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '18',
        name: 'Stage 18',
        spooks: { [Balloom]: 3, [Oneal]: 3, [Pass]: 2 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '19',
        name: 'Stage 19',
        spooks: { [Balloom]: 1, [Oneal]: 1, [Doll]: 3, [Ovapi]: 1, [Pass]: 2 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '20',
        name: 'Stage 20',
        spooks: { [Oneal]: 1, [Doll]: 1, [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 1, [Pass]: 2 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: 'D',
        name: 'Bonus stage',
        spooks: { [Minvo]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '21',
        name: 'Stage 21',
        spooks: { [Kondoria]: 4, [Ovapi]: 3, [Pass]: 2 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '22',
        name: 'Stage 22',
        spooks: { [Doll]: 4, [Minvo]: 3, [Kondoria]: 1, [Pass]: 1 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '23',
        name: 'Stage 23',
        spooks: { [Doll]: 2, [Minvo]: 2, [Kondoria]: 2, [Ovapi]: 2, [Pass]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '24',
        name: 'Stage 24',
        spooks: { [Doll]: 1, [Minvo]: 1, [Kondoria]: 4, [Ovapi]: 2, [Pass]: 1 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '25',
        name: 'Stage 25',
        spooks: { [Oneal]: 2, [Doll]: 1, [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 2, [Pass]: 1 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: 'E',
        name: 'Bonus stage',
        spooks: { [Ovapi]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '26',
        name: 'Stage 26',
        spooks: { [Balloom]: 1, [Oneal]: 1, [Doll]: 1, [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 1, [Pass]: 1 },
        powerUp: PowerUpType.Mystery,
        isBonusStage: false
    },
    {
        id: '27',
        name: 'Stage 27',
        spooks: { [Balloom]: 1, [Oneal]: 1, [Kondoria]: 5, [Ovapi]: 1, [Pass]: 1 },
        powerUp: PowerUpType.Flames,
        isBonusStage: false
    },  {
        id: '28',
        name: 'Stage 28',
        spooks: { [Oneal]: 1, [Doll]: 3, [Minvo]: 3, [Kondoria]: 1, [Pass]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '29',
        name: 'Stage 29',
        spooks: { [Kondoria]: 2, [Ovapi]: 5, [Pass]: 2 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '30',
        name: 'Stage 30',
        spooks: { [Doll]: 3, [Minvo]: 2, [Kondoria]: 1, [Ovapi]: 2, [Pass]: 1 },
        powerUp: PowerUpType.FlamePass,
        isBonusStage: false
    },
    {
        id: 'F',
        name: 'Bonus stage',
        spooks: { [Kondoria]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '31',
        name: 'Stage 31',
        spooks: { [Oneal]: 2, [Doll]: 2, [Minvo]: 2, [Kondoria]: 2, [Ovapi]: 2 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: '32',
        name: 'Stage 32',
        spooks: { [Oneal]: 1, [Doll]: 1, [Minvo]: 3, [Kondoria]: 4, [Pass]: 1 },
        powerUp: PowerUpType.Bombs,
        isBonusStage: false
    },
    {
        id: '33',
        name: 'Stage 33',
        spooks: { [Doll]: 2, [Minvo]: 2, [Kondoria]: 3, [Ovapi]: 1, [Pass]: 2 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '34',
        name: 'Stage 34',
        spooks: { [Doll]: 2, [Minvo]: 3, [Kondoria]: 3, [Pass]: 2 },
        powerUp: PowerUpType.Mystery,
        isBonusStage: false
    },
    {
        id: '35',
        name: 'Stage 35',
        spooks: { [Doll]: 2, [Minvo]: 1, [Kondoria]: 3, [Ovapi]: 1, [Pass]: 2 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: 'G',
        name: 'Bonus stage',
        spooks: { [Pass]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '36',
        name: 'Stage 36',
        spooks: { [Doll]: 2, [Minvo]: 2, [Kondoria]: 3, [Pass]: 3 },
        powerUp: PowerUpType.FlamePass,
        isBonusStage: false
    },
    {
        id: '37',
        name: 'Stage 37',
        spooks: { [Doll]: 2, [Minvo]: 1, [Kondoria]: 3, [Ovapi]: 1, [Pass]: 3 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '38',
        name: 'Stage 38',
        spooks: { [Doll]: 2, [Minvo]: 2, [Kondoria]: 3, [Pass]: 3 },
        powerUp: PowerUpType.Flames,
        isBonusStage: false
    },  {
        id: '39',
        name: 'Stage 39',
        spooks: { [Doll]: 1, [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 2, [Pass]: 4 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: 'H',
        name: 'Bonus stage',
        spooks: { [Pontan]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '40',
        name: 'Stage 40',
        spooks: { [Doll]: 1, [Minvo]: 2, [Kondoria]: 3, [Pass]: 4 },
        powerUp: PowerUpType.Mystery,
        isBonusStage: false
    },
    {
        id: '41',
        name: 'Stage 41',
        spooks: { [Doll]: 1, [Minvo]: 1, [Kondoria]: 3, [Ovapi]: 1, [Pass]: 4 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '42',
        name: 'Stage 42',
        spooks: { [Minvo]: 1, [Kondoria]: 3, [Ovapi]: 1, [Pass]: 5 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: '43',
        name: 'Stage 43',
        spooks: { [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 1, [Pass]: 6 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '44',
        name: 'Stage 44',
        spooks: { [Minvo]: 1, [Kondoria]: 2, [Ovapi]: 1, [Pass]: 6 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: 'I',
        name: 'Bonus stage',
        spooks: { [Pontan]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '45',
        name: 'Stage 45',
        spooks: { [Kondoria]: 2, [Ovapi]: 2, [Pass]: 6 },
        powerUp: PowerUpType.Mystery,
        isBonusStage: false
    },
    {
        id: '46',
        name: 'Stage 46',
        spooks: { [Kondoria]: 2, [Ovapi]: 2, [Pass]: 6 },
        powerUp: PowerUpType.WallPass,
        isBonusStage: false
    },
    {
        id: '47',
        name: 'Stage 47',
        spooks: { [Kondoria]: 2, [Ovapi]: 2, [Pass]: 6 },
        powerUp: PowerUpType.BombPass,
        isBonusStage: false
    },
    {
        id: '48',
        name: 'Stage 48',
        spooks: { [Kondoria]: 2, [Ovapi]: 1, [Pass]: 6, [Pontan]: 1 },
        powerUp: PowerUpType.Detonator,
        isBonusStage: false
    },
    {
        id: '49',
        name: 'Stage 49',
        spooks: { [Kondoria]: 1, [Ovapi]: 2, [Pass]: 6, [Pontan]: 1 },
        powerUp: PowerUpType.FlamePass,
        isBonusStage: false
    },
    {
        id: 'J',
        name: 'Bonus stage',
        spooks: { [Pontan]: Infinity },
        powerUp: null,
        isBonusStage: true
    },
    {
        id: '50',
        name: 'Stage 50',
        spooks: { [Kondoria]: 1, [Ovapi]: 2, [Pass]: 5, [Pontan]: 2 },
        powerUp: PowerUpType.Mystery,
        isBonusStage: false
    }
];
