export default function grade_lengths(inputCoords: number[][][], targetCoords: number[][][]): number[] {
    const lengthDiffs: number[] = [];
    for (let i = 0; i < targetCoords.length; i++) {
        lengthDiffs[i] = inputCoords[i].length - targetCoords[i].length;
    }
    return lengthDiffs;
}