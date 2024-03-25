import fit_bbox from './fit_bbox';
import grade_angles from './grade_angles';
import grade_lengths from './grade_lengths';
import grade_center_points from './grade_center_points';
import grade_intersections from './grade_intersections';
import grade_crosses from './grade_crosses';

function gen_feedback_angles(angleDiffs: number[]): string {
    return '';
}
function gen_feedback_lengths(lengthDiffs: number): string {
    return '';
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

    strokeInfo.push("Aspect Score: ", ((1 - aspectScore) * 100).toString(), "%");
    aspectWarp > 1 ? strokeInfo.push("Input is", ((aspectWarp - 1) * 100).toString(), "% taller than model") : strokeInfo.push("Input is", (((1 / aspectWarp) - 1) * 100).toString(), "% wider than model");

    const [angleDiffs, meanDiffs, squiggle] = grade_angles(inputCoords, targetCoords);
    const lengthDiffs = grade_lengths(inputCoords, targetCoords);
    const [centerDiffs, meanCenterDiffs] = grade_center_points(inputCoords, targetCoords);
    const [extraIntersections, missingIntersections] = grade_intersections(inputCoords, targetCoords);
    const [extraCrosses, missingCrosses] = grade_crosses(inputCoords, targetCoords);

    for (let i = 0; i < inputCoords.length; i++) {
        if (meanDiffs[i] > 90) meanDiffs[i] = 90;

        const angleScore = (meanDiffs[i] / 70) / (Math.sqrt(squiggle[i]));
        const lengthScore = Math.min(Math.pow(lengthDiffs[i], 2) / (targetCoords[i].length * 10), 1);
        const centerScore = Math.max((meanCenterDiffs[i] - 30) / 60, 0)
        const intersectionScore = 
            (extraIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0) + missingIntersections[i].reduce((sum: number, e: number) => sum + (e > 0 ? 1 : 0), 0)) * 0.3;
        const crossScore = (extraCrosses[i].length + missingCrosses[i].length) * 0.3;

        strokeInfo.push("Stroke ", (i + 1).toString(), " Angle Score: ", ((1 - angleScore) * 100).toString(), "%, Length Score: ", ((1 - lengthScore) * 100).toPrecision(4).toString(), "%, Center Score: ", ((1 - centerScore) * 100).toPrecision(4).toString(), "%, Correct Intersections: ", intersectionScore === 0 ? "Yes" : "No", ", Correct Crosses: ", crossScore === 0 ? "Yes" : "No");

        grades[i] = Math.max(1 - intersectionScore - crossScore - angleScore - aspectScore - lengthScore - centerScore, 0);

        if (grades[i] < passing) {
            var feedbackline = 'Stroke ' + (i + 1) + ':\n';
            if (angleScore > 1 - passing) feedbackline += gen_feedback_angles(angleDiffs[i]);
            if (lengthScore > 1 - passing) feedbackline += gen_feedback_lengths(lengthDiffs[i]);
            if (centerScore > 1 - passing) feedbackline += gen_feedback_center_points(centerDiffs[i]);
            feedbackline += gen_feedback_intersections(extraIntersections[i], missingIntersections[i]);
            feedbackline += gen_feedback_crosses(extraCrosses[i], missingCrosses[i]);
            feedbackline += gen_feedback_aspect(aspectScore);
            feedback[i] = feedbackline;
        }
    }
    return [grades, strokeInfo, feedback];
}