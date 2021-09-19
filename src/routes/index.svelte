<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/wallets');
		const res2 = await fetch('/transactions');
		const jsonRes = await res.json();
		const jsonRes2 = await res2.json();
		return { props: { wallets: jsonRes.wallets, transactions: jsonRes2.transactions } };
	}
</script>

<script>
	export let wallets;
	export let transactions;

	let totalBalance = 0;
	wallets.forEach((wallet) => {
		totalBalance += wallet.balance;
	});

	let amount = 0;
	let description = '';
	let walletChoice = wallets[0].name;

	async function addTransaction() {
		try {
			const transaction = {
				amount: amount,
				walletUsed: walletChoice,
				desc: description
			};
			await fetch('/transactions', {
				method: 'POST',
				body: JSON.stringify(transaction)
			});
			fetchTransactions();
			console.log('Transaction completed');
		} catch (err) {
			console.log(err);
		}
	}

	async function fetchTransactions() {
		const res = await fetch('/transactions');
		const jsonRes = await res.json();
		transactions = jsonRes.transactions;
	}
</script>

<div class="flex">
	<div class="card container is-max-desktop max-w-md">
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

	<div class="container is-max-desktop max-w-md">
		<h1 class="text-4xl text-center mb-3 font-semibold">Add Transactions</h1>
		<div class="card">
			<header class="card-header bg-gray-100">
				<p class="card-header-title">Amount:</p>
				<input
					type="number"
					class="card-header-title bg-gray-100 text-center"
					bind:value={amount}
				/>
			</header>
			<div class="card-content">
				<div class="content">
					<input
						type="text"
						placeholder="Description"
						bind:value={description}
						class="outline-none min-w-full"
					/>
				</div>
			</div>
			<footer class="card-footer">
				<div class="w-40">
					<select
						class="text-center font-bold h-10 outline-none mr-20 cursor-pointer w-40"
						bind:value={walletChoice}
					>
						{#each wallets as wallet}
							<option>{wallet.name}</option>
						{/each}
					</select>
				</div>
				<button class="card-footer-item bg-green-500 font-semibold" on:click={addTransaction}
					>Confirm</button
				>
			</footer>
		</div>
	</div>
</div>
