import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import SirenParse from 'siren-parser';
describe('search-results', () => {

	var component,
		fetchStub,
		sandbox,
		searchResultEntityNoResults,
		searchResultEntityWithResults;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match.has('url', sinon.match(url)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		searchResultEntityNoResults = SirenParse({
			class: [
				'activities',
				'collection'
			],
			properties: {
				pagingInfo: {
					total: 0,
					page: 0,
					pageSize: 20
				}
			},
			entities: [],
			links: [{
				rel: ['self'],
				href: 'https://us-east-1.discovery.bff.dev.brightspace.com/search?q=no+results&page=0&pageSize=20'
			}]
		});
		searchResultEntityWithResults = SirenParse({
			class: [
				'activities',
				'collection'
			],
			properties: {
				pagingInfo: {
					total: 2,
					page: 0,
					pageSize: 20
				}
			},
			entities: [{
				class: [
					'activity',
					'course'
				],
				rel: ['https://discovery.brightspace.com'],
				properties: {
					title: null,
					description: 'This is the course with ID of: 123063'
				},
				actions: [],
				links: [{
					rel:['https://api.brightspace.com/rels/organization'],
					href:'organization/1'
				}]
			}, {
				class: [
					'activity',
					'course'
				],
				rel: ['https://discovery.brightspace.com'],
				properties: {
					title: null,
					description: 'This is the course with ID of: 123064'
				},
				actions: [],
				links: [{
					rel:['https://api.brightspace.com/rels/organization'],
					href:'organization/1'
				}]
			}],
			links: [{
				rel: ['self'],
				href: 'https://us-east-1.discovery.bff.dev.brightspace.com/search?q=results&page=0&pageSize=20'
			}]
		});
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub(/\/search\/no-results$/, searchResultEntityNoResults);
		SetupFetchStub(/\/search\/results$/, searchResultEntityWithResults);
		SetupFetchStub(/\/organization\/1$/, {});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads element', () => {
		component = fixture('search-result-basic-fixture');
		expect(component).to.exist;
	});

	describe('With Results', () => {

		beforeEach(done => {
			component = fixture('search-result-with-results-fixture');
			afterNextRender(component, done);
		});

		it('should have href equal to /search/results', () => {
			expect(component.href).to.equal('/search/results');
		});

		it('should show total number of results', done => {
			afterNextRender(component, () => {
				const searchResultText = component.$$('#discovery-search-results-results-message').innerHTML;
				expect(searchResultText).to.include('of 2 for');
				done();
			});
		});

		it('should show range of currently displayed', done => {
			afterNextRender(component, () => {
				const searchResultText = component.$$('#discovery-search-results-results-message').innerHTML;
				expect(searchResultText).to.include('1-2');
				done();
			});
		});

		it('should show the current search query', done => {
			afterNextRender(component, () => {
				expect(component.searchQuery).to.equal('results');
				const searchResultText = component.$$('#discovery-search-results-results-message').innerHTML;
				expect(searchResultText).to.include('"results"');
				done();
			});
		});

		it('should show a list of d2l-activity-list-items', done => {
			afterNextRender(component, () => {
				expect(component.searchQuery).to.equal('results');
				const searchResults = component.shadowRoot.querySelectorAll('d2l-activity-list-item');
				expect(searchResults.length).is.greaterThan(0);
				done();
			});
		});

		it('Switch from results to no results.', done => {
			component.href = '/search/no-results';
			component.searchQuery =  'no results string';
			afterNextRender(component, () => {
				expect(component.href).to.equal('/search/no-results');
				expect(component.searchQuery).to.equal('no results string');
				expect(component._searchResultsTotal).to.equal(0);
				const searchResultText = component.$$('h2').innerHTML;
				expect(searchResultText).to.include('No results for');
				expect(searchResultText).to.include('no results string');
				done();
			});
		});

	});

	describe('With No Results', () => {

		beforeEach(done => {
			component = fixture('search-result-no-results-fixture');
			afterNextRender(component, done);
		});

		it('should have href equal to /search/no-results', () => {
			expect(component.href).to.equal('/search/no-results');
		});

		it('should show no results', done => {
			afterNextRender(component, () => {
				expect(component._searchResultsTotal).to.equal(0);
				const searchResultText = component.$$('h2').innerHTML;
				expect(searchResultText).to.include('No results for');
				expect(searchResultText).to.include('no results string');
				done();
			});
		});

		it('Switch from no results to results.', done => {
			component.href = '/search/results';
			component.searchQuery =  'results';
			afterNextRender(component, () => {
				expect(component.href).to.equal('/search/results');
				const searchResultText = component.$$('#discovery-search-results-results-message').innerHTML;
				expect(searchResultText).to.include('of 2 for');
				expect(component.searchQuery).to.equal('results');
				const searchResults = component.shadowRoot.querySelectorAll('d2l-activity-list-item');
				expect(searchResults.length).is.greaterThan(0);
				done();
			});
		});

	});

});
