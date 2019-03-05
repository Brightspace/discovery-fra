import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Rels } from 'd2l-hypermedia-constants';
import '@polymer/paper-dialog/paper-dialog.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-breadcrumbs/d2l-breadcrumb';
import 'd2l-breadcrumbs/d2l-breadcrumbs';
import 'd2l-button/d2l-button.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';
import 'fastdom/fastdom.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseSummary extends mixinBehaviors([IronResizableBehavior], FetchMixin(LocalizeMixin(RouteLocationsMixin(PolymerElement)))) {
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

				.discovery-course-summary-buttons {
					background: var(--d2l-color-regolith);
					border-radius: 0 0 6px 6px;
					border: 1px solid var(--d2l-color-mica);
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					display: flex;
					padding: 0.9rem 1.2rem;
				}

				.discovery-course-summary-buttons d2l-button {
					margin-right: 0.6rem;
					--d2l-button: {
						height: 100%;
						white-space: normal;
					}
				}

				.discovery-course-summary-description {
					padding: 1.5rem;
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
					margin-bottom: 0.5rem;
					text-align: right;
				}

				.discovery-course-summary-dialog-close {
					cursor: pointer;
					float: right;
					font-size: 1.4rem;
				}

				.discovery-course-summary-dialog-content-container{
					margin-right: 1rem;
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

				.discovery-header-image-container {
					background-position: center center;
					background-size: cover;
					left: 0;
					margin-top: -90px;
					position: absolute;
					width: 100%;
					z-index: -10;
				}

				.discovery-course-summary-breadcrumbs {
					font-size: 14px;
					margin: -12px 0 -6px;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary-card,
					.discovery-course-summary-buttons {
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
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary-breadcrumbs {
						display: none;
					}

					.discovery-course-summary-card {
						border-radius: 0;
						border: none;
					}

					.discovery-course-summary-buttons {
						border-left: none;
						border-radius: 0;
						border-right: none;
						box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
						flex-direction: column;
					}
					.discovery-course-summary-buttons d2l-button {
						margin-bottom: 0.6rem;
						margin-right: 0;
						width: 100%;
					}

					.discovery-header-image-container {
						margin: 0;
						position: static;
						z-index: auto;
					}
				}
			</style>

			<div class="d2l-typography discovery-course-summary-container">
				<img id="discovery-header-image" on-load="_headerImageLoaded" src="[[courseImage]]" hidden/>
				<div id="discovery-header-image-container" class="discovery-header-image-container"></div>
				<div id="discovery-course-summary-card" class="discovery-course-summary-card">
					<div class="discovery-course-summary-breadcrumbs">
						<d2l-breadcrumbs class="discovery-search-header-breadcrumb">
							<d2l-breadcrumb on-click="_navigateToHome" href="[[_homeHref]]" text="[[localize('discovery')]]"></d2l-breadcrumb>
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

				<div id="discovery-course-summary-buttons" class="discovery-course-summary-buttons">
					<template is="dom-if" if="[[!actionEnroll]]">
						<d2l-button
							id="discovery-course-summary-open-course"
							on-click="_navigateToOrganizationHomepage"
							primary>
							[[localize('openCourse')]]
						</d2l-button>
					</template>
					<template is="dom-if" if="[[actionEnroll]]">
						<d2l-button
							id="discovery-course-summary-enroll"
							on-click="_enroll"
							primary>
							[[localize('enrollInCourse')]]
						</d2l-button>
					</template>
				</div>

				<div class="discovery-course-summary-description">
					<h2 class="d2l-heading-2 discovery-course-summary-d2l-heading-2">[[localize('courseDescription')]]</h2>
					<div class="d2l-body-compact discovery-course-summary-text-stuff">[[courseDescription]]</div>
				</div>
			</div>

			<paper-dialog class="discovery-course-summary-dialog d2l-typography" id="discovery-course-summary-enroll-dialog" always-on-top with-backdrop>
				<div class="discovery-course-summary-dialog-container">
					<div class="discovery-course-summary-dialog-header-container">
						<d2l-icon class="discovery-course-summary-dialog-close" on-click="_closeDialog" icon="d2l-tier1:close-small"></d2l-icon>
					</div>
					<div class="discovery-course-summary-dialog-content-container">
						<div class="d2l-body-standard">[[_enrollmentDialogMessage]]</div>
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
			courseImage: String,
			format: String,
			actionEnroll: Object,
			organizationHomepage: String,
			organizationHref: String,
			_enrollmentDialogMessage: String,
			_homeHref: {
				type: String,
				computed: '_getHomeHref()'
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('iron-resize', this._onIronResize.bind(this));
	}

	_onIronResize() {
		const headerImageContainer = this.shadowRoot.querySelector('#discovery-header-image-container');
		const courseSummaryCard = this.shadowRoot.querySelector('#discovery-course-summary-card');
		const courseSummaryButtons = this.shadowRoot.querySelector('#discovery-course-summary-buttons');

		if (headerImageContainer && courseSummaryCard && courseSummaryCard) {
			if (window.innerWidth < 420) {
				headerImageContainer.style.height = '150px';
			} else {
				const resHeight = courseSummaryCard.offsetHeight + courseSummaryButtons.offsetHeight * (4 / 6) + 90;
				headerImageContainer.style.height = `${resHeight}px`;
			}
		}
	}

	_headerImageLoaded() {
		const headerImageContainer = this.shadowRoot.querySelector('#discovery-header-image-container');
		if (headerImageContainer && headerImageContainer.style['background-image'] !== undefined && this.courseImage) {
			headerImageContainer.style['background-image'] = `url('${this.courseImage}')`;
			this._onIronResize();
		}
		const imageElement = this.shadowRoot.querySelector('#discovery-header-image');
		if (imageElement) {
			fastdom.mutate(() => {
				imageElement.parentNode.removeChild(imageElement);
			});
		}
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
		if (!this.organizationHomepage) {
			// Refetch organization entity to get the homepage href
			return this._fetchOrganizationHomepage()
				.then(() => {
					this.dispatchEvent(new CustomEvent('navigate-parent', {
						detail: {
							path: this.organizationHomepage
						},
						bubbles: true,
						composed: true
					}));
				});
		} else {
			this.dispatchEvent(new CustomEvent('navigate-parent', {
				detail: {
					path: this.organizationHomepage
				},
				bubbles: true,
				composed: true
			}));
		}
	}

	_enroll() {
		if (this.actionEnroll) {
			return this._fetchEntity(this.actionEnroll.href, this.actionEnroll.method)
				.then(() => {
					this.actionEnroll = null;
					this._enrollmentDialogMessage = this.localize('enrollmentMessage.success');
				})
				.catch(() => {
					this._enrollmentDialogMessage = this.localize('enrollmentMessage.fail');
				})
				.then(() => {
					var enrollmentDialog = this.shadowRoot.querySelector('#discovery-course-summary-enroll-dialog');
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

	_getHomeHref() {
		return this.valenceHomeHref();
	}
}

window.customElements.define('course-summary', CourseSummary);
