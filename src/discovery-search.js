'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';

import './components/search-header.js';
import './components/search-results.js';
import './styles/discovery-styles.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';

class DiscoverySearch extends FetchMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html`
			<style include="discovery-styles">
				.discovery-search-main {
					background-color: white;
					padding: 1rem;
					max-width: 850px;
					margin: auto;
				}
			</style>
			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/search/:searchQuery"
				data="[[routeData]]">
			</app-route>
			<div>
	  			<search-header query="[[_searchQuery]]"></search-header>
			</div>
			<div class="d2l-typography discovery-search-main" hidden$="[[!_searchQuery]]">
				<search-results
					href="[[_searchActionHref]]"
					search-query="[[_searchQuery]]">
				</search-results>
			</div>
		`;
	}
	static get properties() {
		return {
			route: Object,
			routeData: {
				type: Object,
				value: () => {
					return {
						searchQuery: ''
					};
				}
			},
			_searchQuery: {
				type: String,
				value: '',
				computed: '_getDecodedQuery(routeData.searchQuery)'
			},
			_searchActionHref: String
		};
	}
	static get _searchAction() {
		return 'search-activities';
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

	_getDecodedQuery(searchQuery) {
		if (!searchQuery) {
			this._searchActionHref = undefined;
			return;
		}
		searchQuery = decodeURIComponent(searchQuery);
		const parameters = {
			q: searchQuery
		};
		this._getActionUrl(this._searchAction, parameters)
			.then(url => {
				this._searchActionHref = url;
			})
			.catch(() => {
				this.dispatchEvent(new CustomEvent('navigate', {
					detail: {
						path: this.routeLocations().notFound()
					},
					bubbles: true,
					composed: true
				}));
			});
		return searchQuery;
	}
}

window.customElements.define('discovery-search', DiscoverySearch);
