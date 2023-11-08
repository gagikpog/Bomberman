export function initWalls(walls) {
    const width = 31;
    const height = 13;
    const blockSize = 16;
    const offsetTop = 32;

    const isMainWall = (i, j) => i === 0 || j === 0 || i === width - 1 || j === height - 1;
    const isGridWall = (i, j) => i % 2 === 0 && j % 2 === 0;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (isMainWall(i, j) || isGridWall(i, j)) {
                walls.create(blockSize*i, offsetTop + j*blockSize, 'block1').body.immovable = true;
            }
        }
    }
}
