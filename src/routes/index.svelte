<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/wallets');
		const jsonRes = await res.json();
		return { props: { wallets: jsonRes.wallets } };
	}
</script>

<script>
	export let wallets;

	let totalBalance = 0;
	wallets.forEach((wallet) => {
		totalBalance += wallet.balance;
	});
</script>

<div class="card container is-max-desktop max-w-sm mt-10">
	<header class="card-header bg-yellow-100 text-lg">
		<p class="card-header-title">Total Balance: RM {totalBalance}</p>
	</header>
	<div class="card-content ">
		<div class="content font-semibold">
			{#each wallets as wallet}
				<div class="block">
					{wallet.name}: RM {wallet.balance}
				</div>
			{/each}
		</div>
	</div>
</div>
