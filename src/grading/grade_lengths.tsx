export default function grade_lengths(inputCoords: number[][][], targetCoords: number[][][]): number[] {
    const lengthDiffs: number[] = [];
    const inputLength = inputCoords.reduce((acc, stroke) => acc + stroke.length, 0);
    const targetLength = targetCoords.reduce((acc, stroke) => acc + stroke.length, 0);
    for (let i = 0; i < targetCoords.length; i++) {
        lengthDiffs[i] = (inputCoords[i].length / inputLength) / (targetCoords[i].length / targetLength);
    }
    return lengthDiffs;
}