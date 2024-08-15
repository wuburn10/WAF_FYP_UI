<script lang="ts">
	import { AdminService } from '$lib/service/admin.service';
	import { Button, Input, Label, Textarea, Toggle, Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let res: any = {
		settings: {
			WebsiteName: '',
			Port: '',
			WebsiteDescription: '',
			WafOn: false,
			NoLogPaths: [],
			ReverseProxies: []
		}
	};
	let noLogPaths: string[] = [];
	let newPath = '';
	let reverseProxyServers: string[] = [];
	let newServer = '';
	let wafEnabled = false;
	let websiteName = '';
	let port = '';
	let websiteDescription = '';
	let successToast = false;
	let failedToast = false;
	let noAuthToast = false;
	let role: any;

	async function getSettings() {
		const response = await AdminService.getSettings();
		res = response;

		// Initialize variables with fetched data
		websiteName = res.settings.WebsiteName;
		port = res.settings.Port;
		websiteDescription = res.settings.WebsiteDescription;
		wafEnabled = res.settings.WafOn;
		noLogPaths = res.settings.NoLogPaths || [];
		reverseProxyServers = res.settings.ReverseProxies || [];
	}

	const handleSubmit = async () => {
		if (role == 'Administrator') {
			// Update the res object with the latest values
			res.settings.WebsiteName = websiteName;
			res.settings.Port = port;
			res.settings.WebsiteDescription = websiteDescription;
			res.settings.WafOn = wafEnabled;
			res.settings.NoLogPaths = noLogPaths;
			res.settings.ReverseProxies = reverseProxyServers;

			// Submit the settings data
			let success = await AdminService.editSettings(res);
			if (success) {
				noAuthToast = false;
				failedToast = false;
				successToast = true;
			} else {
				noAuthToast = false;
				successToast = false;
				failedToast = true;
			}
		} else {
			successToast = false;
			failedToast = false;
			noAuthToast = true;
		}
	};

	const addNoLogPath = () => {
		if (newPath.trim()) {
			noLogPaths.push(newPath.trim());
			newPath = '';
		}
		noLogPaths = noLogPaths;
	};

	const removeNoLogPath = (index: number) => {
		noLogPaths.splice(index, 1);
		noLogPaths = noLogPaths;
	};

	const addReverseProxyServer = () => {
		if (newServer.trim()) {
			reverseProxyServers.push(newServer.trim());
			newServer = '';
		}
		reverseProxyServers = reverseProxyServers;
	};

	const removeReverseProxyServer = (index: number) => {
		reverseProxyServers.splice(index, 1);
		reverseProxyServers = reverseProxyServers;
	};

	onMount(async () => {
		role = localStorage.getItem('role');
		await getSettings();
	});
</script>

<div class="flex justify-between mb-3">
	<h1>Settings</h1>
</div>
<form on:submit|preventDefault={handleSubmit}>
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
		<div class="w-full">
			<Label for="name" class="mb-2">Website Name</Label>
			<Input
				type="text"
				id="name"
				bind:value={websiteName}
				placeholder="Enter Website Name"
				required
			/>
		</div>
		<div class="w-full">
			<Label for="port" class="mb-2">Port Number</Label>
			<Input type="number" id="port" bind:value={port} placeholder="Enter Port Number" required />
		</div>
		<div class="sm:col-span-2">
			<Label for="description" class="mb-2">Website Description</Label>
			<Textarea
				id="description"
				bind:value={websiteDescription}
				placeholder="Enter Website Description"
				rows="4"
				name="description"
				required
			/>
		</div>
		<div class="w-full">	
			<Label for="waf" class="mb-2">Web Application Firewall (WAF)</Label>
			<Toggle id="waf" bind:checked={wafEnabled} />
		</div>
		<div />
		<div class="w-full flex flex-col">
			<Label for="nolog" class="mb-2">No Log Paths</Label>
			<ul>
				{#each noLogPaths as path, index}
					<li class="flex justify-between items-center mb-1">
						<span>{index + 1}. {path}</span>
						{#if role == 'Administrator'}
							<Button on:click={() => removeNoLogPath(index)} color="red" class="ml-2"
								>Remove</Button
							>
						{/if}
					</li>
				{/each}
			</ul>
			<div class="flex items-center">
				<Input
					type="text"
					id="nolog"
					bind:value={newPath}
					placeholder="Enter new path (eg. /.sveltekit)"
					class="flex-grow"
				/>
				{#if role == 'Administrator'}
					<Button type="button" on:click={addNoLogPath} color="green" class="ml-2">Add</Button>
				{/if}
			</div>
		</div>
		<div class="w-full flex flex-col">
			<Label for="reverseProxy" class="mb-2">Reverse Proxy Servers</Label>
			<ul>
				{#each reverseProxyServers as server, index}
					<li class="flex justify-between items-center mb-1">
						<span>{index + 1}. {server}</span>
						{#if role == 'Administrator'}
							<Button on:click={() => removeReverseProxyServer(index)} color="red" class="ml-2"
								>Remove</Button
							>
						{/if}
					</li>
				{/each}
			</ul>
			<div class="flex items-center">
				<Input
					type="text"
					id="reverseProxy"
					bind:value={newServer}
					placeholder="Enter new server (eg. localhost:5173)"
					class="flex-grow"
				/>
				{#if role == 'Administrator'}
					<Button type="button" on:click={addReverseProxyServer} color="green" class="ml-2"
						>Add</Button
					>
				{/if}
			</div>
		</div>
		<div class="flex items-center col-span-2 flex-col">
			{#if role == 'Administrator'}
				<Button type="submit" class="w-32">Save Settings</Button>
			{/if}
		</div>
	</div>
</form>
{#if successToast}
	<Toast color="green" position="bottom-right">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		Settings Updated. Restart server to see changes.
	</Toast>
{/if}
{#if failedToast}
	<Toast color="red" position="bottom-right">
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		Settings Failed to Update
	</Toast>
{/if}
{#if noAuthToast}
	<Toast color="red" position="bottom-right">
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		Failed to Update: Only Administrators can edit settings
	</Toast>
{/if}
