<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let chart: any;

	onMount(() => {
		const options = {
			chart: {
				type: 'donut',
				height: 350
			},
			series: [44, 55, 41, 17, 15],
			labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}
			]
		};

		chart = new ApexCharts(document.querySelector('#donut-chart'), options);
		chart.render();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div id="donut-chart" />

<style>
	#donut-chart {
		max-width: 650px;
		margin: 35px auto;
	}
</style>
