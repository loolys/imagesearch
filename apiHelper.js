const axios = require('axios');

const instance = axios.create({
	baseURL: 'https://api.imgur.com/3/g/',
	timeout: 2000,
	headers: { 'Authorization': 'Client-ID 94d17a09269dea1' }
});

module.exports = function getGallery(url) {
	return instance.get(url)
		.then(function(info){
			return info;
		});
}
