'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './components/search-header.js';

class DiscoveryHome extends PolymerElement {
	static get template() {
		return html`
			<div>
				  <search-header query=""></search-header>
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
		const searchHeader = this.shadowRoot.querySelector('search-header');
		if (searchHeader) {
			searchHeader.clear();
		}
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
