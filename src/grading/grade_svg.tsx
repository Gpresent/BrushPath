import interpolate from './interpolate';
import fit_bbox from './fit_bbox';
import path_angles from './path_angles';
import color_input from './color_input';
import grade_angles from './grade_angles';

export default function grade_svg(input: string, targetKanji: string) {
        const targetInfoPromise = import("../interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json");
        targetInfoPromise.then((targetInfo) => {
            const tCoords = targetInfo.coords;
            const iCoords = interpolate(input, targetInfo.totalLengths);
            if (!iCoords.length) return;
            const [inputCoords, targetCoords, aspectWarp] = fit_bbox(iCoords, tCoords);
            const aspectScore = aspectWarp > 1 ? 1 / aspectWarp : aspectWarp;
            // console.log("Tall boi: ", aspectWarp);
            // console.log("Wide boi: ", 1 / aspectWarp);
            const [angleDiffs, meanDiffs] = grade_angles(inputCoords, targetCoords);
            // console.log("angle Diffs: ", angleDiffs);
            console.log("Angle Mean Diffs: ", meanDiffs);
            const grades: number[] = [];
            for (let i = 0; i < inputCoords.length; i++) {
                if (meanDiffs[i] > 90) meanDiffs[i] = 90;
                grades[i] = Math.max((1 - (meanDiffs[i] / 90) - (1 - aspectScore)), 0);
            }
            console.log("Grades: ", grades);
            color_input(grades);
        });
}