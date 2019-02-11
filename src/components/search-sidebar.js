'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-breadcrumbs/d2l-breadcrumb';
import 'd2l-breadcrumbs/d2l-breadcrumbs';
import 'd2l-typography/d2l-typography.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchSidebar extends RouteLocationsMixin(LocalizeMixin(PolymerElement)) {
	static get template() {
		return html`
			<style include="d2l-typography-shared-styles">
				:host {
					display: inline;
				}

				.discovery-search-sidebar-nav-container {
					width: 100%;
				}

				d2l-breadcrumb {
					font-size: 14px;
				}
			</style>
			<div>
				<div class="discovery-search-sidebar-container">
					<div class="discovery-search-sidebar-nav-container">
						<d2l-breadcrumbs compact>
							<d2l-breadcrumb on-click="_navigateToHome" href="javascript:void(0)" text="[[localize('backToDiscovery')]]"></d2l-breadcrumb>
						</d2l-breadcrumbs>
					</div>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {};
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
}

window.customElements.define('search-sidebar', SearchSidebar);
