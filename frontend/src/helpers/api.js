import axios from 'axios'


const baseURL = 'http://3.34.139.150';

const axiosClient = axios.create({
	baseURL: baseURL,
	//timeout: 2000,


});

const axiosFile = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'multipart/form-data',
		'Accept': 'application/json',
	  },
	// timeout: 2000,

});

function getPath(payload, url) {
	let iterations = Object.entries(payload).length;
	var pathArr = "?";
	if (url)
		url.includes("?") ? pathArr = '&' : pathArr = '?'

	for (let key in payload) {
		if (!--iterations) {
			pathArr += key + "=" + payload[key];
		} else {
			pathArr += key + "=" + payload[key] + "&";
		}
	}
	return pathArr;
}
