<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import Header from './Header.svelte';
	import '../app.css'; // Global Tailwind import

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<Header />
	<main class="py-10">
		<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">{@render children()}</div>
	</main>
</div>
