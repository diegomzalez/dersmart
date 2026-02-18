<script lang="ts">
	import { page } from '$app/state';
	import { building } from '$app/environment';
	import { getLocale, localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const navLinks = [
		{ href: '/', labelFn: () => m.nav_dashboard(), exact: true },
		{ href: '/images', labelFn: () => m.nav_image_bank(), exact: false }
	];

	let canonicalPath = $derived(
		deLocalizeHref(page.url.pathname + (building ? '' : page.url.search))
	);
	let currentLocale = $derived(getLocale());
	let enHref = $derived(localizeHref(canonicalPath, { locale: 'en' }));
	let esHref = $derived(localizeHref(canonicalPath, { locale: 'es' }));
</script>

<header class="border-b border-slate-800 bg-slate-900 shadow-lg">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 shadow-md">
					<svg
						class="h-5 w-5 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="11" cy="11" r="5" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11 8v3l2 2m5.657 2.343l-2.829-2.829M21 21l-4-4"
						/>
					</svg>
				</div>
				<div class="flex items-center gap-2">
					<a href={localizeHref('/')} class="text-xl font-bold tracking-tight text-white">
						Der<span class="text-teal-400">Smart</span>
					</a>
					<span
						class="hidden rounded border border-slate-700 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-slate-500 uppercase sm:block"
					>
						AI
					</span>
				</div>
			</div>

			<!-- Nav -->
			<nav class="flex items-center gap-1">
				{#each navLinks as link}
					{@const isActive = link.exact
						? page.url.pathname === '/' ||
							page.url.pathname === '/es' ||
							page.url.pathname === '/es/'
						: page.url.pathname.includes('/images')}
					<a
						href={localizeHref(link.href)}
						class="relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-150
							{isActive ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
					>
						{link.labelFn()}
						{#if isActive}
							<span class="absolute right-3 bottom-0 left-3 h-[2px] rounded-full bg-teal-500"
							></span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Right: locale switcher + status + avatar -->
			<div class="flex items-center gap-3">
				<!-- Language switcher -->
				<div
					class="flex items-center overflow-hidden rounded-lg border border-slate-700 text-xs font-semibold"
				>
					<a
						href={enHref}
						class="px-2.5 py-1.5 transition-colors duration-100
							{currentLocale === 'en'
							? 'bg-teal-600 text-white'
							: 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
					>
						EN
					</a>
					<span class="h-4 w-px bg-slate-700"></span>
					<a
						href={esHref}
						class="px-2.5 py-1.5 transition-colors duration-100
							{currentLocale === 'es'
							? 'bg-teal-600 text-white'
							: 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
					>
						ES
					</a>
				</div>

				<!-- Online indicator -->
				<div class="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
					<span class="relative flex h-2 w-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
					</span>
					{m.nav_online()}
				</div>

				<!-- Doctor avatar -->
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 ring-2 ring-slate-600"
				>
					<svg
						class="h-4 w-4 text-slate-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</header>
