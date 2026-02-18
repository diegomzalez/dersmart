<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data, form } = $props();
	let analyzing = $state(false);

	let diagnosis = $derived(data.image.aiDiagnosis ? JSON.parse(data.image.aiDiagnosis) : null);
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-6">
		<a href={localizeHref('/images')} class="text-indigo-600 hover:text-indigo-500">
			&larr; Back to Image Bank
		</a>
	</div>

	<div class="overflow-hidden bg-white shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900">Image Diagnosis</h3>
			<p class="mt-1 max-w-2xl text-sm text-gray-500">
				Patient ID: {data.image.patientId || 'Unknown'}
			</p>
		</div>
		<div class="border-t border-gray-200">
			<dl>
				<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium text-gray-500">Image</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<img
							src={data.image.url}
							alt="Dermatology Case"
							class="w-full max-w-md rounded-lg shadow-lg"
						/>
					</dd>
				</div>
				<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium text-gray-500">Body Site</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{data.image.bodySite || 'N/A'}
					</dd>
				</div>
				<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium text-gray-500">Modality</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{data.image.modality || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium text-gray-500">Diagnosis Status</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<span
							class:bg-yellow-100={data.image.diagnosisStatus === 'pending'}
							class:text-yellow-800={data.image.diagnosisStatus === 'pending'}
							class:bg-green-100={data.image.diagnosisStatus === 'completed'}
							class:text-green-800={data.image.diagnosisStatus === 'completed'}
							class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
						>
							{data.image.diagnosisStatus}
						</span>
					</dd>
				</div>
				{#if diagnosis}
					<div class="bg-green-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">AI Analysis Result</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<div class="rounded-md border bg-white p-4">
								<h4 class="mb-2 text-lg font-bold">{diagnosis.condition}</h4>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-xs text-gray-500">Confidence</p>
										<p class="font-mono">{diagnosis.confidence * 100}%</p>
									</div>
									<div>
										<p class="text-xs text-gray-500">Risk Level</p>
										<p class="font-bold" class:text-red-600={diagnosis.riskLevel === 'High'}>
											{diagnosis.riskLevel}
										</p>
									</div>
								</div>
								<div class="mt-4">
									<p class="text-xs text-gray-500">Recommendation</p>
									<p>{diagnosis.recommendation}</p>
								</div>
							</div>
						</dd>
					</div>
				{:else}
					<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Action</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<form
								method="POST"
								action="?/analyze"
								use:enhance={() => {
									analyzing = true;
									return async ({ update }) => {
										await update();
										analyzing = false;
									};
								}}
							>
								<button
									type="submit"
									disabled={analyzing}
									class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
								>
									{#if analyzing}
										<svg
											class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
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
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									{:else}
										Run AI Diagnosis
									{/if}
								</button>
							</form>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
	</div>
</div>
