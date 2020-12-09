'use strict';
import 'whatwg-fetch'; // Required for d2l-fetch + IE11
import { d2lfetch } from 'd2l-fetch/src/index.js';
window.d2lfetch = d2lfetch;

import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import SirenParse from 'siren-parser';
import 'promise-polyfill/src/polyfill.js';
import 'url-polyfill/url-polyfill.min.js';

window.d2lfetch = d2lfetch.removeTemp('simple-cache');

/* @polymerMixin */
const internalFetchMixin = (superClass) => class extends superClass {
	constructor() {
		super();
	}

	async _fetchEntity(sirenLinkOrUrl, method = 'GET') {
		if (!sirenLinkOrUrl) {
			return;
		}

		const url = sirenLinkOrUrl.href || sirenLinkOrUrl;

		if (!url) {
			return;
		}

		const request = await this._createRequest(url, method);


		const fetch = this._shouldSkipAuth(sirenLinkOrUrl)
			? window.d2lfetch.removeTemp('auth')
			: window.d2lfetch;

		return fetch
			.fetch(request)
			.then(this.__responseToSirenEntity.bind(this));
	}

	async _fetchEntityWithoutDedupe(sirenLinkOrUrl, method = 'GET') {
		if (!sirenLinkOrUrl) {
			return;
		}

		const url = sirenLinkOrUrl.href || sirenLinkOrUrl;

		if (!url) {
			return;
		}

		const request = await this._createRequest(url, method);


		const fetch = this._shouldSkipAuth(sirenLinkOrUrl)
			? window.d2lfetch.removeTemp('auth')
			: window.d2lfetch;

		return fetch
			.removeTemp('dedupe')
			.fetch(request)
			.then(this.__responseToSirenEntity.bind(this));
	}

	_getActionUrl(action, userParams) {
		return Promise.resolve()
			.then(() => {
				const fraSetup = window.D2L && window.D2L.frau;
				const bffEndpoint = fraSetup && fraSetup.options && fraSetup.options.endpoint;
				if (!bffEndpoint) {
					throw new Error('BFF endpoint does not exist');
				}
				return this._fetchEntityWithoutDedupe(bffEndpoint);
			})
			.then((response) => {
				const searchAction = response.getAction(action);
				if (!searchAction) {
					throw new Error('Can\'t find action ' + action);
				}
				const defaultParams = searchAction.fields && searchAction.fields.reduce((defaults, field) => {
					defaults[field.name] = field.value;
					return defaults;
				}, {});
				return this.__createActionUrl(searchAction.href, defaultParams, userParams);
			});
	}

	__createActionUrl(href, defaultParams, userParams) {
		const query = Object.assign({}, defaultParams, userParams);
		const parsedUrl = new URL(href);

		Object.keys(query).forEach((key) => {
			if (query[key] !== undefined) {
				parsedUrl.searchParams.append(key, query[key]);
			}
		});

		return parsedUrl.href;
	}

	__responseToSirenEntity(response) {
		if (response.ok) {
			if (response.status === 204) {
				return undefined; // let no entity be a valid entity...
			}

			return response
				.json()
				.then(function(json) {
					return SirenParse(json);
				});
		}
		return Promise.reject(response.status + ' ' + response.statusText);
	}

	async _createRequest(url, method) {
		const token = await this._getToken();
		const request = new Request(url, {
			method,
			headers: {
				Accept: 'application/vnd.siren+json',
				Authorization: 'Bearer ' + token
			},
		});

		return request;
	}

	//Globally initializes the token using the passed tokenReciever function.
	async _initializeToken(tokenPromise) {
		window.D2L.tokenPromise = tokenPromise;
	}

	async _getToken() {
		if (window.D2L.tokenPromise) {
			const token = await window.D2L.tokenPromise();
			return token;
		}
	}

	_shouldSkipAuth(sirenLinkOrUrl) {
		if (!Array.isArray(sirenLinkOrUrl.rel)) {
			return false;
		}

		if (sirenLinkOrUrl.rel.indexOf('nofollow') === -1) {
			return false;
		}

		return true;
	}
};

export const FetchMixin = dedupingMixin(internalFetchMixin);
