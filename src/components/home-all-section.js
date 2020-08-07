'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-button/d2l-button.js';
import 'd2l-typography/d2l-typography.js';
import '../components/activity-card-list.js';
import '../styles/discovery-styles.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class HomeAllSection extends RouteLocationsMixin(FetchMixin(LocalizeMixin(PolymerElement))) {
	static get template() {

		return html`
			<style include="discovery-styles">
				.discovery-home-recently-updated-container {
					display: flex;
					flex-direction: column;
				}
				.discovery-home-load-more-button {
					margin-top: 0.5rem;
					width: 100%;
				}
				.activity-card-list-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.activity-card-list-header-view-all-link {
					@apply --d2l-body-compact-text;
				}

				@media only screen and (max-width: 615px) {
					.activity-card-list-header-view-all-link {
						font-size: 0.7rem;
					}
				}
			</style>
			<div class="d2l-typography">
				<div class="discovery-home-recently-updated-container" hidden$="[[!_hasCourses(_recentlyUpdatedItems)]]">
					<div class="activity-card-list-header">
						<h2 class="d2l-heading-2" aria-label$="[[localize('all')]]">[[localize('all')]]</h2>
						<d2l-link
							aria-label$="[[localize('viewAllLabel')]]"
							class="activity-card-list-header-view-all-link"
							href="javascript:void(0)"
							on-click="_navigateToViewAll">
							[[localize('viewAll')]]
						</d2l-link>
					</div>
					<activity-card-list
						header="[[localize('recentlyUpdated')]]"
						activities="[[_recentlyUpdatedItems]]"
						token="[[token]]"
						show-organization-code$="[[showOrganizationCode]]"
						show-semester-name$="[[showSemesterName]]">
					</activity-card-list>
					<d2l-button
						class="discovery-home-load-more-button"
						href="javascript:void(0)"
						on-click="_loadMoreRecentlyUpdated"
						hidden$="[[!_recentlyUpdatedItemsHasMore]]">
						[[localize('loadMore')]]
					</d2l-button>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
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
			showOrganizationCode: {
				type: Boolean
			},
			showSemesterName: {
				type: Boolean,
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
		this._updateRecentlyUpdatedItems();
	}

	static get _searchAction() {
		return 'search-activities';
	}

	_hasCourses(_recentlyUpdatedItems) {
		return Array.isArray(_recentlyUpdatedItems) && _recentlyUpdatedItems.length > 0;
	}

	_navigateToViewAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', { sort: 'relevant' })
			},
			bubbles: true,
			composed: true
		}));
	}

	_getRecentlyUpdatedCourses() {
		const parameters = {
			page: this._recentlyUpdatedItemsPage,
			pageSize: this._pageSize,
			sort: 'relevant'
		};

		return this._getActionUrl(this._searchAction, parameters)
			.then(url => {
				return this._fetchEntity(url)
					.then(this._handleSearchResponse.bind(this))
					.catch(() => {
						this._reset();
					});
			})
			.catch(() => {
				this._reset();
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
		this._updateRecentlyUpdatedItems(true);
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

	_updateRecentlyUpdatedItems(loadMore) {
		if (!loadMore) {
			this._reset();
		}
		// Fill with empty slots first - for loading
		const emptyPageArray = new Array(this._pageSize);
		const prevRecentlyUpdatedItems = this._recentlyUpdatedItems;
		const concatenatedResult = this._recentlyUpdatedItems.concat(emptyPageArray);
		this._recentlyUpdatedItems = concatenatedResult;

		// Get new items
		this._getRecentlyUpdatedCourses()
			.then((res) => {
				if (res) {
					if (res.entities) {
						const concatenatedResult = prevRecentlyUpdatedItems.concat(res.entities);
						this._recentlyUpdatedItems = concatenatedResult;
						this.dispatchEvent(new CustomEvent('d2l-discover-home-all-section-courses', {
							detail: {
								value: this._recentlyUpdatedItems.length
							},
							bubbles: true,
							composed: true
						}));
					}
					if (res.total) {
						this._recentlyUpdatedItemsTotal = res.total;
					}
					if (loadMore && prevRecentlyUpdatedItems) {
						this.shadowRoot.querySelector('activity-card-list').focusOnCard(prevRecentlyUpdatedItems.length);
					}
				}
			});
	}

	_recentlyUpdatedItemsPageTotalObserver(recentlyUpdatedItemsPage, recentlyUpdatedItemsTotal) {
		this._recentlyUpdatedItemsHasMore =
			((recentlyUpdatedItemsPage + 1) * this._pageSize) < recentlyUpdatedItemsTotal;
	}
}

window.customElements.define('home-all-section', HomeAllSection);
