'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-icons/tier2-icons.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchHeader extends RouteLocationsMixin(LocalizeMixin(PolymerElement)) {
	static get template() {
		return html`
			<style>
				:host {
					display: inline;
				}

				.discovery-search-header-container {
					overflow: auto;
					background-color: white;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;
					border-bottom: 1px solid #f2f3f5;
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
					width: 50%;
					min-width: 100px;
				}
			</style>

			<div class="discovery-search-header-box">
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
						<!-- This is a placeholder search input box until d2l-inputs is converted to Polymer 3 -->
						<input
							id="search-input"
							class="discovery-search-header-search-bar"
							type="text"
							placeholder="[[localize('searchPlaceholder')]]"
							value="[[query]]">
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
		if (searchInput) {
			searchInput.addEventListener('keyup', (e) => {
				e.preventDefault();
				if (e.keyCode === 13) { // Enter key
					this.query = searchInput.value;
				}
			});
		}
	}
	clear() {
		this.query = '';
		const searchInput = this.shadowRoot.querySelector('#search-input');
		if (searchInput) {
			searchInput.value = '';
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
