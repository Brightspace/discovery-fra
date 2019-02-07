'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import './components/app-location-ifrau.js';
import './components/search-header.js';
import './components/search-results.js';
import './components/search-sidebar.js';
import './styles/discovery-styles.js';

import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import 'url-polyfill/url-polyfill.min.js';

class DiscoverySearch extends FetchMixin(RouteLocationsMixin(LocalizeMixin(PolymerElement))) {
	static get template() {
		return html`
			<style include="discovery-styles">
				.discovery-search-container {
					display: flex;
					flex-direction: row;
				}

				.discovery-search-sidebar {
					background-color: white;
					border-right: 1px solid var(--d2l-color-mica);
					flex-shrink: 0;
					overflow-y: auto;
					padding: 1rem;
					width: 35%;
				}

				.discovery-search-main {
					background-color: white;
					box-shadow: inset 3px 0 20px -6px rgba(86,86,86,0.4);
					-webkit-box-shadow: inset 3px 0 20px -6px rgba(86,86,86,0.4);
					-moz-box-shadow: inset 3px 0 20px -6px rgba(86,86,86,0.4);
					width: 100%;
				}

				.discovery-search-nav-container {
					padding: 0.5rem 1rem 0;
					width: calc(100% - 2rem);
				}

				.discovery-search-results {
					padding: 0 1rem;
					width: calc(100% - 2rem);
				}

				@media only screen and (max-width: 929px) {
					.discovery-search-sidebar {
						display: none;
					}

					.discovery-search-main {
						box-shadow: none;
						-webkit-box-shadow: none;
						-moz-box-shadow: none;
					}

					.discovery-search-nav-container {
						padding: 0;
						width: 100%;
					}
				}
			</style>
			<app-location-ifrau route="[[route]]"></app-location-ifrau>
			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/search/:searchQuery"
				data="[[routeData]]">
			</app-route>

			<div class="discovery-search-container">
				<div class="discovery-search-sidebar">
					<search-sidebar></search-sidebar>
				</div>
				<div class="d2l-typography discovery-search-main" hidden$="[[!_searchQuery]]">
					<div class="discovery-search-nav-container">
						<search-header id="discovery-search-search-header" query="[[_searchQuery]]"></search-header>
					</div>
					<div class="discovery-search-results">
						<search-results
							href="[[_searchActionHref]]"
							search-query="[[_searchQuery]]">
						</search-results>
					</div>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			route: {
				type: Object,
				value: () => {
					return {
						path: ''
					};
				}
			},
			routeData: {
				type: Object,
				value: () => {
					return {
						searchQuery: ''
					};
				}
			},
			queryParams: {
				type: Object,
				value: () => {
					return {};
				}
			},
			_pageCurrent: Number,
			_searchQuery: {
				type: String,
				value: ''
			},
			_searchActionHref: String,
			visible: {
				type: Boolean,
				observer: '_visible'
			}
		};
	}
	static get observers() {
		return [
			'_getDecodedQuery(_searchQuery, _pageCurrent)'
		];
	}
	static get _searchAction() {
		return 'search-activities';
	}
	ready() {
		super.ready();
		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));

		const location = this.shadowRoot.querySelector('app-location-ifrau');
		location.addEventListener('query-params-changed', this._queryParamsChanged.bind(this));
	}
	_visible() {
		const searchHeader = this.shadowRoot.querySelector('#discovery-search-search-header');
		if (searchHeader) {
			searchHeader.showClear(this._searchQuery);
			searchHeader.focusOnInput();
		}
	}
	_routeChanged(route) {
		route.stopPropagation();
		route = route.detail.value || {};
		this.route = route;
	}
	_routeDataChanged(routeData) {
		routeData.stopPropagation();
		routeData = routeData.detail.value || {};
		this._searchQuery = routeData.searchQuery;
		this.routeData = routeData;
	}
	_queryParamsChanged(queryParams) {
		queryParams.stopPropagation();
		queryParams = queryParams.detail.value || {};
		this._pageCurrent = queryParams && queryParams.has && queryParams.has('page') ? Math.max(queryParams.get('page') - 1, 0) : 0;
		this.queryParams = queryParams;
	}
	_getDecodedQuery(searchQuery, page) {
		if (!searchQuery || page === undefined) {
			this._searchActionHref = undefined;
			return;
		}
		searchQuery = decodeURIComponent(searchQuery);
		const parameters = {
			q: searchQuery,
			page: page
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
	}
}

window.customElements.define('discovery-search', DiscoverySearch);
