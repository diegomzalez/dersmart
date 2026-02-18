<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>DerSmart — {m.nav_dashboard()}</title>
</svelte:head>

<!-- Welcome banner -->
<div class="mb-8 animate-fade-up">
	<h1 class="text-2xl font-bold text-slate-800">{m.dashboard_greeting()}</h1>
	<p class="mt-1 text-sm text-slate-500">{m.dashboard_subtitle()}</p>
</div>

<!-- Quick action cards -->
<div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10 animate-fade-up" style="animation-delay:0.05s">

	<a href={localizeHref('/images')}
		class="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200">
		<div class="flex items-start gap-4">
			<div class="shrink-0 w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
				<svg class="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
			<div>
				<p class="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">{m.dashboard_image_bank_label()}</p>
				<p class="text-slate-800 font-semibold">{m.dashboard_manage_cases()}</p>
				<p class="mt-1 text-sm text-slate-500">{m.dashboard_manage_cases_desc()}</p>
			</div>
		</div>
		<svg class="absolute bottom-4 right-4 w-5 h-5 text-slate-300 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</a>

	<a href={localizeHref('/images')}
		class="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200">
		<div class="flex items-start gap-4">
			<div class="shrink-0 w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
				<svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
				</svg>
			</div>
			<div>
				<p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">{m.dashboard_ai_label()}</p>
				<p class="text-slate-800 font-semibold">{m.dashboard_run_analysis()}</p>
				<p class="mt-1 text-sm text-slate-500">{m.dashboard_run_analysis_desc()}</p>
			</div>
		</div>
		<svg class="absolute bottom-4 right-4 w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</a>

	<a href="https://api.isic-archive.com/collections/390/" target="_blank"
		class="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-200">
		<div class="flex items-start gap-4">
			<div class="shrink-0 w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
				<svg class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
			</div>
			<div>
				<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{m.dashboard_reference_label()}</p>
				<p class="text-slate-800 font-semibold">{m.dashboard_isic_archive()}</p>
				<p class="mt-1 text-sm text-slate-500">{m.dashboard_isic_archive_desc()}</p>
			</div>
		</div>
		<svg class="absolute bottom-4 right-4 w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
		</svg>
	</a>
</div>

<!-- Info strip -->
<div class="rounded-xl border border-teal-100 bg-teal-50 px-6 py-4 flex items-start gap-3 animate-fade-up" style="animation-delay:0.1s">
	<svg class="w-5 h-5 text-teal-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	<p class="text-sm text-teal-800">
		<span class="font-semibold">{m.dashboard_isic_aligned()}</span>
		{m.dashboard_isic_note()}
	</p>
</div>
