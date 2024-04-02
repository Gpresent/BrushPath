import { kanjiLabels } from './labels'; // Ensure this has at least as many elements as your predictions array

interface PredictionResult {
    label: string;
    probability: number;
}

export const processPredictions = (predictions: Float32Array | Int32Array | Uint8Array, topK: number = 5): PredictionResult[] => {
    // Map the predictions to an array of { label, probability }

    const predictionsArray = Array.from(predictions)
    const results: PredictionResult[] = predictionsArray.map((probability, index) => ({
        label: kanjiLabels[index], // Ensure kanjiLabels has a corresponding label for each prediction
        probability: probability * 100 // Convert to percentage
    }));

    // Sort the results by probability in descending order
    const sortedResults = results.sort((a, b) => b.probability - a.probability);

    // Return the top K results
    return sortedResults.slice(0, topK);
};