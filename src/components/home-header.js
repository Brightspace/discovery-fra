'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-inputs/d2l-input-search.js';
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

				.discovery-home-header-home {
					padding-left: 1rem;
				}

				.discovery-home-header-d2l-heading-1 {
					margin-bottom: 1rem !important;
					margin-top: 1rem !important;
				}

				.discovery-home-header-clickable {
					cursor: pointer;
				}

				.discovery-home-header-my-list {
					flex-shrink: 0;
					height: 35px;
					margin-right: 1rem;
					width: 77px;
				}

				.discovery-home-header-search-container {
					flex-grow: 1;
					padding: 0 6%;
				}

				@media only screen and (max-width: 545px) {
					.discovery-home-header-my-list {
						height: 0;
						width: 0;
					}

					.discovery-home-header-search-container {
						padding: 0 1rem 1rem;
						width: calc(100% - 2rem);
					}

					.discovery-home-header-container {
						align-items: flex-start;
						flex-direction: column;
					}
				}
			</style>

			<div class="d2l-typography">
				<div class="discovery-home-header-container">
					<div class="discovery-home-header-home">
						<h1 class="d2l-heading-1 discovery-home-header-d2l-heading-1" on-click="_navigateToHome">
							<span class="discovery-home-header-clickable">[[localize('discover')]]</span>
						</h1>
					</div>
					<div class="discovery-home-header-search-container">
						<d2l-input-search
							id="search-input"
							label="[[localize('search')]]"
							value="[[query]]"
							placeholder="[[localize('searchPlaceholder')]]">
						</d2l-input-search>
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
			query: {
				type: String,
				notify: true,
				observer: '_queryChanged',
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

window.customElements.define('home-header', HomeHeader);
