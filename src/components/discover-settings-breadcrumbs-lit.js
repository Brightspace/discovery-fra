import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';


class DiscoverSettingsBreadcrumbsLit extends LocalizeMixin(RouteLocationsMixin(LitElement)) {

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	render() {
		return html `
		<d2l-breadcrumbs compact>
			<d2l-breadcrumb @click="${this._navigateToHome}" href="${this._getHomeHref()}" text="${this.localize('backToDiscover')}"></d2l-breadcrumb>
		</d2l-breadcrumbs>`
	}

	_navigateToHome(e) {
		if (e) {
			e.preventDefault();
		}

		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home()
			},
			bubbles: true,
			composed: true
		}));
	}

	_getHomeHref() {
		return this.valenceHomeHref();
	}
}

window.customElements.define('discover-settings-breadcrumbs-lit', DiscoverSettingsBreadcrumbsLit);
