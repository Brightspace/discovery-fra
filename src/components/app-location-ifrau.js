'use strict';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppRouteConverterBehavior } from '@polymer/app-route/app-route-converter-behavior.js';
import '@polymer/app-route/app-route.js';

/**
 * @customElement
 * @polymer
 */
const rePathWhitelist = [
	/^\/d2l\/le\/discovery\//
];
class AppLocationIfrau extends
	mixinBehaviors([AppRouteConverterBehavior], PolymerElement) {
	static get properties() {
		return {
			_navigation: {
				type: Object,
				value: function() {
					return window.D2L.frau.navigation;
				}
			},
			_frauIsSynchronizing: {
				type: Boolean,
				value: false
			}
		};
	}
	static get observers() {
		return [
			'_handlePathChanged(path)', // path from app-route-converter-behavior
		];
	}
	ready() {
		super.ready();
		const handleLocationChanged = this._handleLocationChanged.bind(this);
		window.D2L = window.D2L || {};
		window.D2L.frau = window.D2L.frau || {};
		window.D2L.frau.navigation.get().then(handleLocationChanged);
		window.D2L.frau.client.onEvent('navigation.statechange', handleLocationChanged);
	}
	_handleLocationChanged(newLocation) {
		this._frauIsSynchronizing = true;
		this.path = newLocation;
		// Since IE11 doesn't support URL, there's a need to figure out a way to get query params to work with IFrau
		// var parsed = new window.URL(newLocation, window.D2L.frau.valenceHost);
		// this.queryParams = createQueryParams(parsed.searchParams);
		this.queryParams = {};
		this._frauIsSynchronizing = false;
	}
	rewriteTo(pathAndQuery) {
		if (this._navigation) {
			this._navigation.replace(pathAndQuery);
		}
	}
	_handlePathChanged(newPath) {
		const shouldReportNavigation =
			newPath !== undefined &&
			this._navigation !== undefined &&
			this._frauIsSynchronizing === false &&
			rePathWhitelist.some(function(re) {
				return re.test(newPath);
			});
		if (shouldReportNavigation) {
			this._navigation.push(newPath, '');
			this._scrollToTop();
		}
		this.set('route.path', newPath);
	}
	_scrollToTop() {
		if (window.parentIFrame && window.parentIFrame.scrollTo) {
			window.parentIFrame.scrollTo(0, 0);
		}
	}
}

window.customElements.define('app-location-ifrau', AppLocationIfrau);
