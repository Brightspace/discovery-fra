import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseAction extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html `
			<style include="d2l-typography">
				:host {
					display: flex;
					width: 100%;
				}

				.discovery-course-action-container {
					display: flex;
					flex-direction: column;
					margin: 1.5rem;
				}

				.discovery-course-action-d2l-heading-3 {
					margin-bottom: 0.9rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-action-info-property {
					display: flex;
					margin-bottom: 0.6rem !important;
				}

				.discovery-course-action-info-property .d2l-body-compact {
					display: flex;
					margin-right: 0.5rem;
					width: 100%;
				}
				.discovery-course-action-tags-container {
					display: flex;
					flex-direction: column;
					margin: 1.5rem;
				}
			</style>

			<div class="d2l-typography">
				<div class="discovery-course-action-container">
					<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('courseInfo')]]</h3>
					<div class="discovery-course-action-info-property">
						<div class="d2l-body-compact">[[localize('startDate')]]</div>
						<div class="d2l-body-compact">[[startDate]]</div>
					</div>

					<div class="discovery-course-action-info-property">
						<div class="d2l-body-compact">[[localize('endDate')]]</div>
						<div class="d2l-body-compact">[[endDate]]</div>
					</div>

					<div class="discovery-course-action-info-property">
						<div class="d2l-body-compact">[[localize('courseCode')]]</div>
						<div class="d2l-body-compact">[[courseCode]]</div>
					</div>

					<div class="discovery-course-action-info-property">
						<div class="d2l-body-compact">[[localize('firstPublished')]]</div>
						<div class="d2l-body-compact">[[firstPublished]]</div>
					</div>
				</div>

				<template is="dom-if" if="[[tagsExist]]">
					<div class="discovery-course-action-tags-container">
						<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('searchKeywords')]]</h3>
						<div>
							<template is="dom-repeat" items="[[courseTags]]">
								<d2l-link href="javascript:void(0)" on-click="_navigateToSearch">
									<span value="[[item]]">[[item]][[_getTagSuffix(index)]]</span>
								</d2l-link>
							</template>
						</div>
					</div>
				</template>
			</div>
		`;
	}

	static get properties() {
		return {
			courseCode: String,
			courseTags: Array,
			endDate: String,
			firstPublished: String,
			startDate: String,
			tagsExist: {
				type: Boolean,
				computed: '_tagsExist(courseTags)',
			},
		};
	}

	_tagsExist(courseTags) {
		return courseTags && courseTags.length;
	}

	_getTagSuffix(index) {
		if (index !== undefined && this.courseTags) {
			if (index === this.courseTags.length - 1) {
				return '';
			} else {
				return ', ';
			}
		}
		return '';
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

window.customElements.define('course-action', CourseAction);
