import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

if (!env.GOOGLE_API_KEY) {
	console.warn('GOOGLE_API_KEY is not set in .env');
}

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY || '');

// ISIC-standard diagnosis taxonomy (aligned with ISIC 2024 challenge labels)
const ISIC_DIAGNOSES = [
	'Benign',
	'Melanoma',
	'Basal Cell Carcinoma',
	'Squamous Cell Carcinoma',
	'Actinic Keratosis',
	'Seborrheic Keratosis',
	'Nevus',
	'Dermatofibroma',
	'Vascular Lesion',
	'Lentigo',
	'Other'
] as const;

const SYSTEM_INSTRUCTION = `You are a board-certified dermatologist with 20+ years of clinical experience in dermoscopy and skin cancer diagnosis, trained on the ISIC (International Skin Imaging Collaboration) classification system.

Your clinical approach:
- When uncertain between a benign and a malignant diagnosis, always err toward the malignant option — missing a skin cancer is far more dangerous than a false positive.
- Weigh clinical metadata (age, sex, anatomical site, lesion size, image type) equally alongside visual features.
- TBP tile images are captured by a 3D total body photography camera — they are NOT dermoscopic. They lack arborizing vessels, blue-grey ovoid nests, milia-like cysts, and other dermoscopic structures. Confidence must be lower for TBP tiles and you must flag this limitation in imageTypeNote.
- Dermoscopic images allow full pattern analysis — apply ABCDE criteria, three-point checklist, and dermoscopic structure identification.
- Always provide 2 differential diagnoses to support clinical decision-making.
- Your output is reviewed by a trained dermatologist — be clinically precise and honest about uncertainty.`;

const model = genAI.getGenerativeModel({
	model: 'gemini-3-pro-preview',
	systemInstruction: SYSTEM_INSTRUCTION,
	generationConfig: {
		responseMimeType: 'application/json',
		responseSchema: {
			type: SchemaType.OBJECT,
			properties: {
				diagnosis: {
					type: SchemaType.STRING,
					format: 'enum',
					enum: ISIC_DIAGNOSES as unknown as string[]
				} as any,
				confidence: { type: SchemaType.NUMBER },
				riskLevel: {
					type: SchemaType.STRING,
					enum: ['Low', 'Medium', 'High']
				} as any,
				recommendation: { type: SchemaType.STRING },
				reasoning: { type: SchemaType.STRING },
				imageTypeNote: { type: SchemaType.STRING },
				differentials: {
					type: SchemaType.ARRAY,
					items: {
						type: SchemaType.OBJECT,
						properties: {
							diagnosis: {
								type: SchemaType.STRING,
								format: 'enum',
								enum: ISIC_DIAGNOSES as unknown as string[]
							} as any,
							confidence: { type: SchemaType.NUMBER }
						},
						required: ['diagnosis', 'confidence']
					}
				}
			},
			required: [
				'diagnosis',
				'confidence',
				'riskLevel',
				'recommendation',
				'reasoning',
				'differentials'
			]
		}
	}
});

export interface ImageMetadata {
	patientId?: string | null;
	ageApprox?: number | null;
	sex?: string | null;
	anatomSiteGeneral?: string | null;
	clinSizeLongDiamMm?: number | null;
	imageType?: string | null;
}

function buildImageTypeGuidance(imageType: string | null | undefined): string {
	if (imageType === 'TBP tile: close-up') {
		return `\n\nIMAGE TYPE — TBP tile (close-up): This is NOT a dermoscopic image. Classic dermoscopic features are absent. Be especially vigilant for Basal Cell Carcinoma and Melanoma, which can appear subtle or atypical in this modality. Set imageTypeNote to explain how this limits diagnostic certainty.`;
	}
	if (imageType === 'dermoscopic') {
		return `\n\nIMAGE TYPE — Dermoscopic: Apply full dermoscopic analysis: ABCDE rule, pigment network, regression structures, vascular patterns, blue-white veil, and any specific dermoscopic clues.`;
	}
	if (imageType === 'clinical') {
		return `\n\nIMAGE TYPE — Clinical photo: Macroscopic features only. Analyze color, border irregularity, surface texture, and asymmetry without dermoscopic detail.`;
	}
	return '';
}

function buildRiskSignals(metadata: ImageMetadata): string {
	const signals: string[] = [];

	if (metadata.ageApprox && metadata.ageApprox >= 60) {
		signals.push(`Age ${metadata.ageApprox} — elevated malignancy risk`);
	}
	if (metadata.anatomSiteGeneral === 'head/neck') {
		signals.push('Head/neck — high cumulative UV exposure, primary site for BCC and SCC');
	}
	if (metadata.anatomSiteGeneral === 'lower extremity' && metadata.sex === 'female') {
		signals.push('Lower extremity in female — classic anatomical site for Melanoma');
	}
	if (
		['anterior torso', 'posterior torso'].includes(metadata.anatomSiteGeneral ?? '') &&
		metadata.sex === 'male'
	) {
		signals.push('Truncal site in male — elevated Melanoma risk');
	}
	if (metadata.clinSizeLongDiamMm && metadata.clinSizeLongDiamMm >= 6) {
		signals.push(`Diameter ${metadata.clinSizeLongDiamMm} mm — meets ABCDE "D" criterion (≥ 6 mm)`);
	}

	return signals.length > 0
		? `\n\nClinical risk signals:\n${signals.map((s) => `⚠ ${s}`).join('\n')}`
		: '';
}

export const analyzeImage = async (
	imageBuffer: Buffer,
	mimeType: string,
	metadata?: ImageMetadata
) => {
	try {
		const clinicalContext: string[] = [];
		if (metadata?.ageApprox) clinicalContext.push(`Patient age: ~${metadata.ageApprox} years`);
		if (metadata?.sex) clinicalContext.push(`Sex: ${metadata.sex}`);
		if (metadata?.anatomSiteGeneral)
			clinicalContext.push(`Anatomical site: ${metadata.anatomSiteGeneral}`);
		if (metadata?.clinSizeLongDiamMm)
			clinicalContext.push(`Lesion longest diameter: ${metadata.clinSizeLongDiamMm} mm`);
		if (metadata?.imageType) clinicalContext.push(`Image type: ${metadata.imageType}`);

		const contextBlock =
			clinicalContext.length > 0
				? `\n\nClinical context:\n${clinicalContext.map((c) => `- ${c}`).join('\n')}`
				: '';

		const imageTypeGuidance = buildImageTypeGuidance(metadata?.imageType);
		const riskSignals = metadata ? buildRiskSignals(metadata) : '';

		const prompt = `Analyze this dermatological image following the ISIC (International Skin Imaging Collaboration) standard.

Classify the lesion as one of: ${ISIC_DIAGNOSES.join(', ')}.

Return:
- diagnosis: primary ISIC label
- confidence: 0–1 score for the primary diagnosis
- riskLevel: Low | Medium | High (when uncertain, prefer higher)
- recommendation: specific clinical action for the treating physician
- reasoning: concise clinical rationale referencing visual features and metadata
- differentials: exactly 2 alternative diagnoses with their individual confidence scores
- imageTypeNote: note about how image modality affects diagnostic certainty (required for TBP tiles; omit or leave empty for dermoscopic)${contextBlock}${riskSignals}${imageTypeGuidance}`;

		const result = await model.generateContent([
			prompt,
			{ inlineData: { data: imageBuffer.toString('base64'), mimeType } }
		]);

		return JSON.parse(result.response.text());
	} catch (error) {
		console.error('AI Analysis failed:', error);
		throw new Error('Failed to analyze image with AI');
	}
};
