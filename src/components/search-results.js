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

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchResults extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-typography">
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
					padding-bottom: 0.5rem;
				}

				.discovery-search-results-sort-by {
					align-items: baseline;
					display: flex;
					flex-shrink: 0;
				}

				.discovery-search-results-search-message {
					flex-shrink: 0;
					padding-right: 1rem;
					padding-bottom: 1rem;
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

			<div class="d2l-typography">
				<template is="dom-if" if="[[!searchResultsExists]]">
					<h4 class="d2l-heading-4">0 [[localize('resultsFor')]] [[searchQuery]]</h4>
				</template>

				<template is="dom-if" if="[[searchResultsExists]]">
					<div class="discovery-search-results-header">
						<span class="d2l-label-text discovery-search-results-search-message">[[localize('searchResultCount', 'searchResultRange', searchResultsRangeToString, 'searchResultsTotal', searchResultsTotal, 'searchQuery', searchQuery)]]</span>
						<div class="discovery-search-results-sort-by">
							<span class="d2l-label-text">[[localize('sortBy')]]:</span>
							<d2l-dropdown>
								<span class="d2l-dropdown-opener d2l-label-text discovery-search-results-dropdown">
									<span class="discovery-search-results-dropdown-text">[[localize('relevance')]]</span>
									<d2l-icon class="discovery-search-results-dropdown-icon" icon="d2l-tier1:chevron-down"></d2l-icon>
								</span>
								<d2l-dropdown-menu>
									<d2l-menu label="[[localize('sortBy')]]">
										<d2l-menu-item-link text="[[localize('relevance')]]" href="javascript:void(0)"></d2l-menu-item-link>
										<d2l-menu-item-link text="[[localize('new')]]" href="javascript:void(0)"></d2l-menu-item-link>
									</d2l-menu>
								</d2l-dropdown-menu>
							</d2l-dropdown>
						</div>
					</div>

					<div class="discovery-search-results-container">
						<template is="dom-repeat" items="[[searchResults.results]]">
							<d2l-activity-list-item
								href="src/placeholder-data/activity.json"
								_tags="[[item.tags]]"
								_link="javascript:void(0)"
								_category="[[item.category]]"
								on-click="_navigateToCourse"
								id="[[item.id]]">
							</d2l-activity-list-item>
						</template>
					</div>
				</template>
			</div>
		`;
	}
	static get properties() {
		return {
			searchQuery: String,
			searchResults: Object,
			searchResultsExists: {
				type: Boolean,
				computed: '_computeSearchResultsExist(searchResults)'
			},
			searchResultsRangeToString: {
				type: String,
				computed: '_computeSearchResultsRange(searchResults)'
			},
			searchResultsTotal: {
				type: Number,
				computed: '_computeTotalSizeOfSearchResults(searchResults)'
			}
		};
	}
	_computeTotalSizeOfSearchResults(searchResults) {
		return searchResults && searchResults.metadata && searchResults.metadata.total;
	}

	_computeSearchResultsExist(searchResults) {
		return searchResults && searchResults.results && searchResults.results.length > 0;
	}
	_computeSearchResultsRange(searchResults) {
		if (searchResults &&
			searchResults.metadata &&
			searchResults.metadata.startIndex !== undefined &&
			searchResults.metadata.size !== undefined) {
			const startIndex = searchResults.metadata.startIndex + 1;
			const endIndex = searchResults.metadata.startIndex + searchResults.metadata.size;
			return `${startIndex}-${endIndex}`;
		}
		return '';
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
}

window.customElements.define('search-results', SearchResults);
