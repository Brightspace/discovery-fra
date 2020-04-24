'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-typography/d2l-typography.js';
import './components/discovery-footer.js';
import './components/home-header.js';
import './components/home-list-section.js';
import './components/home-all-section.js';
import './styles/discovery-styles.js';

import { FetchMixin } from './mixins/fetch-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';

class DiscoveryHome extends FetchMixin(LocalizeMixin(PolymerElement)) {
	static get template() {

		return html`
			<style include="discovery-styles">
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}
				.discovery-home-home-header {
					margin-bottom: 1rem;
				}

				.discovery-home-main {
					margin: 0 30px;
				}
				.discovery-no-courses-message {
					@apply --d2l-body-compact-text;
				}
				@media only screen and (max-width: 929px) {
					.discovery-home-main {
						margin: 0 24px;
					}
				}
				@media only screen and (max-width: 767px) {
					.discovery-home-main {
						margin: 0 18px;
					}
				}
			</style>

			<div class="discovery-home-main">
				<div class="discovery-home-home-header"><home-header id="discovery-home-home-header" query=""></home-header></div>
				<div class="discovery-no-courses-message" hidden$="[[_hasCourses]]">[[localize('noActivities')]]</div>
				<home-list-section
					href="[[_addedHref]]"
					token="[[token]]"
					sort="added"
					section-name="[[localize('new')]]"
					link-label="[[localize('viewAllNewLabel')]]"
					link-name="[[localize('viewAll')]]"
					page-size="[[_pageSize]]"></home-list-section>
				<home-list-section
					href="[[_updatedHref]]"
					token="[[token]]"
					sort="updated"
					section-name="[[localize('updated')]]"
					link-label="[[localize('viewAllUpdatedLabel')]]"
					link-name="[[localize('viewAll')]]"
					page-size="[[_pageSize]]"></home-list-section>
				<home-all-section token="[[token]]"></home-all-section>
				<div>[[promotedCoursesEnabled]]</div>
				<discovery-footer></discovery-footer>
			</div>
		`;
	}

	static get properties() {
		return {
			visible: {
				type: Boolean,
				observer: '_visible'
			},
			token: String,
			promotedCoursesEnabled: Boolean,
			_pageSize: {
				type: Number,
				value: 4
			},
			_addedHref: String,
			_updatedHref: String,
			_hasCourses: {
				type: Boolean,
				value: true
			}
		};
	}

	ready() {
		super.ready();
		this.addEventListener('d2l-discover-home-all-section-courses', this._checkCourses.bind(this));
	}

	_checkCourses(e) {
		if (e && e.detail) {
			if (e.detail.value > 0) {
				this._hasCourses = true;
			} else {
				this._hasCourses = false;
			}
		}
	}

	_visible(visible) {
		if (!visible) {
			return;
		}

		this._updateToken();
		this._setUpUrls();
		const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
		document.title = this.localize('homepageDocumentTitle', 'instanceName', instanceName ? instanceName : '');

		const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
		if (homeHeader) {
			homeHeader.clear();
			homeHeader.focusOnInput();
		}
	}

	_setUpUrls() {
		this._getSortUrl('added').then(url => {
			this._addedHref = url;
		});
		this._getSortUrl('updated').then(url => {
			this._updatedHref = url;
		});
	}

	_getSortUrl(sort) {
		const searchAction = 'search-activities';
		const parameters = {
			page: 0,
			pageSize: this._pageSize,
			sort: sort
		};
		return this._getActionUrl(searchAction, parameters);
	}

	_updateToken() {
		return this._getToken()
			.then((token) => {
				this.token = token;
			});
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
