import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('wallets');
		const wallets = await collection.find().toArray();

		return {
			status: 200,
			body: {
				wallets
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500
		};
	}
}
export async function post(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('wallets');

		const wallet = JSON.parse(request.body);
		await collection.updateOne(
			{
				name: wallet.name
			},
			{
				$set: {
					name: wallet.name,
					balance: wallet.balance
				}
			},
			{
				upsert: true
			}
		);

		return {
			status: 200,
			body: {
				status: 'Success'
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				error: err
			}
		};
	}
}
export async function put(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('wallets');

		const wallet = JSON.parse(request.body);
		await collection.updateOne(
			{
				_id: ObjectId(wallet._id)
			},
			{
				$set: { balance: 5 }
			}
		);

		return {
			status: 200,
			body: {
				status: 'Success'
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				error: err
			}
		};
	}
}

export async function del(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('wallets');

		const wallet = JSON.parse(request.body);
		await collection.deleteOne({
			_id: ObjectId(wallet._id)
		});

		return {
			status: 200,
			body: {
				status: 'Success'
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				error: err
			}
		};
	}
}
