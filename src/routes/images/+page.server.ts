import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export const load = async () => {
    const allImages = await db.select().from(images).orderBy(images.createdAt);
    return { images: allImages };
};

export const actions = {
    upload: async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const patientId = formData.get('patientId') as string;
        const bodySite = formData.get('bodySite') as string;
        const modality = formData.get('modality') as string;

        if (!file || file.size === 0) {
            return fail(400, { missing: true });
        }

        const buffer = await file.arrayBuffer();
        const fileName = `${randomUUID()}-${file.name}`;
        const uploadPath = join(process.cwd(), 'static', 'uploads', fileName);

        try {
            await writeFile(uploadPath, Buffer.from(buffer));

            await db.insert(images).values({
                url: `/uploads/${fileName}`,
                patientId,
                bodySite,
                modality
            });

            return { success: true };
        } catch (error) {
            console.error('Upload failed:', error);
            return fail(500, { uploadFailed: true });
        }
    }
};
