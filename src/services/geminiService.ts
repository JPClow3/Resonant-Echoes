import { GoogleGenAI } from "@google/genai";
import { 
    GEMINI_NARRATIVE_MODEL, IMAGEN_IMAGE_MODEL, VEO_VIDEO_MODEL,
    CORE_SYSTEM_INSTRUCTION, PLACEHOLDER_IMAGE_URL, INTRO_VIDEO_PROMPT, 
    HOME_SCREEN_IMAGE_PROMPT 
} from "../data/prompts";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getApiErrorMessage = (error: any, t: (key: string) => string): string => {
    const errorMessage = (error?.message || String(error)).toLowerCase();
    if (errorMessage.includes('api key')) {
        return t("ERROR_API_KEY_MISSING");
    }
    if (errorMessage.includes('network') || errorMessage.includes('failed to fetch')) {
        return t("ERROR_NETWORK_FAILURE");
    }
    return t("ERROR_GENERIC_API_FAILURE");
};

export async function* generateContentStream(prompt: string) {
    if (!API_KEY) throw new Error("API Key is missing.");
    const response = await ai.models.generateContentStream({
        model: GEMINI_NARRATIVE_MODEL,
        contents: prompt,
        config: {
            systemInstruction: CORE_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json'
        },
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
}

export async function generateContent(prompt: string): Promise<string> {
    if (!API_KEY) throw new Error("API Key is missing.");
    const response = await ai.models.generateContent({
        model: GEMINI_NARRATIVE_MODEL,
        contents: prompt,
    });
    return response.text;
}

export async function generateImage(prompt: string): Promise<string> {
    if (!API_KEY) return PLACEHOLDER_IMAGE_URL;
    try {
        const response = await ai.models.generateImages({
            model: IMAGEN_IMAGE_MODEL,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg'
            }
        });
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        return PLACEHOLDER_IMAGE_URL;
    }
}

export const generateHomeScreenImage = () => generateImage(HOME_SCREEN_IMAGE_PROMPT);

export async function generateIntroVideo(updateLoadingMessage: (message: string) => void, t: (key: string) => string): Promise<string> {
    if (!API_KEY) throw new Error("API Key is missing for video generation.");

    let operation = await ai.models.generateVideos({
        model: VEO_VIDEO_MODEL,
        prompt: INTRO_VIDEO_PROMPT,
        config: { numberOfVideos: 1 }
    });
    
    const loadingMessages = [
        t('Weaving threads of light...'),
        t('Gathering distant memories...'),
        t('The vision nears completion...'),
        t('Just a few moments more...'),
    ];
    let messageIndex = 0;

    while (!operation.done) {
        updateLoadingMessage(loadingMessages[messageIndex % loadingMessages.length]);
        messageIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        return `${downloadLink}&key=${API_KEY}`;
    } else {
        throw new Error("Video generation completed but no video URI was found.");
    }
}
