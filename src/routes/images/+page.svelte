<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data, form } = $props();

	let uploading = $state(false);
	let fileName = $state('');
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Dermatology Image Bank</h1>
		<a
			href="https://api.isic-archive.com/collections/390/"
			target="_blank"
			class="text-sm text-indigo-600 hover:text-indigo-500"
		>
			View ISIC Archive Source
		</a>
	</div>

	<!-- Upload Section -->
	<div class="mb-8 bg-white p-6 shadow sm:rounded-lg">
		<h2 class="mb-4 text-lg leading-6 font-medium text-gray-900">Upload New Image</h2>
		<form
			method="POST"
			action="?/upload"
			enctype="multipart/form-data"
			use:enhance={() => {
				uploading = true;
				return async ({ update }) => {
					await update();
					uploading = false;
				};
			}}
			class="space-y-4"
		>
			<div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
				<div class="sm:col-span-2">
					<label for="patientId" class="block text-sm font-medium text-gray-700">Patient ID</label>
					<div class="mt-1">
						<input
							type="text"
							name="patientId"
							id="patientId"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="e.g. PAT-001"
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="bodySite" class="block text-sm font-medium text-gray-700">Body Site</label>
					<div class="mt-1">
						<input
							type="text"
							name="bodySite"
							id="bodySite"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="e.g. arm, face"
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="modality" class="block text-sm font-medium text-gray-700">Modality</label>
					<div class="mt-1">
						<select
							id="modality"
							name="modality"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						>
							<option value="dermatoscopic">Dermatoscopic</option>
							<option value="clinical">Clinical</option>
						</select>
					</div>
				</div>

				<div class="sm:col-span-6">
					<label for="file" class="block text-sm font-medium text-gray-700">Image File</label>
					<div
						class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
					>
						<div class="space-y-1 text-center">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
								aria-hidden="true"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<div class="flex text-sm text-gray-600">
								<label
									for="file"
									class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500"
								>
									<span>{fileName || 'Upload a file'}</span>
									<input
										id="file"
										name="file"
										type="file"
										class="sr-only"
										accept="image/*"
										required
										onchange={(e) => {
											const files = e.currentTarget.files;
											if (files && files.length > 0) {
												fileName = files[0].name;
											}
										}}
									/>
								</label>
								<p class="pl-1">or drag and drop</p>
							</div>
							<p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-5">
				<div class="flex justify-end">
					<button
						type="submit"
						disabled={uploading}
						class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
					>
						{uploading ? 'Uploading...' : 'Save'}
					</button>
				</div>
			</div>
		</form>
	</div>

	<!-- Gallery -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if data.images.length === 0}
			<div class="col-span-full py-12 text-center text-gray-500">No images uploaded yet.</div>
		{:else}
			{#each data.images as image}
				<a
					href={localizeHref(`/diagnosis/${image.id}`)}
					class="group aspect-w-10 aspect-h-7 relative block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
				>
					<img
						src={image.url}
						alt={image.patientId}
						class="pointer-events-none h-64 w-full object-cover group-hover:opacity-75"
					/>
					<div class="absolute bottom-0 w-full bg-black/50 p-2 text-white">
						<p class="truncate text-sm font-medium">{image.patientId || 'Unknown Patient'}</p>
						<p class="truncate text-xs text-gray-300">{image.bodySite} - {image.modality}</p>
						{#if image.aiDiagnosis}
							<span
								class="absolute top-2 right-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
							>
								Diagnosed
							</span>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>
