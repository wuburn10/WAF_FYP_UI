<script lang="ts">
	import { Button, Label, Input, Toast } from 'flowbite-svelte';
	import { AdminService } from '$lib/service/admin.service';
	import { goto } from '$app/navigation';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let username: string;
	let password: string;
	let successToast = false;
	let failedToast = false;

	async function submit(event: { preventDefault: () => void }) {
		event.preventDefault();
		let res = await AdminService.login(username, password);
		console.log(res);

		if (res.message === 'Login successful') {
			failedToast = false;
			successToast = true;
			setTimeout(() => {
				localStorage.setItem('user', username);
				localStorage.setItem('role', res.role);
				localStorage.setItem('id', res.id);
				goto('/admin/dashboard');
			}, 1500);
		} else if (res.message === 'Invalid username or password') {
			successToast = false;
			failedToast = true;
		}
	}

	onMount(() => {
		if (
			localStorage.getItem('user') == '' ||
			localStorage.getItem('user') == null ||
			localStorage.getItem('user') == 'null' ||
			localStorage.getItem('user') == undefined
		) {
			console.log('no user');
		} else {
			goto('/admin/dashboard');
		}
	});
</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>

<div class="space-y-4 flex flex-col w-3/4 sm:w-1/2 self-center">
	<p
		id="totalRequests"
		class="text-3xl mb-8 text-center self-center font-bold border rounded-full w-32 h-32 flex justify-center items-center"
	>
		<span class="text-orange-600 underline">R-WAF</span>
	</p>
	<form class="flex flex-col space-y-6 bg-gray-800 rounded p-12 pt-8" on:submit={submit}>
		<h3 class="text-4xl text-center font-bold text-gray-900 dark:text-white p-0">Login</h3>
		<Label class="space-y-2">
			<span>Username</span>
			<Input
				bind:value={username}
				type="text"
				name="username"
				placeholder="Your Username"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Password</span>
			<Input
				bind:value={password}
				type="password"
				name="password"
				placeholder="••••••••••"
				required
			/>
		</Label>
		<Button type="submit" class="w-full">Sign in</Button>
		<div class="m-4 mt-12 self-center" />
	</form>
	{#if successToast}
		<Toast color="green" position="bottom-right">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			Login Successful
		</Toast>
	{/if}
	{#if failedToast}
		<Toast color="red" position="bottom-right">
			<svelte:fragment slot="icon">
				<CloseCircleSolid class="w-5 h-5" />
				<span class="sr-only">Error icon</span>
			</svelte:fragment>
			Invalid Username or Password
		</Toast>
	{/if}
</div>
