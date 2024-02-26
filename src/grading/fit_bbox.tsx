export default function fit_bbox(inputCoords: number[][][], targetCoords: number[][][]): [number[][][], number[][][], number] {
    const inputBbox = [
      inputCoords[0][0][0], 
      inputCoords[0][0][1], 
      inputCoords[0][0][0], 
      inputCoords[0][0][1]
    ];
    const targetBbox = [
      targetCoords[0][0][0], 
      targetCoords[0][0][1], 
      targetCoords[0][0][0], 
      targetCoords[0][0][1]
    ];
    var i, j, k;
    for (i = 0; i < inputCoords.length; i++) {
      for (j = 0; j < inputCoords[i].length; j++) {
        for (k = 0; k < inputCoords[i][j].length; k++) {
          if (inputCoords[i][j][k] < inputBbox[k]) {
            inputBbox[k] = inputCoords[i][j][k];
          }
          if (inputCoords[i][j][k] > inputBbox[k + 2]) {
            inputBbox[k + 2] = inputCoords[i][j][k];
          }
        }
      }
    }
    for (i = 0; i < targetCoords.length; i++) {
      for (j = 0; j < targetCoords[i].length; j++) {
        for (k = 0; k < targetCoords[i][j].length; k++) {
          if (targetCoords[i][j][k] < targetBbox[k]) {
            targetBbox[k] = targetCoords[i][j][k];
          }
          if (targetCoords[i][j][k] > targetBbox[k + 2]) {
            targetBbox[k + 2] = targetCoords[i][j][k];
          }
        }
      }
    }
    const targetWidth = targetBbox[2] - targetBbox[0];
    const targetHeight = targetBbox[3] - targetBbox[1];
    const inputWidth = inputBbox[2] - inputBbox[0];
    const inputHeight = inputBbox[3] - inputBbox[1];
    const widthScale = targetWidth / inputWidth;
    const heightScale = targetHeight / inputHeight;
    const aspectWarp = widthScale / heightScale;
  
    for (i = 0; i < inputCoords.length; i++) {
      for (j = 0; j < inputCoords[i].length; j++) {
        for (k = 0; k < inputCoords[i][j].length; k++) {
          inputCoords[i][j][k] -= inputBbox[k];
          k === 0 ? inputCoords[i][j][k] *= widthScale : inputCoords[i][j][k] *= heightScale;
        }
      }
    }
    for (i = 0; i < targetCoords.length; i++) {
      for (j = 0; j < targetCoords[i].length; j++) {
        for (k = 0; k < targetCoords[i][j].length; k++) {
          targetCoords[i][j][k] -= targetBbox[k];
        }
      }
    }
  
    return [inputCoords, targetCoords, aspectWarp];
  }