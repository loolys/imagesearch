const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const apiCall = require('./apiHelper');

const url = process.env.MONGOLAB_URI;
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

const searchSchema = new mongoose.Schema({
	term: String
});
const searchModel = mongoose.model('Search', searchSchema);

const app = express();

app.get('/search/:term', function(req, res) {
	let term = new searchModel({ term: req.params.term });
	term.save(function(err){
		if (err) throw err;
		console.log('saved in db');
	});
	let call = req.params.term + '/time/0.json';
	console.log(req.query.offset);
	let offset = parseInt(req.query.offset);
	if (isNaN(offset)) {
		// default to 10 if no value given
		offset = 10;
	}
	if (offset <= 0) {
		offset = 1;
	} else if (offset > 59) {
		offset = 59;
	}
	console.log(offset);
	apiCall(call)
		.then(function (info) {
			let data = [];
			for (let i = 0; i < offset; i++) {
				let test = info.data.data[i].link.split('.').slice(0,3).join('.');
				let imgData = {
					link: info.data.data[i].link,
					title: info.data.data[i].title,
					pageLink: test
				};
				data.push(imgData);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		});
});

app.get('/latest', function(req, res) {
	// makes a query sorted by how the records are saved on disk
	let searchData = [];
	const query = searchModel.find().sort({$natural: -1}).limit(10);
	query.exec(function(err, docs) {
		if (err) throw err;
		let result = docs.map(function(x) {
			return x.term;
		});
		console.log(result);
		
		for (let i = 0; i < result.length; i++) {
			let jason = {
				term: result[i]
			};
			searchData.push(jason);
		}
		console.log(searchData);
		res.setHeader('Content-Type', 'application/json');
		res.json(searchData);
	});
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on " + port);
