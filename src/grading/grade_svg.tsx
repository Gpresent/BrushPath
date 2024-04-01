import fit_bbox from './fit_bbox';
import grade_angles from './grade_angles';
import grade_lengths from './grade_lengths';
import grade_center_points from './grade_center_points';
import grade_intersections from './grade_intersections';
import grade_crosses from './grade_crosses';

function classify_angle(angle: number): string {
    if (angle <= 20 && angle > -20) return 'horizontally to the right';
    if (angle <= 70 && angle > 20) return 'diagonally to the lower right';
    if (angle <= 110 && angle > 70) return 'vertically down';
    if (angle <= 160 && angle > 110) return 'diagonally to the lower left';
    if (angle <= -160 || angle > 160) return 'horizontally to the left';
    if (angle <= -110 && angle > -160) return 'diagonally to the upper left';
    if (angle <= -70 && angle > -110) return 'vertically up';
    if (angle <= -20 && angle > -70) return 'diagonally to the upper right';
    return 'horizontal';
}

function classify_centerpoints(angle: number): string {
    if (angle <= 20 && angle > -20) return 'to the left';
    if (angle <= 70 && angle > 20) return 'to the upper left';
    if (angle <= 110 && angle > 70) return 'upwards';
    if (angle <= 160 && angle > 110) return 'to the upper right';
    if (angle <= -160 || angle > 160) return 'to the right';
    if (angle <= -110 && angle > -160) return 'to the lower right';
    if (angle <= -70 && angle > -110) return 'downwards';
    if (angle <= -20 && angle > -70) return 'to the lower left';
    return 'up';
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
                    const startRegion = Math.round(regions[index - 1] / targetAngles.length * 10) * 10
                    feedback += 'slopes ' + classify_angle(targetAngles[regions[index - 1]]) + ' from the ' + (startRegion === 0 ? 'beginning' : startRegion + '% mark') + ' to the end';
                    regionIndex = index;
                    break;
                } else {
                    startFeedback ? feedback += ' and ' : feedback += ' the stroke ';
                    const startRegion = Math.round(regions[index - 1] / targetAngles.length * 10) * 10
                    var endRegion = Math.round(regions[index] / targetAngles.length * 10) * 10
                    feedback += 'slopes ' + classify_angle(targetAngles[regions[index - 1]]) + ' from the ' + (startRegion === 0 ? 'beginning' : startRegion + '% mark') + ' to the ' + (endRegion === 100 ? 'end' : endRegion + '% mark');
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
    const angle = Math.atan2(centerDiffs[1], centerDiffs[0]) * 180 / Math.PI;
    return "This stroke is off-center. It should be moved " + classify_centerpoints(angle) + ".\n";
}
function gen_feedback_intersections(extraIntersections: number[], missingIntersections: number[]): string {
    
    var feedback = '';
    if (extraIntersections.length) {
        if (extraIntersections.length === 1) {
            feedback += "This stroke should not intersect with stroke " + (extraIntersections[0] + 1);
        } else {
            feedback += "This stroke should not intersect with strokes " 
            if (extraIntersections.length === 2) {
                feedback += extraIntersections[0] + 1 + " or " + extraIntersections[1] + 1;
            }
            else {
                for (let i = 0; i < extraIntersections.length - 1; i++) {
                    feedback += extraIntersections[i] + 1 + ", ";
                }
                feedback += "or " + extraIntersections[extraIntersections.length - 1] + 1;
            }
        }
    } 
    if (missingIntersections.length) {
        if (feedback) feedback += " and should intersect with ";
        else feedback += "This stroke should intersect with ";
        if (missingIntersections.length === 1) {
            feedback += "stroke " + (missingIntersections[0] + 1);
        } else {
            feedback += "strokes " 
            if (missingIntersections.length === 2) {
                feedback += missingIntersections[0] + 1 + " and " + missingIntersections[1];
            }
            else {
                for (let i = 0; i < missingIntersections.length - 1; i++) {
                    feedback += missingIntersections[i] + 1 + ", ";
                }
                feedback += "and " + missingIntersections[missingIntersections.length - 1] + 1;
            }
        }
    }
    if (feedback) feedback += ".\n";
    return feedback;
}
function gen_feedback_crosses(extraCrosses: number[], missingCrosses: number[]): string {
    var feedback = '';
    if (extraCrosses.length) {
        if (extraCrosses.length === 1) {
            feedback += "This stroke should not cross stroke " + (extraCrosses[0] + 1);
        } else {
            feedback += "This stroke should not cross strokes " 
            if (extraCrosses.length === 2) {
                feedback += extraCrosses[0] + 1 + " or " + extraCrosses[1] + 1;
            }
            else {
                for (let i = 0; i < extraCrosses.length - 1; i++) {
                    feedback += extraCrosses[i] + 1 + ", ";
                }
                feedback += "or " + extraCrosses[extraCrosses.length - 1] + 1;
            }
        }
    }
    if (missingCrosses.length) {
        if (feedback) feedback += " and should cross ";
        else feedback += "This stroke should cross ";
        if (missingCrosses.length === 1) {
            feedback += "stroke " + (missingCrosses[0] + 1);
        } else {
            feedback += "strokes " 
            if (missingCrosses.length === 2) {
                feedback += missingCrosses[0] + 1 + " and " + missingCrosses[1];
            }
            else {
                for (let i = 0; i < missingCrosses.length - 1; i++) {
                    feedback += missingCrosses[i] + 1 + ", ";
                }
                feedback += "and " + missingCrosses[missingCrosses.length - 1] + 1;
            }
        }
    }
    if (feedback) feedback += ".\n";
    return feedback;
}

export default function grade_svg(iCoords: number[][][], tCoords: number[][][], passing: number = 0.6): [number[], string[], string[], string]{
    const [inputCoords, targetCoords, aspectWarp] = fit_bbox(iCoords, tCoords);
    const grades: number[] = [];
    const strokeInfo: string[] = [];
    const feedback: string[] = [];
    const aspectScore = aspectWarp > 1 ? (1 - (1 / aspectWarp)) / 2 : (1 - aspectWarp) / 2;
    var aspectString = '';
    if (aspectScore > 0.1) aspectString = "Feedback on aspect ratio:\n" + (aspectWarp > 1 ? "\tYour input was " + Math.round((aspectWarp - 1) * 100).toString() + "% taller than the model.\n" : "\tYour input was " + Math.round(((1 / aspectWarp) - 1) * 100).toString() + "% wider than the model.\n");

    const [targetAngles, angleDiffs, meanDiffs, squiggle] = grade_angles(inputCoords, targetCoords);
    const lengthDiffs = grade_lengths(inputCoords, targetCoords);
    const [centerDiffs, meanCenterDiffs] = grade_center_points(inputCoords, targetCoords);
    const [extraIntersections, missingIntersections] = grade_intersections(inputCoords, targetCoords);
    const [extraCrosses, missingCrosses] = grade_crosses(inputCoords, targetCoords);

    for (let i = 0; i < inputCoords.length; i++) {
        if (meanDiffs[i] > 90) meanDiffs[i] = 90;

        const angleScore = Math.max(((meanDiffs[i] - 5) / 80) / (Math.sqrt(squiggle[i])), 0);
        const lengthScore = Math.max(Math.min((Math.pow(targetCoords[i].length, 3/4) * Math.abs(lengthDiffs[i] - 1) - 0.5) / 20, 1), 0);
        const centerScore = Math.max((meanCenterDiffs[i] - 30) / 60, 0)
        const intersectionScore = 
            (extraIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0) + missingIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0)) * 0.1;
        const crossScore = (extraCrosses[i].length + missingCrosses[i].length) * 0.3;

        strokeInfo.push(("Stroke " + (i + 1).toString() + " Angle Score: " + Math.round((1 - angleScore) * 100).toString() + "%, Length Score: " + Math.round((1 - lengthScore) * 100).toPrecision(4).toString() + "%, Center Score: " + Math.round((1 - centerScore) * 100).toPrecision(4).toString() + "%, Correct Intersections: "+ (intersectionScore === 0 ? "Yes" : "No") + ", Correct Crosses: " + (crossScore === 0 ? "Yes" : "No")));

        grades[i] = Math.max(1 - intersectionScore - crossScore - angleScore - aspectScore - lengthScore - centerScore, 0);

        if (grades[i] < passing) {
            var feedbackline = 'Stroke ' + (i + 1) + ': grade = ' + Math.round(grades[i] * 100) + "%\n";
            if (angleScore + 0.1 > 1 - passing) feedbackline += gen_feedback_angles(targetAngles[i], angleDiffs[i]);
            if (lengthScore + 0.2 > 1 - passing) feedbackline += gen_feedback_lengths(lengthDiffs[i]);
            if (centerScore + 0.2 > 1 - passing) feedbackline += gen_feedback_center_points(centerDiffs[i]);
            if (intersectionScore) feedbackline += gen_feedback_intersections(extraIntersections[i].filter(num => num > 0), missingIntersections[i].filter(num => num > 0));
            if (crossScore) feedbackline += gen_feedback_crosses(extraCrosses[i], missingCrosses[i]);
            feedback[i] = feedbackline;
        } else {
            feedback[i] = "Stroke " + (i + 1) + " is good. Score = " + Math.round(grades[i] * 100) + "%\n";
        }
    }
    return [grades, strokeInfo, feedback, aspectString];
}