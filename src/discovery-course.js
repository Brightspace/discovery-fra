'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import 'd2l-organization-hm-behavior/d2l-organization-hm-behavior.js';
import 'd2l-colors/d2l-colors.js';

import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';

import './components/course-action.js';
import './components/course-summary.js';
import './components/discovery-footer.js';
import './styles/discovery-styles.js';

class DiscoveryCourse extends mixinBehaviors(
	[D2L.PolymerBehaviors.Hypermedia.OrganizationHMBehavior, IronResizableBehavior],
	FetchMixin(RouteLocationsMixin(LocalizeMixin(PolymerElement)))) {
	static get template() {
		return html `
			<style include="discovery-styles">
				:host {
					display: block;
					position: relative;
				}

				.discovery-course-outer-container {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}

				.discovery-course-container {
					position: relative;
					align-items: flex-start;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
				}

				.discovery-course-summary {
					height: auto;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 90px;
					max-width: 760px;
					min-width: 560px;
					width: 100%;
				}

				.discovery-course-action {
					background-color: white;
					border-radius: 5px;
					border: 1px solid var(--d2l-color-mica);
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					height: auto;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 90px;
					max-width: 350px;
					min-width: 250px;
					width: 100%;
				}

				.discovery-course-header-container {
					height: 100%;
					left: 0;
					position: absolute;
					width: 100%;
					z-index: -10;
				}
				.discovery-course-header-image-container {
					background-position: center center;
					background-size: cover;
				}

				.discovery-course-header-gradient-container {
					background: linear-gradient(to bottom,  rgba(249,250,251,1) 0%,rgba(249,250,251,0) 100%);
				}

				.discovery-course-header-image-placeholder {
					background-color: var(--d2l-color-regolith);
					border-bottom: 1px solid var(--d2l-color-gypsum);
				}

				@media only screen and (max-width: 929px) {
					.discovery-course-container {
						align-items: center;
						flex-direction: column;
					}
					.discovery-course-summary {
						margin-left: 0.9rem;
						margin-right: 0.9rem;
						max-width: 680px;
						width: 90%;
					}
					.discovery-course-action {
						margin-left: 2.1rem;
						margin-right: 2.1rem;
						margin-top: 0;
						max-width: 680px;
						min-width: 532px;
						width: 90%;
					}
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary {
						max-width: 579px;
						min-width: 384px;
						width: 95%;
					}
					.discovery-course-action {
						margin-left: 1.8rem;
						margin-right: 1.8rem;
						margin-top: 1rem;
						max-width: 579px;
						min-width: 384px;
						width: 95%;
					}
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary,
					.discovery-course-action {
						background: transparent;
						border: none;
						box-shadow: none;
						margin: 0;
						min-width: 320px;
						width: 100%;
					}

					.discovery-course-header-container {
						margin: 0;
						position: static;
						z-index: auto;
					}

					.discovery-course-header-image-container {
						position: relative;
					}

					.discovery-course-header-gradient-container {
						position: absolute;
						width: 100%;
						z-index: -10;
					}

					.discovery-course-header-image-placeholder {
						height: 150px;
					}
				}
			</style>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/course/:courseId"
				data="[[routeData]]">
			</app-route>

			<div aria-busy$="[[!_dataIsReady]]">
				<img id="discovery-course-header-image" on-load="_headerImageLoaded" src="[[_courseImage]]" hidden/>
				<div class="discovery-course-header-container">
					<div id="discovery-course-header-image-container" class="discovery-course-header-image-container" hidden$="[[!courseImageIsReady]]"></div>
					<div id="discovery-course-header-image-placeholder" class="discovery-course-header-image-placeholder" hidden$="[[courseImageIsReady]]"></div>
					<div id="discovery-course-header-gradient-container" class="discovery-course-header-gradient-container"></div>
				</div>

				<div class="d2l-typography discovery-course-outer-container">
					<div class="discovery-course-container">
						<course-summary
							id="discovery-course-summary"
							class="discovery-course-summary"
							course-category=[[_courseCategory]]
							course-title=[[_courseTitle]]
							course-description=[[_courseDescription]]
							course-duration=[[_courseDuration]]
							course-last-updated=[[_courseLastUpdated]]
							format=[[_format]]
							action-enroll=[[_actionEnroll]]
							action-unenroll=[[_actionUnenroll]]
							organization-homepage=[[_organizationHomepage]]
							organization-href=[[_organizationHref]]
							start-date=[[_startDate]]
							start-date-iso-format=[[_startDateIsoFormat]]
							end-date=[[_endDate]]
							end-date-iso-format=[[_endDateIsoFormat]]
							data-is-ready=[[_dataIsReady]]>
						</course-summary>

						<course-action
							class="discovery-course-action"
							course-tags=[[_courseTags]]
							course-description-items=[[_courseDescriptionItems]]
							data-is-ready=[[_dataIsReady]]>
						</course-action>
					</div>
					<discovery-footer></discovery-footer>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			route: Object,
			routeData: Object,

			_actionEnroll: {
				type: String,
				value: ''
			},
			_actionUnenroll: {
				type: String,
				value: ''
			},
			_courseCategory: String,
			_courseCode: String,
			_courseDescription: String,
			_courseDuration: Number,
			_courseImage: String,
			_courseLastUpdated: String,
			_courseTags: Array,
			_courseTitle: String,
			_endDate: String,
			_firstPublished: String,
			_format: String,
			_startDate: String,
			_courseDescriptionItems: Array,
			_organizationHomepage: String,
			_organizationHref: String,
			_startDateIsoFormat: String,
			_endDateIsoFormat: String,
			_dataIsReady: {
				type: Boolean,
				value: false
			},
			visible: {
				type: Boolean,
				observer: '_visible'
			},
			courseImageIsReady: {
				type: Boolean,
				value: false
			}
		};
	}
	ready() {
		super.ready();
		const route = this.shadowRoot.querySelector('app-route');
		this.addEventListener('iron-resize', this._onIronResize.bind(this));
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_visible(visible) {
		if (visible) {
			this._updateDocumentTitle();
		}
	}
	_routeChanged(route) {
		this.route = route.detail.value || {};
	}
	_routeDataChanged(routeData) {
		this._reset();
		this.routeData = routeData.detail.value || {};
		if (this.routeData.courseId) {
			const parameters = { id: this.routeData.courseId };
			return this._getActionUrl('course', parameters)
				.then(url => this._fetchEntity(url))
				.then(this._handleCourseEntity.bind(this))
				.catch(() => this._navigateToNotFound());
		} else {
			this._navigateToNotFound();
		}
	}
	_handleCourseEntity(courseEntity) {
		if (!courseEntity) return Promise.reject();

		if (courseEntity.hasAction('assign')) {
			this._actionEnroll = courseEntity.getAction('assign');
		}

		if (courseEntity.hasAction('unassign')) {
			this._actionUnenroll = courseEntity.getAction('unassign');
		}

		if (courseEntity.properties) {
			//TODO: These properties still need to be added
			// 	// data for the course summary
			// 	this._courseCategory = '';
			// 	this._courseDuration = null;
			// 	this._courseLastUpdated = '';
			// 	this._format = '';

			// 	this._isInMyLearning = false;
			// 	this._isOnMyList = false;

			// 	// data for course action
			// 	this._courseTags = [];
			// 	this._firstPublished = '';
		}

		const organizationUrl = courseEntity.hasLink(Rels.organization)
			&& courseEntity.getLinkByRel(Rels.organization).href;
		this._organizationHref = organizationUrl;
		if (organizationUrl) {
			return this._fetchEntity(organizationUrl)
				.then(this._handleOrganizationEntity.bind(this));
		}

		return Promise.resolve();
	}
	_handleOrganizationEntity(organizationEntity) {
		if (!organizationEntity) return Promise.reject();

		if (!organizationEntity.hasClass('active') || !organizationEntity.hasClass('self-assignable')) {
			this._navigateToNotFound();
			return;
		}

		if (organizationEntity.properties) {
			const { code, endDate, name, startDate, description } = organizationEntity.properties;
			this._courseCode = code;
			this._courseTitle = name;
			this._updateDocumentTitle();
			this._courseDescription = description;

			const dateFormat = 'MMMM d, yyyy';
			if (startDate) {
				this._startDateIsoFormat = startDate;
				this._startDate = this.formatDate(new Date(Date.parse(startDate)), {format: dateFormat});
			}
			if (endDate) {
				this._endDateIsoFormat = endDate;
				this._endDate = this.formatDate(new Date(Date.parse(endDate)), {format: dateFormat});
			}
			this._processCourseDescriptionItems();
		}

		this._organizationHomepage = organizationEntity.hasLink(Rels.organizationHomepage)
			&& organizationEntity.getLinkByRel(Rels.organizationHomepage).href;

		this._dataIsReadyProcess();

		if (organizationEntity.hasSubEntityByClass(Classes.courseImage.courseImage)) {
			const imageEntity = organizationEntity.getSubEntityByClass(Classes.courseImage.courseImage);
			// TODO: Do we need to do something similar to this?
			// https://github.com/Brightspace/course-image/blob/master/d2l-course-image.js#L147
			if (imageEntity.href) {
				return this._fetchEntity(imageEntity.href)
					.then(function(hydratedImageEntity) {
						this._courseImage = this.getDefaultImageLink(hydratedImageEntity, 'banner');
					}.bind(this));
			}
		}

		return Promise.resolve();
	}
	_processCourseDescriptionItems() {
		const courseDescriptionItemsArray = [];
		if (this._startDate) {
			courseDescriptionItemsArray.push({
				term: this.localize('startDate'),
				description: this._startDate
			});
		}
		if (this._endDate) {
			courseDescriptionItemsArray.push({
				term: this.localize('endDate'),
				description: this._endDate
			});
		}
		if (this._courseCode) {
			courseDescriptionItemsArray.push({
				term: this.localize('courseCode'),
				description: this._courseCode
			});
		}
		if (this._firstPublished) {
			courseDescriptionItemsArray.push({
				term: this.localize('firstPublished'),
				description: this._firstPublished
			});
		}
		this._courseDescriptionItems = courseDescriptionItemsArray;
	}
	_reset() {
		this._actionEnroll = '';
		this._organizationHomepage = '';
		this._courseCategory = '';
		this._courseCode = '';
		this._courseDescription = '';
		this._courseDuration =  null;
		this._courseImage = '';
		this._courseLastUpdated =  '';
		this._courseTags =  [];
		this._courseTitle =  '';
		this._endDate =  '';
		this._firstPublished =  '';
		this._format =  '';
		this._startDate =  '';
		this._courseDescriptionItems = [];
		this._startDateIsoFormat = '';
		this._endDateIsoFormat = '';
		this._dataIsReady = false;
		this.courseImageIsReady = false;

		this._clearHeaderImage();
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
	_navigateToNotFound() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().notFound()
			},
			bubbles: true,
			composed: true
		}));
	}
	_onIronResize() {
		if (!this.visible) {
			return;
		}

		const courseSummary = this.shadowRoot.querySelector('#discovery-course-summary');
		const headerImageContainer = this.shadowRoot.querySelector('#discovery-course-header-image-container');
		const headerImageContainerPlaceholder = this.shadowRoot.querySelector('#discovery-course-header-image-placeholder');
		const headerGradientContainer = this.shadowRoot.querySelector('#discovery-course-header-gradient-container');

		if (!courseSummary || !headerImageContainer || !headerGradientContainer) {
			return;
		}

		fastdom.measure(() => {
			const heightOfCard = courseSummary._getImageAnchorHeight();
			if (heightOfCard && window.innerHeight) {
				var heightForHeaderImageContainer = 0;
				var heightForHeaderGradientContainer = 0;
				if (window.innerWidth < 420) {
					heightForHeaderImageContainer = '150';
				} else {
					heightForHeaderImageContainer  = heightOfCard + 90;
				}
				heightForHeaderGradientContainer = window.innerHeight - heightForHeaderImageContainer;

				fastdom.mutate(() => {
					if (this.courseImageIsReady) {
						headerImageContainer.style.height = `${heightForHeaderImageContainer}px`;
					} else {
						headerImageContainerPlaceholder.style.height = `${heightForHeaderImageContainer}px`;
					}
					headerGradientContainer.style.height = `${heightForHeaderGradientContainer}px`;
				});
			}
		});
	}
	_headerImageLoaded() {
		const headerImageContainer = this.shadowRoot.querySelector('#discovery-course-header-image-container');
		if (headerImageContainer && headerImageContainer.style['background-image'] !== undefined && this._courseImage) {
			headerImageContainer.style['background-image'] = `url('${this._courseImage}')`;
			this._onIronResize();
		}
		const imageElement = this.shadowRoot.querySelector('#discovery-course-header-image');
		if (imageElement) {
			fastdom.mutate(() => {
				imageElement.parentNode.removeChild(imageElement);
			});
		}
		this.courseImageIsReady = true;
	}
	_clearHeaderImage() {
		const headerImageContainer = this.shadowRoot.querySelector('#discovery-course-header-image-container');
		if (headerImageContainer && headerImageContainer.style['background-image'] !== undefined) {
			headerImageContainer.style['background-image'] = '';
		}
	}
	_dataIsReadyProcess() {
		this._dataIsReady = true;
		const courseSummary = this.shadowRoot.querySelector('#discovery-course-summary');
		if (courseSummary) {
			courseSummary.setFocus();
		}
	}
	_updateDocumentTitle() {
		const instanceName = window.D2L && window.D2L.frau && window.D2L.frau.options && window.D2L.frau.options.instanceName;
		document.title = this.localize('coursePageDocumentTitle', 'courseName', this._courseTitle, 'instanceName', instanceName ? instanceName : '');
	}
}

window.customElements.define('discovery-course', DiscoveryCourse);
