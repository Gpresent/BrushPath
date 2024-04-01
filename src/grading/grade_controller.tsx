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
    maxDepth: number = 5 // Adjust the maximum depth as needed
  ): [number[], string[], string[]] {
    function calculateAverageGrade(order: number[]): [number, number] {
        const [grades] = grade_svg(generateOrderArray(JSON.parse(JSON.stringify(iCoords)), order), tCoords, passing);
        return [grades.reduce((a, b) => a + b, 0) / grades.length, grades.filter(grade => grade < passing).length];
    }

    // BFS function to find the best stroke order
    function bfs(
        currentOrder: number[],
        depth: number,
        visited: Set<string>, // Keep track of visited combinations
    ): [number[], number] {
        if (depth === maxDepth) {
            return [currentOrder, -1];
        }
    
        let bestOrder = currentOrder;
        let [bestGrade, failingnum] = calculateAverageGrade(currentOrder);
        if (failingnum === 0) return [currentOrder, 0];
    
        for (let i = 0; i < currentOrder.length; i++) {
            for (let j = i + 1; j < currentOrder.length; j++) {
                // Swap elements to generate new stroke order
                const newOrder = [...currentOrder];
                [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    
                // Check if the new order is visited
                const orderKey = newOrder.join(',');
                if (!visited.has(orderKey)) {
                    visited.add(orderKey);
                    //console.log("Visited:", visited.size, "combinations, Current:", orderKey);
    
                    // Recursively call bfs with the new order
                    const [updatedOrder, failingnum2] = bfs(newOrder, depth + 1, visited);
    
                    // Calculate grade for the new order
                    const [grade] = calculateAverageGrade(updatedOrder);
    
                    // Update best order if the grade is better
                    if (grade > bestGrade) {
                        bestGrade = grade;
                        bestOrder = updatedOrder;
                        failingnum = failingnum2;
                    }
                    if (failingnum === 0) {
                        return [bestOrder, 0];
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
    console.log("Initial failing:", failing);
  
    // Perform BFS
    [bestCombo, failing] = bfs(bestCombo.slice(), 0, new Set());
    if (failing === -1) {
        console.log("No better stroke order found within the maximum depth")
    }
    console.log("Best combo:", bestCombo);
    console.log("Updated array:", generateOrderArray(iCoords, bestCombo));
  
    return grade_svg(generateOrderArray(iCoords, bestCombo), tCoords, passing); 
  }
  

function extraStrokes(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[]] {
    const n = iCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, tCoords.length);

    console.log("Too many strokes!");
    if (iCoords.length > Math.floor(tCoords.length * 1.25)) {
        console.log("Too many extra strokes, review model");
        color_input([]);
        return[[],[],[]];
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
    console.log("Best combo:", bestCombo);
    console.log("Strokes in combo:", comboNumbers[bestCombo].toString());
    return [gradeColors, strokeInfo, feedback]
}

function missingStrokes(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[]] {
    const n = tCoords.length;
    const array = Array.from({ length: n }, (_, index) => index + 1);
    const comboNumbers = generateCombinations(array, iCoords.length);

    console.log("Too few strokes!");
    if (iCoords.length < Math.ceil(tCoords.length * 0.75)) {
        console.log("Too many extra strokes, review model");
        color_input([]);
        return [[], [], []];
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
    console.log("Best combo:", bestCombo);
    console.log("Strokes in combo:", comboNumbers[bestCombo].toString());
    return [gradeColors, strokeInfo, feedback]
}

export default function grade(input: string, targetKanji: string) {
    const passing = 0.65;
    console.log("GRADING");
    fetch("/interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json").then(response => response.json())
    .then(data => {
        var targetInfo = data as unknown as interp_data;
        const tCoords = targetInfo.coords;
        const iCoords = interpolate((' ' + input).slice(1), targetInfo.totalLengths);
        if (!iCoords.length) return;
        let grades: number[], strokeInfo: string[], feedback: string[]; // Declare the types of the variables separately
        if (iCoords.length > tCoords.length) {
            [grades, strokeInfo, feedback] = extraStrokes(iCoords, tCoords, passing);
        } else if (iCoords.length < tCoords.length) {
            [grades, strokeInfo, feedback] = missingStrokes(iCoords, tCoords, passing);
        } else {
            [grades, strokeInfo, feedback] = alternateStrokeOrder(iCoords, tCoords, passing);
        }
        color_input(grades);
        strokeInfo.forEach(stroke => {
            console.log(stroke)
        });
        feedback.forEach(string => {
            console.log(string);
        });
    });
}