'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './components/home-header.js';
import './styles/discovery-styles.js';

class DiscoveryHome extends PolymerElement {
	static get template() {

		return html`
			<style include="discovery-styles">
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
					<span>This is the Discovery home page.</span>
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
	_visible() {
		const homeHeader = this.shadowRoot.querySelector('#discovery-home-home-header');
		if (homeHeader) {
			homeHeader.clear();
			homeHeader.focusOnInput();
		}
	}
}

window.customElements.define('discovery-home', DiscoveryHome);
