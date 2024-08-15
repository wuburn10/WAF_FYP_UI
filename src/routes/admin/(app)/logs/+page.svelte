<script lang="ts">
	import { AdminService } from '$lib/service/admin.service';
	import {
		Button,
		ButtonGroup,
		Input,
		Dropdown,
		DropdownItem,
		Checkbox,
		Label,
		Select,
		Badge,
		Alert,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		ChevronRightOutline,
		ChevronLeftOutline,
		SearchOutline,
		EyeSolid,
		InfoCircleSolid,
		CloseCircleSolid
	} from 'flowbite-svelte-icons';

	let a:any
	let logs: any[] = [];
	let columns: any[] = [];
	let searchTerm: string = '';
	let responseFilter: string = 'All';
	let filteredLogs: any[] = [];
	let liveData: boolean = false;
	let intervalId: any;
	let currentPosition = 0;
	const itemsPerPage = 10;
	const showPage = 5;
	let totalPages = 0;
	let pagesToShow: any[] = [];
	let totalItems = 0;
	let startPage: number;
	let endPage: number;
	let dateTime: any;
	let searchSelected = 'Path';
	let lastLogTimestamp: Date | null = null;
	let showAlert = false;
	let blockedLogs: any;

	let searchOptions = [
		{ value: 'Path', name: 'Path' },
		{ value: 'Timestamp', name: 'Timestamp' },
		{ value: 'Client IP', name: 'Client IP' },
		{ value: 'Request Method', name: 'Request Method' }
	];

	function formatTimestamp(timestamp: string | number | Date) {
		const date = new Date(timestamp);
		const options = {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};
		//@ts-ignore
		return date.toLocaleString('en-US', options).replace(',', '');
	}

	async function getLogs() {
		const res = await AdminService.getLogs();
		const newLogs = res.logs.dataset;
		const newLogTimestamp = new Date(newLogs[0][13]);

		if (lastLogTimestamp && newLogTimestamp > lastLogTimestamp) {
			blockedLogs = newLogs.filter(
				//@ts-ignore
				(log) => new Date(log[13]) > lastLogTimestamp && log[7] === false
			);
			if (blockedLogs.length > 0) {
				showAlert = true;
				console.log(blockedLogs[0]);
			}
		}

		logs = newLogs;
		columns = res.logs.columns;
		totalItems = logs.length;
		dateTime = formatTimestamp(new Date());
		filterLogs();
		lastLogTimestamp = newLogTimestamp;
	}

	function handleRowClick(logID: string) {
		goto(`/admin/logs/${logID}`);
	}

function filterLogs() {
	filteredLogs = logs.filter((log) => {
		let searchField: string;

		switch (searchSelected) {
			case 'Path':
				searchField = log[2];
				break;
			case 'Timestamp':
				searchField = formatTimestamp(log[13]);
				break;
			case 'Client IP':
				searchField = log[4];
				break;
			case 'Request Method':
				searchField = log[1];
				break;
			default:
				searchField = '';
		}

		return (
			searchField.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(responseFilter === 'All' ||
				(responseFilter === 'Accepted' && log[7] === true) ||
				(responseFilter === 'Denied' && log[7] === false))
		);
	});
	totalItems = filteredLogs.length;
	updateDataAndPagination();
}

	function updateDataAndPagination() {
		renderPagination(filteredLogs.length);
	}

	function loadNextPage() {
		if (currentPosition + itemsPerPage < totalItems) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	}	

	function loadPreviousPage() {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	}

	function renderPagination(totalItems: number) {
		totalPages = Math.ceil(totalItems / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
		console.log(totalItems)
		console.log(filteredLogs)
	}

	function goToPage(pageNumber: number) {
		console.log()
		currentPosition = (pageNumber - 1) * itemsPerPage;
		console.log(pageNumber)
		console.log(currentPosition)

		updateDataAndPagination();
	}

	function toggleLiveData() {
		if (liveData) {
			intervalId = setInterval(getLogs, 3000);
		} else {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		}
	}

	onDestroy(() => {
		clearInterval(intervalId);
	});

	$: startRange = currentPosition + 1;
	$: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

	$: filteredLogs =
		searchTerm || responseFilter !== 'All'
			? logs.filter(
					(log) =>
						(log[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
							log[4].toLowerCase().includes(searchTerm.toLowerCase())) &&
						(responseFilter === 'All' ||
							(responseFilter === 'Accepted' && log[7] === true) ||
							(responseFilter === 'Denied' && log[7] === false))
			  )
			: logs;


	$: a = console.log(filteredLogs)

	onMount(async () => {
		await getLogs();
	});
</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>
{#if showAlert}
	<div class="absolute top-15 left-50 right-50 z-10 w-96">
		<Alert>
			<div class="flex items-center gap-3">
				<InfoCircleSolid class="w-5 h-5" />
				<span class="text-lg font-bold">New blocked request detected!</span>
			</div>
			<p class="mt-2 mb-4 text-sm font-light text-clip overflow-hidden">
				User with IP <span class="font-bold">"{blockedLogs[0][4]}"</span> accessing path
				<span class="font-bold">"{blockedLogs[0][1]} {blockedLogs[0][2]}"</span>
				has violated Rule ID <span class="font-bold">{blockedLogs[0][6]}</span>
			</p>
			<div class="flex gap-2">
				<Button size="xs" on:click={() => goto('logs/' + blockedLogs[0][0])}
					><EyeSolid class="w-4 h-4 me-2" />View Log</Button
				>
				<Button size="xs" outline on:click={() => (showAlert = false)}
					><CloseCircleSolid class="w-5 h-5 me-2" />Close</Button
				>
			</div>
		</Alert>
	</div>
{/if}

<div class="flex justify-between">
	<h1>Logs</h1>
</div>
<div class="w-full mt-3 flex justify-between items-center mb-4">
	<div class="w-1/3 flex">
		<div class="self-end mr-1">
			<Input
				placeholder="Search"
				bind:value={searchTerm}
				on:input={() => {
					currentPosition = 0;
					filterLogs();
				}}
			>
				<SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
			</Input>
		</div>
		<div>
			<Label class="text-xs">
				Search Option
				<Select class="mt-2" items={searchOptions} bind:value={searchSelected} />
			</Label>
		</div>
	</div>
	<div class="flex">
		<div class="w-42">
			<Button color="dark" class="w-full px-2 mr-5">Filter Response</Button>
			<Dropdown>
				<DropdownItem
					on:click={() => {
						responseFilter = 'All';
						filterLogs();
					}}>All</DropdownItem
				>
				<DropdownItem
					on:click={() => {
						responseFilter = 'Accepted';
						filterLogs();
					}}>Accepted</DropdownItem
				>
				<DropdownItem
					on:click={() => {
						responseFilter = 'Denied';
						filterLogs();
					}}>Denied</DropdownItem
				>
			</Dropdown>
		</div>
		<Button pill color="dark" on:click={getLogs} class="ml-5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg>
		</Button>
	</div>
</div>

<div class="flex justify-end">
	<Checkbox bind:checked={liveData} on:change={toggleLiveData} class="mr-2" />
	<span class="text-gray-700 dark:text-gray-300">Live Data</span>
	{#if liveData}
		<svg height="20" width="20" class="blinking ml-3">
			<circle cx="10" cy="10" r="10" fill="red" />
		</svg>
	{/if}
</div>
{#if dateTime != undefined}
	<div class="flex justify-end mt-1">
		<span class="text-xs">Last Updated : {dateTime}</span>
	</div>
{/if}
<div class="mt-4">
	<Table>
		<TableHead>
			<TableHeadCell>Timestamp</TableHeadCell>
			<TableHeadCell>Path</TableHeadCell>
			<TableHeadCell>Client IP</TableHeadCell>
			<TableHeadCell>Response</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filteredLogs.slice(currentPosition, currentPosition + itemsPerPage) as log}
				<TableBodyRow on:click={() => handleRowClick(log[0])} style="cursor: pointer;">
					<TableBodyCell>{formatTimestamp(log[13])}</TableBodyCell>
					<TableBodyCell>
						<span class="text-orange-200">
							{#if log[1] == 'GET'}
								<Badge color="green">{log[1]}</Badge>
							{:else if log[1] == 'POST'}
								<Badge color="blue">{log[1]}</Badge>
							{:else if log[1] == 'PUT'}
								<Badge color="yellow">{log[1]}</Badge>
							{:else if log[1] == 'DELETE'}
								<Badge color="red">{log[1]}</Badge>
							{:else if log[1] == 'PATCH'}
								<Badge color="indigo">{log[1]}</Badge>
							{:else if log[1] == 'HEAD'}
								<Badge color="purple">{log[1]}</Badge>
							{:else if log[1] == 'OPTIONS'}
								<Badge color="dark">{log[1]}</Badge>
							{:else}
								<Badge color="none">{log[1]}</Badge>
							{/if}
						</span>
						{log[2]}
					</TableBodyCell>
					<TableBodyCell class="truncate">{log[4]}</TableBodyCell>
					<TableBodyCell>
						{#if log[7] == true}
							<div class="flex gap-2">
								<span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
											fill="#008000"
										/>
									</svg>
								</span>
								Request Accepted
							</div>
						{:else}
							<div class="flex gap-2">
								<span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
											fill="#ff0000"
										/>
									</svg>
								</span>
								Request Denied
							</div>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
		aria-label="Table navigation"
	>
		<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
			Showing
			<span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
		</span>
		<ButtonGroup>
			<Button on:click={loadPreviousPage} disabled={currentPosition === 0}>
				<ChevronLeftOutline size="xs" class="m-1.5" />
			</Button>
			{#each pagesToShow as pageNumber}
				<Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
			{/each}
			<Button on:click={loadNextPage} disabled={totalPages === endPage}>
				<ChevronRightOutline size="xs" class="m-1.5" />
			</Button>
		</ButtonGroup>
	</div>
</div>

<style>
	.w-full {
		width: 100%;
	}

	.blinking {
		-webkit-animation: 1s blink ease infinite;
		-moz-animation: 1s blink ease infinite;
		-ms-animation: 1s blink ease infinite;
		-o-animation: 1s blink ease infinite;
		animation: 1s blink ease infinite;
	}

	@keyframes blink {
		from,
		to {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}

	@-moz-keyframes blink {
		from,
		to {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}

	@-webkit-keyframes blink {
		from,
		to {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}

	@-ms-keyframes blink {
		from,
		to {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}

	@-o-keyframes blink {
		from,
		to {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}
</style>
