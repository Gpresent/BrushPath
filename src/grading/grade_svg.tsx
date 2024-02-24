import interpolate from './interpolate';
import fit_bbox from './fit_bbox';
import path_angles from './path_angles';
import color_input from './color_input';

export default function grade_svg(input: string, targetKanji: string) {
        const targetInfoPromise = import("../interpolation_data/" + targetKanji.codePointAt(0)?.toString(16).padStart(5, '0') + ".json");
        targetInfoPromise.then((targetInfo) => {
            const tCoords = targetInfo.coords;
            const iCoords = interpolate(input, targetInfo.totalLengths);
            if (!iCoords.length) return;
            const [inputCoords, targetCoords, aspectWarp] = fit_bbox(iCoords, tCoords);
            console.log("Tall boi: ", aspectWarp);
            console.log("Wide boi: ", 1 / aspectWarp);
            const [inputAngles, targetAngles] = path_angles(inputCoords, targetCoords);
            console.log("inputAngles: ", inputAngles);
            console.log("targetAngles: ", targetAngles);
            color_input();
        });
}