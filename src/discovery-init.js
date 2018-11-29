'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { IfrauMixin } from './mixins/ifrau-mixin.js';

class DiscoveryInit extends IfrauMixin(PolymerElement) {
	static get properties() {
		return {
			elementName: String
		}
	}
	ready() {
		super.ready();
		const that = this;
		this.frauConnect().then(() => {
			const element = document.createElement(that.elementName);
			document.body.appendChild(element);
		});
	}
}

window.customElements.define('discovery-init', DiscoveryInit);
