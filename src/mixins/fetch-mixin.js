'use strict';
import 'whatwg-fetch'; // Required for d2l-fetch + IE11
import { d2lfetch } from 'd2l-fetch/src/index.js';
import fetchAuthFramed from 'd2l-fetch-auth/es6/d2lfetch-auth-framed.js';
d2lfetch.use({
	name: 'auth',
	fn: fetchAuthFramed,
	options: {
		enableTokenCache: true
	}
});
import { fetchDedupe } from 'd2l-fetch-dedupe';
d2lfetch.use({name: 'dedupe', fn: fetchDedupe});
window.d2lfetch = d2lfetch;

import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import SirenParse from 'siren-parser';
import 'promise-polyfill/src/polyfill.js';
import 'url-polyfill/url-polyfill.min.js';

/* @polymerMixin */
const internalFetchMixin = (superClass) => class extends superClass {
	constructor() {
		super();
	}
	_fetchEntity(sirenLinkOrUrl, method = 'GET') {
		if (!sirenLinkOrUrl) {
			return;
		}

		const url = sirenLinkOrUrl.href || sirenLinkOrUrl;

		if (!url) {
			return;
		}

		const request = new Request(url, {
			method,
			headers: { Accept: 'application/vnd.siren+json' },
		});

		const fetch = this._shouldSkipAuth(sirenLinkOrUrl)
			? window.d2lfetch.removeTemp('auth')
			: window.d2lfetch;

		return fetch
			.fetch(request)
			.then(this.__responseToSirenEntity.bind(this));
	}
	_fetchEntityWithoutDedupe(sirenLinkOrUrl, method = 'GET') {
		if (!sirenLinkOrUrl) {
			return;
		}

		const url = sirenLinkOrUrl.href || sirenLinkOrUrl;

		if (!url) {
			return;
		}

		const request = new Request(url, {
			method,
			headers: { Accept: 'application/vnd.siren+json' },
		});

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
				const defaultParams = searchAction.fields.reduce((defaults, field) => {
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
	_getToken(scope = '*:*:*') {
		const client = window.D2L && window.D2L.frau && window.D2L.frau.client;
		if (client) {
			return client.request('frau-jwt-new-jwt', scope);
		} else {
			return Promise.resolve(null);
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
