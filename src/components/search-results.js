'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-dropdown/d2l-dropdown.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-menu/d2l-menu.js';
import 'd2l-menu/d2l-menu-item-link.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import './search-result-entry.js';

class SearchResults extends LocalizeMixin(PolymerElement) {
	static get template() {
		return html`
			<style>
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

				.discovery-search-results-search-result {
					margin-bottom: 2rem;
				}
			</style>
			<template is="dom-if" if="[[!searchResultsExists]]">
				<h4 class="d2l-heading-4">0 [[localize('resultsFor')]] [[searchQuery]]</h4>
			</template>

			<template is="dom-if" if="[[searchResultsExists]]">
				<div class="discovery-search-results-header">
					<span class="d2l-label-text discovery-search-results-search-message">[[searchResultsRangeToString]] [[localize('of')]] [[searchResultsTotal]] [[localize('resultsFor')]] "[[searchQuery]]"</span>
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
						<div class="discovery-search-results-search-result">
							<search-result-entry
								course-id="[[item.id]]"
								course-title="[[item.title]]"
								course-description="[[item.description]]"
								course-thumbnail-link="[[item.thumbnail]]"
								course-duration="[[item.duration]]"
								course-tags="[[item.tags]]">
							</search-result-entry>
						</div>
					</template>
				</div>
			</template>
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
}

window.customElements.define('search-results', SearchResults);
