var isAttestInstalled = function() { //eslint-disable-line no-unused-vars
	try {
		attest.reset();
	}
	catch (err) {
		return false;
	}
	return true;
};

var runAttest = function() { //eslint-disable-line no-unused-vars
	//disable a few rules that don't apply to our component
	var rules_options = {
		'rules':{
			'html-has-lang':{enabled:false},
			'landmark-one-main':{enabled:false},
			'page-has-heading-one':{enabled:false},
			'duplicate-id':{enabled:false},
		}
	};

	var res = null;
	return attest.run(rules_options)
		.then((results) => {
			res = results;
			expect(results.violations.length).to.equal(0);
		}).catch((err) => {
			if (err && res && res.violations) {
				res.violations.forEach((violation) => {
					// eslint-disable-next-line no-console
					console.log(JSON.stringify(violation));
				});
			}
			throw err;
		});
};
