const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
// const stringify = require('json-stringify-safe');
const apiCall = require('./apiHelper');

const app = express();

app.get('/', function(req, res) {
	apiCall('memes/viral/0.json')
		.then(function (info) {
			console.log(info.data.data[0]);
			let data = [];
			for (let i = 0; i < 10; i++) {
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
