export default function intersecting_points(inputCoords: number[][][]): number[][] {
    const inputIntersections: number[][] = [];
    for (let i = 0; i < inputCoords.length; i++) inputIntersections[i] = [];

    for (let i = 0; i < inputCoords.length; i++) {
        const strokeStart = inputCoords[i][0];
        const strokeEnd = inputCoords[i][inputCoords[i].length - 1];
        for (let j = 0; j < inputCoords.length; j++) {
            if (i === j) continue;
            for (let k = 0; k < inputCoords[j].length; k++) {
                const startDiff = Math.sqrt((inputCoords[j][k][0] - strokeStart[0]) ** 2 + (inputCoords[j][k][1] - strokeStart[1]) ** 2);
                const endDiff = Math.sqrt((inputCoords[j][k][0] - strokeEnd[0]) ** 2 + (inputCoords[j][k][1] - strokeEnd[1]) ** 2);
                if (startDiff < 20 || endDiff < 20) {
                    inputIntersections[i].push(j);
                    break;
                }
            }
        }
    }
    return inputIntersections;
}