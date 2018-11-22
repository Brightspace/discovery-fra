'use strict';
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

window.D2L = window.D2L || {};
window.D2L.frau = window.D2L.frau || {};
window.D2L.frau.options = window.D2L.frau.options || {};

/* @polymerMixin */
let internalIfrauMixin = (superClass) => class extends superClass {
	constructor() {
		super();
	}
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
		var _ifrauclientOptions = {
			syncLang: true,
			syncTitle: true,
			syncFont: true,
			resizeFrame: true,
			resizerOptions: {
				heightCalculationMethod: 'lowestElement',
			},
		};
		var client = window.ifrauclient(_ifrauclientOptions);
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
				var setup = {
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