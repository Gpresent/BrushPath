import path_angles from './path_angles';

export default function grade_angles(inputCoords: number[][][], targetCoords: number[][][]): [number[][], number[]] {
    const [inputAngles, targetAngles] = path_angles(inputCoords, targetCoords);
    const angleDiffs: number[][] = [];
    for (let i = 0; i < targetAngles.length; i++) {
        angleDiffs[i] = [];
    }
    const meanDiffs: number[] = [];
    if (inputAngles.length !== targetAngles.length) {
        console.log("Input and target have different number of strokes");
        for (let i = 0; i < inputAngles.length; i++) {
            angleDiffs[i] = [];
        }
        for (let i = 0; i < inputAngles.length; i++) {
            meanDiffs[i] = 180;
        }
        return [angleDiffs, meanDiffs];
    }
    for (let i = 0; i < targetAngles.length; i++) {
        for (let j = 0; j < targetAngles[i].length; j++) {
            const progress = (1 + 2 * j) / (2 * targetAngles[i].length);
            const left = Math.floor(inputAngles[i].length * progress);
            var right = Math.ceil(inputAngles[i].length * progress);
            if (right === inputAngles[i].length) {
                right = left;
            }
            var leftAngle = inputAngles[i][left];
            var rightAngle = inputAngles[i][right];
            const leftWeight = 1 - (inputAngles[i].length * progress) % 1;
            const rightWeight = 1 - leftWeight;
            if ((leftAngle < 0) !== (rightAngle < 0) && Math.abs(leftAngle) + Math.abs(rightAngle) > 180) {
                rightAngle < 0 ? 
                    rightAngle += 360 : 
                    leftAngle += 360;
                if (targetAngles[i][j] < 0) {
                    targetAngles[i][j] += 360;
                }
            }

            angleDiffs[i][j] = Math.abs(leftAngle * leftWeight + rightAngle * rightWeight - targetAngles[i][j]);
            if (angleDiffs[i][j] > 180) {
                angleDiffs[i][j] = 360 - angleDiffs[i][j];
            }
        }
        meanDiffs[i] = angleDiffs[i].reduce((a, b) => a + b, 0) / angleDiffs[i].length;
    }
    return [angleDiffs, meanDiffs]
}