function doIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    function orientation(px: number, py: number, qx: number, qy: number, rx: number, ry: number) {
        const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
        if (val === 0) return 0; // Collinear
        return (val > 0) ? 1 : 2; // Clockwise or counterclockwise
    }

    // Find the four orientations needed for general and special cases
    const o1 = orientation(x1, y1, x2, y2, x3, y3);
    const o2 = orientation(x1, y1, x2, y2, x4, y4);
    const o3 = orientation(x3, y3, x4, y4, x1, y1);
    const o4 = orientation(x3, y3, x4, y4, x2, y2);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 === 0 && onSegment(x1, y1, x2, y2, x3, y3)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 === 0 && onSegment(x1, y1, x2, y2, x4, y4)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 === 0 && onSegment(x3, y3, x4, y4, x1, y1)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 === 0 && onSegment(x3, y3, x4, y4, x2, y2)) return true;

    return false; // Doesn't fall in any of the above cases
}

function onSegment(px: number, py: number, qx: number, qy: number, rx: number, ry: number) {
    return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
           qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
}

export default function crossing_points(inputCoords: number[][][]): number[][] {
    const inputCrosses: number[][] = [];
    for (let i = 0; i < inputCoords.length; i++) inputCrosses[i] = [];

    let endpoints = 2;
    for (let i = 0; i < inputCoords.length; i++) {
        for (let j = 0; j < inputCoords.length; j++) {
            inputCrosses[i][j] = 0;
            if (i === j) continue;
            for (let k = endpoints; k < inputCoords[i].length - endpoints; k++) {
                for (let l = endpoints; l < inputCoords[j].length - endpoints; l++) {
                    const ix1 = inputCoords[i][k][0];
                    const iy1 = inputCoords[i][k][1];
                    const ix2 = inputCoords[i][k + 1][0];
                    const iy2 = inputCoords[i][k + 1][1];
                    const tx3 = inputCoords[j][l][0];
                    const ty3 = inputCoords[j][l][1];
                    const tx4 = inputCoords[j][l + 1][0];
                    const ty4 = inputCoords[j][l + 1][1];
                    if (doIntersect(ix1, iy1, ix2, iy2, tx3, ty3, tx4, ty4)) {
                        var cross = 1;
                        const strokeStart = inputCoords[i][0];
                        const strokeEnd = inputCoords[i][inputCoords[i].length - 1];
                        for (let m = 0; m < inputCoords[j].length; m++) {
                            const startDiff = Math.sqrt((inputCoords[j][m][0] - strokeStart[0]) ** 2 + (inputCoords[j][m][1] - strokeStart[1]) ** 2);
                            const endDiff = Math.sqrt((inputCoords[j][m][0] - strokeEnd[0]) ** 2 + (inputCoords[j][m][1] - strokeEnd[1]) ** 2);
                            if (startDiff <= 20 || endDiff <= 20) {
                                cross = 0;
                            }
                        }
                        inputCrosses[i][j] = cross;
                    }
                }
            }
        }
    }
    //console.log(inputCrosses);
    return inputCrosses;
}