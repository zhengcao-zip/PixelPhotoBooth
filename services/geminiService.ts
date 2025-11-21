import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a nostalgic caption based on the photostrip image.
 * @param base64Image The base64 string of the full photostrip (without prefix).
 * @returns A string containing the caption.
 */
export const generatePhotoStripCaption = async (base64Image: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are the internal computer of a vintage 1980s photobooth. 
      Analyze this photo strip. 
      Generate a very short, nostalgic, quirky, or slightly cryptic "memory log" caption for it.
      Keep it under 10 words. 
      Do not use quotes. 
      Example: "Friends forever. 1985." or "Suspicious activity detected." or "Pure joy captured."
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return response.text?.trim() || "Memory Corrupted. [Error 404]";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "System Offline. Date Unknown.";
  }
};