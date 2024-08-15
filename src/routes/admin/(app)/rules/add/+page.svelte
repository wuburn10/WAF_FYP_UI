<script lang="ts">
	import { goto } from '$app/navigation';
	import { AdminService } from '$lib/service/admin.service';
	import { fail } from '@sveltejs/kit';
	import { Tabs, TabItem, Button, Toast } from 'flowbite-svelte';
	import {
	CheckCircleSolid,
		CloseCircleSolid,
		FileCodeOutline,
		FileShieldOutline,
		GlobeOutline,
		LinkOutline,
		TextSlashOutline
	} from 'flowbite-svelte-icons';

	let activeTab = 0;

	// Form data
	let rawRule = '';
	let ipToBan = '';
	let countryToBan = '';
	let urlToBlock = '';
	let wordToBan = '';
	let ruleID = 0;
	let successToast = false;
	let failedToast = false;

	async function addRule() {
		let rule = {};

		switch (activeTab) {
			case 0:
				rule = {
					rule_id: ruleID,
					raw_rule: rawRule,
					file_name: 'custom',
					isEnabled: true
				};
				break;
			case 1:
				rule = {
					rule_id: ruleID,
					raw_rule: `SecRule REMOTE_ADDR "@contains ${ipToBan}" "id:${ruleID},phase:1,deny,status:403,log,msg:'IP Ban'"`,
					file_name: 'ip_ban',
					isEnabled: true
				};
				break;
			case 2:
				rule = {
					rule_id: ruleID,
					raw_rule: `SecRule GEO:COUNTRY_CODE "@streq ${countryToBan}" "id:${ruleID},phase:1,deny,status:403,log,msg:'Country Ban'"`,
					file_name: 'country_ban',
					isEnabled: true
				};
				break;
			case 3:
				rule = {
					rule_id: ruleID,
					raw_rule: `SecRule REQUEST_URI "@streq ${urlToBlock}" "id:${ruleID},phase:1,deny,status:403,log,msg:'URL Block'"`,
					file_name: 'url_block',
					isEnabled: true
				};
				break;
			case 4:
				rule = {
					rule_id: ruleID,
					raw_rule: `SecRule ARGS "@contains ${wordToBan}" "id:${ruleID},phase:2,deny,status:403,log,msg:'Word Ban'"`,
					file_name: 'word_ban',
					isEnabled: true
				};
				break;
		}

		try {
			let res = await AdminService.addRule(rule);
			failedToast = false
			successToast = true
			console.error(res);
		} catch (e:any) {
			failedToast = true
			successToast = false
		}
	}
</script>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-3xl font-bold">Add Rule</h1>
	<Button pill color="dark" on:click={() => goto('/admin/rules')}>Back</Button>
</div>

<Tabs>
	<TabItem
		open
		on:click={() => {
			activeTab = 0;
		}}
	>
		<div slot="title" class="flex items-center gap-2 text-md">
			<FileCodeOutline class="w-5 h-5" />
			Custom
		</div>
		<form on:submit|preventDefault={addRule}>
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-medium text-gray-300">Raw Rule</label>
				<textarea
					class="mt-1 block w-full p-2.5 dark:bg-gray-800 dark:text-white rounded-md"
					bind:value={rawRule}
				/>
				<p class="text-gray-300 pt-2 text-right pr-2 text-sm">
					Need help creating rules? Visit <a href="https://coraza.io/docs/seclang/syntax/"
						>https://coraza.io/docs/seclang/syntax/</a
					>
				</p>
			</div>
			<Button type="submit" pill color="primary">Add Rule</Button>
		</form>
	</TabItem>
	<TabItem
		on:click={() => {
			activeTab = 1;
		}}
	>
		<div slot="title" class="flex items-center gap-2 text-md">
			<FileShieldOutline class="w-5 h-5" />
			IP Ban
		</div>
		<form on:submit|preventDefault={addRule}>
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-medium text-gray-300">IP to Ban</label>
				<input
					type="text"
					class="mt-1 block w-full p-2.5 dark:bg-gray-800 dark:text-white rounded-md"
					bind:value={ipToBan}
				/>
			</div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="block text-sm font-medium text-gray-300">Rule ID</label>
			<input
				type="text"
				class="mt-1 block w-1/4 p-2.5 dark:bg-gray-800 dark:text-white rounded-md mb-2"
				bind:value={ruleID}
			/>
			<Button type="submit" pill color="primary">Add Rule</Button>
		</form>
	</TabItem>
	<TabItem
		on:click={() => {
			activeTab = 2;
		}}
	>
		<div slot="title" class="flex items-center gap-2 text-md">
			<GlobeOutline class="w-5 h-5" />
			Country Ban
		</div>
		<form on:submit|preventDefault={addRule}>
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-medium text-gray-300">Country to Ban</label>
				<input
					type="text"
					class="mt-1 block w-full p-2.5 dark:bg-gray-800 dark:text-white rounded-md"
					bind:value={countryToBan}
				/>
			</div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="block text-sm font-medium text-gray-300">Rule ID</label>
			<input
				type="text"
				class="mt-1 block w-1/4 p-2.5 dark:bg-gray-800 dark:text-white rounded-md mb-2"
				bind:value={ruleID}
			/>
			<Button type="submit" pill color="primary">Add Rule</Button>
		</form>
	</TabItem>
	<TabItem
		on:click={() => {
			activeTab = 3;
		}}
	>
		<div slot="title" class="flex items-center gap-2 text-md">
			<LinkOutline class="w-5 h-5" />
			Block URL
		</div>
		<form on:submit|preventDefault={addRule}>
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-medium text-gray-300">URL to Block</label>
				<input
					type="text"
					class="mt-1 block w-full p-2.5 dark:bg-gray-800 dark:text-white rounded-md"
					bind:value={urlToBlock}
				/>
			</div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="block text-sm font-medium text-gray-300">Rule ID</label>
			<input
				type="text"
				class="mt-1 block w-1/4 p-2.5 dark:bg-gray-800 dark:text-white rounded-md mb-2"
				bind:value={ruleID}
			/>
			<Button type="submit" pill color="primary">Add Rule</Button>
		</form>
	</TabItem>
	<TabItem
		on:click={() => {
			activeTab = 4;
		}}
	>
		<div slot="title" class="flex items-center gap-2 text-md">
			<TextSlashOutline class="w-5 h-5" />
			Word Ban
		</div>
		<form on:submit|preventDefault={addRule}>
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="block text-sm font-medium text-gray-300">Word to Ban</label>
				<input
					type="text"
					class="mt-1 block w-full p-2.5 dark:bg-gray-800 dark:text-white rounded-md"
					bind:value={wordToBan}
				/>
			</div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="block text-sm font-medium text-gray-300">Rule ID</label>
			<input
				type="text"
				class="mt-1 block w-1/4 p-2.5 dark:bg-gray-800 dark:text-white rounded-md mb-2"
				bind:value={ruleID}
			/>
			<Button type="submit" pill color="primary">Add Rule</Button>
		</form>
	</TabItem>
</Tabs>

<div class="mt-4 p-4 bg-gray-800 rounded-lg">
	<h2 class="text-lg font-semibold text-gray-300">Rule Preview</h2>
	{#if activeTab == 0}
		<pre class="text-sm whitespace-pre-wrap">{rawRule}</pre>
	{:else if activeTab == 1}
		<pre
			class="text-sm whitespace-pre-wrap">SecRule REMOTE_ADDR "@ipMatch {ipToBan}" "id:{ruleID},phase:1,deny,status:403,log,msg:'IP Ban'</pre>
	{:else if activeTab == 2}
		<pre
			class="text-sm whitespace-pre-wrap">SecRule GEO:COUNTRY_CODE "@streq {countryToBan}" "id:{ruleID},phase:1,deny,status:403,log,msg:'Country Ban'</pre>
	{:else if activeTab == 3}
		<pre
			class="text-sm whitespace-pre-wrap">SecRule REQUEST_URI "@streq {urlToBlock}" "id:{ruleID},phase:1,deny,status:403,log,msg:'URL Block'</pre>
	{:else if activeTab == 4}
		<pre
			class="text-sm whitespace-pre-wrap">SecRule REQUEST_BODY "@contains {wordToBan}" "id:{ruleID},phase:2,deny,status:403,log,msg:'Word Ban'</pre>
	{/if}
</div>

{#if successToast}
	<Toast color="green" position="bottom-right" on:close={() => goto('/admin/rules')}>
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		Rule Succesfully Added
	</Toast>
{/if}
{#if failedToast}
	<Toast color="red" position="bottom-right">
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		Rule with the ID {ruleID} already exists
	</Toast>
{/if}
