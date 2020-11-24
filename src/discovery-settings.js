'use strict';
import './components/save-close-buttons.js';
import './components/discover-settings-promoted-content.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import './components/discover-settings-breadcrumbs-lit.js';
import './components/discover-settings-toast.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading1Styles, heading2Styles, heading4Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { DiscoverSettingsMixin } from './mixins/discover-settings-mixin.js';
import { getLocalizeResources } from './localization.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class DiscoverySettings extends SkeletonMixin(DiscoverSettingsMixin(LocalizeMixin(FetchMixin(RouteLocationsMixin(LitElement))))) {

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
					<d2l-dialog title-text="${this.localize('saveChanges')}">
						<div><b>${this.localize('saveChangesBoldBody')}</b></div>
						<div>${this.localize('saveChangesBody')}</div>
						<d2l-button slot="footer" primary data-dialog-action="save">${this.localize('save')}</d2l-button>
						<d2l-button slot="footer" data-dialog-action="notSave">${this.localize('doNotSave')}</d2l-button>
						<d2l-button slot="footer" data-dialog-action>${this.localize('cancel')}</d2l-button>
					</d2l-dialog>
				</div>
				<div class="discovery-settings-page-divider"></div>
				<save-close-buttons></save-close-buttons>
			</div>
			<discover-settings-toast></discover-settings-toast>
		`;
	}

	_renderCustomizeDiscoverSection() {
		const renderToggleSections = this._renderToggleSections();
		return html`
			${this.discoverCustomizationsEnabled ? html`
				<div class="discover-customization-section">
					<h2 class="discover-customization-title">${this.localize('customizeDiscover')}</h2>

					${this.discoverToggleSectionsEnabled ? html`
						<h4 class="discovery-settings-h4">${this.localize('courseTileSettings')}</h4>
					` : null}

					${!this._settingsLoaded ? html`
						<d2l-input-checkbox skeleton>${this.localize('showCourseCode')}</d2l-input-checkbox>
						<d2l-input-checkbox skeleton>${this.localize('showSemester')}</d2l-input-checkbox>
					` : html`
						<div class="discover-customization-settings" ?hidden="${!this._settingsLoaded}">
							<d2l-input-checkbox
								id="showCourseCodeCheckbox"
								?checked=${this._savedShowCourseCode}
								@change=${this._onShowCourseCodeChange}>${this.localize('showCourseCode')}</d2l-input-checkbox>
							<d2l-input-checkbox
								id="showSemesterCheckbox"
								?checked=${this._savedShowSemester}
								@change=${this._onShowSemesterChange}>${this.localize('showSemester')}</d2l-input-checkbox>
						</div>
					`}
					${renderToggleSections}
				</div>
			` : null}
		`;
	}

	_renderToggleSections() {
		return html`
			${this.discoverToggleSectionsEnabled ? html`
					<h4 class="discovery-settings-h4">${this.localize('sectionsSettings')}</h4>

					${!this._settingsLoaded ? html`
						<d2l-input-checkbox skeleton>${this.localize('showUpdatedSection')}</d2l-input-checkbox>
						<d2l-input-checkbox skeleton>${this.localize('showNewSection')}</d2l-input-checkbox>
					` : html`
						<div class="discover-customization-settings" ?hidden="${!this._settingsLoaded}">
							<d2l-input-checkbox
								id="showUpdatedSectionCheckbox"
								?checked=${this._savedShowUpdatedSection}
								@change=${this._onShowUpdatedSectionChange}>${this.localize('showUpdatedSection')}</d2l-input-checkbox>
							<d2l-input-checkbox
								id="showNewSectionCheckbox"
								?checked=${this._savedShowNewSection}
								@change=${this._onShowNewSectionChange}>${this.localize('showNewSection')}</d2l-input-checkbox>
						</div>
					`}
			` : null}
		`;
	}

	static get styles() {
		return [
			heading1Styles,
			heading2Styles,
			heading4Styles,
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
				.discovery-settings-h4 {
					margin: 0rem;
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
		this.discoverToggleSectionsEnabled = false;
		this._showCourseCode = true;
		this._showSemester = true;
		this._showUpdatedSection = true;
		this._showNewSection = true;
		this._SavedShowCourseCode = true;
		this._SavedShowSemester = true;
		this._SavedShowUpdatedSection = true;
		this._SavedShowNewSection = true;
		this._settingsLoaded = false;
		this._updateToken();
	}

	static get properties() {
		return {
			token: {
				type: String
			},
			canManageDiscover: {
				type: Boolean,
				attribute: 'can-manage-discover'
			},
			discoverCustomizationsEnabled: {
				type: Boolean,
				attribute: 'discover-customizations-enabled'
			},
			discoverToggleSectionsEnabled: {
				type: Boolean,
				attribute: 'discover-toggle-sections-enabled'
			},
			_savedShowCourseCode: {
				type: Boolean
			},
			_savedShowSemester: {
				type: Boolean
			},
			_savedShowUpdatedSection: {
				type: Boolean
			},
			_savedShowNewSection: {
				type: Boolean
			},
			_showCourseCode: {
				type: Boolean
			},
			_showSemester: {
				type: Boolean
			},
			_showUpdatedSection: {
				type: Boolean
			},
			_showNewSection: {
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
			_settingsLoaded: {
				type: Boolean
			},
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('discover-page-save', this._handleSave.bind(this));
		this.addEventListener('discover-page-cancel', this._handleCancel.bind(this));
		this.addEventListener('discover-settings-promoted-content-selection', this._updateFeaturedSelection.bind(this));
		this.addEventListener('navigate', this._handleNavigate.bind(this));
		window.addEventListener('beforeunload', this._handleBeforeUnload.bind(this));
	}

	disconnectedCallback() {
		this.removeEventListener('discover-page-save', this._handleSave.bind(this));
		this.removeEventListener('discover-page-cancel', this._handleCancel.bind(this));
		this.removeEventListener('discover-settings-promoted-content-selection', this._updateFeaturedSelection.bind(this));
		this.removeEventListener('navigate', this._handleNavigate.bind(this));
		window.removeEventListener('beforeunload', this._handleBeforeUnload.bind(this));
		super.disconnectedCallback();
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'canManageDiscover') {
				this._checkPermission();
				this._initializeSettings();
			}
		});
	}

	_hasChanges() {
		if (this._settingsLoaded === false) {
			return false;
		}

		let hasChanges = false;
		if (this.discoverCustomizationsEnabled) {
			hasChanges = hasChanges || this._showCourseCode !== this._savedShowCourseCode;
			hasChanges = hasChanges || this._showSemester !== this._savedShowSemester;
			hasChanges = hasChanges || this.shadowRoot.querySelector('discover-settings-promoted-content').hasChanges();
		}
		if (this.discoverToggleSectionsEnabled) {
			hasChanges = hasChanges || this._showNewSection !== this._savedShowNewSection;
			hasChanges = hasChanges || this._showUpdatedSection !== this._savedShowUpdatedSection;
		}
		return hasChanges;
	}

	async _handleNavigate(e) {
		if (!this.canManageDiscover) {
			return;
		}

		const detail = e.detail;
		if (this._hasChanges() && !detail.fromDialog) {
			detail.fromDialog = true;
			e.preventDefault();
			e.stopImmediatePropagation();
			const action = await this.shadowRoot.querySelector('d2l-dialog').open();
			if (action === 'save') {
				await this._save();
				this.dispatchEvent(new CustomEvent('navigate', {
					detail: detail,
					bubbles: true,
					composed: true
				}));
			} else if (action === 'notSave') {
				this.dispatchEvent(new CustomEvent('navigate', {
					detail: detail,
					bubbles: true,
					composed: true
				}));
			}
		}
	}

	_handleBeforeUnload(e) {
		if (!this.canManageDiscover) {
			return;
		}
		if (this._hasChanges()) {
			e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
			// Chrome requires returnValue to be set
			e.returnValue = '';
		}
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

	_onShowUpdatedSectionChange() {
		const showUpdatedSectionCheckbox = this.shadowRoot.querySelector('#showUpdatedSectionCheckbox');
		this._showUpdatedSection = showUpdatedSectionCheckbox.checked;
	}

	_onShowNewSectionChange() {
		const showNewSectionCheckbox = this.shadowRoot.querySelector('#showNewSectionCheckbox');
		this._showNewSection = showNewSectionCheckbox.checked;
	}

	_initializeSettings() {
		if (this.discoverCustomizationsEnabled) {
			this.fetchDiscoverSettings().then(properties => {
				if (properties) {
					this._savedShowCourseCode = properties.showCourseCode;
					this._savedShowSemester = properties.showSemester;
					this._showCourseCode = properties.showCourseCode;
					this._showSemester = properties.showSemester;

					if (this.discoverToggleSectionsEnabled) {
						this._savedShowUpdatedSection = properties.showUpdatedSection;
						this._showUpdatedSection = properties.showUpdatedSection;
						this._savedShowNewSection = properties.showNewSection;
						this._showNewSection = properties.showNewSection;
					}
				}
				this._settingsLoaded = true;
			});
		}
	}

	_checkPermission() {
		if (this.canManageDiscover) {
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

	async _save() {
		if (this._selectedPromotedCourses === undefined || !this._settingsLoaded) {
			return;
		}

		await this.saveDiscoverSettings(this._selectedPromotedCourses, this._showCourseCode, this._showSemester, this._showUpdatedSection, this._showNewSection);
		this.shadowRoot.querySelector('discover-settings-promoted-content').save();
		this._savedShowCourseCode = this._showCourseCode;
		this._savedShowSemester = this._showSemester;
		this._savedShowUpdatedSection = this._showUpdatedSection;
		this._savedShowNewSection = this._showNewSection;
	}

	async _handleSave() {
		await this._save();
		this.shadowRoot.querySelector('discover-settings-toast').save();
	}

	_handleCancel() {
		this._reset();
		this.shadowRoot.querySelector('discover-settings-toast').cancel();
	}

	_reset() {
		this.shadowRoot.querySelector('discover-settings-promoted-content').cancel();

		//checkboxes are conditionally rendered based on this flag, need to confirm they exist.
		if (this.discoverCustomizationsEnabled) {
			const showCourseCodeCheckbox = this.shadowRoot.querySelector('#showCourseCodeCheckbox');
			showCourseCodeCheckbox.checked = this._savedShowCourseCode;
			const showSemesterCheckbox = this.shadowRoot.querySelector('#showSemesterCheckbox');
			showSemesterCheckbox.checked = this._savedShowSemester;
			this._showCourseCode = this._savedShowCourseCode;
			this._showSemester = this._savedShowSemester;
		}
		if (this.discoverToggleSectionsEnabled) {
			const showUpdatedSectionCheckbox = this.shadowRoot.querySelector('#showUpdatedSectionCheckbox');
			showUpdatedSectionCheckbox.checked = this._savedShowUpdatedSection;
			const showNewSectionCheckbox = this.shadowRoot.querySelector('#showNewSectionCheckbox');
			showNewSectionCheckbox.checked = this._savedShowNewSection;
			this._showUpdatedSection = this._savedShowUpdatedSection;
			this._showNewSection = this._savedShowNewSection;
		}
	}
}

window.customElements.define('discovery-settings', DiscoverySettings);
