<script src="https://cdn.jsdelivr.net/npm/apexcharts" lang="ts">
	import { AdminService } from '$lib/service/admin.service';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge,
		Modal,
		Input,
		Label,
		Select,
		Toast
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		TrashBinOutline,
		EditSolid
	} from 'flowbite-svelte-icons';

	let res: any[] = [];
	let showModal = false;
	let showEditModal = false;
	let username = '';
	let oldPassword = '';
	let newPassword = '';
	let roleSelected = 'Administrator';
	let fullName = '';
	let email = '';
	let errorMessage = '';
	let successToast = false;
	let failedToast = false;
	let role: any;
	let editUserID = 0;

	const roles = ['Administrator', 'Senior Developer', 'Junior Developer'];

	async function getUsers() {
		res = await AdminService.getUsers();
	}

	async function deleteUser(username: any) {
		await AdminService.deleteUser(username);
		await getUsers();
	}

	onMount(async () => {
		role = localStorage.getItem('role');
		await getUsers();
		res = res;
	});

	function getRoleColor(role: string): string {
		switch (role) {
			case 'Administrator':
				return 'red';
			case 'Senior Developer':
				return 'green';
			case 'Junior Developer':
				return 'blue';
			default:
				return 'dark';
		}
	}

	async function createUser() {
		if (newPassword !== '') {
			let res = await AdminService.createUser(username, newPassword, roleSelected, fullName, email);
			if (res.message === 'User Added') {
				getUsers();
				showModal = false;
				failedToast = false;
				successToast = true;
				setTimeout(() => {
					failedToast = false;
					successToast = false;
				}, 3000);
			} else {
				successToast = false;
				failedToast = true;
			}
		} else {
			errorMessage = 'New password cannot be empty';
		}
	}

	async function editUser() {
		if ((oldPassword == '' && newPassword == '') || newPassword !== oldPassword) {
			let res = await AdminService.editUser(
				editUserID,
				username,
				oldPassword,
				newPassword,
				roleSelected,
				fullName,
				email
			);
			if (res.message === 'User Updated') {
				getUsers();
				showEditModal = false;
				failedToast = false;
				successToast = true;
				setTimeout(() => {
					failedToast = false;
					successToast = false;
				}, 3000);
			} else {
				showEditModal = false;
				successToast = false;
				failedToast = true;
			}
		} else {
			errorMessage = 'Old password and new password cannot be the same';
		}
	}

	function openEditModal(user: any) {
		editUserID = user.id;
		username = user.username;
		fullName = user.full_name;
		email = user.email;
		roleSelected = user.role;
		oldPassword = '';
		newPassword = '';
		showEditModal = true;
	}
</script>

<div class="flex justify-between mb-3">
	<h1>User Management</h1>
	{#if role != 'Junior Developer'}
		<div>
			<Button
				pill
				color="dark"
				on:click={() => {
					fullName = '';
					email = '';
					username = '';
					showModal = true;
				}}
			>
				Add User
				<svg
					class="w-6 h-6 text-gray-800 dark:text-white ml-2"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					/>
				</svg>
			</Button>
		</div>
	{/if}
</div>
<Table>
	<TableHead>
		<TableHeadCell class="w-24">User</TableHeadCell>
		<TableHeadCell>Role</TableHeadCell>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>Created Date</TableHeadCell>
		{#if role == 'Administrator'}
			<TableHeadCell class="flex justify-end">Actions</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody>
		{#each res as user}
			<TableBodyRow>
				<TableBodyCell class="flex items-center">
					<img
						src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`}
						alt={user.full_name}
						class="inline-block w-8 h-8 mr-2 rounded-full"
					/>
					{user.full_name}
				</TableBodyCell>
				<TableBodyCell>
					<Badge large color={getRoleColor(user.role)} class="ml-2">{user.role}</Badge>
				</TableBodyCell>
				<TableBodyCell>
					<p>{user.email}</p>
				</TableBodyCell>
				<TableBodyCell>{new Date(user.created_at).toLocaleDateString()}</TableBodyCell>
				{#if role == 'Administrator'}
					<TableBodyCell class="flex justify-end gap-2">
						<Button color="light" size="sm" on:click={() => openEditModal(user)}>
							<EditSolid class="w-6 h-6" />
						</Button>
						<Button color="red" size="sm" on:click={() => deleteUser(user.username)}>
							<TrashBinOutline class="w-6 h-6" />
						</Button>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal bind:open={showModal} size="md" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-3 px-10 pb-5" action="#" on:submit|preventDefault={createUser}>
		<h3 class="mb-2 text-3xl font-medium text-gray-900 dark:text-white">Create User</h3>
		{#if errorMessage}
			<div class="text-red-500 dark:text-red-400 mb-4">{errorMessage}</div>
		{/if}
		<Label class="space-y-2">
			<span>Full Name</span>
			<Input type="text" bind:value={fullName} required />
		</Label>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" bind:value={email} required />
		</Label>
		<Label class="space-y-2">
			<span>Username</span>
			<Input type="text" bind:value={username} required />
		</Label>
		<Label class="space-y-2">
			<span>New Password</span>
			<Input type="password" bind:value={newPassword} required />
		</Label>
		<Label class="space-y-2">
			<span>Role</span>
			<Select bind:value={roleSelected} required>
				{#each roles as roleOption}
					<option value={roleOption}>{roleOption}</option>
				{/each}
			</Select>
		</Label>
		<Button type="submit" class="w-full">Create User</Button>
	</form>
</Modal>

<Modal bind:open={showEditModal} size="md" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-3 px-10 pb-5" action="#" on:submit|preventDefault={editUser}>
		<h3 class="mb-2 text-3xl font-medium text-gray-900 dark:text-white">Edit User</h3>
		{#if errorMessage}
			<div class="text-red-500 dark:text-red-400 mb-4">{errorMessage}</div>
		{/if}
		<Label class="space-y-2">
			<span>Full Name</span>
			<Input type="text" bind:value={fullName} required />
		</Label>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" bind:value={email} required />
		</Label>
		<Label class="space-y-2">
			<span>Username</span>
			<Input type="text" bind:value={username} required />
		</Label>
		<Label class="space-y-2">
			<span>Old Password</span>
			<Input type="password" bind:value={oldPassword} />
		</Label>
		<Label class="space-y-2">
			<span>New Password</span>
			<Input type="password" bind:value={newPassword} />
		</Label>
		<Label class="space-y-2">
			<span>Role</span>
			<Select bind:value={roleSelected} required>
				{#each roles as roleOption}
					<option value={roleOption}>{roleOption}</option>
				{/each}
			</Select>
		</Label>
		<Button type="submit" class="w-full">Edit User</Button>
	</form>
</Modal>

{#if successToast}
	<Toast color="green" position="top-right">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		User Updated Successfully
	</Toast>
{/if}
{#if failedToast}
	<Toast color="red" position="top-right">
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		Failed to update user
	</Toast>
{/if}
