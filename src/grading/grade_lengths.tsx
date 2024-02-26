export default function grade_lengths(inputCoords: number[][][], targetCoords: number[][][]): number[] {
    if (inputCoords.length !== targetCoords.length) {
        console.log("Input and target have different number of strokes");
        return [];
    }
    const lengthDiffs: number[] = [];
    for (let i = 0; i < targetCoords.length; i++) {
        lengthDiffs[i] = inputCoords[i].length - targetCoords[i].length;
    }
    return lengthDiffs;
}