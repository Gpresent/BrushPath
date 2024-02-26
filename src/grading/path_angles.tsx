export default function path_angles(inputCoords: number[][][], targetCoords: number[][][]): [number[][], number[][]] {
    const inputAngles: number[][] = [];
    const targetAngles: number[][] = [];
    var i, j;
    for (i = 0; i < inputCoords.length; i++) {
      inputAngles[i] = [];
      for (j = 0; j < inputCoords[i].length - 1; j++) {
        inputAngles[i][j] = Math.atan2(inputCoords[i][j + 1][1] - inputCoords[i][j][1], inputCoords[i][j + 1][0] - inputCoords[i][j][0]) * 180 / Math.PI;
      }
    }
    for (i = 0; i < targetCoords.length; i++) {
      targetAngles[i] = [];
      for (j = 0; j < targetCoords[i].length - 1; j++) {
        targetAngles[i][j] = Math.atan2(targetCoords[i][j + 1][1] - targetCoords[i][j][1], targetCoords[i][j + 1][0] - targetCoords[i][j][0]) * 180 / Math.PI;
      }
    }
    
    return [inputAngles, targetAngles];
}