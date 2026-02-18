import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const images = sqliteTable('images', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	url: text('url').notNull(),
	patientId: text('patient_id'),
	bodySite: text('body_site'),
	modality: text('modality'), // 'dermatoscopic', 'clinical'
	diagnosisStatus: text('diagnosis_status').default('pending'), // 'pending', 'processing', 'completed'
	aiDiagnosis: text('ai_diagnosis'), // JSON string
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export * from './auth.schema';
