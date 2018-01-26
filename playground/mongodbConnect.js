// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TSS', (err, db) => {
	if(err) {
		return console.log('Unable to connect to mongoDB server.');
	}
	console.log('Connected to mongoDB server.');

	db.user('Users').insertOne({
		firstN: 'Kevin',
		lastN: 'Loi',
		email: 'kloi@ucsc.edu',
		location: 'Santa Cruz',
	}, (err, res) => {
		if(err) {
			return console.log('Unable to insert user', err);
		}

		console.log(JSON.stringify(res.ops, undefined, 2));
	});

	db.close();
});

