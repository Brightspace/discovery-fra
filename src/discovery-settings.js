'use strict';
import './components/save-close-buttons.js';
import './components/discover-settings-promoted-content.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/alert/alert-toast.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import './components/discover-settings-breadcrumbs-lit.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading1Styles, heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { DiscoverSettingsMixin } from './mixins/discover-settings-mixin.js';
import { getLocalizeResources } from './localization.js';

class DiscoverySettings extends DiscoverSettingsMixin(LocalizeMixin(FetchMixin(RouteLocationsMixin(LitElement)))) {

	render() {
		const customizeDiscoverSection = this._renderCustomizeDiscoverSection();
		return html`
			<style include="discovery-styles"></style>
			<div class="discovery-settings-main">
				<div class="discovery-settings-header">
					<discover-settings-breadcrumbs-lit></discover-settings-breadcrumbs-lit>
					<h1 class="d2l-heading-1 discovery-settings-h1">${this.localize('discoverSettings')}</h1>
				</div>
				<div class="discovery-settings-content">
					<discover-settings-promoted-content token="${this.token}"></discover-settings-promoted-content>
					${customizeDiscoverSection}
				</div>
				<div class="discovery-settings-page-divider"></div>
				<save-close-buttons></save-close-buttons>
			</div>

			<d2l-alert-toast type="success"></d2l-alert-toast>
		`;
	}

	_renderCustomizeDiscoverSection() {
		return html`
			${this.discoverCustomizationsEnabled ? html`
				<div class="discover-customization-section">
					<h2 class="discover-customization-title">${this.localize('customizeDiscover')}</h2>
					<div class="discover-customization-settings" ?hidden="${this._hideCustomizationSettings}">
						<d2l-input-checkbox
							id="showCourseCodeCheckbox"
							?checked=${this._savedShowCourseCode}
							@change=${this._onShowCourseCodeChange}>${this.localize('showCourseCode')}</d2l-input-checkbox>
						<d2l-input-checkbox
							id="showSemesterCheckbox"
							?checked=${this._savedShowSemester}
							@change=${this._onShowSemesterChange}>${this.localize('showSemester')}</d2l-input-checkbox>
					</div>
				</div>
			` : html``}
		`;
	}

	static get styles() {
		return [
			heading1Styles,
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}
				.discovery-settings-header {
					margin-bottom: 1rem;
					margin-top: .75rem;
				}
				.discovery-settings-h1 {
					margin-top: .5rem;
				}
				.discovery-settings-main {
					margin: 0 30px;
				}
				.discovery-settings-content {
					min-height: 30rem;
				}
				.discovery-settings-page-divider {
					border-top: 1px solid rgba(124,134,149,0.18);
				}
				.discover-customization-section {
					padding-top: 1rem;
				}
				.discover-customization-settings {
					display: flex;
					flex-direction: column;
				}
				.discover-customization-settings d2l-switch-visibility {
					padding-bottom: 0.25rem;
				}
				@media only screen and (max-width: 929px) {
					.discovery-settings-main {
						margin: 0 24px;
					}
					.discovery-settings-content {
						min-height: 29rem;
					}
				}
				@media only screen and (max-width: 767px) {
					.discovery-settings-main {
						margin: 0 18px;
					}
					.discovery-settings-content {
						min-height: 27rem;
					}
				}
				@media only screen and (max-width: 671px) {
					.discovery-settings-main {
						margin: 0 18px;
					}
					.discovery-settings-content {
						min-height: 22rem;
					}
				}
				@media only screen and (max-width: 615px) {
					.discovery-settings-content {
						min-height: 20rem;
					}
				}
			`
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this.canManageDiscover = false;
		this.discoverCustomizationsEnabled = false;
		this._showCourseCode = true;
		this._showSemester = true;
		this._hideCustomizationSettings = true;
		this._updateToken();
	}

	static get properties() {
		return {
			visible: {
				type: Boolean
			},
			canManageDiscover: {
				type: Boolean
			},
			discoverCustomizationsEnabled: {
				type: Boolean
			},
			_savedShowCourseCode: {
				type: Boolean
			},
			_savedShowSemester: {
				type: Boolean
			},
			_showCourseCode: {
				type: Boolean
			},
			_showSemester: {
				type: Boolean
			},
			_promotedHref: {
				type: String
			},
			_relevantHref: {
				type: String
			},
			_selectedPromotedCourses: {
				type: Array
			},
			_hideCustomizationSettings: {
				type: Boolean
			},
			token: {
				type: String
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('discover-page-save', this._handleSave.bind(this));
		this.addEventListener('discover-page-cancel', this._handleCancel.bind(this));
		this.addEventListener('discover-settings-promoted-content-selection', this._updateFeaturedSelection.bind(this));
	}

	disconnectedCallback() {
		this.removeEventListener('discover-page-save', this._handleSave.bind(this));
		this.removeEventListener('discover-page-cancel', this._handleCancel.bind(this));
		this.removeEventListener('discover-settings-promoted-content-selection', this._updateFeaturedSelection.bind(this));
		super.disconnectedCallback();
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'canManageDiscover' || propName === 'visible') {
				this._checkPermission();
				this._initializeSettings();
			}
		});
	}

	_updateFeaturedSelection(e) {
		this._selectedPromotedCourses = e.detail.selection;
	}

	_onShowCourseCodeChange() {
		const showCourseCodeCheckbox = this.shadowRoot.querySelector('#showCourseCodeCheckbox');
		this._showCourseCode = showCourseCodeCheckbox.checked;
	}

	_onShowSemesterChange() {
		const showSemesterCheckbox = this.shadowRoot.querySelector('#showSemesterCheckbox');
		this._showSemester = showSemesterCheckbox.checked;
	}

	_initializeSettings() {
		if (this.discoverCustomizationsEnabled) {
			this.fetchDiscoverSettings().then(properties => {
				if (properties) {
					this._savedShowCourseCode = properties.showCourseCode;
					this._savedShowSemester = properties.showSemester;
					this._showCourseCode = properties.showCourseCode;
					this._showSemester = properties.showSemester;
					this._hideCustomizationSettings = false;
				}
			});
		}
	}

	_checkPermission() {
		if (!this.visible || this.canManageDiscover) {
			return;
		}

		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().notFound()
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

	async _handleSave() {
		if (this._selectedPromotedCourses === undefined) {
			return;
		}

		await this.saveDiscoverSettings(this._selectedPromotedCourses, this._showCourseCode, this._showSemester);
		this._savedShowCourseCode = this._showCourseCode;
		this._savedShowSemester = this._showSemester;
		this.shadowRoot.querySelector('d2l-alert-toast').innerHTML = this.localize('saveCompleted');
		this.shadowRoot.querySelector('d2l-alert-toast').open = true;
	}

	_handleCancel() {
		this._reset();
		this.shadowRoot.querySelector('d2l-alert-toast').innerHTML = this.localize('saveCancelled');
		this.shadowRoot.querySelector('d2l-alert-toast').open = true;
	}

	_reset() {
		this.shadowRoot.querySelector('discover-settings-promoted-content').cancel();
		const showCourseCodeCheckbox = this.shadowRoot.querySelector('#showCourseCodeCheckbox');
		showCourseCodeCheckbox.checked = this._savedShowCourseCode;
		const showSemesterCheckbox = this.shadowRoot.querySelector('#showSemesterCheckbox');
		showSemesterCheckbox.checked = this._savedShowSemester;
		this._showCourseCode = this._savedShowCourseCode;
		this._showSemester = this._savedShowSemester;
	}
}

window.customElements.define('discovery-settings', DiscoverySettings);
