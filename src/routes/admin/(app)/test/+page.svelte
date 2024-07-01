<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	// Donut Chart Data
	const donutData = {
		labels: ['SQL Injection', 'XSS', 'RCE', 'Others'],
		datasets: [
			{
				label: 'Attack Attempts',
				data: [82, 10, 2, 25],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(54, 162, 235)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)'
				],
				hoverOffset: 4
			}
		]
	};

	// Area Chart Data
	const areaData = {
		labels: ['10:00am', '11:00am', '12:00pm', '1:00pm'],
		datasets: [
			{
				label: 'Accepted',
				data: [30, 50, 70, 60],
				fill: true,
				backgroundColor: 'rgba(153, 102, 255, 0.2)',
				borderColor: 'rgb(153, 102, 255)',
				tension: 0.1
			},
			{
				label: 'Denied',
				data: [20, 30, 40, 50],
				fill: true,
				backgroundColor: 'rgba(255, 159, 64, 0.2)',
				borderColor: 'rgb(255, 159, 64)',
				tension: 0.1
			}
		]
	};

	onMount(() => {
		// Donut Chart
		const donutCtx = document.getElementById('donutChart').getContext('2d');
		new Chart(donutCtx, {
			type: 'doughnut',
			data: donutData,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top'
					}
				}
			}
		});

		// Area Chart
		const areaCtx = document.getElementById('areaChart').getContext('2d');
		new Chart(areaCtx, {
			type: 'line',
			data: areaData,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top'
					}
				},
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});
</script>

<div class="dashboard">
	<div class="header box">xyz.com Dashboard</div>
	<div class="donut box">
		<canvas id="donutChart" />
	</div>
	<div class="total-calls box">Total Calls<br />657</div>
	<div class="blocked-calls box">Blocked Calls<br />65</div>
	<div class="api-calls box">
		<div>API Calls: 267</div>
		<div>UI Calls: 390</div>
		<div>Accept Rate (API): 78%</div>
		<div>Accept Rate (UI): 95.01%</div>
	</div>
	<div class="area box">
		<canvas id="areaChart" />
	</div>
	<div class="users box">Connected Users<br />29</div>
</div>

<style>
	.dashboard {
		display: grid;
		grid-template-areas:
			'header header header'
			'donut total-calls api-calls'
			'donut blocked-calls api-calls'
			'area area area'
			'area area area'
			'users users users';
		grid-gap: 20px;
		padding: 20px;
		background-color: #f0f2f5;
		color: #333;
		height: 100vh;
	}

	.header {
		grid-area: header;
		text-align: center;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.box {
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 20px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.donut {
		grid-area: donut;
	}

	.total-calls {
		grid-area: total-calls;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
	}

	.blocked-calls {
		grid-area: blocked-calls;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
	}

	.api-calls {
		grid-area: api-calls;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: bold;
	}

	.area {
		grid-area: area;
	}

	.users {
		grid-area: users;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
	}

	canvas {
		width: 100% !important;
		height: 100% !important;
	}
</style>
