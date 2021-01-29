import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { FetchMixin } from '../../src/mixins/fetch-mixin.js';
import SirenParse from 'siren-parser';

describe('Fetch Mixin Tests', () => {
	let component,
		fetchStub,
		sandbox,
		bffRootResponse;
	function SetupFetchStub(url, entity) {
		const request = new Request(url, {
			headers: {
				Accept: 'application/vnd.siren+json',
				Authorization: 'Bearer ' + 'token'
			},
		});
		fetchStub.withArgs(request)
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(entity); }
			}));
	}
	before(() => {
		class FetchMixinTest extends FetchMixin(PolymerElement) {}
		window.customElements.define('fetch-mixin-test', FetchMixinTest);

		bffRootResponse = SirenParse({
			class: ['root'],
			actions: [{
				name: 'search-activities',
				method: 'PUT',
				href: 'https://bff.test/search',
				type: 'application/json',
				fields: [{
					name: 'q',
					type: 'text'
				},
				{
					name: 'page',
					type: 'number'
				},
				{
					name: 'pageSize',
					type: 'number'
				}]
			}
			],
			links: [{
				rel: ['self'],
				href: 'https://bff.test/'
			}]
		});
		const fraSetup = {
			options: {
				endpoint: '/bffRootEndPoint/1'
			}
		};

		window.D2L = {};
		window.D2L.frau = fraSetup;
		component = new FetchMixinTest();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(window.d2lfetch, 'removeTemp')
			.withArgs('dedupe').returns(window.d2lfetch)
			.withArgs('auth').returns(window.d2lfetch);
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');
		SetupFetchStub(/\/bffRootEndpoint\/1$/, bffRootResponse);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('check if url is encoded correctly.', () => {
		const href = 'http://url.example.com/test';
		const defaultParams = {
			param1: 'test',
			param2: 'test2 Space',
			param3: 'test3'
		};
		const userParams = {
			param3: 'test4'
		};
		const url = component.__createActionUrl(href, defaultParams, userParams);
		assert.equal(url, 'http://url.example.com/test?param1=test&param2=test2+Space&param3=test4');
	});

	it('Get actions will get the proper url', () => {
		const action = 'search-activities';
		const userParams = {
			q: 'search'
		};
		return component._getActionUrl(action, userParams)
			.then((url) => {
				assert.equal(url, 'https://bff.test/search?q=search');
			})
			.catch((e) => {
				assert.equal(e, false);
			});
	});

	describe('_fetchEntity', () => {
		it('should skip auth for nofollow links', async() => {
			await component._fetchEntity({
				rel: ['nofollow'],
				href: '/bffRootEndpoint/1',
			});

			sinon.assert.calledWith(window.d2lfetch.removeTemp, 'auth');
		});
	});

	describe('_fetchEntityWithoutDedupe', () => {
		it('should skip auth and dedupe for nofollow links', async() => {
			await component._fetchEntityWithoutDedupe({
				rel: ['nofollow'],
				href: '/bffRootEndpoint/1',
			});

			sinon.assert.calledWith(window.d2lfetch.removeTemp, 'auth');
			sinon.assert.calledWith(window.d2lfetch.removeTemp, 'dedupe');
		});
	});

	describe('_shouldSkipAuth', () => {
		it('should return false for string urls', () => {
			assert.equal(
				component._shouldSkipAuth('https://example.com'),
				false
			);
		});

		it('should return false for siren links without nofollow rel', () => {
			assert.equal(
				component._shouldSkipAuth({
					rel: ['https://api.brightspace.com/rels/organization-image'],
					href: 'https://example.com',
				}),
				false
			);
		});

		it('should return false for siren links without rel', () => {
			assert.equal(
				component._shouldSkipAuth({
					href: 'https://example.com',
				}),
				false
			);
		});

		it('should return true for siren links with nofollow rel', () => {
			assert.equal(
				component._shouldSkipAuth({
					rel: ['https://api.brightspace.com/rels/organization-image', 'nofollow'],
					href: 'https://example.com',
				}),
				true
			);
		});
	});
});
