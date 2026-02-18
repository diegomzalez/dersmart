import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { analyzeImage } from '$lib/server/ai';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getLocale } from '$lib/paraglide/runtime';

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
            const relativeUrl = image.url; // e.g., /uploads/filename.jpg
            const fileName = relativeUrl.split('/').pop()!;
            const filePath = join(process.cwd(), 'data', 'uploads', fileName);
            const fileBuffer = await readFile(filePath);

            // Determine mime type (basic check or default to jpeg)
            const mimeType = relativeUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';

            const diagnosisResult = await analyzeImage(fileBuffer, mimeType, {
                patientId: image.patientId,
                ageApprox: image.ageApprox,
                sex: image.sex,
                anatomSiteGeneral: image.anatomSiteGeneral,
                clinSizeLongDiamMm: image.clinSizeLongDiamMm,
                imageType: image.imageType
            }, getLocale());

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
