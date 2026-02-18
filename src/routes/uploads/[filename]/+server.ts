import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const MIME_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
};

const UPLOADS_DIR = join(process.cwd(), 'data', 'uploads');

export const GET = async ({ params }) => {
	const { filename } = params;

	if (!filename || filename.includes('..') || filename.includes('/')) {
		throw error(400, 'Invalid filename');
	}

	const filePath = join(UPLOADS_DIR, filename);

	try {
		const fileBuffer = await readFile(filePath);
		const ext = extname(filename).toLowerCase();
		const contentType = MIME_TYPES[ext] || 'application/octet-stream';

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch {
		throw error(404, 'Image not found');
	}
};
