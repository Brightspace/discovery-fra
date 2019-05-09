'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-button/d2l-button.js';
import 'd2l-typography/d2l-typography.js';
import './components/activity-card-list.js';
import './components/discovery-footer.js';
import './components/home-header.js';
import './styles/discovery-styles.js';

import { FetchMixin } from './mixins/fetch-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

class DiscoveryHome extends RouteLocationsMixin(FetchMixin(LocalizeMixin(PolymerElement))) {
	static get template() {

		return html`
			<style include="discovery-styles">
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}
				.discovery-home-home-header {
					margin-bottom: 1rem;
				}

				.discovery-home-main {
					margin: 0 30px;
				}

				.discovery-home-recently-updated-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-home-load-more-button {
					margin-top: 0.5rem;
					width: 100%;
				}

				@media only screen and (max-width: 929px) {
					.discovery-home-main {
						margin: 0 24px;
					}
				}
				@media only screen and (max-width: 767px) {
					.discovery-home-main {
						margin: 0 18px;
					}
				}
			</style>
			<div class="d2l-typography">
				<div class="discovery-home-main">
					<div class="discovery-home-home-header"><home-header id="discovery-home-home-header" query=""></home-header></div>
					<div class="discovery-home-recently-updated-container">
						<activity-card-list
							header="[[localize('recentlyUpdated')]]"
							activities="[[_recentlyUpdatedItems]]"
							token="[[token]]">
						</activity-card-list>
						<d2l-button
							class="discovery-home-load-more-button"
							href="javascript:void(0)"
							on-click="_loadMoreRecentlyUpdated"
							hidden$="[[!_recentlyUpdatedItemsHasMore]]">
							[[localize('loadMore')]]
						</d2l-button>
					</div>
					<discovery-footer></discovery-footer>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			visible: {
				type: Boolean,
				observer: '_visible'
			},
			_pageSize: {
				type: Number,
				value: 12
			},
			_recentlyUpdatedItems: {
				type: Array,
				value: function() { return []; }
			},
			_recentlyUpdatedItemsPage: {
				type: Number,
				value: 0
			},
			_recentlyUpdatedItemsTotal: {
				type: Number,
				value: undefined
			},
			_recentlyUpdatedItemsHasMore: {
				type: Boolean,
				value: false
			},
			token: String
		};
	}
	static get observers() {
		return [
			'_recentlyUpdatedItemsPageTotalObserver(_recentlyUpdatedItemsPage, _recentlyUpdatedItemsTotal)'
		];
	}
	ready() {
		super.ready();
		this.addEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
	}
	_visible(visible) {
		if (visible) {
			const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
			document.title = this.localize('homepageDocumentTitle', 'instanceName', instanceName ? instanceName : '');

			const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
			if (homeHeader) {
				homeHeader.clear();
				homeHeader.focusOnInput();
			}

			this._updateRecentlyUpdatedItems();
		} else {
			this._reset();
		}
	}
	static get _searchAction() {
		return 'search-activities';
	}
	_getRecentlyUpdatedCourses() {
		const parameters = {
			page: this._recentlyUpdatedItemsPage,
			pageSize: this._pageSize
		};

		return this._getActionUrl(this._searchAction, parameters)
			.then(url => {
				return this._fetchEntity(url)
					.then(this._handleSearchResponse.bind(this))
					.catch(() => {
						this.dispatchEvent(new CustomEvent('navigate', {
							detail: {
								path: this.routeLocations().notFound()
							},
							bubbles: true,
							composed: true
						}));
					});
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
	_handleSearchResponse(sirenEntity) {
		if (!sirenEntity || !sirenEntity.properties) {
			return;
		}

		return {
			total: sirenEntity.properties.pagingInfo.total,
			entities: sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com')
		};
	}
	_loadMoreRecentlyUpdated() {
		if (!this._recentlyUpdatedItems || !this._recentlyUpdatedItems.length) {
			return;
		}

		this._recentlyUpdatedItemsPage++;
		this._updateRecentlyUpdatedItems();
	}
	_navigateToCourse(e) {
		e.stopPropagation();
		if (e && e.detail && e.detail.orgUnitId) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().course(e.detail.orgUnitId)
				},
				bubbles: true,
				composed: true
			}));
		}
	}
	_reset() {
		this._recentlyUpdatedItems = [];
		this._recentlyUpdatedItemsPage = 0;
		this._recentlyUpdatedItemsTotal = undefined;
		this._recentlyUpdatedItemsHasMore = false;
	}
	_updateRecentlyUpdatedItems() {
		// Fill with empty slots first - for loading
		const emptyPageArray = new Array(this._pageSize);
		const prevRecentlyUpdatedItems = this._recentlyUpdatedItems;
		const concatenatedResult = this._recentlyUpdatedItems.concat(emptyPageArray);
		this._recentlyUpdatedItems = concatenatedResult;

		// Get new items
		this._updateToken();
		this._getRecentlyUpdatedCourses()
			.then((res) => {
				if (res) {
					if (res.entities) {
						const concatenatedResult = prevRecentlyUpdatedItems.concat(res.entities);
						this._recentlyUpdatedItems = concatenatedResult;
					}
					if (res.total) {
						this._recentlyUpdatedItemsTotal = res.total;
					}
				}
			});
	}
	_recentlyUpdatedItemsPageTotalObserver(recentlyUpdatedItemsPage, recentlyUpdatedItemsTotal) {
		this._recentlyUpdatedItemsHasMore =
			((recentlyUpdatedItemsPage + 1) * this._pageSize) < recentlyUpdatedItemsTotal;
	}
	_updateToken() {
		return this._getToken()
			.then((token) => {
				this.token = token;
			});
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
