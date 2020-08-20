'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import 'd2l-activities/components/d2l-activity-list-item/d2l-activity-list-item.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui-labs/pagination/pagination.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-inputs/d2l-input-text.js';
import 'd2l-link/d2l-link.js';
import 'd2l-offscreen/d2l-offscreen-shared-styles.js';
import 'd2l-typography/d2l-typography.js';
import 'fastdom/fastdom.js';
import 'd2l-facet-filter-sort/components/d2l-sort-by-dropdown/d2l-sort-by-dropdown-option.js';
import 'd2l-facet-filter-sort/components/d2l-sort-by-dropdown/d2l-sort-by-dropdown.js';
import { FetchMixin } from '../mixins/fetch-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import './loading-overlay.js';
import './loading-skeleton.js';
import './d2l-discover-list/d2l-discover-list.js';

class SearchResults extends FetchMixin(LocalizeMixin(RouteLocationsMixin(PolymerElement))) {
	static get template() {
		return html`
			<style include="d2l-offscreen-shared-styles"></style>
			<style include="d2l-typography-shared-styles">
				:host {
					display: inline;
				}

				.discovery-search-results-outer-container {
					position: relative;
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

				.discovery-search-results-no-results-container {
					display: flex;
					flex-direction: column;
					overflow: hidden;
					overflow-wrap: break-word;
					word-wrap: break-word;
				}

				.discovery-search-results-sort-by {
					align-items: baseline;
					display: flex;
					flex-shrink: 0;
				}

				.discovery-search-results-search-message {
					flex-shrink: 0;
					width: 60%;
					overflow: hidden;
					overflow-wrap: break-word;
					word-wrap: break-word;
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
				.discovery-search-results-no-results-heading {
					margin-top: 0 !important;
					margin-bottom: 0.5rem !important;
					@apply --d2l-heading-2;
				}
				.discovery-search-results-no-results-message {
					@apply --d2l-body-compact-text;
				}
				.discovery-search-results-header-placeholder {
					height: 0.65rem;
					width: 45%;
				}

				.discovery-search-results-offscreen-text {
					display: inline-block;
					@apply --d2l-offscreen;
				}
				:host(:dir(rtl)) .discovery-search-results-offscreen-text {
					@apply --d2l-offscreen-rtl
				}
			</style>
			<span class="discovery-search-results-offscreen-text" aria-live="polite">[[loadingMessage]]</span>

			<div class="discovery-search-results-outer-container">
				<loading-overlay loading=[[_showLoadingOverlay]]></loading-overlay>

				<div class="discovery-search-results-header">
					<template is="dom-if" if="[[_searchQueryLoading]]">
						<loading-skeleton class="discovery-search-results-header-placeholder"></loading-skeleton>
					</template>

					<template is="dom-if" if="[[!_searchQueryLoading]]">
						<template is="dom-if" if="[[_searchResultsTotalReady]]">
							<template is="dom-if" if="[[!_searchResultsExists]]" on-dom-change="setUpNoResultsMessage">
								<div class="discovery-search-results-no-results-container">
									<h2 class="discovery-search-results-no-results-heading" id="discovery-search-results-no-results-heading"></h2>
									<div class="discovery-search-results-no-results-message" id="discovery-search-results-no-results-message"></div>
								</div>
							</template>
							<template is="dom-if" if="[[_searchResultsExists]]">
								<div id="discovery-search-results-results-message" hidden$="[[emptySearchQuery]]">
									<span class="d2l-label-text discovery-search-results-search-message">[[localize('searchResultCount', 'searchResultRange', _searchResultsRangeToString, 'searchResultsTotal', _searchResultsTotal, 'searchQuery', searchQuery)]]</span>
								</div>
								<div id="discovery-search-results-all-results-message" hidden$="[[!emptySearchQuery]]">
									<span class="d2l-label-text discovery-search-results-search-message">[[localize('searchResultCountForAllResults', 'searchResultRange', _searchResultsRangeToString, 'searchResultsTotal', _searchResultsTotal)]]</span>
								</div>
							</template>
							<d2l-sort-by-dropdown id="sortDropdown" label="Sort by options" align="end">
								<d2l-sort-by-dropdown-option
									selected="[[_isSelected('relevant')]]"
									value="relevant"
									text="[[getSortText('relevant')]]"></d2l-sort-by-dropdown-option>
								<d2l-sort-by-dropdown-option
									selected="[[_isSelected('updated')]]"
									value="updated"
									text="[[getSortText('updated')]]"></d2l-sort-by-dropdown-option>
								<d2l-sort-by-dropdown-option
									selected="[[_isSelected('added')]]"
									value="added"
									text="[[getSortText('added')]]"></d2l-sort-by-dropdown-option>
								<d2l-sort-by-dropdown-option
									selected="[[_isSelected('enrolled')]]"
									value="enrolled"
									text="[[getSortText('enrolled')]]"></d2l-sort-by-dropdown-option>
							</d2l-sort-by-dropdown>
						</template>
					</template>
				</div>

				<template is="dom-if" if="[[_searchQueryLoading]]">
					<d2l-discover-list imagePlaceholder textPlaceholder entities$=[[_noResultSkeletonItems]]></d2l-discover-list>
				</template>

				<template is="dom-if" if="[[!_searchQueryLoading]]" restamp>
					<template is="dom-if" if="[[_searchResultsExists]]">
						<div class="discovery-search-results-container">
							<d2l-discover-list id="discover-search-results-list"
								entities="[[_searchResult]]"
								token="[[token]]">
							</d2l-discover-list>
						</div>
						<div class="discovery-search-results-page-number-container">
							<d2l-labs-pagination on-pagination-page-change="_paginationPageChanged" page-number="[[_pageCurrent]]" max-page-number="[[_pageTotal]]"></d2l-labs-pagination>
						</div>
					</template>
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
				value: '',
				observer: '_onSearchQueryChange'
			},
			sortParameter: String,
			_searchResult: {
				type: Array,
				value: function() { return []; }
			},
			_searchResultsExists: {
				type: Boolean,
				value: false
			},
			_searchResultsRangeToString: String,
			_pageCurrent: Number,
			_pageTotal: Number,
			_searchResultsTotal: Number,
			_noResultSkeletonItems: String,
			_searchResultsTotalReady: {
				type: Boolean,
				observer: '_searchResultsTotalReadyObserver'
			},
			_showLoadingOverlay: {
				type: Boolean,
				value: false
			},
			_searchQueryLoading: {
				type: Boolean,
				value: false
			},
			_allTextLoaded: Boolean,
			_allImageLoaded: Boolean,
			loadingMessage: {
				type: String,
				value: ''
			},
			emptySearchQuery: {
				type: Boolean,
				value: false
			},
			token: String
		};
	}

	static get observers() {
		return [
			'_allTextAndImagesLoadedObserver(_allTextLoaded, _allImageLoaded)',
			'_totalReadyAndResultExists(_searchResultsTotalReady, _searchResultsExists)',
			'_searchResultObserver(_searchResult)'
		];
	}

	constructor() {
		super();
		this._numberOfTextLoadedEvents = 0;
		this._numberOfImageLoadedEvents = 0;
	}

	ready() {
		super.ready();
		this._noResultSkeletonItems = '[null,null,null,null,null]';
		this.addEventListener('d2l-discover-activity-triggered', this._navigateToCourse.bind(this));
		this.addEventListener('d2l-discover-text-loaded', this._removeTextPlaceholders);
		this.addEventListener('d2l-discover-image-loaded', this._removeImagePlaceholders);
		this.addEventListener('d2l-sort-by-dropdown-change', this._onSortChanged.bind(this));
	}

	_isSelected(item) {
		return item === this.sortParameter;
	}
	_onSortChanged(sortEvent) {
		// If same sort is selected, nothing is changed
		if (this.sortParameter === sortEvent.detail.value) {
			return;
		}

		this._searchQueryLoading = true;
		this._processBeforeLoading();
		this.setUpNoResultsMessage();
		this.sortParameter = sortEvent.detail.value;
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search(this.searchQuery, {
					sort: this.sortParameter
				})
			},
			bubbles: true,
			composed: true
		}));
	}

	getSortText(value) {
		const sortValueTexts = {
			relevant: this.localize('sorting.mostRelevant'),
			updated: this.localize('sorting.updated'),
			added: this.localize('sorting.new'),
			enrolled: this.localize('sorting.enrolled')
		};
		return sortValueTexts[value];
	}

	_onHrefChange(href) {
		if (!href) {
			return;
		}

		return this._fetchEntity(href)
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
	}

	_handleSearchResponse(sirenEntity) {
		if (!sirenEntity || !sirenEntity.properties) {
			return;
		}
		const pageSize = sirenEntity.properties.pagingInfo.pageSize;
		this._searchResultsTotal = sirenEntity.properties.pagingInfo.total;
		this._searchResultsTotalReady = true;
		this._searchResultsExists = this._searchResultsTotal > 0;
		this._pageCurrent = sirenEntity.properties.pagingInfo.page + 1;
		this._pageTotal = Math.ceil(this._searchResultsTotal / pageSize);

		const startIndex = sirenEntity.properties.pagingInfo.page * pageSize + 1;
		const endIndex = Math.min(startIndex + pageSize - 1, this._searchResultsTotal);
		this._searchResultsRangeToString = `${startIndex}-${endIndex}`;

		this._searchResult = sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com');
		// This is needed due to a polymer bug. When user comes to "Browse All" page, change the default sort selection, and then go
		// back to homepage, and then come back, the value in WC is updated but UI is stuck with old value because it's not reloading
		// hence not re-evaluating the selected option, this force to update with selected option
		this.setSortSelection();
	}

	setSortSelection() {
		const sortOptions = this.shadowRoot.querySelectorAll('#sortDropdown d2l-sort-by-dropdown-option');
		for (const option of sortOptions) {
			option.selected = option.value === this.sortParameter;
		}
		const sortDropdown = this.shadowRoot.querySelector('#sortDropdown');
		if (sortDropdown) {
			sortDropdown._text = this.getSortText(this.sortParameter);
			sortDropdown.value = this.sortParameter;
		}
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

	_paginationPageChanged(e) {

		this._navigateToPage(e.detail.page);
	}


	_navigateToPage(pageNumber) {
		// keep page number within the range of the search results.
		pageNumber = Math.min(pageNumber, this._pageTotal);
		pageNumber = Math.max(pageNumber, 1);
		if (pageNumber === this._pageCurrent) {
			return;
		}
		this._resetNonSearchResultProperties();
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search(this.searchQuery, {
					sort: this.sortParameter,
					page: pageNumber
				})
			},
			bubbles: true,
			composed: true
		}));
		this._showLoadingOverlay = true;
		const discoverList = this.shadowRoot.querySelector('#discover-search-results-list');
		discoverList.Reset();
	}

	_countDigits(number) {
		return number.toString().length;
	}

	_resetNonSearchResultProperties() {
		this._numberOfTextLoadedEvents = 0;
		this._numberOfImageLoadedEvents = 0;
		this._showLoadingOverlay = false;
		this._allTextLoaded = false;
		this._allImageLoaded = false;
		this.loadingMessage = '';
	}
	_reset() {
		this._searchResult = [];
		this._searchResultsExists = false;
		this._searchResultsRangeToString = '';
		this._searchResultsTotal = 0;
		this._searchResultsTotalReady = false;
		this._resetNonSearchResultProperties();
	}
	_searchResultsTotalReadyObserver(searchResultsTotalReady) {
		if (searchResultsTotalReady) {
			this.dispatchEvent(new CustomEvent('search-loading', {
				detail: {
					loading: false
				},
				bubbles: true,
				composed: true
			}));
			this._searchQueryLoading = false;
			if (this._searchResultsTotal === 0) {
				this.loadingMessage = this.localize('noResultsHeading', 'searchQuery', this.searchQuery);
			}
		}
	}
	_processBeforeLoading() {
		this.dispatchEvent(new CustomEvent('search-loading', {
			detail: {
				loading: true
			},
			bubbles: true,
			composed: true
		}));
		this._reset();
	}
	_onSearchQueryChange() {
		this._searchQueryLoading = true;
		this._processBeforeLoading();
		this.setUpNoResultsMessage();

		this.emptySearchQuery = !this.searchQuery;
	}
	_removeImagePlaceholders() {
		this._allImageLoaded = true;
	}
	_removeTextPlaceholders() {
		this._allTextLoaded = true;
		if (this.emptySearchQuery) {
			this.loadingMessage = this.localize(
				'searchResultsReadyMessageForAllResults',
				'pageCurrent', this._pageCurrent,
				'pageTotal', this._pageTotal);
		} else {
			this.loadingMessage = this.localize(
				'searchResultsReadyMessage',
				'pageCurrent', this._pageCurrent,
				'pageTotal', this._pageTotal,
				'searchQuery', this.searchQuery);
		}
	}

	_allTextAndImagesLoadedObserver(_allTextLoaded, _allImageLoaded) {
		if (_allTextLoaded && _allImageLoaded) {
			this._showLoadingOverlay  = false;
		}
	}
	// Rare case where changing pages will get no results (so we can't wait for text/images to load if there are none)
	_totalReadyAndResultExists(_searchResultsTotalReady, _searchResultsExists) {
		if (_searchResultsTotalReady && !_searchResultsExists) {
			this._showLoadingOverlay  = false;
		}
	}
	setUpNoResultsMessage() {
		const noResultsHeaderElement = this.shadowRoot.querySelector('#discovery-search-results-no-results-heading');
		const noResultsMessageElement = this.shadowRoot.querySelector('#discovery-search-results-no-results-message');

		if (noResultsHeaderElement) {
			fastdom.mutate(() => {
				const noResultsHeader = this.localize('noResultsHeading', 'searchQuery', `<b>${this.searchQuery}</b>`);
				noResultsHeaderElement.innerHTML = noResultsHeader;
			});
		}

		if (noResultsMessageElement && !noResultsMessageElement.innerHTML) {
			const noResultsMessage = this.localize(
				'noResultsMessage',
				'linkStart',
				'<d2l-link href=javascript:void(0) id="discovery-search-results-browse-all">',
				'linkEnd',
				'</d2l-link>');
			fastdom.mutate(() => {
				noResultsMessageElement.innerHTML = noResultsMessage;

				afterNextRender(this, () => {
					const browseAllLinkElement = this.shadowRoot.querySelector('#discovery-search-results-browse-all');
					if (browseAllLinkElement) {
						browseAllLinkElement.addEventListener('click', this._navigateToBrowseAll.bind(this));
					}
				});
			});
		}
	}
	_navigateToBrowseAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', {
					sort: this.sortParameter
				})
			},
			bubbles: true,
			composed: true
		}));
	}
	_updateToken() {
		return this._getToken()
			.then((token) => {
				this.token = token;
			});
	}
	_searchResultObserver(searchResult) {
		if (searchResult && searchResult.length) {
			this._updateToken();
		}
	}
}

window.customElements.define('search-results', SearchResults);
