<script lang="ts">
	import { goto } from '$app/navigation';
	import { APIService } from '$lib/service/api.service';
	import { Input, Label, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let username: string, password: string;

	onMount(() => {
		goto('/sampleApp');
	});

	function submit() {
		APIService.sendTestData(username, password);
	}
</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>

<form on:submit={submit}>
	<div class="flex flex-col max-w-sm mb-4">
		<span class="text-3xl">LOGIN</span>
		<div>
			<Label for="username" class="mb-2">Username</Label>
			<Input bind:value={username} type="text" id="username" required />
		</div>
		<div>
			<Label for="password" class="mb-2">Password</Label>
			<Input bind:value={password} type="password" id="password" required />
		</div>
	</div>
	<Button type="submit">Submit</Button>
</form>

<style>
</style>
