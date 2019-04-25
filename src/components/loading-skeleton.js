'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-colors/d2l-colors.js';

class LoadingSkeleton extends PolymerElement {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: inline-block;
				}

				@keyframes pulsingAnimation {
					0% { background-color: var(--d2l-color-sylvite); }
					50% { background-color: var(--d2l-color-regolith); }
					100% { background-color: var(--d2l-color-sylvite); }
				}
				@keyframes pulsingAnimation0 {
					0% { background-color: red; }
					50% { background-color: green; }
					100% { background-color: red; }
				}
				.discovery-loading-skeleton-container {
					animation: pulsingAnimation 1.8s linear infinite;
					border-radius: 4px;
					height: 100%;
					width: 100%;
				}
			</style>

			<div class="discovery-loading-skeleton-container"></div>
		`;
	}
	static get properties() {
		return {};
	}
}

window.customElements.define('loading-skeleton', LoadingSkeleton);

