import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

if (!env.GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY is not set in .env');
}

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                condition: { type: SchemaType.STRING },
                confidence: { type: SchemaType.NUMBER },
                riskLevel: { type: SchemaType.STRING, enum: ['Low', 'Medium', 'High'] } as any,
                recommendation: { type: SchemaType.STRING }
            },
            required: ['condition', 'confidence', 'riskLevel', 'recommendation']
        }
    }
});

export const analyzeImage = async (imageBuffer: Buffer, mimeType: string) => {
    try {
        const prompt =
            'Analyze this dermatological image. Identify the visible skin condition, provide a confidence score (0-1), assess the risk level, and suggest a recommendation for the patient or doctor. Return the result in JSON format.';

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType
                }
            }
        ]);

        return JSON.parse(result.response.text());
    } catch (error) {
        console.error('AI Analysis failed:', error);
        throw new Error('Failed to analyze image with AI');
    }
};
