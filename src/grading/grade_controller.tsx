import grade_svg from './grade_svg';
import interpolate from './interpolate';
import color_input from './color_input';
import { Heap } from 'heap-js';
import KanjiGrade from '../types/KanjiGrade';

class interp_data {
    coords! : [];
    totalLengths!: number;
}

const passing = 0.65;

var kanji_grade: KanjiGrade = {
    overallGrade: 0,
    overallFeedback: "",
    grades: [],
    feedback: [],
    strokeInfo: []
}

function order_feedback(order: number[]) {
    const default_order = Array.from({ length: order.length }, (_, index) => index + 1);
    if (order.toString() === default_order.toString()) {
        return;
    }
    var feedback = "Feedback on stroke order:\n";
    for (let i = 0; i < order.length; i++) {
        if (order[i] !== i + 1) {
            if (order[order[i] - 1] === i + 1) {
                if (order[i] < order[order[i] - 1]) {
                    feedback += "\tStrokes " + order[i] + " and " + default_order[i] + " should be swapped.\n";
                    kanji_grade.overallGrade -= 2 * (100 - passing * 100);
                }
            } else {
                feedback += "\tStroke " + order[i] + " should be stroke " + default_order[i] + ".\n";
                kanji_grade.overallGrade -= (100 - passing * 100);
            }
        }
    }
    kanji_grade.overallFeedback += feedback;
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

function generateOrderArray<T>(array: T[][], order: number[]): T[][] {
    const result: T[][] = [];
    for (const index of order) {
        result.push(array[index - 1]); // Subtract 1 because indices are 0-based
    }
    return result;
}

function alternateStrokeOrder(
    iCoords: number[][][],
    tCoords: number[][][],
    passing: number = 0.6,
    maxIters: number = 40
  ): [number[], string[], string[], string, number, number[]] {
    function calculateAverageGrade(order: number[]): [number, number] {
        const [grades] = grade_svg(generateOrderArray(JSON.parse(JSON.stringify(iCoords)), order), tCoords, passing);
        return [grades.reduce((a, b) => a + b, 0) / grades.length, grades.filter(grade => grade < passing).length];
    }

    // BFS function to find the best stroke order
    function bfs(order: number[]): [number[], number] {
        const visited = new Set<string>();
        const queue = new Heap<[number[], number]>((a, b) => a[1] - b[1]);
        queue.push([order, calculateAverageGrade(order)[1]]);
        let failingnum = calculateAverageGrade(order)[1];
        let bestOrder = order.slice();
        let iters = 0;
        while (queue.size() > 0) {
            if (iters > maxIters) {
                return [bestOrder, failingnum];
            }
            const [currentOrder, currentFailing] = queue.pop() as [number[], number];
            iters++;
            if (currentFailing === 0) {
                return [currentOrder, 0];
            }
            if (currentFailing < failingnum) {
                failingnum = currentFailing;
                bestOrder = currentOrder.slice();
            } else if (currentFailing > failingnum) {
                continue;
            }
            for (let i = 0; i < currentOrder.length; i++) {
                for (let j = i + 1; j < currentOrder.length; j++) {
                    const newOrder = currentOrder.slice();
                    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
                    const key = newOrder.toString();
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push([newOrder, calculateAverageGrade(newOrder)[1]]);
                    }
                }
            }
        }
        
        return [bestOrder, failingnum];
    }
      
  
    // Initialize variables
    let bestCombo = Array.from({ length: iCoords.length }, (_, index) => index + 1);
    let [grades] = grade_svg(iCoords, tCoords, passing);
    let failing = grades.filter(grade => grade < passing).length;
  
    // Perform BFS
    [bestCombo, failing] = bfs(bestCombo.slice());


    let res = grade_svg(generateOrderArray(iCoords, bestCombo), tCoords, passing);
    let retVal = [res[0], res[1], res[2], res[3], failing, bestCombo] as [number[], string[], string[], string, number, number[]];

    return retVal;
}
  

function extraStrokes(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[], string, number] {
    const n = iCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, tCoords.length);

    if (iCoords.length > Math.floor(tCoords.length * 1.25)) {
        kanji_grade.overallFeedback += "You entered too many strokes for this character.\n";
        color_input([]);
        return[[],[],[], "", 0];
    }
    const lengthdiff = iCoords.length - tCoords.length;
    var iCoordsCorrected = iCoords.slice(0, iCoords.length - lengthdiff);
    var [grades, strokeInfo, feedback, aspectString, failing, sOrder] = alternateStrokeOrder(JSON.parse(JSON.stringify(iCoordsCorrected)), tCoords, passing);
    var avgGrade = 0
    var bestCombo = 0;
    const combos = generateCombinations(iCoords, tCoords.length);
    for (let i = 0; i < combos.length; i++) {
        const [newGrades, newStrokeInfo, newFeedback, newAspectString, newFailing, newSOrder] = alternateStrokeOrder(JSON.parse(JSON.stringify(combos[i])), tCoords, passing);
        const newAvgGrade = newGrades.reduce((a, b) => a + b, 0) / newGrades.length;
        if (newAvgGrade > avgGrade) {
            [grades, strokeInfo, feedback, aspectString, failing, sOrder] = [newGrades, newStrokeInfo, newFeedback, newAspectString, newFailing, newSOrder]
            iCoordsCorrected = combos[i];
            avgGrade = newAvgGrade;
            bestCombo = i;
            if (failing === 0) {
                break;
            }
            if (failing > tCoords.length * 0.75) {
                kanji_grade.overallFeedback += "It looks like you drew the wrong character.\n";
                return [[],[],[],"",0];
            }
        }
    }

    kanji_grade.overallFeedback += aspectString;
    kanji_grade.overallFeedback += "Feedback on stroke number:\n";
    const gradeColors = [];
    var j = 0;

    for (var i = 1; i < iCoords.length + 1; i++) {
        if (comboNumbers[bestCombo].includes(i)) {
            gradeColors.push(grades[j]);
            j++;
        } else {
            gradeColors.push(0);
            kanji_grade.overallFeedback += "\tStroke " + i + " was an extra stroke, it was removed for stroke grading.\n";
            kanji_grade.overallGrade -= (100 - passing * 100)
        }
    }

    order_feedback(sOrder);

    return [gradeColors, strokeInfo, feedback, aspectString, failing]
}

function missingStrokes(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[], string, number] {
    const n = tCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, iCoords.length);

    if (iCoords.length < Math.ceil(tCoords.length * 0.75)) {
        kanji_grade.overallFeedback += "You entered too few strokes for this character.\n";
        color_input([]);
        return [[],[],[], "",0];
    }
    const lengthdiff = tCoords.length - iCoords.length;
    var tCoordsCorrected = tCoords.slice(0, tCoords.length - lengthdiff);
    var [grades, strokeInfo, feedback, aspectString, failing, sOrder] = alternateStrokeOrder(iCoords, JSON.parse(JSON.stringify(tCoordsCorrected)), passing);
    var avgGrade = 0;
    var bestCombo = 0;
    const combos = generateCombinations(tCoords, iCoords.length);
    for (let i = 0; i < combos.length; i++) {
        const [newGrades, newStrokeInfo, newFeedback, newAspectString, newFailing, newSOrder] = alternateStrokeOrder(iCoords, JSON.parse(JSON.stringify(combos[i])), passing);
        const newAvgGrade = newGrades.reduce((a, b) => a + b, 0) / newGrades.length;
        if (newAvgGrade > avgGrade) {
            [grades, strokeInfo, feedback, aspectString, failing, sOrder] = [newGrades, newStrokeInfo, newFeedback, newAspectString, newFailing, newSOrder];
            tCoordsCorrected = combos[i];
            avgGrade = newAvgGrade;
            bestCombo = i;
            if (failing === 0) {
                break;
            }
            if (failing > iCoords.length * 0.75) {
                kanji_grade.overallFeedback += "It looks like you drew the wrong character.\n";
                return [[],[],[],"",0];
            }
        }
    }

    kanji_grade.overallFeedback += aspectString;
    kanji_grade.overallFeedback += "Feedback on stroke number:\n";
    const gradeColors = [];
    var j = 0;

    for (var i = 1; i < tCoords.length + 1; i++) {
        if (comboNumbers[bestCombo].includes(i)) {
            gradeColors.push(grades[j]);
            j++;
        } else {
            kanji_grade.overallFeedback += "\tStroke " + i + " from the model was missing, it was ignored for stroke grading.\n";
            kanji_grade.overallGrade -= (100 - passing * 100)

        }
    }

    order_feedback(sOrder);
    return [gradeColors, strokeInfo, feedback, aspectString, failing]
}

export default function grade(input: string, targetKanji: string): Promise<KanjiGrade> {
    console.log("GRADING");
    kanji_grade = {
        overallGrade: 100,
        overallFeedback: "",
        grades: [],
        feedback: [],
        strokeInfo: []
    }

    return new Promise((resolve, reject) => {
        fetch("/interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json")
            .then(response => response.json())
            .then(data => {
                var targetInfo = data as unknown as interp_data;
                const tCoords = targetInfo.coords;
                const iCoords = interpolate((' ' + input).slice(1), targetInfo.totalLengths);
                if (!iCoords.length) return;
                let grades: number[], strokeInfo: string[], feedback: string[], aspectString: string, failing: number, strokeOrder: number[]; // Declare the types of the variables separately
                if (iCoords.length > tCoords.length) {
                    [grades, strokeInfo, feedback, aspectString, failing] = extraStrokes(iCoords, tCoords, passing);
                } else if (iCoords.length < tCoords.length) {
                    [grades, strokeInfo, feedback, aspectString, failing] = missingStrokes(iCoords, tCoords, passing);
                } else {
                    [grades, strokeInfo, feedback, aspectString, failing, strokeOrder] = alternateStrokeOrder(iCoords, tCoords, passing);
                    kanji_grade.overallFeedback += aspectString;
                    order_feedback(strokeOrder);
                }
                const avgGrade = grades.reduce((a, b) => a + b, 0) / grades.length;

                kanji_grade.overallGrade *= avgGrade;
                kanji_grade.overallGrade = Math.max(kanji_grade.overallGrade, 0);
                kanji_grade.grades = grades;
                kanji_grade.feedback = feedback;
                kanji_grade.strokeInfo = strokeInfo;


                color_input(grades);
                strokeInfo.forEach(stroke => {
                    console.log(stroke)
                });
                feedback.forEach(string => {
                    console.log(string);
                });
                console.log("Overall grade: " + kanji_grade.overallGrade);
                if (kanji_grade.overallFeedback === "") {
                    console.log("Great job!");
                } else console.log(kanji_grade.overallFeedback)
                
                
                resolve (kanji_grade);
            })
            .catch(error => {
                console.error("Error grading:", error);
                return kanji_grade;
            });
    });
}