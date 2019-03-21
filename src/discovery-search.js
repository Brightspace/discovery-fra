'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/app-route/app-route.js';
import './components/app-location-ifrau.js';
import './components/discovery-footer.js';
import './components/search-header.js';
import './components/search-results.js';
import './components/search-sidebar.js';
import './styles/discovery-styles.js';

import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import { IfrauMixin } from './mixins/ifrau-mixin.js';
import 'url-polyfill/url-polyfill.min.js';
import 'fastdom/fastdom.js';

class DiscoverySearch extends mixinBehaviors([IronResizableBehavior], IfrauMixin(FetchMixin(RouteLocationsMixin(LocalizeMixin(PolymerElement))))) {
	static get template() {
		return html`
			<style include="discovery-styles">
				:host {
					display: block
				}

				.discovery-search-outer-container {
					display: flex;
					flex-direction: column;
					flex-grow: 1;
				}

				.discovery-search-container {
					display: flex;
					flex-direction: row;
				}

				.discovery-search-left-filler {
					background-color: white;
					flex-grow: 1;
				}

				.discovery-search-sidebar {
					background-color: white;
					border-right: 1px solid var(--d2l-color-mica);
					box-shadow: 3px 0 3px -2px var(--d2l-color-mica);
					flex-grow: 0;
					flex-shrink: 0;
					padding: 1rem 0 0 calc(1rem + 30px);
					overflow-y: auto;
					width: calc(268px - 1rem - 30px);
				}

				.discovery-search-main {
					flex-grow: 0;
					margin: 1rem 30px 0 1rem;
					width: calc(1230px - 268px - 1rem - 30px);
				}

				.discovery-search-right-filler {
					background-color: transparent;
					flex-grow: 1;
				}

				.discovery-search-nav-container {
					margin-bottom: 1rem;
					width: 100%;
				}

				.discovery-search-results {
					width: 100%;
				}

				@media only screen and (max-width: 929px) {
					.discovery-search-container {
						margin: 0 24px;
					}

					.discovery-search-left-filler,
					.discovery-search-sidebar,
					.discovery-search-right-filler {
						display: none;
					}

					.discovery-search-main {
						margin: 0;
						width: 100%;
					}
				}

				@media only screen and (max-width: 767px) {
					.discovery-search-container {
						margin: 0 18px;
					}
				}
			</style>
			<app-location-ifrau route="[[route]]"></app-location-ifrau>
			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/search/:searchQuery"
				data="[[routeData]]">
			</app-route>

			<!-- IE11 Bug with min-height not working with flex unless there's an outer flex column with flex-grow: 1 -->
			<div class="discovery-search-outer-container">
				<div class="discovery-search-container">
					<div class="discovery-search-left-filler"></div>
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
						<discovery-footer></discovery-footer>
					</div>
					<div class="discovery-search-right-filler"></div>
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
			_pageCurrent: {
				type: Number,
				value: undefined
			},
			_searchQuery: {
				type: String,
				value: '',
				observer: '_searchQueryChanged'
			},
			_searchActionHref: String,
			visible: {
				type: Boolean,
				observer: '_visible'
			},
			_searchLoading: {
				type: Boolean,
				value: true
			},
			_minViewPortHeight: Number
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

		this.addEventListener('iron-resize', this._onIronResize.bind(this));
		this.addEventListener('search-loading', this._searchLoadingChanged);
	}
	_visible(visible) {
		const searchHeader = this.shadowRoot.querySelector('#discovery-search-search-header');
		if (searchHeader) {
			searchHeader.showClear(this._searchQuery);
			searchHeader.focusOnInput();
		}
		if (visible) {
			beforeNextRender(this, () => {
				this._onIronResize();
			});
		} else {
			this._searchQuery = null;
			this._pageCurrent = 0;
		}
	}
	_routeChanged(route) {
		route.stopPropagation();
		this.route = route.detail.value || {};
	}
	_routeDataChanged(routeData) {
		routeData.stopPropagation();
		routeData = routeData.detail.value || {};
		this._searchQuery = decodeURIComponent(routeData.searchQuery);
		this.routeData = routeData;
	}
	_queryParamsChanged(queryParams) {
		queryParams.stopPropagation();
		queryParams = queryParams.detail.value || {};
		const hasPageQueryParam = queryParams && queryParams.has && queryParams.has('page');
		if (!hasPageQueryParam) {
			this._pageCurrent = this._pageCurrent ? undefined : 0;
		} else {
			this._pageCurrent = Math.max(queryParams.get('page') - 1, 0);
		}
		this.queryParams = queryParams;
	}
	_searchQueryChanged() {
		if (this._pageCurrent !== undefined) {
			this._pageCurrent = 0;
		}
	}
	_getDecodedQuery(searchQuery, page) {
		if (!searchQuery || page === undefined || !this.visible) {
			this._searchActionHref = undefined;
			return;
		}
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
	_searchLoadingChanged(e) {
		if (e && e.detail) {
			this._searchLoading = e.detail.loading;
			beforeNextRender(this, () => {
				this._onIronResize();
			});
		}
	}
	_getIframeHeight() {
		const windowInnerHeight = window.innerHeight;
		const documentElementClientHeight  = document.documentElement.clientHeight;
		return Math.max(documentElementClientHeight, windowInnerHeight || 0);
	}
	_onIronResize() {
		if (!this.visible) {
			return;
		}
		const container = this.shadowRoot.querySelector('.discovery-search-container');
		if (!this._searchLoading) {
			fastdom.measure(() => {
				// Set height of the iframe to be max of container and height of iframe
				const heightOfIframe = this._getIframeHeight();
				const containerHeight = container.offsetHeight;
				const heightToUse = Math.max(heightOfIframe, containerHeight);
				if (heightToUse) {
					this.iframeApplyStyles({
						height: heightToUse + 'px'
					});
				}
				// Make sure the height of container is at least the full viewport
				fastdom.mutate(() => {
					if (containerHeight > this._minViewPortHeight) {
						container.style.minHeight = '';
					} else {
						container.style.minHeight = this._minViewPortHeight + 'px';
					}
				});
			});
		} else {
			this.iframeApplyStyles({
				display: 'block',
				height: '100vh'
			});
			afterNextRender(this, () => {
				fastdom.measure(() => {
					// Set min-height of the container to be the iframe's height at 100vh
					const heightOfIframe = this._getIframeHeight();
					if (heightOfIframe) {
						fastdom.mutate(() => {
							container.style.minHeight = heightOfIframe + 'px';
							this._minViewPortHeight = heightOfIframe;
						});
					}
				});
			});
		}
	}
}

window.customElements.define('discovery-search', DiscoverySearch);
