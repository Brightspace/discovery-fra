#! /usr/bin/env node
const os = require('os');

(() => {
	const networkInterfaces = os.networkInterfaces();

	for (var key in networkInterfaces) {
		if (networkInterfaces.hasOwnProperty(key)) {
			const addresses = networkInterfaces[key];
			const res = addresses.filter((addressObj) => {
				return addressObj.family === 'IPv4' && addressObj.internal === false;
			});

			if (res && res.length > 0 && res[0] && res[0].address) {
				console.log(res[0].address); // eslint-disable-line no-console
				return;
			}
		}
	}
})();
