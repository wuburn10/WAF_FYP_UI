<script lang="ts">
	import { onMount } from 'svelte';
	import { AdminService } from '$lib/service/admin.service';
	import { Button, Popover } from 'flowbite-svelte';
	import Chart from 'chart.js/auto';
	import { CommandOutline, QuestionCircleSolid, ChevronRightOutline } from 'flowbite-svelte-icons';

	let accepted = 0;
	let denied = 0;
	let highestUserAgent = '';
	let dashboardData = {
		trafficOverTime: [],
		topClientIPs: [],
		topPaths: [],
		acceptHeaders: [],
		topUserAgents: [],
		topRulesTriggered: [],
		highestBlockedIP: { label: '', value: 0 }
	};
	let dateTime: any;

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
		return date.toLocaleString('en-US', options).replace(',', '');
	}

	onMount(async () => {
		await getDashboardData();
		initializeCharts();
	});

	async function getDashboardData() {
		try {
			let res = await AdminService.getDashboardData();
			dateTime = formatTimestamp(new Date());
			console.log(res);
			dashboardData = res.dashboard;
			console.log(dashboardData.acceptHeaders);
			if (dashboardData.acceptHeaders.length == 2) {
				// @ts-ignore
				denied = dashboardData.acceptHeaders[1].value;
				// @ts-ignore
				accepted = dashboardData.acceptHeaders[0].value;
			} else {
				denied = 0;
				// @ts-ignore
				accepted = dashboardData.acceptHeaders[0].value;
			}

			// @ts-ignore
			highestUserAgent = dashboardData.topUserAgents[0].label;
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		}
	}

	// @ts-ignore
	function formatDate(dateString) {
		const options = {
			hour: '2-digit',
			minute: '2-digit'
		};
		// @ts-ignore
		return new Date(dateString).toLocaleString(undefined, options);
	}

	function initializeCharts() {
		if (!dashboardData) {
			return;
		}

		// Top Client IPs Chart
		// @ts-ignore
		const ctx2 = document.getElementById('topClientIPsChart').getContext('2d');
		new Chart(ctx2, {
			type: 'bar',
			data: {
				// @ts-ignore
				labels: dashboardData.topClientIPs.map((dp) => dp.label),
				datasets: [
					{
						label: 'Top Client IPs',
						// @ts-ignore
						data: dashboardData.topClientIPs.map((dp) => dp.value),
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						title: {
							display: true,
							text: 'IP Address',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Count',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					}
				},
				plugins: {
					legend: {
						display: false,
						position: 'bottom',
						labels: {
							color: 'white'
						}
					}
				}
			}
		});

		// Top Paths Chart
		// @ts-ignore
		const ctx3 = document.getElementById('topPathsChart').getContext('2d');
		new Chart(ctx3, {
			type: 'bar',
			data: {
				// @ts-ignore
				labels: dashboardData.topPaths.map((dp) => dp.label),
				datasets: [
					{
						label: 'Top Paths',
						// @ts-ignore
						data: dashboardData.topPaths.map((dp) => dp.value),
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						title: {
							display: true,
							text: 'Path',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Count',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					}
				},
				plugins: {
					legend: {
						display: false,
						position: 'top',
						labels: {
							color: 'white'
						}
					}
				}
			}
		});

		// Top Rules Triggered Chart
		// @ts-ignore
		const ctx6 = document.getElementById('topRulesTriggeredChart').getContext('2d');
		new Chart(ctx6, {
			type: 'doughnut',
			data: {
				// @ts-ignore
				labels: dashboardData.topRulesTriggered.map((dp) => dp.label),
				datasets: [
					{
						label: 'Top Rules Triggered',
						// @ts-ignore
						data: dashboardData.topRulesTriggered.map((dp) => dp.value),
						backgroundColor: [
							'rgba(255, 99, 132, 0.9)',
							'rgba(54, 162, 235, 0.9)',
							'rgba(255, 206, 86, 0.9)',
							'rgba(75, 192, 192, 0.9)',
							'rgba(153, 102, 255, 0.9)',
							'rgba(255, 159, 64, 0.9)'
						],
						borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: 'white'
						}
					}
				}
			}
		});

		// Traffic Over Time Chart
		// @ts-ignore
		const ctx7 = document.getElementById('requestOverTime').getContext('2d');
		new Chart(ctx7, {
			type: 'line',
			data: {
				// @ts-ignore
				labels: dashboardData.trafficOverTime.map((dp) => formatDate(dp.label)),
				datasets: [
					{
						label: 'Request',
						// @ts-ignore
						data: dashboardData.trafficOverTime.map((dp) => dp.value),
						fill: false,
						borderColor: 'rgb(75, 192, 192)',
						tension: 0.1
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						title: {
							display: true,
							text: 'Timestamp',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Count',
							color: 'white'
						},
						ticks: {
							color: 'white'
						}
					}
				},
				plugins: {
					legend: {
						position: 'top',
						labels: {
							color: 'white'
						}
					}
				}
			}
		});
	}
</script>

{#if dashboardData != undefined}
	<div class="flex justify-between m-3 mt-0">
		<h1>Dashboard</h1>
		<div class="flex">
			{#if dateTime != undefined}
				<div class="flex justify-end mt-1 self-end">
					<span class="text-xs">Last Updated : {dateTime}</span>
				</div>
			{/if}
			<Button pill color="dark" on:click={getDashboardData} class="ml-5">
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
	<div class="grid md:grid-cols-3 gap-4 px-2 mb-3 grid-cols-1">
		<div
			class="bg-gray-800 rounded p-3 flex flex-col col-span-2 justify-between max-h-96 pb-12 flex-grow-0"
		>
			<div class="flex items-center">
				<CommandOutline size="md" class="m-1.5" color="orange" />
				<h2>Request Over Time (Last 24hrs)</h2>
				<button id="b1" class="ml-1">
					<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
					<span class="sr-only">Request Over Time (Last 24 hrs)</span>
				</button>
				<Popover
					triggeredBy="#b1"
					class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
					placement="bottom-start"
				>
					<div class="p-3 space-y-2">
						<h3 class="font-semibold text-gray-900 dark:text-white">Request Over Time</h3>
						This chart shows the number of requests over time, providing a visual representation of traffic
						trends and patterns. It helps you as an administrator identify peak usage times and detect
						unusual activity that may indicate potential security threats.
					</div>
				</Popover>
			</div>
			<canvas id="requestOverTime" />
		</div>
		<div class="bg-gray-800 rounded p-3 flex flex-col">
			<div class="flex items-center">
				<CommandOutline size="md" class="m-1.5" color="orange" />
				<h2>Request Breakdown</h2>
				<button id="b2" class="ml-1">
					<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
					<span class="sr-only">Request Breakdown</span>
				</button>
				<Popover
					triggeredBy="#b2"
					class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
					placement="bottom-start"
				>
					<div class="p-3 space-y-2">
						<h3 class="font-semibold text-gray-900 dark:text-white">Request Breakdown</h3>
						This chart provides a breakdown of all requests, including total requests, denied requests,
						and blocked requests. It offers insight into the effectiveness of the WAF in filtering out
						malicious traffic and maintaining the integrity of web applications.
					</div>
				</Popover>
			</div>
			<div
				class="donut box dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-around flex-grow"
			>
				<div
					class="summary-card box dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center"
				>
					<p class="text-xs text-center mb-2">Total Requests</p>
					<p
						id="totalRequests"
						class="text-3xl text-center font-bold border rounded-full w-20 h-20 flex justify-center items-center"
					>
						{accepted + denied}
					</p>
				</div>
				<div
					class="summary-card box dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center"
				>
					<p class="text-xs text-center mb-2">Accepted Requests</p>
					<div>
						<div
							id="acceptedRequests"
							class="text-3xl text-green-600 font-bold text-center border rounded-full w-20 h-20 flex justify-center items-center"
						>
							{accepted}
						</div>
					</div>
				</div>
				<div
					class="summary-card box dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center"
				>
					<p class="text-xs text-center mb-2">Blocked Requests</p>
					<p
						id="blockedRequests"
						class="text-3xl text-red-600 font-bold text-center border rounded-full w-20 h-20 flex justify-center items-center"
					>
						{denied}
					</p>
				</div>
			</div>
		</div>
		<div class="bg-gray-800 rounded p-3 flex flex-col max-h-96 pb-20">
			<div class="flex items-center">
				<CommandOutline size="md" class="m-1.5" color="orange" />
				<h2>Rules Triggered</h2>
				<button id="b3" class="ml-1">
					<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
					<span class="sr-only">Rules Triggered</span>
				</button>
				<Popover
					triggeredBy="#b3"
					class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
					placement="bottom-start"
				>
					<div class="p-3 space-y-2">
						<h3 class="font-semibold text-gray-900 dark:text-white">Rules Triggered</h3>
						This chart displays the security rules that have been triggered most frequently. It helps
						administrators identify the types of attacks or suspicious activities most commonly encountered,
						allowing for better tuning of security measures and quick response to emerging threats. Understanding
						which rules are triggered can also indicate potential areas of vulnerability in the web application.
					</div>
				</Popover>
			</div>
			{#if dashboardData.topRulesTriggered.length == 0}
				<span class="italic">No Rules Triggered Yet</span>
			{/if}
			<canvas id="topRulesTriggeredChart" />

			<div class={dashboardData.topRulesTriggered.length == 0 ? 'mt-0' : 'mt-2'}>
				<a href="/admin/rules" class="underline">View All Rules</a>
			</div>
		</div>
		<div class="bg-gray-800 rounded p-3 flex flex-col justify-between max-h-96 pb-20">
			<div class="flex items-center">
				<CommandOutline size="md" class="m-1.5" color="orange" />
				<h2>Top Client IPs</h2>
				<button id="b4" class="ml-1">
					<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
					<span class="sr-only">Top Client IPs</span>
				</button>
				<Popover
					triggeredBy="#b4"
					class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
					placement="bottom-start"
				>
					<div class="p-3 space-y-2">
						<h3 class="font-semibold text-gray-900 dark:text-white">Top Client IPs</h3>
						This chart displays the IP addresses with the highest number of requests. It helps administrators
						identify frequent visitors and monitor potential malicious activity from specific IP addresses.
					</div>
				</Popover>
			</div>
			<canvas id="topClientIPsChart" />
		</div>
		<div class="bg-gray-800 rounded p-3 flex flex-col justify-between max-h-96 pb-20">
			<div class="flex items-center">
				<CommandOutline size="md" class="m-1.5" color="orange" />
				<h2>Top Paths</h2>
				<button id="b5" class="ml-1">
					<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
					<span class="sr-only">Top Paths</span>
				</button>
				<Popover
					triggeredBy="#b5"
					class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
					placement="bottom-start"
				>
					<div class="p-3 space-y-2">
						<h3 class="font-semibold text-gray-900 dark:text-white">Top Paths</h3>
						This chart shows the most accessed paths on your web application. It helps you as an administrator
						to understand user behavior, monitor the popularity of different sections, and detect unusual
						access patterns that may indicate an attack.
					</div>
				</Popover>
			</div>
			<canvas id="topPathsChart" />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-3">
			<div class="bg-gray-800 rounded p-3 flex flex-col justify-between max-h-80 pb-20">
				<div class="flex items-center">
					<CommandOutline size="md" class="m-1.5" color="orange" />
					<h2>Highest User Agent</h2>
					<button id="b6" class="ml-1">
						<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
						<span class="sr-only">Highest User Agent</span>
					</button>
					<Popover
						triggeredBy="#b6"
						class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
						placement="bottom-start"
					>
						<div class="p-3 space-y-2">
							<h3 class="font-semibold text-gray-900 dark:text-white">Highest User Agent</h3>
							This chart lists the most common user agents accessing your application. It provides insight
							into the types of browsers and devices being used, which can help in optimizing performance
							and security measures.
						</div>
					</Popover>
				</div>
				<span class="self-start text-3xl pt-4">
					{highestUserAgent}
				</span>
			</div>
			<div class="bg-gray-800 rounded p-3 flex flex-col justify-between max-h-80 pb-20">
				<div class="flex items-center">
					<CommandOutline size="md" class="m-1.5" color="orange" />
					<h2>IP with Highest Denied Request</h2>
					<button id="b7" class="ml-1">
						<QuestionCircleSolid class="w-5 h-5 ms-1.5" />
						<span class="sr-only">IP with Highest Denied Request</span>
					</button>
					<Popover
						triggeredBy="#b7"
						class="w-72 text-sm font-light text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
						placement="bottom-start"
					>
						<div class="p-3 space-y-2">
							<h3 class="font-semibold text-gray-900 dark:text-white">
								IP with Highest Denied Request
							</h3>
							This chart identifies the IP address with the most denied requests, along with the count.
							It highlights potentially malicious IPs, allowing administrators to take proactive measures
							to block or monitor these sources more
						</div>
					</Popover>
				</div>
				<div class="text-white text-center text-lg font-bold mt-4 flex">
					<span class="w-1/2 self-start text-3xl">
						IP: <br />{dashboardData.highestBlockedIP.label}
					</span>
					<span class="w-1/2 text-3xl flex flex-col">
						<span class="">Count:</span>
						<div
							id="acceptedRequests"
							class="text-3xl text-red-600 font-bold text-center border rounded-full w-20 h-20 flex justify-center items-center self-center"
						>
							{dashboardData.highestBlockedIP.value}
						</div>
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
