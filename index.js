const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const stringify = require('json-stringify-safe');
const apiCall = require('./apiHelper');

const app = express();

app.get('/', function(req, res) {
	apiCall('memes/viral/0.json')
		.then(function (info) {
			console.log(info);
		});
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on " + port);
