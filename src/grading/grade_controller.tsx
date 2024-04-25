import grade_svg from './grade_svg';
import interpolate from './interpolate';
import color_input from './color_input';
import { Heap } from 'heap-js';
import KanjiGrade from '../types/KanjiGrade';

class interp_data {
    coords! : [];
    totalLengths!: number;
}

var passing = 0.65;

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
    var feedback = "Stroke order:\n";
    var feedbackCount = 0;
    for (let i = 0; i < order.length; i++) {
        if (order[i] !== i + 1) {
            if (order[order[i] - 1] === i + 1) {
                if (order[i] < order[order[i] - 1]) {
                    feedback += "\tSwap strokes " + order[i] + " and " + default_order[i] + ".\n";
                    kanji_grade.overallGrade -= 2 * (100 - passing * 100);
                    feedbackCount++;
                }
            } else {
                feedback += "\tStroke " + order[i] + " should be stroke " + default_order[i] + ".\n";
                kanji_grade.overallGrade -= (100 - passing * 100);
                feedbackCount++;
            }
        }
    }
    if (feedbackCount > 3) {
        kanji_grade.overallFeedback += "Review the stroke order and try again.\n";
        return;
    }
    kanji_grade.overallFeedback += feedback;
}

function generateOrderArray<T>(array: T[][], order: number[]): T[][] {
    const result: T[][] = [];
    for (const index of order) {
        result.push(array[index - 1]); // Subtract 1 because indices are 0-based
    }
    return result;
}

function center_points(inputCoords: number[][][]): number[][] {
    const centers = [];
    const input_center = () => {
        let x = 0;
        let y = 0;
        let points = 0;
        for (let i = 0; i < inputCoords.length; i++) {
            for (let j = 0; j < inputCoords[i].length; j++) {
                x += inputCoords[i][j][0];
                y += inputCoords[i][j][1];
                points++;
            }
        }
        return [x / points, y / points];
    }
    for (let stroke = 0; stroke < inputCoords.length; stroke++) {
        const input_stroke_center = [
            inputCoords[stroke].reduce((acc, point) => acc + point[0], 0) / inputCoords[stroke].length - input_center()[0],
            inputCoords[stroke].reduce((acc, point) => acc + point[1], 0) / inputCoords[stroke].length - input_center()[1]
        ];
        centers[stroke] = input_stroke_center;
    }
    return centers;
}

function choose_strokes(iCoords: number[][][], tCoords: number[][][]): [number[], string[], string[], string, number] {
    const iCenters = center_points(iCoords);
    const tCenters = center_points(tCoords);
    if (iCoords.length > tCoords.length) {
        let assigned = Array.from({ length: iCoords.length }, () => -1);
        for (let i = 0; i < tCoords.length; i++) {
            let minDiff = Number.MAX_VALUE;
            let secondDiff = Number.MAX_VALUE;
            let minIndex = -1;
            let secondIndex = -1;
            for (let j = 0; j < iCoords.length; j++) {
                if (assigned[j] !== -1) continue;
                const diff = Math.sqrt((iCenters[j][0] - tCenters[i][0]) ** 2 + (iCenters[j][1] - tCenters[i][1]) ** 2);
                if (diff < minDiff) {
                    secondDiff = minDiff;
                    minDiff = diff;
                    secondIndex = minIndex;
                    minIndex = j;
                } else if (diff < secondDiff) {
                    secondDiff = diff;
                    secondIndex = j;
                }
            }
            if (secondIndex === -1) {
                assigned[minIndex] = i + 1;
                continue;
            }
            const lengthDiff = Math.abs(iCoords[minIndex].length - tCoords[i].length);
            const lengthDiff2 = Math.abs(iCoords[secondIndex].length - tCoords[i].length);
            if (lengthDiff <= lengthDiff2 || minDiff < secondDiff - 50) {
                assigned[minIndex] = i + 1;
            } else {
                assigned[secondIndex] = i + 1;
            }
        }
        const iCoordsCorrected = iCoords.filter((_, index) => assigned[index] !== -1);
        var [grades, strokeInfo, feedback, aspectString, failing, sOrder] = alternateStrokeOrder(JSON.parse(JSON.stringify(iCoordsCorrected)), tCoords, passing);
        if (failing > tCoords.length * 0.75) {
            kanji_grade.overallFeedback += "Review the model and try again.\n";
            return [[],[],[],"",0];
        }
        kanji_grade.overallFeedback += "Stroke number:\n";
        let gradeColors = [];
        var j = 0;
        for (let i = 0; i < iCoords.length; i++) {
            if (assigned[i] === -1) {
                kanji_grade.overallFeedback += "Stroke " + (i + 1) + " is extra.\n";
                kanji_grade.overallGrade -= (100 - passing * 100)
                gradeColors.push(-1);
            }
            else {
                sOrder[j] === j + 1 ? gradeColors.push(grades[j]) : gradeColors.push(-2);
                j++;
            }
        } 
        order_feedback(sOrder);
        console.log("Stroke order: ", sOrder)
        console.log("Grade colors: ", gradeColors)
        return [gradeColors, strokeInfo, feedback, aspectString, failing];

    } else {
        let assigned = Array.from({ length: tCoords.length }, () => -1);
        for (let i = 0; i < iCoords.length; i++) {
            let minDiff = Number.MAX_VALUE;
            let secondDiff = Number.MAX_VALUE;
            let minIndex = -1;
            let secondIndex = -1;
            for (let j = 0; j < tCoords.length; j++) {
                if (assigned[j] !== -1) continue;
                const diff = Math.sqrt((iCenters[i][0] - tCenters[j][0]) ** 2 + (iCenters[i][1] - tCenters[j][1]) ** 2);
                if (diff < minDiff) {
                    secondDiff = minDiff;
                    minDiff = diff;
                    secondIndex = minIndex;
                    minIndex = j;
                } else if (diff < secondDiff) {
                    secondDiff = diff;
                    secondIndex = j;
                }
            }
            if (secondIndex === -1) {
                assigned[minIndex] = i + 1;
                continue;
            }
            const lengthDiff = Math.abs(iCoords[i].length - tCoords[minIndex].length);
            const lengthDiff2 = Math.abs(iCoords[i].length - tCoords[secondIndex].length);
            if (lengthDiff <= lengthDiff2 || minDiff < secondDiff - 50) {
                assigned[minIndex] = i + 1;
            } else {
                assigned[secondIndex] = i + 1;
            }
        }
        const tCoordsCorrected = tCoords.filter((_, index) => assigned[index] !== -1);
        var [grades, strokeInfo, feedback, aspectString, failing, sOrder] = alternateStrokeOrder(iCoords, JSON.parse(JSON.stringify(tCoordsCorrected)), passing);
        if (failing > iCoords.length * 0.75) {
            kanji_grade.overallFeedback += "Review the model and try again.\n";
            return [[],[],[],"",0];
        }
        kanji_grade.overallFeedback += "Stroke number:\n";
        let gradeColors = [];
        var j = 0;
        for (let i = 0; i < tCoords.length; i++) {
            if (assigned[i] === -1) {
                kanji_grade.overallFeedback += "Stroke " + (i + 1) + " is missing.\n";
                kanji_grade.overallGrade -= (100 - passing * 100)
            }
            else {
                sOrder[j] === j + 1 ? gradeColors.push(grades[j]) : gradeColors.push(-2);
                j++;
            }
        }
        order_feedback(sOrder);
        return [gradeColors, strokeInfo, feedback, aspectString, failing];   
    }
}

function alternateStrokeOrder(
    iCoords: number[][][],
    tCoords: number[][][],
    passing: number = 0.65,
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
        const basegrade = calculateAverageGrade(order);
        queue.push([order, basegrade[1]]);
        let failingnum = basegrade[1];
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
            } 
            for (let i = 0; i < currentOrder.length; i++) {
                for (let j = i + 1; j < currentOrder.length; j++) {
                    const newOrder = currentOrder.slice();
                    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
                    const key = newOrder.toString();
                    if (!visited.has(key)) {
                        const newFailing = calculateAverageGrade(newOrder)[1];
                        if (newFailing <= failingnum) {
                            visited.add(key);
                            queue.push([newOrder, newFailing]);
                        }
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

export default function grade(input: string, targetKanji: string, passing: number, coords?: number[][][], totalLengths?: number): Promise<KanjiGrade> {
    kanji_grade = {
        overallGrade: 100,
        overallFeedback: "",
        grades: [],
        feedback: [],
        strokeInfo: []
    }
    passing = passing;


    return new Promise((resolve, reject) => {
        if(coords && totalLengths) {
            const data = {coords,totalLengths};

            try {
                var targetInfo = data as unknown as interp_data;
                const tCoords = targetInfo.coords;
                const iCoords = interpolate((' ' + input).slice(1), targetInfo.totalLengths);
                if (!iCoords.length) return;
                let grades: number[], strokeInfo: string[], feedback: string[], aspectString: string, failing: number, strokeOrder: number[]; // Declare the types of the variables separately
                if (iCoords.length !== tCoords.length) {
                    [grades, strokeInfo, feedback, aspectString, failing] = choose_strokes(iCoords, tCoords);
                } else {
                    [grades, strokeInfo, feedback, aspectString, failing, strokeOrder] = alternateStrokeOrder(iCoords, tCoords, passing);
                    if (failing > iCoords.length * 0.75) {
                        color_input([]);
                        kanji_grade = {
                            overallGrade: 0,
                            overallFeedback: "Review the model and try again.\n",
                            grades: [],
                            feedback: [],
                            strokeInfo: []
                        }
                        resolve(kanji_grade);
                        return;
                    }
                    kanji_grade.overallFeedback += aspectString;
                    for (let i = 0; i < strokeOrder.length; i++) {
                        if (strokeOrder[i] !== i + 1) grades[i] = -2;
                    }
                    order_feedback(strokeOrder);
                }
                let avgGrade = grades.filter((val) => val >= passing).reduce((a, b) => a + b, 0) / grades.filter((val) => val >= passing).length;
                if (kanji_grade.overallGrade > passing * 100 && failing !== 0) {
                    kanji_grade.overallGrade -= failing * (100 - passing * 100);
                }

                if(!avgGrade){
                    avgGrade = 0;
                }
                

                kanji_grade.overallGrade *= avgGrade;
                kanji_grade.overallGrade = Math.max(kanji_grade.overallGrade, 0);

                kanji_grade.grades = grades;
                kanji_grade.feedback = feedback;
                kanji_grade.strokeInfo = strokeInfo;

                      
                color_input(grades);
                
                resolve (kanji_grade);
            }
            catch(error) {
                console.error("Error grading:", error);
                return kanji_grade;
            }

        }
        else{

        
            fetch("/interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json")
                .then(response => response.json())
                .then(data => {
                    var targetInfo = data as unknown as interp_data;
                    const tCoords = targetInfo.coords;
                    const iCoords = interpolate((' ' + input).slice(1), targetInfo.totalLengths);
                    if (!iCoords.length) return;
                    let grades: number[], strokeInfo: string[], feedback: string[], aspectString: string, failing: number, strokeOrder: number[]; // Declare the types of the variables separately
                    if (iCoords.length !== tCoords.length) {
                        [grades, strokeInfo, feedback, aspectString, failing] = choose_strokes(iCoords, tCoords);
                    } else {
                        [grades, strokeInfo, feedback, aspectString, failing, strokeOrder] = alternateStrokeOrder(iCoords, tCoords, passing);
                        if (failing > iCoords.length * 0.75) {
                            color_input([]);
                            kanji_grade = {
                                overallGrade: 0,
                                overallFeedback: "Review the model and try again.\n",
                                grades: [],
                                feedback: [],
                                strokeInfo: []
                            }
                            resolve(kanji_grade);
                            return;
                        }
                        kanji_grade.overallFeedback += aspectString;
                        order_feedback(strokeOrder);
                    }
                    let avgGrade = grades.filter((val) => val >= passing).reduce((a, b) => a + b, 0) / grades.filter((val) => val >= passing).length;
                    if (kanji_grade.overallGrade > passing * 100 && failing !== 0) {
                        kanji_grade.overallGrade -= failing * (100 - passing * 100);
                    }

                    if(!avgGrade){
                        avgGrade = 0;
                    }

                    kanji_grade.overallGrade *= avgGrade;
                    kanji_grade.overallGrade = Math.max(kanji_grade.overallGrade, 0);

                    kanji_grade.grades = grades;
                    kanji_grade.feedback = feedback;
                    kanji_grade.strokeInfo = strokeInfo;


                    color_input(grades);
                    
                    
                    resolve (kanji_grade);
                })
                .catch(error => {
                    console.error("Error grading:", error);
                    return kanji_grade;
                });
            }
    });
}