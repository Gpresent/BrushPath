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
            if (inputIntersections[i].includes(j) && !targetIntersections[i].includes(j)) {
                extraIntersections[i].push(j);
            }
            if (!inputIntersections[i].includes(j) && targetIntersections[i].includes(j)) {
                missingIntersections[i].push(j);
            }
        }
    }
    return [extraIntersections, missingIntersections];
}