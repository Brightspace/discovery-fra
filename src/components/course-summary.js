import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseSummary extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html `
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-course-summary-container {
					display: flex;
					flex-direction: column;
					overflow: hidden;
					padding: 1rem;
				}

				.discovery-course-summary-breadcrumbs {
					align-items: center;
					display: flex;
					flex-direction: row;
				}

				.discovery-course-summary-breadcrumbs>* {
					margin: 2px;
				}

				.discovery-course-summary-title {
					margin-top: 0.5rem;
				}

				.discovery-course-summary-d2l-heading-1 {
					margin-top: 0 !important;
				}

				.discovery-course-summary-d2l-heading-4 {
					margin-bottom: 1rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-summary-text-stuff {
					white-space: pre-wrap;
				}
			</style>

			<div class="d2l-typography discovery-course-summary-container">
				<div class="discovery-course-summary-breadcrumbs">
					<d2l-link href="javascript:void(0)" on-click="_navigateToHome">[[localize('discover')]]</d2l-link>
					<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>
					<d2l-link href="javascript:void(0)" on-click="_navigateToSearch">
						<span value="[[courseCategory]]">[[courseCategory]]</span>
					</d2l-link>
					<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>
				</div>

				<div class="discovery-course-summary-title">
					<h1 class="d2l-heading-1 discovery-course-summary-d2l-heading-1">[[courseTitle]]</h1>
				</div>

				<div class="discovery-course-summary-description">
					<h4 class="d2l-heading-4 discovery-course-summary-d2l-heading-4">[[localize('courseDescription')]]</h4>
					<div class="d2l-body-compact discovery-course-summary-text-stuff">[[courseDescription]]</div>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			courseCategory: String,
			courseTitle: String,
			courseDescription: String,
		};
	}

	_navigateToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home(),
			},
			bubbles: true,
			composed: true,
		}));
	}

	_navigateToSearch(e) {
		if (e && e.target && e.target.value) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().search(e.target.value),
				},
				bubbles: true,
				composed: true,
			}));
		}
	}
}

window.customElements.define('course-summary', CourseSummary);
