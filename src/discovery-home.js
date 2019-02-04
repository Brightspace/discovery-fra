'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './components/home-header.js';
import './styles/discovery-styles.js';

class DiscoveryHome extends PolymerElement {
	static get template() {
		return html`
			<style include="discovery-styles"></style>
			<div class="d2l-typography">
				<home-header id="discovery-home-home-header" query=""></home-header>
			</div>
			This is the Discovery home page.
		`;
	}
	static get properties() {
		return {
			visible: {
				type: Boolean,
				observer: '_visible'
			}
		};
	}
	_visible() {
		const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
		if (homeHeader) {
			homeHeader.clear();
			homeHeader.focusOnInput();
		}
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
