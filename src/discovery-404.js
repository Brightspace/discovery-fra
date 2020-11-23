'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

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
			<p>[[localize('message404')]] <a href="javascript:void(0)" on-click="_goToHome">[[localize('navigateHome')]]</a></p>
		`;
	}
	_goToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path:  this.routeLocations().navLink()
			},
			bubbles: true,
			composed: true,
		}));
	}
}

window.customElements.define('discovery-404', Discovery404);
