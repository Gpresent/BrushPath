import * as tf from '@tensorflow/tfjs';
import { processPredictions } from './predictionDisplay'; // Adjust path as needed

const MODEL_PATH = 'model/model.json';
const inputSize = { width: 64, height: 64 };


//Could possibly get DOCUMENT  Element instead of Image URL will try later 
export const interpretImage = async (imageDataUrl: string) => {
    const model = await tf.loadGraphModel(MODEL_PATH);

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageDataUrl;




    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = inputSize.width;
    canvas.height = inputSize.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Unable to get canvas context');
        return;
    }

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, inputSize.width, inputSize.height);


    let tensor = tf.browser.fromPixels(canvas)
        .toFloat()
        .div(tf.scalar(255));

    tensor = tensor.mean(2).expandDims(2).expandDims();




    //console.log(tensor.shape)
    //Start prediciton 
    const prediction = model.predict(tensor) as tf.Tensor;

    // Get prediction data
    const predictionData = await prediction.data();
    //console.log(predictionData);

    // Assuming generatePredictions is implemented elsewhere
    const result = processPredictions(predictionData);
    //console.log(result);

    tensor.dispose();
    prediction.dispose();

    return result;
};