import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import 'd2l-alert/d2l-alert-toast.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-button/d2l-button.js';
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
				}

				.discovery-course-summary-card {
					background: white;
					border: 1px solid var(--d2l-color-mica);
					border-bottom: transparent;
					border-radius: 6px 6px 0 0;
					padding: 1.5rem 1.5rem 1.2rem;
				}

				.discovery-course-summary-breadcrumbs {
					align-items: center;
					display: flex;
					flex-direction: row;
				}

				.discovery-course-summary-breadcrumbs>* {
					margin: 0.1rem;
				}

				.discovery-course-summary-title {
					margin-top: 0.5rem;
				}

				.discovery-course-summary-info-container {
					display: flex;
					flex-wrap: wrap;
				}

				.discovery-course-summary-info-property {
					display: flex;
					align-items: center;
					margin-right: 0.9rem;
					margin-top: 0.5rem;
				}

				.discovery-course-summary-info-container span {
					margin-left: 0.5rem;
				}

				.discovery-course-summary-actions {
					background: var(--d2l-color-regolith);
					border-radius: 0 0 6px 6px;
					border: 1px solid var(--d2l-color-mica);
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					display: flex;
					padding: 0.9rem 1.2rem;
				}

				.discovery-course-summary-actions d2l-button {
					margin-right: 0.6rem;
				}

				.discovery-course-summary-description {
					padding: 1.5rem;
				}

				.discovery-course-summary-dialog-button-container {
					display: flex;
					flex-direction: row;
					margin-top: 2rem;
					overflow: auto;
				}

				.discovery-course-summary-alert {
					height: auto;
				}

				.discovery-course-summary-alert-container {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					overflow: auto;
				}

				.discovery-course-summary-alert-content {
					margin-left: 0.5rem;
					margin-right: 0.5rem;
				}

				.discovery-course-summary-dialog {
					border-radius: 5px;
					overflow: auto;
					width: 45%;
				}

				.discovery-course-summary-dialog-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-course-summary-dialog-header-container {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}

				.discovery-course-summary-dialog-close {
					cursor: pointer;
					font-size: 1.4rem;
				}

				.discovery-course-summary-second-dialog-button {
					margin-left: 1rem;
				}

				.discovery-course-summary-d2l-heading-1 {
					margin-bottom: 0.7rem !important;
					margin-top: 0.9rem !important;
				}

				.discovery-course-summary-d2l-heading-2 {
					margin-bottom: 1rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-summary-text-stuff {
					white-space: pre-wrap;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary-card,
					.discovery-course-summary-actions {
						padding: 0.9rem;
					}

					.discovery-course-summary-description {
						padding: 1.5rem 0.9rem 0.9rem;
					}
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary-card {
						border-radius: 0;
						border: none;
					}

					.discovery-course-summary-actions {
						border-left: none;
						border-radius: 0;
						border-right: none;
						box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
						flex-direction: column;
					}
					.discovery-course-summary-actions d2l-button {
						--d2l-button: {
							width: 100%;
						}

						margin-bottom: 0.6rem;
						margin-right: 0;
					}
				}
			</style>

			<div class="d2l-typography discovery-course-summary-container">
				<div class="discovery-course-summary-card">
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

					<div class="discovery-course-summary-info-container">
						<div class="discovery-course-summary-info-property">
							<d2l-icon icon="d2l-tier1:time"></d2l-icon>
							<span class="d2l-body-standard">[[localize('durationMinutes', 'minutes', courseDuration)]]</span>
						</div>
						<div class="discovery-course-summary-info-property">
							<d2l-icon icon="d2l-tier1:locations"></d2l-icon>
							<span class="d2l-body-standard">[[format]]</span>
						</div>
						<div class="discovery-course-summary-info-property">
							<d2l-icon icon="d2l-tier1:calendar"></d2l-icon>
							<span class="d2l-body-standard">[[localize('lastUpdatedDate', 'date', courseLastUpdated)]]</span>
						</div>
					</div>
				</div>

				<div class="discovery-course-summary-actions">
					<template is="dom-if" if="[[isInMyLearning]]">
						<d2l-button on-click="_addToMyLearning" primary>[[localize('accessMaterials')]]</d2l-button>
					</template>
					<template is="dom-if" if="[[!isInMyLearning]]">
						<d2l-button on-click="_addToMyLearning" primary>[[localize('enrollInCourse')]]</d2l-button>
					</template>
					<template is="dom-if" if="[[isInMyLearning]]">
						<d2l-button on-click="_addToMyList">[[localize('unenroll')]]</d2l-button>
					</template>
					<template is="dom-if" if="[[!isInMyLearning]]">
						<template is="dom-if" if="[[isOnMyList]]">
							<d2l-button on-click="_addToMyList">[[localize('onMyList')]]</d2l-button>
						</template>
						<template is="dom-if" if="[[!isOnMyList]]">
							<d2l-button on-click="_addToMyList">[[localize('addToMyList')]]</d2l-button>
						</template>
					</template>
				</div>

				<div class="discovery-course-summary-description">
					<h2 class="d2l-heading-2 discovery-course-summary-d2l-heading-2">[[localize('courseDescription')]]</h2>
					<div class="d2l-body-compact discovery-course-summary-text-stuff">[[courseDescription]]</div>
				</div>
			</div>

			<d2l-alert-toast class="discovery-course-summary-alert" id="addedAlert" type="success" hide-close-button>
				<div class="discovery-course-summary-alert-container">
					<div class="discovery-course-summary-alert-content">[[localize('addedToYourList')]]</div>
					<div class="discovery-course-summary-alert-content">
						<d2l-link href="javascript:void(0)" on-click="_navigateToMyList">[[localize('viewMyList')]]</d2l-link>
					</div>
				</div>
			</d2l-alert-toast>

			<paper-dialog class="discovery-course-summary-dialog d2l-typography" id="myLearningDialog" always-on-top with-backdrop>
				<div class="discovery-course-summary-dialog-container">
					<div class="discovery-course-summary-dialog-header-container">
						<h4 class="d2l-heading-4 discovery-course-summary-d2l-heading-4">[[localize('addedToMyLearningHeader')]]</h4>
						<d2l-icon class="discovery-course-summary-dialog-close" on-click="_closeDialog" icon="d2l-tier1:close-small"></d2l-icon>
					</div>

					<h2 class="d2l-heading-2 discovery-course-summary-d2l-heading-2">[[courseTitle]]</h2>
					<h4 class="d2l-heading-4 discovery-course-summary-d2l-heading-4">[[localize('welcomeToTheCourse')]]</h4>
					<span class="d2l-body-standard">
						[[localize('addedToMyLearningMessage')]]
					</span>
					<div class="discovery-course-summary-dialog-button-container">
						<div>
							<d2l-button on-click="_navigateToHome" primary>[[localize('startLearning')]]</d2l-button>
						</div>
						<div class="discovery-course-summary-second-dialog-button">
							<d2l-button on-click="_closeDialog">[[localize('continueBrowsing')]]</d2l-button>
						</div>
					</div>
				</div>
			</paper-dialog>
		`;
	}

	static get properties() {
		return {
			courseCategory: String,
			courseTitle: String,
			courseDescription: String,
			courseDuration: Number,
			courseLastUpdated: String,
			format: String,
			isInMyLearning: {
				type: Boolean,
				notify: true
			},
			isOnMyList: {
				type: Boolean,
				notify: true
			},
		};
	}

	_addToMyLearning() {
		this.isInMyLearning = !this.isInMyLearning; // temporary toggle functionality for testing

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = true;
	}

	_addToMyList() {
		this.isOnMyList = !this.isOnMyList; // temporary toggle functionality for testing

		var addedAlert = this.shadowRoot.querySelector('#addedAlert');
		addedAlert.open = true;
	}

	_closeDialog() {
		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
	}

	_navigateToMyList() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().myList(),
			},
			bubbles: true,
			composed: true,
		}));

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
	}

	_navigateToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home(),
			},
			bubbles: true,
			composed: true,
		}));

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
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
