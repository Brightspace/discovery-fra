'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/link/link.js';
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

				.discovery-home-header-browse-all-link {
					flex-shrink: 0;
					padding-left: 0.6rem;
					@apply --d2l-body-compact-text;
				}
				:host(:dir(rtl)) .discovery-home-header-browse-all-link {
					padding-left: 0;
					padding-right: 0.6rem;
				}

				.discovery-home-header-settings-button {
					align-self: center;
					margin-left: auto;
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

					.discovery-home-header-settings-button {
						align-self: start;
						margin-left: 0;
						margin-top: 6px;
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
							placeholder="[[localize('searchPlaceholder')]]">
						</d2l-input-search>
						<d2l-link
							class="discovery-home-header-browse-all-link"
							href="javascript:void(0)"
							on-click="_navigateToBrowseAll">
							[[localize('browseAllContent')]]
						</d2l-link>
					</div>
					<d2l-button
						class="discovery-home-header-settings-button"
						aria-label$="[[localize('settingsLabel')]]"
						on-click="_navigateToSettings"
						hidden$="[[!showSettingsButton]]">
						[[localize('settings')]]
					</d2l-button>
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
			searchInput: Object,
			showSettingsButton: Boolean,
			resetPage: String //The app name of a page to reset upon navigation
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
							path: this.routeLocations().search(query ? query.trim() : '', {
								sort: 'relevant'
							})
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
				resetPages: [this.resetPage]
			},
			bubbles: true,
			composed: true,
		}));
	}
	_navigateToBrowseAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', { sort: 'relevant' }),
				resetPages: [this.resetPage]
			},
			bubbles: true,
			composed: true
		}));
	}
	_navigateToSettings() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().settings(),
				resetPages: [this.resetPage]
			},
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('home-header', HomeHeader);
