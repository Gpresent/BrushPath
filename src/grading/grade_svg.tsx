import interpolate from './interpolate';
import fit_bbox from './fit_bbox';
import color_input from './color_input';
import grade_angles from './grade_angles';
import grade_lengths from './grade_lengths';

export default function grade_svg(input: string, targetKanji: string) {
        const targetInfoPromise = import("../interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json");
        targetInfoPromise.then((targetInfo) => {
            const tCoords = targetInfo.coords;
            const iCoords = interpolate(input, targetInfo.totalLengths);
            if (!iCoords.length) return;

            const [inputCoords, targetCoords, aspectWarp] = fit_bbox(iCoords, tCoords);
            const aspectScore = aspectWarp > 1 ? 1 - 1 / aspectWarp : 1 - aspectWarp;

            console.log("Aspect Score: ", (1 - aspectScore) * 100, "%");
            aspectWarp > 1 ? console.log("Input is", (aspectWarp - 1) * 100, "% taller than model") : console.log("Input is", ((1 / aspectWarp) - 1) * 100, "% wider than model");

            const [angleDiffs, meanDiffs] = grade_angles(inputCoords, targetCoords);
            const lengthDiffs = grade_lengths(inputCoords, targetCoords);

            const grades: number[] = [];
            for (let i = 0; i < inputCoords.length; i++) {
                if (meanDiffs[i] > 90) meanDiffs[i] = 90;
                const angleScore = (meanDiffs[i] / 90);

                const lengthScore = Math.min(Math.pow(lengthDiffs[i], 2) / (targetCoords[i].length * 5), 1);

                console.log("Stroke ", i + 1, " Angle Score: ", (1 - angleScore) * 100, "%, Length Score: ", ((1 - lengthScore) * 100).toPrecision(4), "%");

                grades[i] = Math.max(1 - angleScore - aspectScore - lengthScore, 0);
                
                console.log("Grade: ", (grades[i] * 100).toPrecision(4), "%");
            }
            color_input(grades);
        });
}