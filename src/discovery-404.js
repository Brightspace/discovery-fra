'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import '@brightspace-ui/core/components/link/link.js';

class Discovery404 extends RouteLocationsMixin(LocalizeMixin(PolymerElement)) {
	static get template() {
		return html`
	  		<style>
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
					padding: 10px;
				}
	  		</style>
			
			<div>
				<span>[[localize('message404')]]</span>
				<d2l-link href="[[_getHomeHref()]]">[[localize('navigateHome')]]</d2l-link>
			</div>
		`;
	}

	_getHomeHref() {
		return this.routeLocations().home();
	}
}

window.customElements.define('discovery-404', Discovery404);
