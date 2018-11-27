import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {IfrauMixin} from './ifrau-mixin.js';


class DiscoveryInit extends IfrauMixin(PolymerElement) {
	static get properties() {
		return {
			elementName: String,
		};
	}
	ready() {
		super.ready();
		this.frauConnect().then(() => {
			var element = document.createElement(this.elementName);
			document.body.appendChild(element);
		});
	}
}

window.customElements.define('discovery-init', DiscoveryInit);