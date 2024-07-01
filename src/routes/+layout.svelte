<script>
	// Importing necessary CSS files
	import '../app.postcss';
	import './styles.css';

	// Applying dark mode by adding the 'dark' class to the <html> element
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add('dark');
	}
</script>

<div class="app dark:bg-gray-900 dark:text-white">
	<!-- Uncomment the Header component if needed -->
	<!-- <Header /> -->

	<main class="dark:bg-gray-900 dark:text-white">
		<slot />
	</main>

	<!-- Uncomment the footer if needed -->
	<!-- <footer class="dark:bg-gray-900 dark:text-white">
    <p>visit <a href="https://kit.svelte.dev" class="dark:text-blue-500">kit.svelte.dev</a> to learn SvelteKit</p>
  </footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 68rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
