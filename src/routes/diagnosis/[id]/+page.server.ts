import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { analyzeImage } from '$lib/server/ai';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const load = async ({ params }: RequestEvent) => {
    const imageId = params.id;
    if (!imageId) throw new Error('Image ID is required');

    const image = await db.select().from(images).where(eq(images.id, imageId)).get();

    if (!image) {
        throw new Error('Image not found');
    }

    return { image };
};

export const actions = {
    analyze: async ({ params }: RequestEvent) => {
        const imageId = params.id;
        if (!imageId) return fail(400, { missing: true });

        const image = await db.select().from(images).where(eq(images.id, imageId)).get();
        if (!image) return fail(404, { notFound: true });

        // Real AI Analysis
        try {
            // Read file from disk
            // Note: In a production app, we might want to store this in S3/Blob storage
            // For this demo, we read from the local static uploads folder
            const relativeUrl = image.url; // e.g., /uploads/filename.jpg
            // Remove leading slash if present for path joining
            const cleanUrl = relativeUrl.startsWith('/') ? relativeUrl.slice(1) : relativeUrl;

            const filePath = join(process.cwd(), 'static', cleanUrl);
            const fileBuffer = await readFile(filePath);

            // Determine mime type (basic check or default to jpeg)
            const mimeType = relativeUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';

            const diagnosisResult = await analyzeImage(fileBuffer, mimeType);

            await db.update(images)
                .set({
                    diagnosisStatus: 'completed',
                    aiDiagnosis: JSON.stringify(diagnosisResult)
                })
                .where(eq(images.id, imageId));

            return { success: true };
        } catch (error) {
            console.error('Diagnosis error:', error);
            return fail(500, { diagnosisFailed: true });
        }
    }
};
