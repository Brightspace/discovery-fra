describe('d2l-discover-list-empty', () => {
 	let element;

 	beforeEach(async() => {
 		element = fixture('d2l-discover-list-item-empty-fixture');
 		await element.updateComplete;
 	});

 	it('loads element', () => {
 		expect(element).to.exist;
 	});
});

describe('d2l-discover-list', () => {
 	let element;

 	beforeEach(async() => {
 		element = fixture('d2l-discover-list-item-href-fixture');
 		await element.updateComplete;
 	});

 	it('should set the href', () => {
 		element = fixture('d2l-discover-list-item-href-fixture');
 		expect(JSON.stringify(element.hrefs)).to.equal('["./data/base/activity.json"]');
 	});
});

describe('d2l-discover-list-entity', () => {
	let element;
	let activityEntity;

	beforeEach(async() => {
		element = fixture('d2l-discover-list-item-empty-fixture');

		const activityUrl = './data/base/activity.json';
		await fetch(activityUrl)
			.then(res => res.json())
				.then((out) => {
					activityEntity = window.D2L.Hypermedia.Siren.Parse(out);
					element.entities = [activityEntity];
		})

		await element.updateComplete;
	});

	it('should set entity', () => {
		expect(element.entities[0]).to.equal(activityEntity);
	});

	it('should fetch the organization', () => {
		expect(element._items[0].organizationUrl).to.equal('data/base/organization.json');
	});

	it('should ensure image loaded count increased', function(done) {
		setTimeout(() => {
			expect(element._loadedImageCount).to.equal(1);
			done();
		}, 1000);
	});

	it('should set the activity homepage', () => {
	 	expect(element._items[0].activityHomepage).to.equal('#');
	});
});

describe('Accessibility', () => {
	let element;

	beforeEach(async() => {
		element = fixture('d2l-discover-list-item-href-fixture');
		await element.updateComplete;
	});

	it('should set accessibility data', function(done) {
		setTimeout(() => {
			expect(element._items[0].accessibilityData.organizationName).to.equal('Actuators & Power');
			done();
		}, 1000);
	});
});

describe('Handle Events', () => {
	let element;
	let activityEntity;
	let textHandler;
	let imageHandler;
	afterEach(() => {
		window.document.removeEventListener('d2l-discover-text-loaded', textHandler);
		window.document.removeEventListener('d2l-discover-image-loaded', imageHandler);
	});

	it('should send text loaded event', function(done) {
		textHandler = () => {
			done();
		};
		window.document.addEventListener('d2l-discover-text-loaded', textHandler);
		element = fixture('d2l-discover-list-item-empty-fixture');

		const activityUrl = './data/base/activity.json';
		fetch(activityUrl)
			.then(res => res.json())
				.then((out) => {
					activityEntity = window.D2L.Hypermedia.Siren.Parse(out);
					element.entities = [activityEntity];
		})
	});

	it('should send image loaded event', function(done) {
		imageHandler = () => {
			done();
		};
		window.document.addEventListener('d2l-discover-image-loaded', imageHandler);
		element = fixture('d2l-discover-list-item-empty-fixture');

		const activityUrl = './data/base/activity.json';
		fetch(activityUrl)
			.then(res => res.json())
				.then((out) => {
					activityEntity = window.D2L.Hypermedia.Siren.Parse(out);
					element.entities = [activityEntity];
		})
	});
});

describe('Responsive Behaviour', () => {
	let elementWide;
	let elementShort;
	beforeEach(async() => {
		elementWide = fixture('d2l-discover-list-item-responsive-1000-fixture');
		await elementWide.updateComplete;
		elementShort = fixture('d2l-discover-list-item-responsive-385-fixture');
		await elementShort.updateComplete;
	});

	it('Description changes size within each breakpoint', function(done) {
		setTimeout(() => {
			const wideString = elementWide.shadowRoot.querySelector('.d2l-discover-list-item-description').getElementsByTagName("p")[0].innerHTML;
			const shortString = elementShort.shadowRoot.querySelector('.d2l-discover-list-item-description').getElementsByTagName("p")[0].innerHTML;
			assert(wideString.length > shortString.length);
			done();
		}, 1500);
	});
});
