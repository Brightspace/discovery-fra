'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
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
							<d2l-breadcrumb href="[[_getHomeHref()]]" text="[[localize('backToDiscover')]]"></d2l-breadcrumb>
						</d2l-breadcrumbs>
					</div>
				</div>
			</div>
		`;
	}

	_getHomeHref() {
		return this.routeLocations().home();
	}
}

window.customElements.define('search-sidebar', SearchSidebar);
