CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`patient_id` text,
	`body_site` text,
	`modality` text,
	`diagnosis_status` text DEFAULT 'pending',
	`ai_diagnosis` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`priority` integer DEFAULT 1 NOT NULL
);
