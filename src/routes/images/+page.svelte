<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';

	let { data, form } = $props();

	let uploading = $state(false);
	let fileName = $state('');
	let showUpload = $state(false);
	let searchQuery = $state('');

	let filteredImages = $derived(
		data.images.filter((img) => {
			const query = searchQuery.toLowerCase();
			if (!query) return true;

			const patientMatch = img.patientId?.toLowerCase().includes(query);
			const siteMatch = img.anatomSiteGeneral?.toLowerCase().includes(query);
			const typeMatch = img.imageType?.toLowerCase().includes(query);
			const sexMatch = img.sex?.toLowerCase().includes(query);

			let diagnosisMatch = false;
			const diagnosis = safeParseAiDiagnosis(img.aiDiagnosis);
			if (diagnosis && diagnosis.primary_diagnosis) {
				diagnosisMatch = diagnosis.primary_diagnosis.toLowerCase().includes(query);
			}

			return patientMatch || siteMatch || typeMatch || sexMatch || diagnosisMatch;
		})
	);

	const anatomSites = [
		'anterior torso',
		'posterior torso',
		'head/neck',
		'lower extremity',
		'upper extremity',
		'palms/soles',
		'oral/genital'
	];

	const imageTypes = ['dermoscopic', 'clinical', 'TBP tile: close-up'];

	function riskColors(risk: string | undefined) {
		if (risk === 'High') return 'bg-rose-100 text-rose-700 ring-rose-200';
		if (risk === 'Medium') return 'bg-amber-100 text-amber-700 ring-amber-200';
		return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
	}

	function safeParseAiDiagnosis(raw: string | null) {
		try {
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}
</script>

<svelte:head>
	<title>DerSmart — {m.images_title()}</title>
</svelte:head>

<!-- Page header -->
<div class="animate-fade-up mb-6 flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">{m.images_title()}</h1>
		<p class="mt-0.5 text-sm text-slate-500">
			{data.images.length}
			{data.images.length !== 1 ? 'cases' : 'case'} · {m.images_isic_metadata()}
		</p>
	</div>
	<div class="flex items-center gap-3">
		<a
			href="https://api.isic-archive.com/collections/390/"
			target="_blank"
			class="hidden items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-700 sm:inline-flex"
		>
			<svg
				class="h-3.5 w-3.5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
			{m.images_archive_link()}
		</a>
		<button
			onclick={() => (showUpload = !showUpload)}
			class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-teal-700 active:scale-95"
		>
			<svg
				class="h-4 w-4 transition-transform duration-200 {showUpload ? 'rotate-45' : ''}"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
			</svg>
			{showUpload ? m.images_cancel() : m.images_new_case()}
		</button>
	</div>
</div>

<!-- Search Bar -->
<div class="mb-6 animate-fade-up">
	<div class="relative max-w-md">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<svg
				class="h-4 w-4 text-slate-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			placeholder={m.images_search_placeholder()}
			class="block w-full rounded-lg border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500 transition-colors duration-150"
		/>
	</div>
</div>

<!-- Upload panel (collapsible) -->
{#if showUpload}
	<div transition:slide={{ duration: 250 }} class="mb-8">
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
				<svg
					class="h-4 w-4 text-teal-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
				{m.images_upload_title()}
			</h2>

			{#if form?.success}
				<div
					class="animate-fade-up mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
				>
					<svg
						class="h-4 w-4 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					{m.images_upload_success()}
				</div>
			{/if}

			<form
				method="POST"
				action="?/upload"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploading = true;
					return async ({ update }) => {
						await update();
						uploading = false;
						fileName = '';
						if (form?.success) showUpload = false;
					};
				}}
				class="space-y-5"
			>
				<!-- Row 1: Patient metadata -->
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<div>
						<label for="patientId" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_patient_id()}</label
						>
						<input
							type="text"
							name="patientId"
							id="patientId"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
							placeholder="IP_1234567"
						/>
					</div>
					<div>
						<label for="ageApprox" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_age_approx()}</label
						>
						<input
							type="number"
							name="ageApprox"
							id="ageApprox"
							min="0"
							max="120"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
							placeholder="55"
						/>
					</div>
					<div>
						<label for="sex" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_sex()}</label
						>
						<select
							id="sex"
							name="sex"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
						>
							<option value="">{m.images_sex_unknown()}</option>
							<option value="male">{m.images_sex_male()}</option>
							<option value="female">{m.images_sex_female()}</option>
						</select>
					</div>
					<div>
						<label for="clinSizeLongDiamMm" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_lesion_size()}</label
						>
						<input
							type="number"
							name="clinSizeLongDiamMm"
							id="clinSizeLongDiamMm"
							min="0"
							step="0.01"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
							placeholder="3.50"
						/>
					</div>
				</div>

				<!-- Row 2: Image metadata -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="anatomSiteGeneral" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_anatomical_site()}</label
						>
						<select
							id="anatomSiteGeneral"
							name="anatomSiteGeneral"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
						>
							<option value="">{m.images_site_placeholder()}</option>
							{#each anatomSites as site}
								<option value={site}>{site}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="imageType" class="mb-1 block text-xs font-medium text-slate-600"
							>{m.images_image_type()}</label
						>
						<select
							id="imageType"
							name="imageType"
							class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
						>
							{#each imageTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- File drop zone -->
				<div>
					<label for="file" class="mb-1 block text-xs font-medium text-slate-600"
						>{m.images_file_label()}</label
					>
					<label
						for="file"
						class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors duration-150 hover:border-teal-400 hover:bg-teal-50/50"
					>
						<svg
							class="h-8 w-8 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
							/>
						</svg>
						{#if fileName}
							<span class="text-sm font-medium text-teal-700">{fileName}</span>
						{:else}
							<span class="text-sm text-slate-500">
								<span class="font-medium text-teal-600">{m.images_file_hint()}</span>
								{m.images_file_drop()}
							</span>
							<span class="text-xs text-slate-400">{m.images_file_formats()}</span>
						{/if}
						<input
							id="file"
							name="file"
							type="file"
							class="sr-only"
							accept="image/*"
							required
							onchange={(e) => {
								const files = e.currentTarget.files;
								if (files && files.length > 0) fileName = files[0].name;
							}}
						/>
					</label>
				</div>

				<div class="flex justify-end pt-1">
					<button
						type="submit"
						disabled={uploading}
						class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if uploading}
							<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								></path>
							</svg>
							{m.images_uploading()}
						{:else}
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							{m.images_save_case()}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Gallery grid -->
{#if filteredImages.length === 0}
	{#if searchQuery}
		<div class="animate-fade-up flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
			<div class="mb-3 rounded-full bg-slate-100 p-3 ring-1 ring-slate-200">
				<svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<h3 class="mt-2 text-sm font-medium text-slate-900">No results found</h3>
			<p class="mt-1 text-sm text-slate-500">
				No images match "{searchQuery}".
			</p>
		</div>
	{:else}
		<div
			class="animate-fade-up flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center"
		>
			<svg
				class="mb-3 h-12 w-12 text-slate-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
				/>
			</svg>
			<p class="font-medium text-slate-500">{m.images_no_cases()}</p>
			<p class="mt-1 text-sm text-slate-400">
				{m.images_no_cases_hint()}
				<button onclick={() => (showUpload = true)} class="font-medium text-teal-600 hover:text-teal-500 hover:underline">
					{m.images_new_case()}
				</button>
				{m.images_no_cases_hint2()}
			</p>
		</div>
	{/if}
{:else}
	<div
		class="animate-fade-up grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		style="animation-delay:0.05s"
	>
		{#each filteredImages as image}
			{@const d = safeParseAiDiagnosis(image.aiDiagnosis)}
			<a
				href={localizeHref(`/diagnosis/${image.id}`)}
				class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
			>
				<!-- Image -->
				<div class="relative h-52 overflow-hidden bg-slate-100">
					<img
						src={image.url}
						alt={image.patientId ?? 'Dermatology case'}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					{#if d?.riskLevel}
						<span
							class="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 {riskColors(
								d.riskLevel
							)}"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
							{d.riskLevel}
						</span>
					{:else}
						<span
							class="absolute top-2.5 right-2.5 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200"
						>
							{m.images_status_pending()}
						</span>
					{/if}
				</div>
				<!-- Info -->
				<div class="flex flex-col gap-1.5 p-3">
					<p class="truncate text-sm font-semibold text-slate-800">
						{image.patientId || m.diagnosis_unknown_patient()}
					</p>
					<div class="flex flex-wrap gap-1.5">
						{#if image.ageApprox || image.sex}
							<span
								class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
							>
								{image.sex ? (image.sex === 'male' ? 'M' : 'F') : '?'} · {image.ageApprox
									? `~${image.ageApprox}y`
									: '?'}
							</span>
						{/if}
						{#if image.anatomSiteGeneral}
							<span
								class="inline-flex max-w-30 items-center truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
							>
								{image.anatomSiteGeneral}
							</span>
						{/if}
						{#if image.imageType}
							<span
								class="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs text-teal-700"
							>
								{image.imageType}
							</span>
						{/if}
					</div>
					{#if d?.diagnosis}
						<p class="mt-0.5 truncate text-xs font-medium text-slate-700">{d.diagnosis}</p>
					{/if}
				</div>
			</a>
		{/each}
	</div>
{/if}
