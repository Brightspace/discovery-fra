'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';

class DiscoveryHome extends PolymerElement {
	static get template() {
		return html`
			<app-route
				route="{{route}}"
				pattern="/d2l/le/discovery/view/home"
				data="{{routeData}}">
			</app-route>

			This is the Discovery home page.
			<button on-click="_goTo404">Go to the 404 page</button>
		`;
	}
	static get properties() {
	}
	_goTo404() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: '/d2l/le/discovery/view/404'
			},
			bubbles: true,
			composed: true,
		}));
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
