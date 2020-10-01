import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Rels } from 'd2l-hypermedia-constants';
import createDOMPurify from 'dompurify/dist/purify.es.js';
const DOMPurify = createDOMPurify(window);
import '@polymer/paper-dialog/paper-dialog.js';
import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/icons/icon.js';
import 'd2l-offscreen/d2l-offscreen-shared-styles.js';
import 'd2l-typography/d2l-typography.js';
import 'fastdom/fastdom.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import './loading-skeleton.js';

class CourseSummary extends FetchMixin(LocalizeMixin(RouteLocationsMixin(PolymerElement))) {
	static get template() {
		return html `
			<style include="d2l-offscreen-shared-styles"></style>
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-course-summary-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-course-summary-card {
					background: white;
					border: 1px solid var(--d2l-color-mica);
					border-bottom: transparent;
					border-radius: 6px 6px 0 0;
					padding: 1.1rem 1.5rem;
					overflow: hidden;
				}

				.discovery-course-summary-title {
					margin-top: 0.65rem;
					margin-bottom: 0.25rem;
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
				:host(:dir(rtl)) .discovery-course-summary-info-property {
					margin-left: 0.9rem;
					margin-right: 0;
				}

				.discovery-course-summary-info-container d2l-icon {
					margin-right: 0.5rem;
				}
				:host(:dir(rtl)) .discovery-course-summary-info-container d2l-icon {
					margin-left: 0.5rem;
					margin-right: 0;
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
					overflow: hidden;
				}

				.discovery-course-summary-description {
					padding: 1.5rem;
					overflow:hidden;
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
				:host(:dir(rtl)) .discovery-course-summary-dialog-content-container {
					margin-left: 1rem;
					margin-right: 0;
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
					margin-bottom: 0 !important;
					margin-top: 0 !important;
				}
				.discovery-course-summary-d2l-heading-1:focus {
					outline: none;
				}

				.discovery-course-summary-d2l-heading-2 {
					margin-bottom: 0.55rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-summary-breadcrumbs {
					font-size: 14px;
				}

				.discovery-course-summary-empty-description {
					padding: 1.5rem 0;
					overflow:hidden;
				}

				.discovery-course-summary-empty-description-box {
					background: var(--d2l-color-regolith);
					border: 1px solid var(--d2l-color-gypsum);
					border-radius: 6px;
				}

				.discovery-course-summary-empty-description-text {
					padding: 1.2rem 1.5rem;
				}

				.discovery-course-summary-breadcrumbs-placeholder {
					height: 0.5rem;
					width: 15%;
				}

				.discovery-course-summary-title-placeholder {
					height: 1.7rem;
					margin: 0.17rem 0rem;
					width: 60%;
				}

				.discovery-course-summary-button-placeholder-container {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
				}
				.discovery-course-summary-button-placeholder {
					height: 2.1rem;
					width: 30%;
				}

				.discovery-course-summary-description-placeholder {
					height: 0.55rem;
					width: 100%;
				}

				.discovery-course-summary-description-placeholder-shorter {
					height: 0.55rem;
					width: 90%;
				}

				.discovery-course-summary-enrolled-container {
					align-items: baseline;
					display: flex;
					flex-direction: row;
					width: 100%;
				}

				.discovery-course-summary-already-enrolled {
					color: var(--d2l-color-tungsten);
					margin-left: 1.5rem;
				}

				:host(:dir(rtl)) .discovery-course-summary-already-enrolled {
					margin-left: 0;
					margin-right: 1.5rem;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary-card,
					.discovery-course-summary-bottom-container {
						padding: 0.8rem 0.9rem;
					}

					.discovery-course-summary-title {
						margin: 0.45rem 0rem;
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

					.discovery-course-summary-title-placeholder {
						height: 1.1rem;
					}

					.discovery-course-summary-d2l-heading-2 {
						margin-bottom: 0.5rem !important;
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
						margin-right: 0;
						width: 100%;
					}

					.discovery-course-summary-empty-description-box {
						margin: 0 0.9rem;
					}

					.discovery-course-summary-button-placeholder {
						width: 100%;
					}

					.discovery-course-summary-title {
						margin-top: 0.1rem;
					}

					.discovery-course-summary-already-enrolled {
						display: none;
					}
				}

				.discovery-course-summary-offscreen-text {
					display: inline-block;
					@apply --d2l-offscreen;
				}

				:host(:dir(rtl)) .discovery-course-summary-offscreen-text {
					@apply --d2l-offscreen-rtl;
				}
			</style>

			<span class="discovery-course-summary-offscreen-text" aria-live="polite">[[_loadingMessage(dataIsReady)]]</span>
			<div class="d2l-typography discovery-course-summary-container">

				<!-- Loading Skeleton -->
				<div hidden$="[[dataIsReady]]">
					<div id="discovery-course-summary-card-placeholder" class="discovery-course-summary-card">
						<div class="discovery-course-summary-breadcrumbs">
							<loading-skeleton class="discovery-course-summary-breadcrumbs-placeholder"></loading-skeleton>
						</div>

						<div class="discovery-course-summary-title">
							<loading-skeleton class="discovery-course-summary-title-placeholder"></loading-skeleton>
						</div>
					</div>

					<div id="discovery-course-summary-bottom-container-placeholder" class="discovery-course-summary-bottom-container">
						<div class="discovery-course-summary-buttons">
							<loading-skeleton class="discovery-course-summary-button-placeholder"></loading-skeleton>
						</div>
					</div>

					<div class="discovery-course-summary-description">
						<h2 class="d2l-heading-2 discovery-course-summary-d2l-heading-2">[[localize('courseDescription')]]</h2>
						<loading-skeleton class="discovery-course-summary-description-placeholder"></loading-skeleton>
						<loading-skeleton class="discovery-course-summary-description-placeholder"></loading-skeleton>
						<loading-skeleton class="discovery-course-summary-description-placeholder"></loading-skeleton>
						<loading-skeleton class="discovery-course-summary-description-placeholder-shorter"></loading-skeleton>
					</div>
				</div>

				<!-- Real Components -->
				<div hidden$="[[!dataIsReady]]">
					<div id="discovery-course-summary-card" class="discovery-course-summary-card">
						<div class="discovery-course-summary-breadcrumbs">
							<d2l-breadcrumbs>
								<d2l-breadcrumb on-click="_navigateToHome" href="[[_homeHref]]" text="[[localize('discover')]]" aria-label="[[localize('backToDiscover')]]"></d2l-breadcrumb>
							</d2l-breadcrumbs>
						</div>

						<div id="discovery-course-summary-title" class="discovery-course-summary-title">
							<h1 class="d2l-heading-1 discovery-course-summary-d2l-heading-1" tabindex="-1">[[courseTitle]]</h1>
						</div>

						<div id="discovery-course-summary-info-container" class="discovery-course-summary-info-container">
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
								hidden$="[[!_isFutureAndCannotAccess]]"
								class="discovery-course-summary-alert">
								[[localize('startDateIsInTheFuture', 'date', startDate)]]
							</d2l-alert>
							<d2l-alert
								id="discovery-course-summary-end-date-alert"
								hidden$="[[!_isPastAndCannotAccess]]"
								class="discovery-course-summary-alert"
								type="critical">
								[[localize('endDateIsInThePast', 'date', endDate)]]
							</d2l-alert>
						</div>

						<div class="discovery-course-summary-buttons">
							<template is="dom-if" if="[[!actionEnroll]]">
								<div class="discovery-course-summary-enrolled-container">
									<d2l-button
										id="discovery-course-summary-open-course"
										on-click="_tryNavigateToOrganizationHomepage"
										disabled$="[[_isFutureAndCannotAccess]]"
										hidden$="[[_isPastAndCannotAccess]]"
										primary>
										[[localize('openCourse')]]
									</d2l-button>
									<template is="dom-if" if="[[actionUnenroll]]">
										<d2l-dropdown-more>
											<d2l-dropdown-menu>
												<d2l-menu label="[[localize('enrollmentOptions')]]">
													<d2l-menu-item
														id="discovery-course-summary-unenroll"
														text="[[localize('unenroll')]]"
														on-click="_unenroll">
													</d2l-menu-item>
												</d2l-menu>
											</d2l-dropdown-menu>
										</d2l-dropdown-more>
									</template>
									<span class="discovery-course-summary-already-enrolled d2l-body-compact">[[localize('alreadyEnrolled')]]</span>
								</div>
							</template>
							<template is="dom-if" if="[[actionEnroll]]">
								<d2l-button
									id="discovery-course-summary-enroll"
									on-click="_enroll"
									primary
									disabled$="[[_endDateIsPast]]">
									[[localize('enrollInCourse')]]
								</d2l-button>
							</template>
						</div>
					</div>

					<div>
						<div id="discovery-course-summary-description" class="discovery-course-summary-description" hidden$="[[_isCourseDescriptionEmpty]]">
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
			</div>

			<paper-dialog
				class="discovery-course-summary-dialog d2l-typography"
				id="discovery-course-summary-enroll-dialog"
				always-on-top
				with-backdrop
				role="alertdialog"
				aria-labelledby="#discovery-course-summary-dialog-label"
				aria-describedby="#discovery-course-summary-dialog-describe"
				aria-modal>
				<div class="discovery-course-summary-dialog-container">
					<div class="discovery-course-summary-dialog-header-container">
						<h3 class="discovery-course-summary-dialog-heading-text" id="discovery-course-summary-dialog-label">[[_enrollmentDialogHeader]]</h3>
					</div>
					<div class="discovery-course-summary-dialog-content-container">
						<div class="d2l-body-standard" id="discovery-course-summary-dialog-describe">[[_enrollmentDialogMessage]]</div>
					</div>
					<d2l-button
						on-click="_closeDialog"
						primary
						autofocus>
						[[localize('OK')]]
					</d2l-button>
				</div>
			</paper-dialog>
			<paper-dialog
				class="discovery-course-summary-dialog d2l-typography"
				id="discovery-course-summary-dialog-unenroll-confirm"
				always-on-top
				with-backdrop
				role="alertdialog"
				aria-labelledby="#discovery-course-summary-dialog-unenroll-confirm-label"
				aria-describedby="#discovery-course-summary-dialog-unenroll-confirm-describe"
				aria-modal>
				<div class="discovery-course-summary-dialog-container">
					<div class="discovery-course-summary-dialog-header-container">
						<h3 class="discovery-course-summary-dialog-heading-text" id="discovery-course-summary-dialog-unenroll-confirm-label">[[localize('unenrollConfirmHeader')]]</h3>
					</div>
					<div class="discovery-course-summary-dialog-content-container">
						<div class="d2l-body-standard" id="discovery-course-summary-dialog-unenroll-confirm-describe">[[localize('unenrollConfirmBody', 'title', courseTitle)]]</div>
					</div>
					<d2l-button
						id="discovery-course-summary-dialog-unenroll-dismiss"
						on-click="_dismissUnenrollment"
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
			actionUnenroll: Object,
			organizationHomepage: String,
			organizationHref: String,
			selfEnrolledDate: String,
			_enrollmentDialogHeader: String,
			_enrollmentDialogMessage: String,
			_homeHref: {
				type: String,
				computed: '_getHomeHref()'
			},
			startDate: String,
			startDateIsoFormat: String,
			_startDateIsFuture: {
				type: Boolean,
				value: false,
				computed: '_startDateIsFutureComputed(startDateIsoFormat)'
			},
			endDate: String,
			endDateIsoFormat: String,
			_endDateIsPast: {
				type: Boolean,
				value: false,
				computed: '_endDateIsPastComputed(endDateIsoFormat)'
			},
			dataIsReady: {
				type: Boolean,
				value: false
			},
			_isCourseDescriptionEmpty: {
				type: Boolean,
				computed: '_isCourseDescriptionEmptyComputed(courseDescription)'
			},
			_isFutureAndCannotAccess: {
				type: Boolean,
				value: false
			},
			_isPastAndCannotAccess: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			'_isFutureAndCannotAccessObserver(_startDateIsFuture, organizationHomepage)',
			'_isPastAndCannotAccessObserver(_endDateIsPast, organizationHomepage)'
		];
	}

	_closeDialog() {
		var enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
		enrollmentDialog.opened = false;
	}

	_navigateToHome(e) {
		if (e) {
			e.preventDefault();
		}

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

	_navigateToOrganizationHomepage(organizationHomepage) {
		this.dispatchEvent(new CustomEvent('navigate-parent', {
			detail: {
				path: organizationHomepage
			},
			bubbles: true,
			composed: true
		}));
	}

	_tryNavigateToOrganizationHomepage() {
		if (!this.organizationHomepage) {
			// Refetch organization entity to get the homepage href
			return this._fetchOrganizationHomepage()
				.then((organizationHomepage) => {
					if (organizationHomepage) {
						this._navigateToOrganizationHomepage(organizationHomepage);
					} else {
						const enrolledDate = new Date(this.selfEnrolledDate);
						const mins = 10;
						if (!isNaN(enrolledDate) && Date.now() - enrolledDate <= 1000 * 60 * mins) {
							this._enrollmentDialogHeader = this.localize('enrollmentHeaderPending');
							this._enrollmentDialogMessage = this.localize('enrollmentMessagePending');
						} else {
							this._enrollmentDialogHeader = this.localize('enrollmentHeaderUnenrolled');
							this._enrollmentDialogMessage = this.localize('enrollmentMessageUnenrolled');
						}
						const enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
						enrollmentDialog.opened = true;
					}
				});
		} else {
			this._navigateToOrganizationHomepage(this.organizationHomepage);
		}
	}

	_enroll() {
		if (this.actionEnroll) {
			return this._fetchEntity(this.actionEnroll.href, this.actionEnroll.method)
				.then(entity => {
					this.actionUnenroll = entity.getActionByName('unassign');
				})
				.then(() => {
					this.actionEnroll = null;
					this._enrollmentDialogHeader = this.localize('enrollmentHeaderSuccess');
					const intervalInMs = 100;
					var maxRetries = 5;
					if (!this._startDateIsFuture && !this._endDateIsPast) {
						maxRetries = 1;
					}
					return this.retryFetchOrganizationHomepage({ maxRetries, intervalInMs })
						.then((organizationHomepage) => {
							if (organizationHomepage) {
								this._enrollmentDialogMessage = this.localize('enrollmentMessageSuccess', 'title', this.courseTitle);
							} else if (this._startDateIsFuture) {
								this._enrollmentDialogMessage = this.localize('enrollmentMessageSuccessFuture', 'title', this.courseTitle, 'date', this.startDate);
							} else if (this._endDateIsPast) {
								this._enrollmentDialogMessage = this.localize('enrollmentMessageSuccessPast', 'title', this.courseTitle, 'date', this.endDate);
							} else { // enrollment is taking a long time to process
								this._enrollmentDialogMessage = this.localize('enrollmentMessageSuccess', 'title', this.courseTitle);
							}
							this.organizationHomepage = organizationHomepage;
						});
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

	_unenroll() {
		if (this.actionUnenroll) {
			const actionUnenroll = this.actionUnenroll;
			this.actionUnenroll = null;
			return this._fetchEntity(actionUnenroll.href, actionUnenroll.method)
				.then(() => {
					this.shadowRoot.querySelector('#discovery-course-summary-dialog-unenroll-confirm').opened = true;
				})
				.catch(() => {
					this.actionUnenroll = actionUnenroll; // give the user a chance to try again...
				});
		}
	}

	_dismissUnenrollment() {
		this.shadowRoot.querySelector('#discovery-course-summary-dialog-unenroll-confirm').opened = false;
		this._navigateToHome();
	}

	retryFetchOrganizationHomepage({ maxRetries, intervalInMs }) {
		var retry = 0;
		const fn = this._fetchOrganizationHomepage.bind(this);
		return new Promise((resolve) => {
			function retryFn(retry) {
				if (retry < maxRetries) {
					return fn().then((res) => {
						if (!res && (retry + 1 < maxRetries)) {
							setTimeout(() => {
								retryFn(retry + 1);
							}, intervalInMs);
						} else {
							resolve(res);
						}
					});
				} else {
					resolve(null);
				}
			}
			return retryFn(retry);
		});
	}

	_fetchOrganizationHomepage() {
		if (this.organizationHref) {
			return this._fetchEntity(this.organizationHref)
				.then((organizationEntity) => {
					return organizationEntity.hasLink(Rels.organizationHomepage)
						&& organizationEntity.getLinkByRel(Rels.organizationHomepage).href;
				});
		}
		return Promise.resolve();
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

	_startDateIsFutureComputed(startDateIsoFormat) {
		return startDateIsoFormat ? moment().isBefore(moment(startDateIsoFormat)) : false;
	}

	_endDateIsPastComputed(endDateIsoFormat) {
		return endDateIsoFormat ? moment().isAfter(moment(endDateIsoFormat)) : false;
	}

	_getImageAnchorHeight() {
		var courseSummaryCard;
		var courseSummaryBottomContainer;
		if (this.dataIsReady) {
			courseSummaryCard = this.shadowRoot.querySelector('#discovery-course-summary-card');
			courseSummaryBottomContainer = this.shadowRoot.querySelector('#discovery-course-summary-bottom-container');
		} else {
			courseSummaryCard = this.shadowRoot.querySelector('#discovery-course-summary-card-placeholder');
			courseSummaryBottomContainer = this.shadowRoot.querySelector('#discovery-course-summary-bottom-container-placeholder');
		}
		return courseSummaryCard && courseSummaryBottomContainer ?
			courseSummaryCard.offsetHeight + courseSummaryBottomContainer.offsetHeight * (4 / 6) : 0;
	}

	_isCourseDescriptionEmptyComputed(courseDescription) {
		return !courseDescription;
	}

	_isFutureAndCannotAccessObserver(startDateIsFuture, organizationHomepage) {
		this._isFutureAndCannotAccess = startDateIsFuture && !organizationHomepage;
	}

	_isPastAndCannotAccessObserver(endDateIsPast, organizationHomepage) {
		this._isPastAndCannotAccess = endDateIsPast && !organizationHomepage;
	}

	setFocus() {
		const itemToFocus = this.shadowRoot.querySelector('.discovery-course-summary-d2l-heading-1');
		if (itemToFocus) {
			itemToFocus.focus();
		}
	}

	_loadingMessage(dataIsReady) {
		if (dataIsReady) {
			return this.localize('courseSummaryReadyMessage', 'courseTitle', this.courseTitle);
		}
		return '';
	}
}

window.customElements.define('course-summary', CourseSummary);
