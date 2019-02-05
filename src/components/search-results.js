'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-activities/components/d2l-activity-list-item/d2l-activity-list-item.js';
import 'd2l-dropdown/d2l-dropdown.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
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
								_link="javascript:void(0)"
								on-click="_navigateToCourse">
							</d2l-activity-list-item>
						</template>
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
			_searchResultsTotal: Number
		};
	}

	_onHrefChange(href) {
		this._reset();
		this._fetchEntity(href)
			.then(this._handleSearchResponse.bind(this));
	}

	_handleSearchResponse(sirenEntity) {
		if (!sirenEntity || !sirenEntity.properties) {
			return;
		}

		this._searchResultsTotal = sirenEntity.properties.pagingInfo.total;
		this._searchResultsExists = this._searchResultsTotal > 0;

		const startIndex = sirenEntity.properties.pagingInfo.page * sirenEntity.properties.pagingInfo.pageSize + 1;
		const endIndex = Math.min(startIndex + sirenEntity.properties.pagingInfo.pageSize - 1, this._searchResultsTotal);
		this._searchResultsRangeToString = `${startIndex}-${endIndex}`;

		this._searchResult = sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com');
	}

	_navigateToCourse(e) {
		if (e && e.target && e.target.id) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().course(e.target.id)
				},
				bubbles: true,
				composed: true
			}));
		}
	}

	_reset() {
		this._searchResult = [];
		this._searchResultsExists = undefined;
		this._searchResultsRangeToString = undefined;
		this._searchResultsTotal = undefined;
	}
}

window.customElements.define('search-results', SearchResults);
