'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './components/discovery-footer.js';
import './components/home-header.js';
import './styles/discovery-styles.js';

import { LocalizeMixin } from './mixins/localize-mixin.js';

class DiscoveryHome extends LocalizeMixin(PolymerElement) {
	static get template() {

		return html`
			<style include="discovery-styles">
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}
				.discovery-home-home-header {
					margin-bottom: 1rem;
				}

				.discovery-home-main {
					margin: 0 30px;
				}

				@media only screen and (max-width: 929px) {
					.discovery-home-main {
						margin: 0 24px;
					}
				}
				@media only screen and (max-width: 767px) {
					.discovery-home-main {
						margin: 0 18px;
					}
				}
			</style>
			<div class="d2l-typography">
				<div class="discovery-home-main">
					<div class="discovery-home-home-header"><home-header id="discovery-home-home-header" query=""></home-header></div>
					<span>[[localize('discoverHomeMessage')]]</span>
					<discovery-footer></discovery-footer>
				</div>
			</div>
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
	_visible(visible) {
		if (visible) {
			const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
			document.title = this.localize('homepageDocumentTitle', 'instanceName', instanceName ? instanceName : '');

			const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
			if (homeHeader) {
				homeHeader.clear();
				homeHeader.focusOnInput();
			}
		}
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
