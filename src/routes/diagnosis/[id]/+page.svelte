<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { data, form } = $props();
	let analyzing = $state(false);

	let diagnosis = $derived(
		data.image.aiDiagnosis
			? (() => { try { return JSON.parse(data.image.aiDiagnosis!); } catch { return null; } })()
			: null
	);

	let confidenceWidth = $state(0);
	$effect(() => {
		if (diagnosis?.confidence != null) {
			const t = setTimeout(() => { confidenceWidth = diagnosis.confidence * 100; }, 300);
			return () => clearTimeout(t);
		} else {
			confidenceWidth = 0;
		}
	});

	function riskBadgeClass(risk: string) {
		if (risk === 'High')   return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200';
		if (risk === 'Medium') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
		return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
	}

	function riskBarClass(risk: string) {
		if (risk === 'High')   return 'bg-rose-500';
		if (risk === 'Medium') return 'bg-amber-500';
		return 'bg-emerald-500';
	}

	function capitalize(s: string | null | undefined) {
		if (!s) return '—';
		return s.charAt(0).toUpperCase() + s.slice(1);
	}
</script>

<svelte:head>
	<title>DerSmart — {m.diagnosis_patient_label()} {data.image.patientId ?? ''}</title>
</svelte:head>

<!-- Back nav -->
<div class="mb-5 animate-fade-up">
	<a href={localizeHref('/images')}
		class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors">
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
		{m.diagnosis_back()}
	</a>
</div>

<!-- Main 2-column layout -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-5 animate-fade-up" style="animation-delay:0.05s">

	<!-- LEFT: Image panel (2/5) -->
	<div class="lg:col-span-2 flex flex-col gap-4">

		<!-- Image card with scan overlay -->
		<div class="relative rounded-xl overflow-hidden bg-slate-900 shadow-md aspect-square">
			<img src={data.image.url} alt="Dermatology case"
				class="w-full h-full object-cover {analyzing ? 'opacity-80' : 'opacity-100'} transition-opacity duration-300" />

			{#if analyzing}
				<div class="absolute inset-0 bg-slate-900/30"></div>
				<div class="absolute left-0 right-0 h-0.75 animate-scan pointer-events-none"
					style="background: linear-gradient(90deg, transparent 0%, #2dd4bf 30%, #2dd4bf 70%, transparent 100%); box-shadow: 0 0 10px 3px rgba(45,212,191,0.5);">
				</div>
				<div class="absolute bottom-4 left-0 right-0 flex justify-center">
					<span class="inline-flex items-center gap-2 rounded-full bg-slate-900/70 backdrop-blur-sm px-4 py-2 text-xs font-medium text-teal-300">
						<svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						{m.diagnosis_analyzing()}
					</span>
				</div>
			{/if}

			<!-- Status badge -->
			<div class="absolute top-3 left-3">
				{#if data.image.diagnosisStatus === 'completed'}
					<span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
						<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						{m.diagnosis_status_completed()}
					</span>
				{:else}
					<span class="inline-flex items-center gap-1 rounded-full bg-slate-700/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-slate-300">
						<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
						{m.diagnosis_status_pending()}
					</span>
				{/if}
			</div>
		</div>

		<!-- ISIC metadata chips -->
		<div class="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
			<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{m.diagnosis_isic_metadata()}</p>
			<dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
				<div>
					<dt class="text-xs text-slate-400 mb-0.5">{m.diagnosis_image_type()}</dt>
					<dd class="font-medium text-slate-700">{data.image.imageType || '—'}</dd>
				</div>
				<div>
					<dt class="text-xs text-slate-400 mb-0.5">{m.diagnosis_lesion_size()}</dt>
					<dd class="font-medium text-slate-700">
						{data.image.clinSizeLongDiamMm != null ? `${data.image.clinSizeLongDiamMm} mm` : '—'}
					</dd>
				</div>
				<div>
					<dt class="text-xs text-slate-400 mb-0.5">{m.diagnosis_anatomical_site()}</dt>
					<dd class="font-medium text-slate-700 capitalize">{data.image.anatomSiteGeneral || '—'}</dd>
				</div>
				<div>
					<dt class="text-xs text-slate-400 mb-0.5">{m.diagnosis_lesion_id()}</dt>
					<dd class="font-medium text-slate-700 font-mono text-xs">{data.image.lesionId || '—'}</dd>
				</div>
			</dl>
		</div>
	</div>

	<!-- RIGHT: Data panel (3/5) -->
	<div class="lg:col-span-3 flex flex-col gap-4">

		<!-- Patient card -->
		<div class="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{m.diagnosis_patient_label()}</p>
					<h2 class="text-xl font-bold text-slate-800">{data.image.patientId || m.diagnosis_unknown_patient()}</h2>
					<div class="mt-2 flex flex-wrap gap-2">
						{#if data.image.sex}
							<span class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
								{capitalize(data.image.sex)}
							</span>
						{/if}
						{#if data.image.ageApprox}
							<span class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
								~{data.image.ageApprox} years
							</span>
						{/if}
						{#if data.image.anatomSiteGeneral}
							<span class="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 capitalize">
								{data.image.anatomSiteGeneral}
							</span>
						{/if}
					</div>
				</div>
				<div class="shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
					<svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- AI Result OR Action -->
		{#if diagnosis}
			<div class="rounded-xl bg-white border border-slate-200 shadow-sm p-5 animate-result-reveal">
				<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{m.diagnosis_ai_label()}</p>

				<!-- Image type warning -->
				{#if diagnosis.imageTypeNote}
					<div class="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
						<svg class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
						<div>
							<p class="text-xs font-semibold text-amber-700 mb-0.5">{m.diagnosis_image_type_note()}</p>
							<p class="text-xs text-amber-700 leading-relaxed">{diagnosis.imageTypeNote}</p>
						</div>
					</div>
				{/if}

				<!-- Primary diagnosis + risk -->
				<div class="flex items-start justify-between gap-3 mb-5">
					<div>
						<p class="text-xs text-slate-400 mb-1">{m.diagnosis_primary()}</p>
						<h3 class="text-2xl font-bold text-slate-900">{diagnosis.diagnosis}</h3>
					</div>
					<div class="text-right shrink-0">
						<p class="text-xs text-slate-400 mb-1">{m.diagnosis_risk()}</p>
						<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold {riskBadgeClass(diagnosis.riskLevel)}">
							<span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
							{diagnosis.riskLevel}
						</span>
					</div>
				</div>

				<!-- Confidence bar -->
				<div class="mb-5">
					<div class="flex items-center justify-between mb-1.5">
						<p class="text-xs text-slate-400">{m.diagnosis_confidence()}</p>
						<p class="text-xs font-bold font-mono text-slate-700">{(diagnosis.confidence * 100).toFixed(1)}%</p>
					</div>
					<div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full rounded-full transition-[width] duration-700 ease-out {riskBarClass(diagnosis.riskLevel)}"
							style="width: {confidenceWidth}%"></div>
					</div>
				</div>

				<!-- Differential Diagnoses -->
				{#if diagnosis.differentials?.length}
					<div class="mb-5">
						<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{m.diagnosis_differentials()}</p>
						<div class="flex flex-col gap-2">
							{#each diagnosis.differentials as diff}
								<div class="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5">
									<div class="flex items-center gap-2">
										<span class="text-xs text-slate-400">{m.diagnosis_also_consider()}</span>
										<span class="text-sm font-semibold text-slate-700">{diff.diagnosis}</span>
									</div>
									<span class="text-xs font-bold font-mono text-slate-500">{(diff.confidence * 100).toFixed(1)}%</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Detailed Analysis -->
				{#if diagnosis.reasoning}
					<div class="rounded-lg bg-slate-50 border border-slate-100 p-4 mb-4">
						<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{m.diagnosis_detailed_analysis()}</p>
						<p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{diagnosis.reasoning}</p>
					</div>
				{/if}

				<!-- Recommendation -->
				<div class="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
					<p class="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">{m.diagnosis_recommendation()}</p>
					<p class="text-sm text-indigo-900 leading-relaxed font-medium">{diagnosis.recommendation}</p>
				</div>

				<p class="mt-3 text-xs text-slate-400 text-center">{m.diagnosis_isic_note()}</p>
			</div>

		{:else}
			<div class="rounded-xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-4">
				<div class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
					<svg class="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
					</svg>
				</div>
				<div>
					<h3 class="text-base font-semibold text-slate-800">{m.diagnosis_none_title()}</h3>
					<p class="mt-1 text-sm text-slate-500 max-w-xs">{m.diagnosis_none_desc()}</p>
				</div>
				<form method="POST" action="?/analyze"
					use:enhance={() => {
						analyzing = true;
						return async ({ update }) => {
							await update();
							analyzing = false;
						};
					}}>
					<button type="submit" disabled={analyzing}
						class="inline-flex items-center gap-2.5 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed">
						{#if analyzing}
							<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							{m.diagnosis_analyzing()}
						{:else}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
							{m.diagnosis_run_button()}
						{/if}
					</button>
				</form>
				<p class="text-xs text-slate-400">{m.diagnosis_context_note()}</p>
			</div>

			{#if form?.diagnosisFailed}
				<div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-up">
					{m.diagnosis_failed()}
				</div>
			{/if}
		{/if}
	</div>
</div>
