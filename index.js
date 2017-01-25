const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const apiCall = require('./apiHelper');

const app = express();

app.get('/search/:term', function(req, res) {
	let call = req.params.term + '/time/0.json';
	let offset = parseInt(req.query.offset);
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
				let imgData = {
					link: info.data.data[i].link,
					title: info.data.data[i].title
				};
				data.push(imgData);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		});
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on " + port);
