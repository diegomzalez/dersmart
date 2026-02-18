<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-50">
	<Header />
	<main class="py-8">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in">
			{@render children()}
		</div>
	</main>
</div>
