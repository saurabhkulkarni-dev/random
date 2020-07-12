/*
robot is at the upper left corner of the rows X cols grid.
it needs to get to the bottom right corner of this grid. it can only go down or right.
there are certain points that are no go. Marked as 0. points that are 1 are ok.
find a path that can make robot go from start to end
*/
const CONNECTOR = '&';


const getPath = (matrix, rows, cols) => {
    let path = [];
    let pointStatus = {};

    return getPathTo(matrix, rows, cols, path, pointStatus);
}

const getPathTo = (matrix, row, col, path, pointStatus) => {
    if(row < 0 || col < 0 || !matrix[row][co]) {
        return false;
    }

    let point = row.toString() + CONNECTOR + col.toString();
    if(pointStatus[point]){
        return pointStatus[point];
    }

    let success = false;
    let isOrigin = row === 0 && col === 0;

    if(isOrigin || getPathTo(matrix, row - 1, col, path, pointStatus) || getPathTo(matrix, row, col - 1, path, pointStatus)) {
        success = true;
        path.push(point);
    }

    pointStatus[point] = success;
    return success;
};