<script lang="ts">
	import { goto } from '$app/navigation';
	import { AdminService } from '$lib/service/admin.service';
	import { Button, Modal, Label, Input, Textarea, Select, Badge } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let lid: string;
	let res: any;
	let logData: any;
	let incidentResponse: any;
	let formModal = false;
	let editFormModal = false;

	let title = '';
	let actionsTaken = '';
	let dateOfActionsTaken = '';
	let severity = 'low';
	let status = 'open';
	let resolvedAt = '';
	let ruleInfo: any;
	let role: any;
	let parsedData = '';

	function formatTimestamp(timestamp: string | number | Date) {
		const date = new Date(timestamp);
		const options = {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			fractionalSecondDigits: 2
		};
		//@ts-ignore
		return date.toLocaleString('en-US', options).replace(',', '');
	}

	function formatTimestamp2(timestamp: string | number | Date) {
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

	function formatDate(timestamp: string | number | Date) {
		const date = new Date(timestamp);
		const options = {
			year: 'numeric',
			month: 'short',
			day: '2-digit'
		};
		//@ts-ignore
		return date.toLocaleString('en-US', options).replace(',', '');
	}

	async function getLog() {
		lid = window.location.href.split('/')[5];
		res = await AdminService.getLog(lid);
		// TODO : Toast if cant get log
		logData = res.log.dataset[0];
		console.log("logData", logData);
		incidentResponse = res.incidentResponse;
		console.log("incidentResponse", incidentResponse);

		if (logData[7] == false) {
			console.log("logData[6]", logData[6])
			let res2 = await getRuleInfo(logData[6]);
			console.log("res2", res2)
			ruleInfo = res2.rule[0];
			console.log("res2.rule[0]", res2.rule[0])

			if (incidentResponse != null) {
				title = incidentResponse.title;
				actionsTaken = incidentResponse.actionsTaken;
				dateOfActionsTaken = incidentResponse.dateOfAction;
				severity = incidentResponse.severity;
				status = incidentResponse.status;
				resolvedAt = incidentResponse.resolved_at;
			}
		}
		console.log("true");
	}

	onMount(async () => {
		role = localStorage.getItem('role');
		lid = window.location.href.split('/')[5];
		res = await AdminService.getLog(lid);
		// TODO : Toast if cant get log
		logData = res.log.dataset[0];
		console.log("logData", logData);
		incidentResponse = res.incidentResponse;
		console.log("incidentResponse", incidentResponse);

		if (logData[7] == false) {
			console.log("logData[6]", logData[6])
			let res2 = await getRuleInfo(logData[6]);
			console.log("res2", res2)
			ruleInfo = res2.rule[0];
			console.log("res2.rule[0]", res2.rule[0])

			if (incidentResponse != null) {
				title = incidentResponse.title;
				actionsTaken = incidentResponse.actionsTaken;
				dateOfActionsTaken = incidentResponse.dateOfAction;
				severity = incidentResponse.severity;
				status = incidentResponse.status;
				resolvedAt = incidentResponse.resolved_at;
			}
		}
		console.log("true");
		console.log("DONE GET LOG")
		logData = logData
	});

	async function getRuleInfo(ruleID: string): Promise<any> {
		console.log("getting rule info");
		let res = await AdminService.getRuleInfo(ruleID);

		console.log(res);
		return res;
	}

	async function addIncidentResponse(event: any) {
		event.preventDefault();
		let userID = localStorage.getItem('id');
		if (userID != null) {
			res = await AdminService.addIncidentResponse(
				title,
				lid,
				actionsTaken,
				dateOfActionsTaken,
				severity,
				status,
				resolvedAt,
				userID
			);
		}

		formModal = false;
		await getLog();
	}

	async function editIncidentResponse(event: any) {
		event.preventDefault();
		let userID = localStorage.getItem('id');
		if (userID != null) {
			res = await AdminService.editIncidentResponse(
				incidentResponse.id,
				title,
				lid,
				actionsTaken,
				dateOfActionsTaken,
				severity,
				status,
				resolvedAt,
				userID
			);
		}

		editFormModal = false;
		await getLog();
	}

	function getSeverityColor(severity: string) {
		switch (severity) {
			case 'low':
				return 'green';
			case 'medium':
				return 'yellow';
			case 'high':
				return 'red';
			default:
				return 'dark';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'open':
				return 'blue';
			case 'in progress':
				return 'yellow';
			case 'closed':
				return 'green';
			default:
				return 'dark';
		}
	}


</script>

<svelte:head>
	<title>FYP</title>
	<meta name="description" content="FYP WAF App" />
</svelte:head>

<div class="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
	<div class="flex justify-between mb-4">
		<h1 class="text-2xl">
			<span class="font-bold">Log Details</span>
			{#if logData != undefined}(ID : {logData[0]?.slice(-6)}){/if}
		</h1>
		<Button pill color="dark" on:click={() => goto('/admin/logs')}>Back</Button>
	</div>

	{#if logData != undefined}
		<div class="grid grid-cols-1 gap-4">
			<div class="bg-gray-800 p-4 rounded-lg">
				<div class="flex justify-between items-center mb-4">
					<div class="flex-grow">
						<h2 class="text-xl font-semibold text-white">Path</h2>
						<p class="text-gray-300 text-2xl max-w-xs w-full">
							{logData[2]}
						</p>
					</div>
					<div>
						{#if logData[7] == true}
							<div class="flex items-center text-green-500">
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
									/>
								</svg>
								<span class="ml-2">Request Accepted</span>
							</div>
						{:else}
							<div class="flex items-center text-red-500">
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
									/>
								</svg>
								<span class="ml-2">Request Denied</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-gray-400">Method</p>
						<p class="text-gray-300">{logData[1]}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Protocol</p>
						<p class="text-gray-300">{logData[3]}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Client IP</p>
						<p class="text-gray-300">{logData[4]}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Server IP</p>
						<p class="text-gray-300">{logData[12]}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">User Agent</p>
						<p class="text-gray-300">{logData[8]}</p>
					</div>
					<div>
						<p class="text-sm text-gray-400">Timestamp</p>
						<p class="text-gray-300">{formatTimestamp(logData[13])}</p>
					</div>
					<div class="col-span-2">
						<p class="text-sm text-gray-400">Referer</p>
						<p class="text-gray-300">{logData[9]}</p>
					</div>
					<div class="col-span-2">
						<p class="text-sm text-gray-400">Request Body</p>
						<div class="text-gray-300 col-span-2 bg-gray-700 p-3 rounded-lg mt-3">
							{#if logData[10] != ''}
								{@html (() => {
									try {
										parsedData = JSON.parse(logData[10]);
										return Object.entries(parsedData)
											.map(([key, value]) => `${key}: "${value}"<br>`)
											.join('');
									} catch (e) {
										return logData[10]; // if not JSON, just return the original string
									}
								})()}
							{:else}
								<p class="italic font-light text-red-300">Request Body is Empty</p>
							{/if}
						</div>
					</div>
					<div class="col-span-2">
						<p class="text-sm text-gray-400">Headers</p>
						<div class="text-gray-300 col-span-2 bg-gray-700 p-3 rounded-lg mt-3 overflow-x-scroll">
							{#each Object.entries(JSON.parse(logData[11])) as [key, value]}<span
									class="font-semibold">{key}:</span
								>
								"{value}"<br />{/each}
						</div>
					</div>
				</div>
			</div>
			{#if logData[7] == false}
				<div class="bg-gray-800 p-4 rounded-lg">
					<h2 class="text-lg font-semibold text-white">Additional Info</h2>
					<div class="grid grid-cols-2 gap-4 mt-2">
						<div>
							<p class="text-sm text-gray-400">Incident Response</p>
							{#if logData[5] == ''}
								<span class="italic font-thin">None</span>
								<div class="mt-2">
									<Button size="xs" color="light" on:click={() => (formModal = true)}
										>Add Incident Response</Button
									>
								</div>
							{:else}
								<div class="text-gray-300 col-span-2 bg-gray-700 p-3 rounded-lg mt-3 shadow-lg">
									<div class="flex justify-between">
										<div>
											<h3 class="text-xl font-bold text-gray-200">{incidentResponse.title}</h3>
											<Badge color={getSeverityColor(incidentResponse.severity)}
												>{incidentResponse.severity.toUpperCase()}</Badge
											>
											<Badge color={getStatusColor(incidentResponse.status)}
												>{incidentResponse.status.toUpperCase()}</Badge
											>
										</div>
										{#if role != 'Junior Developer'}
											<Button
												class="w-10 h-10"
												size="xs"
												color="light"
												on:click={() => (editFormModal = true)}
											>
												<EditSolid class="w-6 h-6" />
											</Button>
										{/if}
									</div>
									<p class="text-sm text-gray-400 pb-2 pt-0.5 border-gray-500 border-b-2">
										{formatDate(incidentResponse.dateOfAction)}
									</p>
									<p class="text-gray-300 leading-relaxed p-1">{incidentResponse.actionsTaken}</p>
									{#if incidentResponse.status === 'closed'}
										<p class="text-gray-300 leading-relaxed pt-2">
											<span class="text-sm text-gray-400">Resolved At: <br></span>{formatTimestamp2(incidentResponse.resolved_at)}
										</p>
									{/if}
									<p class="text-gray-300 leading-relaxed text-right pt-2">
										Created By: {incidentResponse.created_by_username}
									</p>
								</div>
							{/if}
						</div>
						<div>
							<p class="text-sm text-gray-400">Rule</p>
							<div class="text-gray-300 col-span-2 bg-gray-700 p-3 rounded-lg mt-3 shadow-lg">
								<p class="text-gray-300">
									<span class="text-lg font-semibold">Blocked by</span>
									<br />
									<span class="text-sm">Rule ID :</span>
									<span class=" ">{logData[6]}</span>
									{#if ruleInfo != undefined}
										<br />
										<span class="text-sm">Rule Group:</span>
										<span class="text-md font-medium">{ruleInfo.FileName.slice(0, -5)}</span>
										{#if ruleInfo.Msg != undefined || ruleInfo.Msg != null || ruleInfo.Msg != ''}
											<br />
											<span class="text-sm">Reason:</span>
											<span class="text-md italic text-red-300">{ruleInfo.Msg}</span>
										{/if}
									{/if}
								</p>
								{#if ruleInfo != undefined}
									<div class="flex justify-end">
										<a href="/admin/rules/{ruleInfo.FileName.slice(0, -5)}" class="underline"
											>View Full Rule</a
										>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<p class="text-gray-700 dark:text-gray-300">Loading log details...</p>
	{/if}

	<!-- Add Incident Response Modal -->
	<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
		<form class="flex flex-col space-y-3" action="#" on:submit={addIncidentResponse}>
			<h3 class="mb-2 text-3xl font-medium text-gray-900 dark:text-white">Incident Response</h3>
			<Label class="space-y-2">
				<span>Title</span>
				<Input type="text" name="title" bind:value={title} placeholder="" required />
			</Label>
			<Label class="space-y-2">
				<span>Actions Taken</span>
				<Textarea
					type="text"
					name="actionsTaken"
					bind:value={actionsTaken}
					placeholder=""
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Date of Actions Taken</span>
				<Input
					type="date"
					name="dateOfActionsTaken"
					bind:value={dateOfActionsTaken}
					placeholder=""
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Severity</span>
				<Select name="severity" bind:value={severity} required>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				<span>Status</span>
				<Select name="status" bind:value={status} required>
					<option value="open">Open</option>
					<option value="in progress">In Progress</option>
					<option value="closed">Closed</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				<span >Resolved At</span>
				<Input type="datetime-local" name="resolvedAt" bind:value={resolvedAt} placeholder="" />
			</Label>
			<Button type="submit" class="w-full">Add Incident Response</Button>
		</form>
	</Modal>

	<!-- Edit Incident Response Modal -->
	<Modal bind:open={editFormModal} size="xs" autoclose={false} class="w-full">
		<form class="flex flex-col space-y-3" action="#" on:submit={editIncidentResponse}>
			<h3 class="mb-2 text-3xl font-medium text-gray-900 dark:text-white">
				Edit Incident Response
			</h3>
			<Label class="space-y-2">
				<span>Title</span>
				<Input type="text" name="title" bind:value={title} placeholder="" required />
			</Label>
			<Label class="space-y-2">
				<span>Actions Taken</span>
				<Textarea
					type="text"
					name="actionsTaken"
					bind:value={actionsTaken}
					placeholder=""
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Date of Actions Taken</span>
				<Input
					type="date"
					name="dateOfActionsTaken"
					bind:value={dateOfActionsTaken}
					placeholder=""
					required
				/>
			</Label>
			<Label class="space-y-2">
				<span>Severity</span>
				<Select name="severity" bind:value={severity} required>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				<span>Status</span>
				<Select name="status" bind:value={status} required>
					<option value="open">Open</option>
					<option value="in progress">In Progress</option>
					<option value="closed">Closed</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				<span>Resolved At</span>
				<Input type="datetime-local" name="resolvedAt" bind:value={resolvedAt} placeholder="" />
			</Label>
			<Button type="submit" class="w-full">Update Incident Response</Button>
		</form>
	</Modal>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
