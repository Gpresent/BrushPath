export default function grade_center_points(inputCoords: number[][][], targetCoords: number[][][]): [center_diffs: number[][], mean_center_diffs: number[]] {

    const center_diffs = [];
    const mean_center_diffs = [];
    const skip_indices: number[] = [];
    console.log(inputCoords);
    console.log(targetCoords);

    while (true) {
        for (let stroke = 0; stroke < inputCoords.length; stroke++){
            if (skip_indices.includes(stroke)) continue;
            const input_center = () => {
                let x = 0;
                let y = 0;
                let points = 0;
                for (let i = 0; i < inputCoords.length; i++) {
                    if (skip_indices.includes(i)) continue;
                    for (let j = 0; j < inputCoords[i].length; j++) {
                        x += inputCoords[i][j][0];
                        y += inputCoords[i][j][1];
                        points++;
                    }
                }
                return [x / points, y / points];
            }
            const target_center = () => {
                let x = 0;
                let y = 0;
                let points = 0;
                for (let i = 0; i < targetCoords.length; i++) {
                    if (skip_indices.includes(i)) continue;
                    for (let j = 0; j < targetCoords[i].length; j++) {
                        x += targetCoords[i][j][0];
                        y += targetCoords[i][j][1];
                        points++;
                    }
                }
                return [x / points, y / points];
            }
            const center_diff = [input_center()[0] - target_center()[0], input_center()[1] - target_center()[1]];
            const target_stroke_center = [
                targetCoords[stroke].reduce((acc, point) => acc + point[0], 0) / targetCoords[stroke].length, 
                targetCoords[stroke].reduce((acc, point) => acc + point[1], 0) / targetCoords[stroke].length
            ];
            const input_stroke_center = [
                inputCoords[stroke].reduce((acc, point) => acc + point[0], 0) / inputCoords[stroke].length, 
                inputCoords[stroke].reduce((acc, point) => acc + point[1], 0) / inputCoords[stroke].length
            ];

            const stroke_center_diff = [input_stroke_center[0] - target_stroke_center[0] - center_diff[0], input_stroke_center[1] - target_stroke_center[1] - center_diff[1]];
            center_diffs[stroke] = stroke_center_diff;
        }
        for (let i = 0; i < center_diffs.length; i++) {
            mean_center_diffs[i] = Math.sqrt(center_diffs[i][0] ** 2 + center_diffs[i][1] ** 2);
        }
        var max_diff = 0;
        for (let i = 0; i < mean_center_diffs.length; i++) {
            if (mean_center_diffs[i] > max_diff && !skip_indices.includes(i)) {
                max_diff = mean_center_diffs[i];
            }
        }
        console.log(center_diffs);
        const max_diff_index = mean_center_diffs.indexOf(max_diff);

        if (max_diff > 50) {
            skip_indices.push(max_diff_index);
        } else {
            break;
        }
    }
    
    return [center_diffs, mean_center_diffs];
}
