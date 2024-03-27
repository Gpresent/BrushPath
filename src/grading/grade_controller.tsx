import grade_svg from './grade_svg';
import interpolate from './interpolate';
import color_input from './color_input';

class interp_data {
    coords! : [];
    totalLengths!: number;
}

function generateCombinations<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];

    function generate(current: T[], start: number, sizeLeft: number) {
        if (sizeLeft === 0) {
            result.push(current.slice(0));
            return;
        }

        for (let i = start; i <= arr.length - sizeLeft; i++) {
            current.push(arr[i]);
            generate(current, i + 1, sizeLeft - 1);
            current.pop();
        }
    }

    generate([], 0, size);
    return result;
}

function extraStrokes(input: string, iCoords: number[][][], tCoords: number[][][], passing: number = 0.6) {
    const n = iCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, tCoords.length);

    console.log("Too many strokes!");
    if (iCoords.length > Math.floor(tCoords.length * 1.25)) {
        console.log("Too many extra strokes, review model");
        color_input([]);
        return;
    }
    const lengthdiff = iCoords.length - tCoords.length;
    var iCoordsCorrected = iCoords.slice(0, iCoords.length - lengthdiff);
    var [grades, strokeInfo, feedback] = grade_svg(JSON.parse(JSON.stringify(iCoordsCorrected)), tCoords, passing);
    var avgGrade = 0
    var bestCombo = 0;
    const combos = generateCombinations(iCoords, tCoords.length);
    console.log("generated", combos.length, "combinations")
    for (let i = 0; i < combos.length; i++) {
        const [newGrades, newStrokeInfo, newFeedback] = grade_svg(JSON.parse(JSON.stringify(combos[i])), tCoords, passing);
        const newAvgGrade = newGrades.reduce((a, b) => a + b, 0) / newGrades.length;
        console.log("combo", i, ": average grade:", newAvgGrade)
        if (newAvgGrade > avgGrade) {
            iCoordsCorrected = combos[i];
            avgGrade = newAvgGrade;
            grades = newGrades;
            strokeInfo = newStrokeInfo;
            feedback = newFeedback;
            bestCombo = i;
        }
    }
    const gradeColors = [];
    var j = 0;
    for (var i = 1; i < iCoords.length + 1; i++) {
        if (comboNumbers[bestCombo].includes(i)) {
            gradeColors.push(grades[j]);
            j++;
        } else {
            gradeColors.push(0);
        }
    }
    color_input(gradeColors);
    console.log(strokeInfo);
    console.log(feedback);
}

function missingStrokes(input: string, iCoords: number[][][], tCoords: number[][][], passing: number = 0.6) {
    const n = tCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, iCoords.length);

    console.log("Too few strokes!");
    if (iCoords.length < Math.ceil(tCoords.length * 0.75)) {
        console.log("Too many extra strokes, review model");
        color_input([]);
        return;
    }
    const lengthdiff = tCoords.length - iCoords.length;
    var tCoordsCorrected = tCoords.slice(0, tCoords.length - lengthdiff);
    var [grades, strokeInfo, feedback] = grade_svg(iCoords, JSON.parse(JSON.stringify(tCoordsCorrected)), passing);
    var avgGrade = 0;
    var bestCombo = 0;
    const combos = generateCombinations(tCoords, iCoords.length);
    console.log("generated", combos.length, "combinations");
    for (let i = 0; i < combos.length; i++) {
        const [newGrades, newStrokeInfo, newFeedback] = grade_svg(iCoords, JSON.parse(JSON.stringify(combos[i])), passing);
        const newAvgGrade = newGrades.reduce((a, b) => a + b, 0) / newGrades.length;
        console.log("combo", i, ": average grade:", newAvgGrade)
        console.log("Combo Numbers", comboNumbers[i]);
        if (newAvgGrade > avgGrade) {
            tCoordsCorrected = combos[i];
            avgGrade = newAvgGrade;
            grades = newGrades;
            strokeInfo = newStrokeInfo;
            feedback = newFeedback;
            bestCombo = i;
        }
    }
    const gradeColors = [];
    var j = 0;
    for (var i = 1; i < tCoords.length + 1; i++) {
        if (comboNumbers[bestCombo].includes(i)) {
            gradeColors.push(grades[j]);
            j++;
        } 
    }
    console.log("Best Combo numbers", comboNumbers[bestCombo]);
    console.log("Grades", grades);
    console.log("Grade colors", gradeColors);
    color_input(gradeColors);
    console.log(strokeInfo);
    console.log(feedback);
}

export default function grade(input: string, targetKanji: string) {
    const passing = 0.6;
    console.log("grading");
    fetch("/interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json").then(response => response.json())
    .then(data => {
        var targetInfo = data as unknown as interp_data;
        const tCoords = targetInfo.coords;
        const iCoords = interpolate((' ' + input).slice(1), targetInfo.totalLengths);
        console.log(iCoords.length);
        console.log(tCoords.length);
        if (!iCoords.length) return;
        
        if (iCoords.length > tCoords.length) {
            extraStrokes(input, iCoords, tCoords, passing);
            return;
        } else if (iCoords.length < tCoords.length) {
            missingStrokes(input, iCoords, tCoords, passing);
            return;
        } 

        const [grades, strokeInfo, feedback] = grade_svg(iCoords, tCoords, passing);
        color_input(grades);
        console.log(strokeInfo);
        console.log(feedback);
    });
}