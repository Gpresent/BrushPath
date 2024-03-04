import crossing_points from './crossing_points'

export default function grade_crosses(inputCoords: number[][][], targetCoords: number[][][]): [number[][], number[][]] {
    const inputIntersections = crossing_points(inputCoords);
    const targetIntersections = crossing_points(targetCoords);
    const extraCrosses: number[][] = [];
    const missingCrosses: number[][] = [];
    for (let i = 0; i < targetIntersections.length; i++) {
        extraCrosses[i] = [];
        missingCrosses[i] = [];
        for (let j = 0; j < targetIntersections.length; j++) {
            if (inputIntersections[i][j] && !targetIntersections[i][j]) {
                extraCrosses[i].push(j);
            }
            if (!inputIntersections[i][j] && targetIntersections[i][j]) {
                missingCrosses[i].push(j);
            }
        }
    }
    return [extraCrosses, missingCrosses];
}