'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class DiscoveryFooter extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: inline-block;
					height: 150px;
				}
			</style>
			<footer></footer>
		`;
	}
	static get properties() {
		return {};
	}
}

window.customElements.define('discovery-footer', DiscoveryFooter);
