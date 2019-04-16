import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Rels } from 'd2l-hypermedia-constants';
import createDOMPurify from 'dompurify/dist/purify.es.js';
const DOMPurify = createDOMPurify(window);
import '@polymer/paper-dialog/paper-dialog.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-breadcrumbs/d2l-breadcrumb';
import 'd2l-breadcrumbs/d2l-breadcrumbs';
import 'd2l-button/d2l-button.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';
import 'fastdom/fastdom.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseSummary extends FetchMixin(LocalizeMixin(RouteLocationsMixin(PolymerElement))) {
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
					margin-bottom: 0.2rem;
					margin-right: 0.9rem;
					margin-top: 0.2rem;
				}

				.discovery-course-summary-info-container d2l-icon {
					margin-right: 0.5rem;
				}


				.discovery-course-summary-bottom-container {
					background: var(--d2l-color-regolith);
					border-radius: 0 0 6px 6px;
					border: 1px solid var(--d2l-color-mica);
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					display: flex;
					flex-direction: column;
					padding: 0.9rem 1.2rem;
				}

				.discovery-course-summary-bottom-container d2l-button {
					margin-right: 0.6rem;
					overflow: hidden;
					--d2l-button: {
						height: 100%;
						white-space: normal;

						word-wrap: break-word; /* Fallback for IE/Edge */
						overflow-wrap: break-word; /* replaces 'word-wrap' in Firefox, Chrome, Safari */
					}
				}

				.discovery-course-summary-buttons {
					display: flex;
					flex-direction: row;
				}

				.discovery-course-summary-alert-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-course-summary-alert {
					margin-bottom: 0.9rem;
				}

				.discovery-course-summary-description {
					padding: 1.5rem;
				}

				.discovery-course-summary-dialog {
					border-radius: 5px;
					overflow: auto;
					top: 50px;
				}
				.discovery-course-summary-dialog-container {
					display: flex;
					flex-direction: column;
					align-items: baseline;
				}

				.discovery-course-summary-dialog-container d2l-button {
					display: flex;
					flex-direction: column;
					align-items: baseline;
				}

				.discovery-course-summary-dialog-content-container {
					margin-right: 1rem;
					margin-bottom: 1.5rem;
				}

				.discovery-course-summary-dialog-header-container {
					align-items: center;
					display: flex;
					justify-content: space-between;
					margin: 0.5rem 0;
					width: 100%;
				}
				.discovery-course-summary-dialog-heading-text {
					@apply --d2l-heading-3;
					margin: 0;
				}
				.discovery-course-summary-d2l-heading-1 {
					margin-bottom: 0.7rem !important;
					margin-top: 0.9rem !important;
				}

				.discovery-course-summary-d2l-heading-2 {
					margin-bottom: 1rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-summary-breadcrumbs {
					font-size: 14px;
					margin: -12px 0 -6px;
				}

				.discovery-course-summary-empty-description {
					padding: 1.5rem 0;
				}

				.discovery-course-summary-empty-description-box {
					background: var(--d2l-color-regolith);
					border: 1px solid var(--d2l-color-gypsum);
					border-radius: 6px;
				}

				.discovery-course-summary-empty-description-text {
					padding: 1.2rem 1.5rem;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary-card,
					.discovery-course-summary-bottom-container {
						padding: 0.9rem;
					}

					.discovery-course-summary-breadcrumbs {
						margin: -6px 0 -12px;
					}

					.discovery-course-summary-description {
						padding: 1.5rem 0.9rem 0.9rem;
					}

					.discovery-course-summary-info-property {
						margin-bottom: 0.3rem;
						margin-top: 0.3rem;
					}

					.discovery-course-summary-empty-description {
						padding: 1.5rem 0 0.9rem 0;
					}
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary-breadcrumbs {
						display: none;
					}

					.discovery-course-summary-card {
						border-radius: 0;
						border: none;
					}

					.discovery-course-summary-bottom-container {
						border-left: none;
						border-radius: 0;
						border-right: none;
						box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
						flex-direction: column;
					}
					.discovery-course-summary-bottom-container d2l-button {
						margin-bottom: 0.6rem;
						margin-right: 0;
						width: 100%;
					}

					.discovery-course-summary-empty-description-box {
						margin: 0 0.9rem;
					}
				}
			</style>

			<div class="d2l-typography discovery-course-summary-container">
				<div id="discovery-course-summary-card" class="discovery-course-summary-card">
					<div class="discovery-course-summary-breadcrumbs">
						<d2l-breadcrumbs class="discovery-search-header-breadcrumb">
							<d2l-breadcrumb on-click="_navigateToHome" href="[[_homeHref]]" text="[[localize('discover')]]"></d2l-breadcrumb>
						</d2l-breadcrumbs>
					</div>

					<div class="discovery-course-summary-title">
						<h1 class="d2l-heading-1 discovery-course-summary-d2l-heading-1">[[courseTitle]]</h1>
					</div>

					<div class="discovery-course-summary-info-container">
						<template is="dom-if" if="[[courseDuration]]">
							<div class="discovery-course-summary-info-property">
								<d2l-icon icon="d2l-tier1:time"></d2l-icon>
								<div class="d2l-body-standard">[[localize('durationMinutes', 'minutes', courseDuration)]]</div>
							</div>
						</template>
						<template is="dom-if" if="[[format]]">
							<div class="discovery-course-summary-info-property">
								<d2l-icon icon="d2l-tier1:my-computer"></d2l-icon>
								<div class="d2l-body-standard">[[format]]</div>
							</div>
						</template>
						<template is="dom-if" if="[[courseLastUpdated]]">
							<div class="discovery-course-summary-info-property">
								<d2l-icon icon="d2l-tier1:calendar"></d2l-icon>
								<div class="d2l-body-standard">[[localize('lastUpdatedDate', 'date', courseLastUpdated)]]</div>
							</div>
						</template>
					</div>
				</div>

				<div id="discovery-course-summary-bottom-container" class="discovery-course-summary-bottom-container">
					<div class="discovery-course-summary-alert-container">
						<d2l-alert
							id="discovery-course-summary-start-date-alert"
							hidden$="[[!_showStartDateAlert]]"
							class="discovery-course-summary-alert">
							[[localize('startDateIsInTheFuture', 'date', startDate)]]
						</d2l-alert>
						<d2l-alert
							id="discovery-course-summary-end-date-alert"
							hidden$="[[!_showEndDateAlert]]"
							class="discovery-course-summary-alert"
							type="critical">
							[[localize('endDateIsInThePast', 'date', endDate)]]
						</d2l-alert>
					</div>

					<div class="discovery-course-summary-buttons" hidden$="[[!dataIsReady]]">
						<template is="dom-if" if="[[!actionEnroll]]">
							<d2l-button
								id="discovery-course-summary-open-course"
								on-click="_tryNavigateToOrganizationHomepage"
								primary>
								[[localize('openCourse')]]
							</d2l-button>
						</template>
						<template is="dom-if" if="[[actionEnroll]]">
							<d2l-button
								id="discovery-course-summary-enroll"
								on-click="_enroll"
								primary
								disabled$="[[_showEndDateAlert]]">
								[[localize('enrollInCourse')]]
							</d2l-button>
						</template>
					</div>
				</div>

				<div hidden$="[[!dataIsReady]]">
					<div class="discovery-course-summary-description" hidden$="[[_isCourseDescriptionEmpty]]">
						<h2 class="d2l-heading-2 discovery-course-summary-d2l-heading-2">[[localize('courseDescription')]]</h2>
						<div id="discovery-course-summary-description-text" class="d2l-body-compact"></div>
					</div>
					<div class="discovery-course-summary-empty-description" hidden$="[[!_isCourseDescriptionEmpty]]">
						<div class="discovery-course-summary-empty-description-box">
							<div class="discovery-course-summary-empty-description-text d2l-body-standard">[[localize('noCourseDescription')]]</div>
						</div>
					</div>
				</div>
			</div>

			<paper-dialog class="discovery-course-summary-dialog d2l-typography" id="discovery-course-summary-enroll-dialog" always-on-top with-backdrop>
				<div class="discovery-course-summary-dialog-container">
					<div class="discovery-course-summary-dialog-header-container">
						<h3 class="discovery-course-summary-dialog-heading-text">[[_enrollmentDialogHeader]]</h3>
					</div>
					<div class="discovery-course-summary-dialog-content-container">
						<div class="d2l-body-standard">[[_enrollmentDialogMessage]]</div>
					</div>
					<d2l-button
						on-click="_closeDialog"
						primary
						autofocus>
						[[localize('OK')]]
					</d2l-button>
				</div>
			</paper-dialog>
		`;
	}

	static get properties() {
		return {
			courseCategory: String,
			courseTitle: String,
			courseDescription: {
				type: String,
				observer: '_onDescriptionChange'
			},
			courseDuration: Number,
			courseLastUpdated: String,
			format: String,
			actionEnroll: Object,
			organizationHomepage: String,
			organizationHref: String,
			_enrollmentDialogHeader: String,
			_enrollmentDialogMessage: String,
			_homeHref: {
				type: String,
				computed: '_getHomeHref()'
			},
			startDate: String,
			startDateIsoFormat: String,
			_showStartDateAlert: {
				type: Boolean,
				value: false,
				computed: '_showStartDateAlertComputed(startDateIsoFormat)'
			},
			endDate: String,
			endDateIsoFormat: String,
			_showEndDateAlert: {
				type: Boolean,
				value: false,
				computed: '_showEndDateAlertComputed(endDateIsoFormat)'
			},
			dataIsReady: {
				type: Boolean,
				value: false
			},
			_isCourseDescriptionEmpty: {
				type: Boolean,
				computed: '_isCourseDescriptionEmptyComputed(courseDescription)'
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_closeDialog() {
		var enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
		enrollmentDialog.opened = false;
	}

	_navigateToHome(e) {
		e.preventDefault();
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home()
			},
			bubbles: true,
			composed: true
		}));

		var enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
		enrollmentDialog.opened = false;
	}

	_navigateToSearch(e) {
		if (e && e.target && e.target.value) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().search(e.target.value)
				},
				bubbles: true,
				composed: true
			}));
		}
	}

	_navigateToOrganizationHomepage() {
		this.dispatchEvent(new CustomEvent('navigate-parent', {
			detail: {
				path: this.organizationHomepage
			},
			bubbles: true,
			composed: true
		}));
	}

	_tryNavigateToOrganizationHomepage() {
		if (!this.organizationHomepage) {
			// Refetch organization entity to get the homepage href
			return this._fetchOrganizationHomepage()
				.then(() => {
					if (this.organizationHomepage) {
						this._navigateToOrganizationHomepage();
					} else {
						this._enrollmentDialogHeader = this.localize('enrollmentHeaderPending');
						this._enrollmentDialogMessage = this.localize('enrollmentMessagePending');
						const enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
						enrollmentDialog.opened = true;
					}
				});
		} else {
			this._navigateToOrganizationHomepage();
		}
	}

	_enroll() {
		if (this.actionEnroll) {
			return this._fetchEntity(this.actionEnroll.href, this.actionEnroll.method)
				.then(() => {
					this.actionEnroll = null;
					this._enrollmentDialogHeader = this.localize('enrollmentHeaderSuccess');
					this._enrollmentDialogMessage = this.localize('enrollmentMessageSuccess', 'title', this.courseTitle);
				})
				.catch(() => {
					this._enrollmentDialogHeader = this.localize('enrollmentHeaderFail');
					this._enrollmentDialogMessage = this.localize('enrollmentMessageFail');
				})
				.finally(() => {
					const enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
					enrollmentDialog.opened = true;
				});
		}
	}

	_fetchOrganizationHomepage() {
		if (this.organizationHref) {
			return this._fetchEntity(this.organizationHref)
				.then((organizationEntity) => {
					this.organizationHomepage = organizationEntity.hasLink(Rels.organizationHomepage)
						&& organizationEntity.getLinkByRel(Rels.organizationHomepage).href;
				});
		}
	}

	_onDescriptionChange(description) {
		const descriptionElement = this.shadowRoot.querySelector('#discovery-course-summary-description-text');

		fastdom.mutate(() => {
			descriptionElement.innerHTML = DOMPurify.sanitize(description);
		});
	}

	_getHomeHref() {
		return this.valenceHomeHref();
	}

	_showStartDateAlertComputed(startDateIsoFormat) {
		return startDateIsoFormat ? moment().isBefore(moment(startDateIsoFormat)) : false;
	}

	_showEndDateAlertComputed(endDateIsoFormat) {
		return endDateIsoFormat ? moment().isAfter(moment(endDateIsoFormat)) : false;
	}

	_getImageAnchorHeight() {
		const courseSummaryCard = this.shadowRoot.querySelector('#discovery-course-summary-card');
		const courseSummaryBottomContainer = this.shadowRoot.querySelector('#discovery-course-summary-bottom-container');
		return courseSummaryCard && courseSummaryBottomContainer ?
			courseSummaryCard.offsetHeight + courseSummaryBottomContainer.offsetHeight * (4 / 6) : 0;
	}

	_isCourseDescriptionEmptyComputed(courseDescription) {
		return !courseDescription;
	}
}

window.customElements.define('course-summary', CourseSummary);
