<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Avatar,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavHamburger
	} from 'flowbite-svelte';
	import {
		ShieldCheckOutline,
		ClipboardListSolid,
		ScaleBalancedSolid,
		UsersSolid,
		ObjectsColumnOutline,
		UserCircleOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let nav = false;
	let username = 'Username';
	let role = 'Role';

	onMount(() => {
		if (
			localStorage.getItem('user') == '' ||
			localStorage.getItem('user') == null ||
			localStorage.getItem('user') == 'null' ||
			localStorage.getItem('user') == undefined
		) {
			console.log('no user');
			goto('/admin');
		} else {
			if (localStorage.getItem('user') != null) {
				username = localStorage.getItem('user');
				role = localStorage.getItem('role');
			}
		}
	});

	// This script will force the dark mode by adding the 'dark' class to the <html> element.
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add('dark');
	}

	let currentPath: string;

	function getPath(path: string) {
		currentPath = path;
	}

	$: getPath($page.url.pathname);

	function inPath(currPath: string, path: string): boolean {
		if (currPath === path) {
			return true;
		} else if (currPath.startsWith(path + '/')) {
			return true;
		} else {
			return false;
		}
	}

	function showNav() {
		nav = !nav;
	}

	function logout() {
		localStorage.removeItem('user');
		localStorage.removeItem('role');
		localStorage.removeItem('id');
		goto('/admin');
	}
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-0">
		<a href="/admin/dashboard" class="flex items-center space-x-3 rtl:space-x-reverse underline">
			<div class="flex">
				<ShieldCheckOutline class="w-12 h-12 me-1.5" />
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
					>R-WAF</span
				>
			</div>
		</a>
		<button
			data-collapse-toggle="navbar-default"
			type="button"
			class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			aria-controls="navbar-default"
			aria-expanded="false"
			on:click={showNav}
		>
			<span class="sr-only">Open main menu</span>
			<svg
				class="w-5 h-5"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 17 14"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1h15M1 7h15M1 13h15"
				/>
			</svg>
		</button>
		<div class="{nav ? '' : 'hidden'} w-full md:block md:w-auto" id="navbar-default">
			<ul
				class="font-medium flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<li>
					<button
						class="flex p-5 {inPath(currentPath, '/admin/dashboard')
							? 'bg-orange-600 '
							: ''} block py-2 px-3 cursor-pointer text-gray-900 rounded md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
						on:click={() => goto('/admin/dashboard')}
					>
						<ObjectsColumnOutline class="w-5 h-5 me-1.5" />
						<a href="/admin/dashboard" class="text-white">Dashboard</a>
					</button>
				</li>
				<li class="flex w-full">
					<button
						class="flex p-5 {inPath(currentPath, '/admin/logs')
							? 'bg-orange-600 '
							: ''} block py-2 px-3 cursor-pointer text-gray-900 rounded md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
						on:click={() => goto('/admin/logs')}
					>
						<ClipboardListSolid class="w-5 h-5 me-1.5" />
						<a href="/admin/logs" class="text-white">Logs</a>
					</button>
				</li>
				<li class="flex w-full">
					<button
						class="flex p-5 {inPath(currentPath, '/admin/rules')
							? 'bg-orange-600 '
							: ''} block py-2 px-3 cursor-pointer text-gray-900 rounded md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
						on:click={() => goto('/admin/rules')}
					>
						<ScaleBalancedSolid class="w-5 h-5 me-1.5" />
						<a href="/admin/rules" class="text-white">Rules</a>
					</button>
				</li>
				<li class="flex w-full">
					<button
						class="flex p-5 {inPath(currentPath, '/admin/users')
							? 'bg-orange-600 '
							: ''} block py-2 px-3 cursor-pointer text-gray-900 rounded md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
						on:click={() => goto('/admin/users')}
					>
						<UsersSolid class="w-5 h-5 me-1.5" />
						<a href="/admin/users" class="text-white">Users</a>
					</button>
				</li>
				<li class="flex ">
					<div class=" md:order-2">
						<UserCircleOutline id="avatar-menu" class="w-8 h-8" />
					</div>
					<Dropdown placement="bottom" triggeredBy="#avatar-menu">
						<DropdownHeader>
							<span class="block text-md">{username}</span>
							<span class="block truncate text-sm font-medium">{role}</span>
						</DropdownHeader>
						<DropdownItem
							on:click={() => {
								goto('/admin/settings');
							}}>Settings</DropdownItem
						>
						<DropdownDivider />
						<DropdownItem on:click={logout}>Sign out</DropdownItem>
					</Dropdown>
				</li>
			</ul>
		</div>
	</div>
</nav>

<slot />
