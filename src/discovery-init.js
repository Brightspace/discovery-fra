'use strict';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { IfrauMixin } from './mixins/ifrau-mixin.js';
import 'd2l-typography/d2l-typography.js';

class DiscoveryInit extends IfrauMixin(PolymerElement) {
	static get properties() {
		return {
			elementName: String
		};
	}
	ready() {
		super.ready();
		this.frauConnect().then(function() {
			const element = document.createElement(this.elementName);
			document.body.appendChild(element);
		}.bind(this));
	}
}

window.customElements.define('discovery-init', DiscoveryInit);
