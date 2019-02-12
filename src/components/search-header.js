'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-breadcrumbs/d2l-breadcrumb';
import 'd2l-breadcrumbs/d2l-breadcrumbs';
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
					display: flex;
					flex-direction: column;
				}

				.discovery-search-header-nav-container {
					align-items: center;
					background-color: white;
					border-bottom: 1px solid var(--d2l-color-gypsum);
					display: flex;
					flex-direction: column;
					height: 39px;
					margin: 0 -30px;
					padding: 8px 30px 0;
					width: 100%;
				}

				.discovery-search-header-breadcrumb {
					width: 100%;
				}

				d2l-breadcrumb {
					font-size: 14px;
				}

				@media only screen and (min-width: 930px) {
					.discovery-search-header-nav-container {
						display: none;
					}

					.discovery-search-header-search-container {
						width: 100%;
					}
				}

				@media only screen and (max-width: 929px) {
					.discovery-search-header-nav-container {
						margin-bottom: 1rem;
					}

					.discovery-search-header-search-container {
						width: 50%;
					}
				}

				@media only screen and (max-width: 767px) {
					.discovery-search-header-search-container {
						width: 100%;
					}
				}
			</style>

			<div class="d2l-typography">
				<div class="discovery-search-header-container">
					<div class="discovery-search-header-nav-container">
						<d2l-breadcrumbs class="discovery-search-header-breadcrumb" compact>
							<d2l-breadcrumb on-click="_navigateToHome" href="javascript:void(0)" text="[[localize('backToDiscovery')]]"></d2l-breadcrumb>
						</d2l-breadcrumbs>
					</div>

					<div class="discovery-search-header-search-container">
						<d2l-input-search
							id="search-input"
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
				observer: '_queryChanged'
			},
			searchInput: Object
		};
	}
	ready() {
		super.ready();
		this.searchInput = this.shadowRoot.querySelector('#search-input');
		if (this.searchInput) {
			this.searchInput.addEventListener('d2l-input-search-searched', (e) => {
				if (e && e.detail) {
					if (e.detail.value) {
						this.query = e.detail.value;
					} else {
						this._navigateToHome();
					}
				}
			});
		}
	}
	clear() {
		this.query = '';
		this.searchInput.value = '';
		this.searchInput._setLastSearchValue('');
	}
	showClear(query) {
		this.searchInput.value = query;
		this.searchInput._setLastSearchValue(query);
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
		this.clear();
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
