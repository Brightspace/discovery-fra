'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';

import './components/search-header.js';
import './components/search-results.js';
import './styles/discovery-styles.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

class DiscoverySearch extends RouteLocationsMixin(PolymerElement) {
	static get template() {
		return html`
			<style include="discovery-styles">
				.discovery-search-main {
					padding: 1rem;
				}
			</style>
			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/search/:searchQuery"
				data="[[routeData]]">
			</app-route>
			<div>
	  			<search-header query="[[searchQuery]]"></search-header>
			</div>
			<div class="d2l-typography discovery-search-main">
				<search-results
					search-results="[[searchResults]]"
					search-query="[[searchQuery]]">
				</search-results>
			</div>
		`;
	}
	static get properties() {
		return {
			route: Object,
			routeData: Object,

			visible: {
				type: Boolean,
				observer: '_visible'
			},
			searchQuery: {
				type: String,
				computed: '_getDecodedQuery(routeData.searchQuery)'
			},
			searchResults: {
				type: Object
			}
		};
	}
	ready() {
		super.ready();
		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_routeChanged(route) {
		route = route.detail.value || {};
		this.route = route;
	}
	_routeDataChanged(routeData) {
		routeData = routeData.detail.value || {};
		this.routeData = routeData;
	}
	_visible() {
		const searchHeader = this.shadowRoot.querySelector('search-header');
		if (searchHeader) {
			searchHeader.showClear(this.searchQuery);
			searchHeader.focusOnInput();
		}

		this.searchResults = {
			metadata: {
				startIndex: 0,
				size: 5,
				total: 15
			},
			results: [
				{
					id: 1000,
					tags: ['Duration 100h30m', 'Stocks', 'Finance', 'Marketing', 'Finance', 'Marketing', 'Finance', 'Marketing', 'Finance', 'Marketing', 'Finance', 'Marketing', 'Microsoft'],
					category: 'Financial Planning'
				},
				{
					id: 1001,
					tags: ['Duration 2h45m', 'Stocks', 'Finance', 'Marketing'],
					category: 'Mathematics'
				},
				{
					id: 1002,
					tags: [],
					category: 'Science'
				},
				{
					id: 1003,
					tags: ['Duration 1h30m'],
					category: 'Economics'
				},
				{
					id: 1004,
					tags: ['Duration 30m'],
					category: 'English'
				}
			]
		};
	}
	_getDecodedQuery(searchQuery) {
		return decodeURIComponent(searchQuery);
	}
}

window.customElements.define('discovery-search', DiscoverySearch);
