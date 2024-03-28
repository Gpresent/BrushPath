import fit_bbox from './fit_bbox';
import grade_angles from './grade_angles';
import grade_lengths from './grade_lengths';
import grade_center_points from './grade_center_points';
import grade_intersections from './grade_intersections';
import grade_crosses from './grade_crosses';

function classify_angle(angle: number): string {
    if (angle < 20 && angle > -20) return 'horizontally to the right';
    if (angle < 70 && angle > 20) return 'diagonally to the lower right';
    if (angle < 110 && angle > 70) return 'vertically down';
    if (angle < 160 && angle > 110) return 'diagonally to the lower left';
    if (angle < -160 || angle > 160) return 'horizontally to the left';
    if (angle < -110 && angle > -160) return 'diagonally to the upper left';
    if (angle < -110 && angle > -70) return 'vertically up';
    if (angle < -70 && angle > -20) return 'diagonally to the upper right';
    return 'horizontal';
}

function gen_feedback_angles(targetAngles: number[], angleDiffs: number[]): string {
    var feedback = '';
    const feedbackThreshold = angleDiffs.length / 5;
    const angleThreshold = 15;
    var badLocations = [] as number[];
    for (let i = 0; i < angleDiffs.length; i++) {
        
        if (angleDiffs[i] > angleThreshold) {
            var addFeedback = true;
            for (let j = i; j < feedbackThreshold; j++) {
                if (j === angleDiffs.length || angleDiffs[j] < angleThreshold) {
                    addFeedback = false;
                    break;
                }
            }
            if (addFeedback) {
                badLocations.push(Math.floor(i + feedbackThreshold / 2));
                i += Math.ceil(feedbackThreshold);
            }          
        }
    }   
    if (!badLocations.length) return '';
    var regions = [0];
    for (let i = 0; i < targetAngles.length; i++) {
        if (classify_angle(targetAngles[i]) !== classify_angle(targetAngles[i + 1])) regions.push(i + 1);
    }
    if (!regions.includes(targetAngles.length)) regions.push(targetAngles.length);
    feedback += 'The angle of this stroke is off. Make sure that';
    var startFeedback = false;
    var regionIndex = 0;
    for (let i = 0; i < badLocations.length; i++) {
        if (regionIndex && badLocations[i] <= regions[regionIndex]) continue;
        for (let index = 0; index < regions.length; index++) {
            if (regions[index] > badLocations[i]) {
                if (index === 1) {
                    if (index === regions.length - 1) {
                        feedback += ' the stroke slopes ' + classify_angle(targetAngles[0]); 
                    } else {
                        feedback += ' the stroke slopes ' + classify_angle(targetAngles[0]) + ' until the ' + Math.round(regions[index] / targetAngles.length * 10) * 10 + '% mark';
                    }
                    startFeedback = true;
                    regionIndex = index;
                    break;
                } else if (index === regions.length - 1) {
                    startFeedback ? feedback += ' and ' : feedback += ' the stroke ';
                    feedback += 'slopes ' + classify_angle(targetAngles[regions[index - 1]]) + ' from the ' + Math.round(regions[index - 1] / targetAngles.length * 10) * 10 + '% mark to the end';
                    regionIndex = index;
                    break;
                } else {
                    startFeedback ? feedback += ' and ' : feedback += ' the stroke ';
                    const startRegion = Math.round(regions[index - 1] / targetAngles.length * 10) * 10
                    feedback += 'slopes ' + classify_angle(targetAngles[regions[index - 1]]) + ' from the ' + (startRegion === 0 ? 'beginning' : startRegion + '% mark') + ' to the ' + Math.round(regions[index] / targetAngles.length * 10) * 10 + '% mark';
                    startFeedback = true;
                    regionIndex = index;
                    break;
                }
            }   
        }
    }
    feedback += ".\n";

    return feedback;
}
function gen_feedback_lengths(lengthDiffs: number): string {
    var feedback = ''
    if (lengthDiffs > 1) feedback += "This stroke is too long by " + Math.round((lengthDiffs - 1) * 10) * 10 + "%.\n";
    else feedback += "This stroke is too short by " + Math.round((1 - lengthDiffs) * 10) * 10 + "%.\n";
    return feedback;
}
function gen_feedback_center_points(centerDiffs: number[]): string {
    return '';
}
function gen_feedback_intersections(extraIntersections: number[], missingIntersections: number[]): string {
    return '';
}
function gen_feedback_crosses(extraCrosses: number[], missingCrosses: number[]): string {
    return '';
}
function gen_feedback_aspect(aspectScore: number): string {
    return '';
}

export default function grade_svg(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[]]{
    const [inputCoords, targetCoords, aspectWarp] = fit_bbox(iCoords, tCoords);
    const grades: number[] = [];
    const strokeInfo: string[] = [];
    const feedback: string[] = [];
    const aspectScore = aspectWarp > 1 ? (1 - (1 / aspectWarp)) / 2 : (1 - aspectWarp) / 2;

    strokeInfo.push("Aspect Score: " + Math.round((1 - aspectScore) * 100).toString() + "%");
    aspectWarp > 1 ? strokeInfo.push("Input is " + Math.round((aspectWarp - 1) * 100).toString() + "% taller than model") : strokeInfo.push("Input is " + Math.round(((1 / aspectWarp) - 1) * 100).toString() + "% wider than model");

    const [targetAngles, angleDiffs, meanDiffs, squiggle] = grade_angles(inputCoords, targetCoords);
    const lengthDiffs = grade_lengths(inputCoords, targetCoords);
    const [centerDiffs, meanCenterDiffs] = grade_center_points(inputCoords, targetCoords);
    const [extraIntersections, missingIntersections] = grade_intersections(inputCoords, targetCoords);
    const [extraCrosses, missingCrosses] = grade_crosses(inputCoords, targetCoords);

    for (let i = 0; i < inputCoords.length; i++) {
        if (meanDiffs[i] > 90) meanDiffs[i] = 90;

        const angleScore = (meanDiffs[i] / 70) / (Math.sqrt(squiggle[i]));
        const lengthScore = Math.max(Math.min((targetCoords[i].length * Math.abs(lengthDiffs[i] - 1) - 2) / 25, 1), 0);
        const centerScore = Math.max((meanCenterDiffs[i] - 30) / 60, 0)
        const intersectionScore = 
            (extraIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0) + missingIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0)) * 0.3;
        const crossScore = (extraCrosses[i].length + missingCrosses[i].length) * 0.3;

        strokeInfo.push(("Stroke " + (i + 1).toString() + " Angle Score: " + Math.round((1 - angleScore) * 100).toString() + "%, Length Score: " + Math.round((1 - lengthScore) * 100).toPrecision(4).toString() + "%, Center Score: " + Math.round((1 - centerScore) * 100).toPrecision(4).toString() + "%, Correct Intersections: "+ (intersectionScore === 0 ? "Yes" : "No") + ", Correct Crosses: " + (crossScore === 0 ? "Yes" : "No")));

        grades[i] = Math.max(1 - intersectionScore - crossScore - angleScore - aspectScore - lengthScore - centerScore, 0);

        if (grades[i] < passing) {
            var feedbackline = 'Stroke ' + (i + 1) + ': grade = ' + Math.round(grades[i] * 100) + "%\n";
            if (angleScore + 0.15 > 1 - passing) feedbackline += gen_feedback_angles(targetAngles[i], angleDiffs[i]);
            if (lengthScore + 0.15 > 1 - passing) feedbackline += gen_feedback_lengths(lengthDiffs[i]);
            if (centerScore + 0.15 > 1 - passing) feedbackline += gen_feedback_center_points(centerDiffs[i]);
            feedbackline += gen_feedback_intersections(extraIntersections[i], missingIntersections[i]);
            feedbackline += gen_feedback_crosses(extraCrosses[i], missingCrosses[i]);
            feedbackline += gen_feedback_aspect(aspectScore);
            feedback[i] = feedbackline;
        } else {
            feedback[i] = "Stroke " + (i + 1) + " is good. Score = " + Math.round(grades[i] * 100) + "%\n";
        }
    }
    return [grades, strokeInfo, feedback];
}