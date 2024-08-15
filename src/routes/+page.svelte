<script lang="ts">
	import { goto } from '$app/navigation';
	import { APIService } from '$lib/service/api.service';
	import { onMount } from 'svelte';

	let username: string, password: string;

	onMount(() => {
		goto('/admin');
	});

	function submit() {
		APIService.sendTestData(username, password);
	}
</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>

