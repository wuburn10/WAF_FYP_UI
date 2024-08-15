<script lang="ts">
	import { goto } from '$app/navigation';
	import { AdminService } from '$lib/service/admin.service';
	import { Badge, Button, Toggle } from 'flowbite-svelte';
	import {
		MessageDotsSolid,
		GridSolid,
		ShieldCheckSolid,
		ScaleBalancedSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let ruleGroup: string;
	let rules: any[] = [];
	let role:any

	async function getRules(ruleGroup: string) {
		role = localStorage.getItem("role")
		const res = await AdminService.getRules(ruleGroup);
		rules = res.rules;
	}

	async function toggleRule(index: number) {
		await AdminService.toggleRule(rules[index]);
		console.log(rules[index]);
		rules[index].On = !rules[index].On;
	}

	onMount(async () => {
		ruleGroup = window.location.href.split('/')[5];
		await getRules(ruleGroup);
	});
</script>

{#if rules.length > 0}
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">{ruleGroup} Rules</h1>
		<Button pill color="dark" on:click={() => goto('/admin/rules')}>Back</Button>
	</div>
	{#each rules as rule, index}
		<div
			class="rule-item flex justify-between items-center p-4 mb-4 rounded-lg dark:bg-gray-800 shadow-md"
		>
			<div class="flex-1 pr-5">
				<div class="mb-2">
					<div class="flex">
						<ScaleBalancedSolid class="w-6 h-6 me-0.5" />
						<h2 class="text-xl font-semibold text-white">Rule ID</h2>
					</div>
					<h2 class="text-gray-300 text-2xl pl-1">{rule.RuleID}</h2>
				</div>

				<Badge large color="purple"><GridSolid class="w-4 h-4 me-0.5" />Phase {rule.Phase}</Badge>

				<Badge large color={rule.Action == 'pass' ? 'green' : 'red'}
					><ShieldCheckSolid class="w-4 h-4 me-0.5" />Action: {rule.Action}</Badge
				>
				{#if rule.Msg != '' && rule.Msg != undefined && rule.Msg != null}
					<div class="flex mt-2">
						<Badge large color="dark"><MessageDotsSolid class="w-4 h-4 me-0.5 " />Message</Badge>
						<span class="text-sm ml-1 pt-0.5">: {rule.Msg}</span>
					</div>
				{/if}
				<div class="mt-5 text-gray-300 bg-gray-700 border rounded">
					<div class="raw-rule-text font-mono">{rule.RawRule}</div>
				</div>
			</div>
			<div class="flex flex-col">
				{#if role != "Junior Developer"}
					<Toggle checked={rule.On} on:click={() => toggleRule(index)} />
				{:else}
					<Toggle disabled checked={rule.On} on:click={() => toggleRule(index)} />
				{/if}
			</div>
		</div>
	{/each}
{:else}
	<p class="text-gray-700 dark:text-gray-300 mt-5">Loading rules</p>
{/if}

<style>
	.rule-item {
		background: #2d3748;
		border: 1px solid #4a5568;
		color: #f7fafc;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.rule-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
	}

	.rule-item h2 {
		color: #edf2f7;
	}

	.raw-rule-text {
		border: 1px #edf2f7;
		padding: 1rem;
		border-radius: 0.375rem;
		color: #f7fafc;
		white-space: pre-wrap; /* Preserve whitespace and wrap text */
		word-wrap: break-word; /* Break long words */
		word-break: break-all;
	}
</style>
