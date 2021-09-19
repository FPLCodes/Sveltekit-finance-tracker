import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection.db;
		const collection = db.collection('transactions');
		const transactions = await collection.find().toArray();

		return {
			status: 200,
			body: {
				transactions
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
		const collection = db.collection('transactions');

		const transaction = JSON.parse(request.body);
		await collection.insertOne(transaction);

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
		const collection = db.collection('transactions');

		const transaction = JSON.parse(request.body);
		await collection.updateOne(
			{
				_id: ObjectId(transaction)
			},
			{
				$set: { total: transaction.total + transaction.amount }
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

export async function del(request) {}
