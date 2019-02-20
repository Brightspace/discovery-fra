'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-activities/components/d2l-activity-list-item/d2l-activity-list-item.js';
import 'd2l-dropdown/d2l-dropdown.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-inputs/d2l-input-text.js';
import 'd2l-menu/d2l-menu.js';
import 'd2l-menu/d2l-menu-item-link.js';
import 'd2l-typography/d2l-typography.js';
import { FetchMixin } from '../mixins/fetch-mixin.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchResults extends FetchMixin(LocalizeMixin(RouteLocationsMixin(PolymerElement))) {
	static get template() {
		return html`
			<style include="d2l-typography-shared-styles">
				:host {
					display: inline;
				}

				.discovery-search-results-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-search-results-header {
					align-items: baseline;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					margin-bottom: 0.5rem;
				}

				.discovery-search-results-sort-by {
					align-items: baseline;
					display: flex;
					flex-shrink: 0;
				}

				.discovery-search-results-search-message {
					flex-shrink: 0;
					width: 60%;
				}

				.discovery-search-results-dropdown {
					cursor: pointer;
				}

				.discovery-search-results-dropdown-icon {
					margin-left: 0.5rem;
				}

				.discovery-search-results-dropdown-text {
					margin-left: 0.25rem;
				}

				d2l-activity-list-item {
					border-bottom: 1px solid var(--d2l-color-mica);
				}
				.discovery-search-results-page-number-container {
					margin: 15px;
					display: flex;
					align-items: center;
					justify-content:center;
				}
				.discovery-search-results-page-count {
					width: auto;
					max-width: 4rem;
				}
			</style>
			<div>
				<template is="dom-if" if="[[!_searchResultsExists]]">
					<h4 class="d2l-heading-4">[[localize('resultsFor', 'amount', 0, 'searchQuery', searchQuery)]]</h4>
				</template>

				<template is="dom-if" if="[[_searchResultsExists]]">
					<div class="discovery-search-results-header">
						<span class="d2l-label-text discovery-search-results-search-message">[[localize('searchResultCount', 'searchResultRange', _searchResultsRangeToString, 'searchResultsTotal', _searchResultsTotal, 'searchQuery', searchQuery)]]</span>
					</div>
					<div class="discovery-search-results-container">
						<template is="dom-repeat" items="[[_searchResult]]">
							<d2l-activity-list-item
								entity=[[item]]
								send-on-trigger-event>
							</d2l-activity-list-item>
						</template>
					</div>
					<div class="discovery-search-results-page-number-container">
						<d2l-button-icon
							icon="d2l-tier1:chevron-left"
							aria-label="[[localize('pagePrevious')]]"
							disabled$="[[_previousPageDisabled(_pageCurrent)]]"
							on-click="_toPreviousPage"
							on-keydown="_toPreviousPage">
						</d2l-button-icon>
						<d2l-input-text
							class="discovery-search-results-page-count"
							type="number"
							aria-label="[[localize('pageSelection', 'pageCurrent', _pageCurrent, 'pageTotal', _pageTotal)]]"
							aria-invalid="[[localize('pageSelectionInvalid', 'pageTotal', _pageTotal)]]"
							name="myInput"
							value="[[_pageCurrent]]"
							min="1"
							max="[[_pageTotal]]"
							size=[[_countDigits(_pageTotal)]]
							on-keydown="_toPage"
							on-blur="_inputPageCounterOnBlur">
						</d2l-input-text>
						<div>
						/ [[_pageTotal]]
						</div>
						<d2l-button-icon
							icon="d2l-tier1:chevron-right"
							aria-label="[[localize('pageNext')]]"
							disabled$="[[_nextPageDisabled(_pageCurrent, _pageTotal)]]"
							on-click="_toNextPage"
							on-keydown="_toNextPage">
						</d2l-button-icon>
					</div>
				</template>
			</div>
		`;
	}
	static get properties() {
		return {
			href: {
				type: String,
				observer: '_onHrefChange'
			},
			searchQuery: {
				type: String,
				value: ''
			},
			_searchResult: {
				type: Array,
				value: function() { return []; }
			},
			_searchResultsExists: Boolean,
			_searchResultsRangeToString: String,
			_pageCurrent: Number,
			_pageTotal: Number,
			_searchResultsTotal: Number
		};
	}

	ready() {
		super.ready();
		this.addEventListener('d2l-activity-trigger', this._navigateToCourse.bind(this));
	}

	_onHrefChange(href) {
		if (!href) {
			this._reset();
			return;
		}
		this._fetchEntity(href)
			.then(this._handleSearchResponse.bind(this));
	}

	_handleSearchResponse(sirenEntity) {
		if (!sirenEntity || !sirenEntity.properties) {
			return;
		}
		const pageSize = sirenEntity.properties.pagingInfo.pageSize;
		this._searchResultsTotal = sirenEntity.properties.pagingInfo.total;
		this._searchResultsExists = this._searchResultsTotal > 0;
		this._pageCurrent = sirenEntity.properties.pagingInfo.page + 1;
		this._pageTotal = Math.ceil(this._searchResultsTotal / pageSize);

		const startIndex = sirenEntity.properties.pagingInfo.page * pageSize + 1;
		const endIndex = Math.min(startIndex + pageSize - 1, this._searchResultsTotal);
		this._searchResultsRangeToString = `${startIndex}-${endIndex}`;

		this._searchResult = sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com');
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

	_toPreviousPage(event) {
		if (event.type === 'keydown' && event.keyCode !== 13 && event.keyCode !== 32) {
			return;
		}

		this._navigateToPage(this._pageCurrent - 1);
	}
	_previousPageDisabled(pageCurrent) {
		return pageCurrent <= 1;
	}
	_toNextPage(event) {
		if (event.type === 'keydown' && event.keyCode !== 13 && event.keyCode !== 32) {
			return;
		}

		this._navigateToPage(this._pageCurrent + 1);
	}
	_nextPageDisabled(pageCurrent, pageTotal) {
		return pageCurrent >= pageTotal;
	}
	_toPage(event) {
		if (event.type !== 'keydown' || event.keyCode !== 13) {
			return;
		}
		this._navigateToPage(event.srcElement.value);
	}
	_inputPageCounterOnBlur(event) {
		event.srcElement.value = this._pageCurrent;
	}

	_navigateToPage(pageNumber) {
		// keep page number within the range of the search results.
		pageNumber = Math.min(pageNumber, this._pageTotal);
		pageNumber = Math.max(pageNumber, 1);
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search(this.searchQuery, { page: pageNumber })
			},
			bubbles: true,
			composed: true
		}));
	}

	_countDigits(number) {
		return number.toString().length;
	}

	_reset() {
		this._searchResult = [];
		this._searchResultsExists = undefined;
		this._searchResultsRangeToString = undefined;
		this._searchResultsTotal = undefined;
	}
}

window.customElements.define('search-results', SearchResults);
