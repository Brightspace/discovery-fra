'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';

class Discovery404 extends LocalizeMixin(PolymerElement) {
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
			<p>[[localize('404message')]] <a href="javascript:void(0)" on-click="_goToHome">[[localize('navigateHome')]]</a></p>
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
