import intersecting_points from './intersecting_points';

export default function grade_intersections(inputCoords: number[][][], targetCoords: number[][][]): [number[][], number[][]] {
    const inputIntersections = intersecting_points(inputCoords);
    const targetIntersections = intersecting_points(targetCoords);
    const extraIntersections: number[][] = [];
    const missingIntersections: number[][] = [];
    for (let i = 0; i < targetIntersections.length; i++) {
        extraIntersections[i] = [];
        missingIntersections[i] = [];
        for (let j = 0; j < targetIntersections.length; j++) {
            if (inputIntersections[i][j][0] && !targetIntersections[i][j][0]) {
                if (Math.abs(inputIntersections[i][j][1] - targetIntersections[i][j][1]) > 30)
                    extraIntersections[i].push(j);
                else extraIntersections[i].push(j * -1);
            }
            if (!inputIntersections[i][j][0] && targetIntersections[i][j][0]) {
                if (Math.abs(inputIntersections[i][j][1] - targetIntersections[i][j][1]) > 30)
                    missingIntersections[i].push(j);
                else missingIntersections[i].push(j * -1);
            }

        }
    }
    return [extraIntersections, missingIntersections];
}