'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-inputs/d2l-input-search.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class HomeHeader extends RouteLocationsMixin(LocalizeMixin(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-home-header-container {
					align-items: center;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
				}

				.discovery-home-header-d2l-heading-1 {
					margin-bottom: 10px !important;
					margin-top: 10px !important;
				}

				.discovery-home-header-clickable {
					cursor: pointer;
				}

				.discovery-home-header-my-list {
					flex-shrink: 0;
					height: 35px;
					width: 77px;
				}

				.discovery-home-header-search-container {
					align-items: center;
					display: flex;
					flex-direction: row;
					flex-grow: 1;
					margin-top: 3px;
					padding: 0 6%;
				}

				.discovery-home-header-search-input {
					flex-grow: 1;
				}

				.discovery-home-header-or {
					flex-shrink: 0;
					padding-left: 0.9rem;
					@apply --d2l-body-compact-text;
				}
				:host(:dir(rtl)) .discovery-home-header-or {
					padding-left: 0;
					padding-right: 0.9rem;
				}

				.discovery-home-header-browse-all-link {
					flex-shrink: 0;
					padding-left: 0.6rem;
					@apply --d2l-body-compact-text;
				}
				:host(:dir(rtl)) .discovery-home-header-browse-all-link {
					padding-left: 0;
					padding-right: 0.6rem;
				}

				@media only screen and (max-width: 767px) {
					.discovery-home-header-container {
						align-items: flex-start;
						flex-direction: column;
					}

					.discovery-home-header-search-container {
						padding: 0 12% 0 0;
						width: 88%;
					}
					:host(:dir(rtl)) .discovery-home-header-search-container {
						padding: 0 0 0 12%;
					}

					.discovery-home-header-my-list {
						height: 0;
						width: 0;
					}
				}

				@media only screen and (max-width: 615px) {
					.discovery-home-header-search-container {
						margin-top: 6px;
					}
				}

				@media only screen and (max-width: 545px) {
					.discovery-home-header-search-container {
						align-items: flex-start;
						flex-direction: column;
						padding: 0;
						width: 100%;
					}

					.discovery-home-header-or {
						display: none;
					}

					.discovery-home-header-browse-all-link {
						font-size: 14px;
						margin-top: 6px;
						padding-left: 0.3rem;
					}
					:host(:dir(rtl)) .discovery-home-header-browse-all-link {
						padding-left: 0;
						padding-right: 0.3rem;
					}
				}
			</style>

			<div class="d2l-typography">
				<div class="discovery-home-header-container">
					<div>
						<h1 class="d2l-heading-1 discovery-home-header-d2l-heading-1" on-click="_navigateToHome">
							<span class="discovery-home-header-clickable">[[localize('discover')]]</span>
						</h1>
					</div>
					<div class="discovery-home-header-search-container">
						<d2l-input-search
							id="discovery-home-header-search-input"
							class="discovery-home-header-search-input"
							label="[[localize('search')]]"
							value="[[query]]"
							placeholder="[[localize('search.placeholder')]]">
						</d2l-input-search>
						<span class="discovery-home-header-or">[[localize('or')]]</span>
						<d2l-link
							class="discovery-home-header-browse-all-link"
							href="javascript:void(0)"
							on-click="_navigateToBrowseAll">
							[[localize('browseAllContent')]]
						</d2l-link>
					</div>
					<div class="discovery-home-header-my-list"></div>
				</div>
			</div>
		`;
	}
	constructor() {
		super();
		this.query = '';
	}
	static get properties() {
		return {
			query: String,
			searchInput: Object
		};
	}
	ready() {
		super.ready();
		this.searchInput = this.shadowRoot.querySelector('#discovery-home-header-search-input');
		if (this.searchInput) {
			this.searchInput.addEventListener('d2l-input-search-searched', (e) => {
				if (e && e.detail) {
					const query = e.detail.value;
					this.dispatchEvent(new CustomEvent('navigate', {
						detail: {
							path: this.routeLocations().search(query ? query.trim() : '')
						},
						bubbles: true,
						composed: true,
					}));
				}
			});
		}
	}
	clear() {
		this.query = '';
		this.searchInput.value = '';
		this.searchInput._setLastSearchValue('');
	}
	focusOnInput() {
		this.searchInput.focus();
	}
	_navigateToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().navLink(),
			},
			bubbles: true,
			composed: true,
		}));
	}
	_navigateToBrowseAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', { sort: 'relevant' })
			},
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('home-header', HomeHeader);
