'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import createDOMPurify from 'dompurify/dist/purify.es.js';
const DOMPurify = createDOMPurify(window);
import 'd2l-offscreen/d2l-offscreen-shared-styles.js';
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
			<style include="d2l-offscreen-shared-styles"></style>
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
				:host(:dir(rtl)) .discovery-search-sidebar {
					border-left: 1px solid var(--d2l-color-mica);
					border-right: none;
					box-shadow: -3px 0 3px -2px var(--d2l-color-mica);
					padding: 1rem calc(1rem + 30px) 0 0;
				}

				.discovery-search-main {
					flex-grow: 0;
					margin: 1rem 30px 0 1rem;
					width: calc(1230px - 268px - 1rem - 30px);
				}
				:host(:dir(rtl)) .discovery-search-main {
					margin: 1rem 1rem 0 30px;
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

				.discovery-search-offscreen-text {
					display: inline-block;
					@apply --d2l-offscreen;
				}

				:host(:dir(rtl)) .discovery-search-offscreen-text {
					@apply --d2l-offscreen-rtl
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
					:host(:dir(rtl)) .discovery-search-main {
						margin: 0;
					}
				}

				@media only screen and (max-width: 767px) {
					.discovery-search-container {
						margin: 0 18px;
					}
				}
			</style>

			<h1 class="discovery-search-offscreen-text" tabindex="0">[[localize('searchResultsOffscreen', 'searchQuery', _query)]]</h1>

			<!-- IE11 Bug with min-height not working with flex unless there's an outer flex column with flex-grow: 1 -->
			<div class="discovery-search-outer-container">
				<div class="discovery-search-container">
					<div class="discovery-search-left-filler"></div>
					<div class="discovery-search-sidebar">
						<search-sidebar></search-sidebar>
					</div>
					<div class="d2l-typography discovery-search-main">
						<div class="discovery-search-nav-container">
							<search-header
								id="discovery-search-search-header"
								query="[[_query]]"
								page="[[_page]]"
								sort-parameter="[[_sort]]">
							</search-header>
						</div>
						<div class="discovery-search-results">
							<search-results
								href="[[_searchActionHref]]"
								search-query="[[_query]]"
								sort-parameter="[[_sort]]">
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
			queryParams: {
				type: Object,
				value: () => {
					return {};
				},
				observer: '_queryParamsChanged'
			},
			_searchActionHref: String,
			_searchLoading: {
				type: Boolean,
				value: true
			},
			_minViewPortHeight: Number,
			_query: {
				type: String,
				value: ''
			},
			_sort: {
				type: String,
				value: 'relevant'
			},
			_page: {
				type: Number,
				value: 0
			},
			_searchAction: {
				type: String,
				value: 'search-activities'
			}
		};
	}

	ready() {
		super.ready();
		this.addEventListener('iron-resize', this._onIronResize.bind(this));
		this.addEventListener('search-loading', this._searchLoadingChanged);
	}

	_queryParamsChanged(queryParams) {
		this.queryParams = queryParams;

		if (queryParams.query) {
			this._query = queryParams.query;
		} else {
			this._query = '';
		}

		if (queryParams.sort && (queryParams.sort === 'added' || queryParams.sort === 'updated' || queryParams.sort === 'enrolled')) {
			this._sort = queryParams.sort;
		}
		else {
			this._sort = 'relevant';
		}

		if (!Number.isNaN(queryParams.page) && queryParams.page > 1) {
			this._page = queryParams.page - 1;
		}
		else {
			this._page = 0;
		}

		this._getDecodedQuery(this._query, this._page);
		this._updateDocumentTitle();
		const searchHeader = this.shadowRoot.querySelector('#discovery-search-search-header');
		if (searchHeader) {
			searchHeader.showClear(this._query);
		}
		this.setInitialFocusAfterRender();
	}

	_getDecodedQuery(searchQuery, page) {
		if (page === undefined) {
			this._searchActionHref = undefined;
			return;
		}

		const parameters = {
			q: searchQuery,
			page: page,
			sort: this._sort
		};

		if (!searchQuery) {
			delete parameters.q;
		}

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
		const container = this.shadowRoot.querySelector('.discovery-search-container');
		if (!this._searchLoading) {
			fastdom.measure(() => {
				// Set height of the iframe to be max of container and height of iframe
				const containerHeight = container.offsetHeight;
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

	setInitialFocusAfterRender() {
		const itemToFocus = this.shadowRoot.querySelector('.discovery-search-offscreen-text');
		afterNextRender(this, () => {
			if (itemToFocus) {
				itemToFocus.focus();
			}
		});
	}

	_updateDocumentTitle() {
		const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
		document.title = this.localize(
			'searchPageDocumentTitle',
			'searchTerm',
			this._query ? this._query : this.localize('browseAllContent'),
			'instanceName',
			instanceName ? instanceName : '');
	}
}

window.customElements.define('discovery-search', DiscoverySearch);
