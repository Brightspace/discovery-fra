'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import SirenParse from 'siren-parser';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-fetch-auth/d2l-fetch-auth-framed.js';
import 'promise-polyfill/src/polyfill.js';
import 'url-polyfill/url-polyfill.min.js';

/* @polymerMixin */
const internalFetchMixin = (superClass) => class extends superClass {
	constructor() {
		super();
		window.d2lfetch.use({name: 'auth', fn: window.d2lfetch.auth});
	}
	_fetchEntity(url) {
		if (!url) {
			return;
		}
		const request = new Request(url, {
			headers: { Accept: 'application/vnd.siren+json' },
		});
		return window.d2lfetch
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
				return this._fetchEntity(bffEndpoint);
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
			return response
				.json()
				.then(function(json) {
					return SirenParse(json);
				});
		}
		return Promise.reject(response.status + ' ' + response.statusText);
	}
};

export const FetchMixin = dedupingMixin(internalFetchMixin);
