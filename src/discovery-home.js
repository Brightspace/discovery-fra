'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-typography/d2l-typography.js';
import './components/discovery-footer.js';
import './components/home-header.js';
import './components/home-list-section.js';
import './components/home-all-section.js';
import './components/featured-list-section.js';
import './styles/discovery-styles.js';

import { FetchMixin } from './mixins/fetch-mixin.js';
import { DiscoverSettingsMixin } from './mixins/discover-settings-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { FeatureMixin } from './mixins/feature-mixin.js';

class DiscoveryHome extends FeatureMixin(DiscoverSettingsMixin(FetchMixin(LocalizeMixin(PolymerElement)))) {
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
					padding-top: 60px;
					text-align: center;
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
				<div class="discovery-home-home-header">
					<home-header id="discovery-home-home-header" query="" show-settings-button="[[canManageDiscover]]"></home-header>
				</div>
				<template is="dom-if" if="[[promotedCoursesEnabled]]">
					<featured-list-section
						href="[[_promotedCoursesHref]]"
						token="[[token]]"
						showOrganizationCode$="[[showOrganizationCode]]"
						showSemesterName$="[[showSemesterName]]"></featured-list-section>
				</template>
				<div class="discovery-no-courses-message" hidden$="[[_hasCoursesFromAllSection]]">[[_noActivitiesMsg]]</div>
				<home-list-section
					href="[[_addedHref]]"
					token="[[token]]"
					sort="added"
					section-name="[[localize('new')]]"
					link-label="[[localize('viewAllNewLabel')]]"
					link-name="[[localize('viewAll')]]"
					page-size="[[_pageSize]]"
					showOrganizationCode$="[[showOrganizationCode]]"
					showSemesterName$="[[showSemesterName]]"></home-list-section>
				<home-list-section
					href="[[_updatedHref]]"
					token="[[token]]"
					sort="updated"
					section-name="[[localize('updated')]]"
					link-label="[[localize('viewAllUpdatedLabel')]]"
					link-name="[[localize('viewAll')]]"
					page-size="[[_pageSize]]"
					showOrganizationCode$="[[showOrganizationCode]]"
					showSemesterName$="[[showSemesterName]]"></home-list-section>
				<home-all-section
					token="[[token]]"
					show-organization-code$="[[showOrganizationCode]]"
					show-semester-name$="[[showSemesterName]]"></home-all-section>
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
			canManageDiscover: Boolean,
			_pageSize: {
				type: Number,
				value: 4
			},
			_addedHref: String,
			_updatedHref: String,
			_promotedCoursesHref: String,
			_hasCoursesFromAllSection: {
				type: Boolean,
				value: true
			},
			_hasPromotedCourses: {
				type: Boolean,
				value: false
			},
			showOrganizationCode: {
				type: Boolean
			},
			showSemesterName: {
				type: Boolean,
			},
			_noActivitiesMsg: String
		};
	}

	ready() {
		super.ready();
		this.addEventListener('d2l-discover-home-all-section-courses', this._checkCoursesFromAllSection.bind(this));
		this.addEventListener('d2l-discover-home-featured-section-courses', this._checkPromotedCourses.bind(this));
	}

	_checkCoursesFromAllSection(e) {
		if (e && e.detail) {
			if (e.detail.value > 0) {
				this._hasCoursesFromAllSection = true;
			} else {
				this._hasCoursesFromAllSection = false;
			}
			this._updateNoActivitiesMsg();
		}
	}

	_checkPromotedCourses(e) {
		if (e && e.detail) {
			if (e.detail.value > 0) {
				this._hasPromotedCourses = true;
			} else {
				this._hasPromotedCourses = false;
			}
			this._updateNoActivitiesMsg();
		}
	}

	_updateNoActivitiesMsg() {
		if (this._hasCoursesFromAllSection) {
			return;
		}
		if (this._hasPromotedCourses) {
			this._noActivitiesMsg = this.localize('noActivitiesExceptPrmoted');
		} else {
			this._noActivitiesMsg = this.localize('noActivities');
		}
	}

	_visible(visible) {
		if (!visible) {
			return;
		}

		this._updateToken();
		this._initializeSettings();
		const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
		document.title = this.localize('homepageDocumentTitle', 'instanceName', instanceName ? instanceName : '');

		const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
		if (homeHeader) {
			homeHeader.clear();
			homeHeader.focusOnInput();
		}
	}

	_initializeSettings() {
		this.showOrganizationCode = true;
		this.showSemesterName = true;

		if (this._isDiscoverCustomizationsEnabled()) {
			this.fetchDiscoverSettings().then(properties => {
				if (properties) {
					this.showOrganizationCode = properties.showCourseCode;
					this.showSemesterName = properties.showSemester;
				}
			});
		}
		this._setUpUrls();
	}

	_setUpUrls() {
		this._getSortUrl('added').then(url => {
			this._addedHref = url;
		});
		this._getSortUrl('updated').then(url => {
			this._updatedHref = url;
		});
		this._getActionUrl('get-promoted-courses').then(url => {
			this._promotedCoursesHref = url;
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
