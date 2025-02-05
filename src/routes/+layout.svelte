<script>
	import '../app.css';
	import '@picocss/pico';
	let { children } = $props();
</script>

<header></header>
<main class="container py-12">
	{@render children()}
</main>
<footer></footer>
