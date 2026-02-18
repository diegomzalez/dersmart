<script lang="ts">
	import { page } from '$app/state';
	import { building } from '$app/environment';
	import { getLocale, localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const navLinks = [
		{ href: '/', labelFn: () => m.nav_dashboard(), exact: true },
		{ href: '/images', labelFn: () => m.nav_image_bank(), exact: false }
	];

	let canonicalPath = $derived(deLocalizeHref(page.url.pathname + (building ? '' : page.url.search)));
	let currentLocale = $derived(getLocale());
	let enHref = $derived(localizeHref(canonicalPath, { locale: 'en' }));
	let esHref = $derived(localizeHref(canonicalPath, { locale: 'es' }));
</script>

<header class="bg-slate-900 border-b border-slate-800 shadow-lg">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">

			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div class="flex items-center justify-center w-9 h-9 bg-teal-500 rounded-lg shadow-md">
					<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="5" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M11 8v3l2 2m5.657 2.343l-2.829-2.829M21 21l-4-4" />
					</svg>
				</div>
				<div class="flex items-center gap-2">
					<a href={localizeHref('/')} class="text-white font-bold text-xl tracking-tight">
						Der<span class="text-teal-400">Smart</span>
					</a>
					<span class="hidden sm:block text-slate-500 text-[10px] font-medium border border-slate-700 rounded px-1.5 py-0.5 uppercase tracking-wider">
						AI
					</span>
				</div>
			</div>

			<!-- Nav -->
			<nav class="flex items-center gap-1">
				{#each navLinks as link}
					{@const isActive = link.exact
						? page.url.pathname === '/' || page.url.pathname === '/es' || page.url.pathname === '/es/'
						: page.url.pathname.includes('/images')}
					<a
						href={localizeHref(link.href)}
						class="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-150
							{isActive
								? 'text-teal-400 bg-slate-800'
								: 'text-slate-400 hover:text-white hover:bg-slate-800'}"
					>
						{link.labelFn()}
						{#if isActive}
							<span class="absolute bottom-0 left-3 right-3 h-[2px] bg-teal-500 rounded-full"></span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Right: locale switcher + status + avatar -->
			<div class="flex items-center gap-3">

				<!-- Language switcher -->
				<div class="flex items-center rounded-lg overflow-hidden border border-slate-700 text-xs font-semibold">
					<a href={enHref} data-sveltekit-reload
						class="px-2.5 py-1.5 transition-colors duration-100
							{currentLocale === 'en' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
						EN
					</a>
					<span class="w-px h-4 bg-slate-700"></span>
					<a href={esHref} data-sveltekit-reload
						class="px-2.5 py-1.5 transition-colors duration-100
							{currentLocale === 'es' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
						ES
					</a>
				</div>

				<!-- Online indicator -->
				<div class="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
					{m.nav_online()}
				</div>

				<!-- Doctor avatar -->
				<div class="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center ring-2 ring-slate-600">
					<svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
			</div>

		</div>
	</div>
</header>
