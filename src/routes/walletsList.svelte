<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/wallets');
		const jsonRes = await res.json();
		return { props: { wallets: jsonRes.wallets } };
	}
</script>

<script>
	export let wallets;
	let newBalance = 0;

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

<div class="grid grid-cols-1 justify-items-strech container is-max-desktop">
	<div class="field has-addons has-addons-right ml-20 w-96">
		<p class="control min-w-full">
			<input class="input" type="text" placeholder="Wallet name" bind:value={walletName} />
		</p>
		<p class="control">
			<button class="button is-primary font-semibold" on:click={addWallet}> Create </button>
		</p>
	</div>

	<div class="flex">
		<div>
			<select
				bind:value={walletChoice}
				class="text-center font-bold h-10 outline-none border-2 rounded mr-20 cursor-pointer bg-gray-100"
			>
				{#each wallets as wallet}
					<option>{wallet.name}</option>
				{/each}
			</select>
		</div>
		<div class="field has-addons has-addons-right">
			<p class="control">
				<input
					class="input w-40"
					type="number"
					placeholder="Amount of money"
					bind:value={newBalance}
				/>
			</p>
			<p class="control">
				<button class="button is-primary font-semibold" on:click={updateWallet(walletChoice)}>
					Update
				</button>
			</p>
		</div>
	</div>
</div>

{#each wallets as wallet}
	<div class="card container is-max-desktop mt-10">
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
