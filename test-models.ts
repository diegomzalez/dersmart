import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('GOOGLE_API_KEY not found in environment');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Note: listModels is on the genAI instance or model manager depending on SDK version
        // In @google/generative-ai, it might not be directly exposed easily in the main class in older versions,
        // but let's try via the model manager if available or just hit the REST endpoint if needed.
        // Actually, for the JS SDK, we might just try a known working model "gemini-pro" first if inspection is hard.
        // But let's try to just check if `gemini-1.5-flash` works with a simple prompt script.

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        console.log('gemini-1.5-flash works:', result.response.text());
    } catch (error) {
        console.error('gemini-1.5-flash failed:', error.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
        const result = await model.generateContent('Hello');
        console.log('gemini-1.5-flash-001 works:', result.response.text());
    } catch (error) {
        console.error('gemini-1.5-flash-001 failed:', error.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
        const result = await model.generateContent('Hello');
        console.log('gemini-1.5-pro-latest works:', result.response.text());
    } catch (error) {
        console.error('gemini-1.5-pro-latest failed:', error.message);
    }
}

listModels();
