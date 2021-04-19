'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

window.D2L = window.D2L || {};
window.D2L.frau = window.D2L.frau || {};
window.D2L.frau.options = window.D2L.frau.options || {};

/* @polymerMixin */
const internalIfrauMixin = (superClass) => class extends superClass {
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
				// global Promise
				return Promise.all([
					client.request('options'),
					client.getService('navigation', '0.1'),
					client.request('valenceHost'),
					client.getService('frame', '0.1')
				]);
			})
			.then((all) => {
				const setup = {
					client: client,
					options: all[0],
					navigation: all[1],
					valenceHost: all[2],
					frame: all[3]
				};
				Object.assign(window.D2L.frau.options, setup.options);
				window.D2L.frau.client = setup.client;
				window.D2L.frau.navigation = setup.navigation;
				window.D2L.frau.valenceHost = (setup.valenceHost || '').replace(/\/$/, '');
				window.D2L.frau.frame = setup.frame;
				return setup;
			});
	}
	_ifrauNavigationGo(href) {
		window.D2L = window.D2L || {};
		window.D2L.frau = window.D2L.frau || {};
		const navigationService = window.D2L.frau.navigation;

		if (navigationService && navigationService.go && href) {
			return navigationService.go(href);
		}
	}
	iframeApplyStyles(styles) {
		window.D2L = window.D2L || {};
		window.D2L.frau = window.D2L.frau || {};
		const frameService = window.D2L.frau.frame;
		if (frameService && frameService.applyStyle && styles) {
			return frameService.applyStyle(styles);
		}
	}
};

export const IfrauMixin = dedupingMixin(internalIfrauMixin);
