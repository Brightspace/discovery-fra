'use strict';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';

class DiscoveryInit extends IfrauMixin(LocalizeMixin(PolymerElement)) {
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
			document.title = this.localize('discover');
		}.bind(this));
	}
}

window.customElements.define('discovery-init', DiscoveryInit);
