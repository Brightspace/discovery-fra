'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class Discovery404 extends PolymerElement {
	static get template() {
		return html`
	  		<style>
				:host {
					display: block;
					padding: 10px;
				}
	  		</style>
			<p>Oops you hit a 404. <a href="javascript:void(0)" on-click="_goToHome">Head back to home.</a></p>
		`;
	}
	_goToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: '/d2l/le/discovery/view/'
			},
			bubbles: true,
			composed: true,
		}));
	}
}

window.customElements.define('discovery-404', Discovery404);
