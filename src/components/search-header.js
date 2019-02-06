'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-breadcrumbs/d2l-breadcrumb';
import 'd2l-breadcrumbs/d2l-breadcrumbs';
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
					border-bottom: 1px solid var(--d2l-color-mica);
					display: flex;
					flex-direction: row;
					height: 48px;
					width: 100%;
				}

				.discovery-search-header-breadcrumb {
					margin-left: 1rem;
					width: 100%;
				}

				.discovery-search-header-search-container {
					margin: 1rem;
				}

				@media only screen and (min-width: 930px) {
					.discovery-search-header-nav-container {
						display: none;
					}

					.discovery-search-header-search-container {
						margin: 1rem 0;
						width: 100%;
					}
				}

				@media only screen and (max-width: 929px) {
					.discovery-search-header-search-container {
						width: 50%;
					}
				}

				@media only screen and (max-width: 767px) {
					.discovery-search-header-search-container {
						width: calc(100% - 2rem);
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
				if (e && e.detail && e.detail.value) {
					this.query = e.detail.value;
				}
			});
		}
	}
	clear() {
		this.query = '';
		this.searchInput.value = '';
	}
	showClear(query) {
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
