<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>DerSmart Dashboard</title>
</svelte:head>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-12 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
			<span class="block xl:inline">Dermatology AI</span>
			<span class="block text-indigo-600 xl:inline">Platform Demo</span>
		</h1>
		<p
			class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
		>
			Manage dermatological images and access automated diagnostic tools.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Card 1 -->
		<div class="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
			<div class="px-4 py-5 sm:p-6">
				<dt class="truncate text-sm font-medium text-gray-500">Image Bank</dt>
				<dd class="mt-1 text-3xl font-semibold text-gray-900">Manage</dd>
				<p class="mt-2 text-sm text-gray-600">Upload and organize patient images.</p>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a
						href={localizeHref('/images')}
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						Go to Image Bank <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Card 2 -->
		<div class="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
			<div class="px-4 py-5 sm:p-6">
				<dt class="truncate text-sm font-medium text-gray-500">Diagnosis</dt>
				<dd class="mt-1 text-3xl font-semibold text-gray-900">Analyze</dd>
				<p class="mt-2 text-sm text-gray-600">Run AI diagnosis on uploaded images.</p>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a
						href={localizeHref('/images')}
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						Select Image to Diagnose <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Card 3 -->
		<div class="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
			<div class="px-4 py-5 sm:p-6">
				<dt class="truncate text-sm font-medium text-gray-500">ISIC Archive</dt>
				<dd class="mt-1 text-3xl font-semibold text-gray-900">Reference</dd>
				<p class="mt-2 text-sm text-gray-600">
					Access the International Skin Imaging Collaboration.
				</p>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a
						href="https://api.isic-archive.com/collections/390/"
						target="_blank"
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						Visit Archive <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
