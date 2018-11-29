'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

window.D2L = window.D2L || {};
window.D2L.frau = window.D2L.frau || {};
window.D2L.frau.options = window.D2L.frau.options || {};

/* @polymerMixin */
const internalIfrauMixin = (superClass) => class extends superClass {
	static get properties() {
		return {
			_ifrauclientOptions: {
				syncLang: true,
				syncTitle: true,
				syncFont: true,
				resizeFrame: true,
				resizerOptions: {
					heightCalculationMethod: 'lowestElement',
				},
	  		},
		};
  	}

  	frauConnect() {
		const _ifrauclientOptions = {
			syncLang: true,
			syncTitle: true,
			syncFont: true,
			resizeFrame: true,
			resizerOptions: {
				heightCalculationMethod: 'lowestElement',
			},
		};
		const client = window.ifrauclient(_ifrauclientOptions);
		return client
	  		.connect()
	  		.then(() => {
				return Promise.all([
					client.request('options'),
					client.getService('navigation', '0.1'),
					client.request('valenceHost'),
				]);
			})
			.then((all) => {
				const setup = {
					client: client,
					options: all[0],
					navigation: all[1],
					valenceHost: all[2],
				};
				Object.assign(window.D2L.frau.options, setup.options);
				window.D2L.frau.client = setup.client;
				window.D2L.frau.navigation = setup.navigation;
				window.D2L.frau.valenceHost = (setup.valenceHost || '').replace(/\/$/, '');
				return setup;
			});
  	}
}

export const IfrauMixin = dedupingMixin(internalIfrauMixin);
