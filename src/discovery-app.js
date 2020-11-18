import { LitElement, html } from 'lit-element';
import './discovery-404.js';
import './discovery-course.js';
import './discovery-home.js';
import './discovery-search.js';
import './discovery-settings.js';
import { navigator, router } from 'lit-element-router';

import { FeatureMixin } from './mixins/feature-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

export class DiscoveryApp extends (navigator(router(FetchMixin(FeatureMixin(RouteLocationsMixin(LitElement)))))) {
	constructor() {
		super();
		this.route = '';
		this.params = {};
		this.query = {};
		this.data = {};
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			switch (propName) {
				case 'options': this._optionsChanged();
					break;
				case 'token': this._tokenChanged();
					break;
			}
		});
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('navigate', this._handleNavigate.bind(this));
	}
	disconnectedCallback() {
		window.removeEventListener('navigate', this._handleNavigate.bind(this));
	}

	static get properties() {
		return {
			options: {
				type: String,
			},
			token: {
				type: String,
			},
			resolvedToken: {
				type: String
			},
			route: {
				type: String
			},
			params: {
				type: Object
			},
			data: {
				type: Object
			},
			_promotedCoursesEnabled: {
				type: Boolean
			},
			_manageDiscover: {
				type: Boolean
			},
			_discoverCustomizationsEnabled: {
				type: Boolean
			},
			_discoverToggleSectionsEnabled: {
				type: Boolean
			}
		};
	}

	_renderCurrentView() {
		switch (this.route) {
			case 'home' || '': return html `
				<discovery-home name="home"
					?promoted-courses-enabled="${this._promotedCoursesEnabled}"
					?can-manage-discover="${this._manageDiscover}">
				</discovery-home>`;
			case 'settings': return html `
				<discovery-settings
					name="settings"
					?can-manage-discover="${this._manageDiscover}"
					?discover-customizations-enabled = "${this._discoverCustomizationsEnabled}"
					?discover-toggle-sections-enabled = "${this._discoverToggleSectionsEnabled}">
				</discovery-settings>`;

			case 'course': return html `
				<discovery-course name="course" course-id="${this.params.id}"></discovery-course>`;

			case 'search': return html `
				<discovery-search name="search" query="${this.query.query}" sort="${this.query.sort}" ></discovery-search>`;

			default: return html `
				<discovery-404></discovery-404>`;
		}
	}

	render() {
		return html`
			${this._isDiscoverInitialized(this.resolvedToken, this.options) ? html`
				${this._renderCurrentView(this.route)}
			` : null }
		`;
	}

	_handleNavigate(e) {
		if (e && e.detail) {
			if (e.detail.resetPages) {
				e.detail.resetPages.forEach((page) => {
					this._resetPage(page);
				});
			}
			this.navigate(e.detail.path);
		}
	}

	//Assigns feature/flags/endpoint/other information from LMS.
	_optionsChanged() {
		this._initializeOptions(this.options);
		this._promotedCoursesEnabled = this._isPromotedCoursesEnabled();
		this._manageDiscover = this._canManageDiscover();
		this._discoverCustomizationsEnabled = this._isDiscoverCustomizationsEnabled();
		this._discoverToggleSectionsEnabled = this._isDiscoverToggleSectionsEnabled();
	}

	_isDiscoverInitialized(resolvedToken, options) {
		if (resolvedToken && options) {
			return true;

		}
		return false;
	}

	//Retrieves a token for interacting with the BFF
	async _tokenChanged() {
		this._initializeToken(this.token);

		//Resolve the token
		this._getToken().then((token) => {
			this.resolvedToken = token;
		});
	}

	_resetPage(pageName) {
		const pageElement = this.shadowRoot.querySelector(`[name="${pageName}"]`);
		if (pageElement && typeof pageElement._reset === 'function') {
			pageElement._reset();
		}
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
