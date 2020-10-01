'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';

class LoadingOverlay extends PolymerElement {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: inline;
				}
				.discovery-loading-overlay-container {
					background-color: rgba(255, 255, 255, 0.5);
					height: 100%;
					position: absolute;
					width: 100%;
					z-index: 1000;
				}
				.discovery-loading-overlay-container-inner {
					left: 50%;
					position: absolute;
				}
				.discovery-loading-overlay-spinner {
					left: -50%;
					position: relative;
					--d2l-loading-spinner-size: 100px;
				}
			</style>

			<div class="discovery-loading-overlay-container" hidden$="[[!loading]]">
				<div class="discovery-loading-overlay-container-inner">
					<d2l-loading-spinner class="discovery-loading-overlay-spinner"></d2l-loading-spinner>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false
			}
		};
	}
}

window.customElements.define('loading-overlay', LoadingOverlay);
