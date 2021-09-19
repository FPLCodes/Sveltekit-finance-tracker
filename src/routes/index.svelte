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
	import { afterUpdate } from 'svelte';
	export let wallets;
	export let transactions;

	afterUpdate(() => {
		totalBalance = 0;
		wallets.forEach((wallet) => {
			totalBalance += wallet.balance;
		});
	});

	let totalBalance = 0;

	let amount = 0;
	let amountToAdd = 0;
	let walletToAdd = '';
	let description = '';
	let walletChoice = wallets[0].name;
	let date = '';
	let time = '';

	function getCurrentDate() {
		let currentDate = new Date();
		let cDay = currentDate.getDate();
		let cMonth = currentDate.getMonth() + 1;
		let cYear = currentDate.getFullYear();
		return `${cMonth + '/' + cDay + '/' + cYear}`;
	}

	function getCurrentTime() {
		let currentDate = new Date();
		let time =
			currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
		return time;
	}

	async function addTransaction() {
		date = getCurrentDate();
		time = getCurrentTime();

		try {
			const transaction = {
				amount: amount,
				walletUsed: walletChoice,
				desc: description,
				date: date,
				time: time
			};
			await fetch('/transactions', {
				method: 'POST',
				body: JSON.stringify(transaction)
			});
			fetchTransactions();
			updateWallet(false);
			console.log('Transaction completed');
		} catch (err) {
			console.log(err);
		}
	}

	async function deleteTransaction(transaction) {
		amountToAdd = transaction.amount;
		walletToAdd = transaction.walletUsed;
		try {
			await fetch('/transactions', {
				method: 'DELETE',
				body: JSON.stringify(transaction)
			});
			fetchTransactions();
			updateWallet(true);
			console.log('Transaction deleted');
		} catch (err) {
			console.log(err);
		}
	}

	async function fetchTransactions() {
		const res = await fetch('/transactions');
		const jsonRes = await res.json();
		transactions = jsonRes.transactions;
	}

	async function updateWallet(add) {
		let newBalance = 0;
		let walletToChange = add ? walletToAdd : walletChoice;
		wallets.forEach((wallet) => {
			if (wallet.name == walletToChange) {
				if (add === true) {
					newBalance = wallet.balance + amountToAdd;
				} else newBalance = wallet.balance - amount;
			}
		});
		try {
			const wallet = {
				name: walletToChange,
				balance: newBalance
			};
			await fetch('/wallets', {
				method: 'POST',
				body: JSON.stringify(wallet)
			});
			console.log('Created wallet');
			fetchWallets();
			console.log('Wallet updated');
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

<div class="grid grid-cols-1 place-content-center lg:grid-cols-2">
	<div class="container is-fluid max-w-2xl mb-3 lg:max-w-2xl">
		<div class="card container is-max-desktop max-w-2xl lg:max-w-3xl">
			<header class="card-header bg-yellow-100 text-2xl lg:text-3xl">
				<p class="card-header-title">Total Balance: RM {totalBalance}</p>
			</header>
			<div class="card-content">
				<div class="content font-semibold grid grid-cols-2 gap-4 justify-items-stretch">
					{#each wallets as wallet}
						<div class="card text-xs bg-gray-300">
							<header class="card-header bg-green-300">
								<h3 class="ml-2 mt-1">{wallet.name}</h3>
							</header>
							<div class="ml-2 mt-1 pt-4 h-14">
								<h1>RM {wallet.balance}</h1>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="container is-max-desktop max-w-md lg:max-w-md md:max-w-2xl sm:max-w-xl">
		<h1 class="text-2xl mb-3 font-semibold">Add Transactions</h1>
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
				<div class="w-40 mr-3">
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
	<div class="container is-fluid max-w-2xl mt-3 lg:max-w-3xl">
		<div class="container is-max-desktop max-w-2xl mb-3 lg:max-w-3xl">
			<h1 class="text-2xl mb-3 font-semibold">Transaction history</h1>
			{#each transactions as transaction}
				<div class="card grid grid-cols-2 mt-2 max-w-3xl transition hover:scale-105">
					<div class="card-content">
						<div class="content font-semibold text-lg">
							<h3>RM {transaction.amount}</h3>
							<p>{transaction.desc} ({transaction.walletUsed})</p>
						</div>
					</div>
					<div class="justify-self-end mt-3">
						<div class="ml-24">
							<button class="delete bg-red-400" on:click={deleteTransaction(transaction)} />
						</div>
						<div class="mt-14 mr-2 text-sm">
							{transaction.date}, {transaction.time}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
