'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-icons/tier2-icons.js';
import 'd2l-inputs/d2l-input-search.js';
import 'd2l-typography/d2l-typography.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchHeader extends RouteLocationsMixin(LocalizeMixin(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-search-header-container {
					align-items: center;
					background-color: white;
					border-bottom: 1px solid #f2f3f5;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					overflow: auto;
				}

				.discovery-search-header-content {
					flex-shrink: 0;
					padding-left: 1rem;
				}

				.discovery-search-header-box {
					-webkit-box-shadow: 0 1px 4px rgba(86,86,86,0.2);
					-moz-box-shadow: 0 1px 4px rgba(86,86,86,0.2);
					box-shadow: 0 1px 4px rgba(86,86,86,0.2);
				}

				.discovery-search-header-clickable {
					cursor: pointer;
				}

				.discovery-search-header-search-bar-container {
					padding-left: 1rem;
					width: 100%;
				}
				.discovery-search-header-search-bar{
					min-width: 150px;
					width: 80%;
				}
			</style>

			<div class="d2l-typography discovery-search-header-box">
				<div class="discovery-search-header-container">
					<div class="discovery-search-header-content">
						<h2 class="d2l-heading-2 discovery-search-header-clickable" on-click="_navigateToHome">
							[[localize('discover')]]
						</h2>
					</div>

					<div class="discovery-search-header-content">
						<d2l-icon icon="d2l-tier2:divider"></d2l-icon>
					</div>

					<div class="discovery-search-header-content">
						<span class="d2l-body-standard">[[localize('searchLabel')]]</span>
					</div>

					<div class="discovery-search-header-search-bar-container">
						<d2l-input-search
							id="search-input"
							class="discovery-search-header-search-bar"
							label="[[localize('search')]]"
							value="[[query]]"
							placeholder="[[localize('searchPlaceholder')]]">
						</d2l-input-search>
					</div>
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
			query: {
				type: String,
				notify: true,
				observer: '_queryChanged',
			}
		};
	}
	ready() {
		super.ready();
		const searchInput = this.shadowRoot.querySelector('#search-input');
		searchInput.addEventListener('d2l-input-search-searched', (e) => {
			if (e && e.detail && e.detail.value) {
				this.query = e.detail.value;
			}
		});
	}
	clear() {
		this.query = '';
		const searchInput = this.shadowRoot.querySelector('#search-input');
		if (searchInput) {
			searchInput.value = '';
		}
	}
	showClear(query) {
		const searchInput = this.shadowRoot.querySelector('#search-input');
		if (searchInput) {
			searchInput._setLastSearchValue(query);
		}
	}
	focusOnInput() {
		const searchInput = this.shadowRoot.querySelector('#search-input');
		if (searchInput) {
			searchInput.focus();
		}
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
	_queryChanged(query) {
		if (query) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().search(query.trim())
				},
				bubbles: true,
				composed: true,
			}));
		}
	}
}

window.customElements.define('search-header', SearchHeader);
