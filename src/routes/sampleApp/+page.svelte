<script lang="ts">
	import { APIService } from '$lib/service/api.service';
	import { Input, Label, Button } from 'flowbite-svelte';

	let item: string;

	function submit() {
		APIService.sendSampleAppData(item);
	}

	function getItems() {
		APIService.getItems();
	}
</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>

<form on:submit={submit}>
	<div class="flex flex-col max-w-sm mb-4">
		<span class="text-3xl">Inventory List</span>
		<div>
			<Label for="item" class="mb-2">Item</Label>
			<Input bind:value={item} type="text" id="item" required />
		</div>
	</div>
	<Button type="submit">Submit</Button>
</form>

<div class="w-42 m-auto">
	<Button color="yellow" on:click={() => getItems()}>Load Items</Button>
</div>

<style>
</style>
