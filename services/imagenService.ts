
import { GoogleGenAI } from "@google/genai";
import { IMAGEN_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set for Imagen service.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  const client = getAiClient();
  // Base prompt enhancement can be minimal if problem-specific prompts are good
  const enhancedPrompt = `${prompt}, museum setting, educational illustration style.`; 

  try {
    const response = await client.models.generateImages({
      model: IMAGEN_MODEL_NAME,
      prompt: enhancedPrompt, // Use the prompt directly from MathProblem or enhanced
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    console.warn("Imagen response did not contain image data.");
    return null;
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
    // Return null on error, game can proceed with a placeholder or message
    return null; 
  }
};
