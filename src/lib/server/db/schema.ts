import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

// ISIC-aligned schema
// anatom_site_general values: 'anterior torso' | 'head/neck' | 'lower extremity' |
//   'oral/genital' | 'palms/soles' | 'posterior torso' | 'upper extremity'
// image_type values: 'TBP tile: close-up' | 'dermoscopic' | 'clinical'
// sex values: 'male' | 'female'
export const images = sqliteTable('images', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	url: text('url').notNull(),
	// Patient metadata
	patientId: text('patient_id'),
	ageApprox: integer('age_approx'),               // approximate patient age in years
	sex: text('sex'),                                // 'male' | 'female'
	// Lesion metadata
	anatomSiteGeneral: text('anatom_site_general'),  // ISIC standard anatomical site
	clinSizeLongDiamMm: real('clin_size_long_diam_mm'), // longest diameter in mm
	lesionId: text('lesion_id'),                     // optional lesion identifier
	// Image metadata
	imageType: text('image_type'),                   // ISIC image type
	// Diagnosis
	diagnosisStatus: text('diagnosis_status').default('pending'), // 'pending' | 'completed'
	diagnosisConfirmType: text('diagnosis_confirm_type'),          // confirmation method
	aiDiagnosis: text('ai_diagnosis'),               // JSON string of AI analysis result
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export * from './auth.schema';
