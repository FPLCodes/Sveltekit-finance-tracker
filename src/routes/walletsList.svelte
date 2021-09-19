<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/wallets');
		const jsonRes = await res.json();
		return { props: { wallets: jsonRes.wallets } };
	}
</script>

<script>
	export let wallets;
	let newBalance;

	let walletName = '';
	let walletChoice = wallets[0].name;

	async function addWallet() {
		try {
			const wallet = {
				name: walletName,
				balance: newBalance
			};
			await fetch('/wallets', {
				method: 'POST',
				body: JSON.stringify(wallet)
			});
			console.log('Created wallet');
			fetchWallets();
		} catch (err) {
			console.log(err);
		}
	}

	async function updateWallet(walletChoice) {
		try {
			const wallet = {
				name: walletChoice,
				balance: newBalance
			};
			await fetch('/wallets', {
				method: 'POST',
				body: JSON.stringify(wallet)
			});
			console.log('Updated wallet');
			fetchWallets();
		} catch (err) {
			console.log(err);
		}
	}

	async function deleteWallet(wallet) {
		try {
			await fetch('/wallets', {
				method: 'DELETE',
				body: JSON.stringify(wallet)
			});
			console.log('Deleted wallet');
			fetchWallets();
		} catch (err) {
			console.log(err);
		}
	}

	async function fetchWallets() {
		const res = await fetch('/wallets');
		const jsonRes = await res.json();
		wallets = jsonRes.wallets;
	}
</script>

<div class="grid grid-cols-1 container is-fluid">
	<div class="field has-addons has-addons justify-self-center">
		<p class="control ">
			<input class="input w-72" type="text" placeholder="Wallet name" bind:value={walletName} />
		</p>
		<p class="control">
			<button class="button is-primary font-semibold" on:click={addWallet}> Create </button>
		</p>
	</div>

	<div class="flex justify-center">
		<div class="w-40">
			<select
				bind:value={walletChoice}
				class="text-center font-bold h-10 outline-none border-2 rounded mr-20 cursor-pointer bg-gray-100 w-36"
			>
				{#each wallets as wallet}
					<option>{wallet.name}</option>
				{/each}
			</select>
		</div>
		<div class="field has-addons">
			<p class="control">
				<input
					class="input w-32"
					type="number"
					placeholder="Adjust balance"
					bind:value={newBalance}
				/>
			</p>
			<p class="control">
				<button class="button is-primary font-semibold w-20" on:click={updateWallet(walletChoice)}>
					Update
				</button>
			</p>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 container is-fluid xl:grid-cols-3">
	{#each wallets as wallet}
		<div class="card container is-max-desktop mt-10 justify-self-auto w-96 rounded-lg">
			<header class="card-header bg-gray-100">
				<p class="card-header-title">{wallet.name}</p>
			</header>
			<div class="card-content ">
				<div class="content font-semibold">
					Balance: RM {wallet.balance}
					<br />
				</div>
			</div>
			<footer class="card-footer">
				<button class="card-footer-item bg-red-400 font-semibold" on:click={deleteWallet(wallet)}
					>Delete</button
				>
			</footer>
		</div>
	{/each}
</div>
