'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import 'd2l-organization-hm-behavior/d2l-organization-hm-behavior.js';
import 'd2l-colors/d2l-colors.js';

import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import { FetchMixin } from './mixins/fetch-mixin.js';
import './components/course-action.js';
import './components/course-summary.js';
import './components/discovery-footer.js';
import './styles/discovery-styles.js';

class DiscoveryCourse extends mixinBehaviors(
	[D2L.PolymerBehaviors.Hypermedia.OrganizationHMBehavior],
	FetchMixin(RouteLocationsMixin(LocalizeMixin(IfrauMixin(PolymerElement))))) {
	static get template() {
		/* global moment*/
		return html `
			<style include="discovery-styles">
				:host {
					display: inline;
				}

				.discovery-course-container {
					position: relative;
					align-items: flex-start;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					overflow: auto;
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
						max-width: 645px;
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
						max-width: 542px;
						min-width: 348px;
						width: 95%;
					}
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary,
					.discovery-course-action {
						background: var(--d2l-color-regolith);
						border: none;
						box-shadow: none;
						margin: 0;
						min-width: 320px;
						width: 100%;
					}
				}
			</style>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/course/:courseId"
				data="[[routeData]]">
			</app-route>

			<div class="d2l-typography discovery-course-container">
				<course-summary
					class="discovery-course-summary"
					course-image="[[_courseImage]]"
					course-category=[[_courseCategory]]
					course-title=[[_courseTitle]]
					course-description=[[_courseDescription]]
					course-duration=[[_courseDuration]]
					course-last-updated=[[_courseLastUpdated]]
					format=[[_format]]
					is-in-my-learning=[[_isInMyLearning]]
					is-on-my-list=[[_isOnMyList]]>
				</course-summary>

				<course-action
					class="discovery-course-action"
					course-code=[[_courseCode]]
					course-tags=[[_courseTags]]
					end-date=[[_endDate]]
					first-published=[[_firstPublished]]
					start-date=[[_startDate]]>
				</course-action>
			</div>
			<discovery-footer></discovery-footer>
		`;
	}

	static get properties() {
		return {
			route: Object,
			routeData: Object,

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
			_isInMyLearning: Boolean,
			_isOnMyList: Boolean,
			_startDate: String,
		};
	}
	ready() {
		super.ready();
		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_routeChanged(route) {
		this.route = route.detail.value || {};
	}
	_routeDataChanged(routeData) {
		this.routeData = routeData.detail.value || {};
		if (this.routeData.courseId) {
			const parameters = { id: this.routeData.courseId };
			this._getActionUrl('course', parameters)
				.then(url => this._fetchEntity(url))
				.then(this._handleCourseEntity.bind(this));
		}
	}
	_handleCourseEntity(courseEntity) {
		if (!courseEntity.properties) { return; }

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
		this._courseDescription = courseEntity.properties.description;

		const organizationUrl = courseEntity.hasLink(Rels.organization)
			&& courseEntity.getLinkByRel(Rels.organization).href;
		if (organizationUrl) {
			this._fetchEntity(organizationUrl)
				.then(this._handleOrganizationEntity.bind(this));
		}
	}
	_handleOrganizationEntity(organizationEntity) {
		if (!organizationEntity.properties) { return; }

		const { code, endDate, name, startDate } = organizationEntity.properties;
		const dateFormat = 'MMM Do, YYYY';
		moment.locale(this.language);

		this._courseCode = code;
		this._courseTitle = name; // TODO: this can also be fetched from BFF's course entity
		this._endDate = moment.utc(endDate).format(dateFormat); // TODO: Date can be empty, we'll need a fallback langterm?
		this._startDate = moment.utc(startDate).format(dateFormat);

		if (organizationEntity.hasSubEntityByClass(Classes.courseImage.courseImage)) {
			const imageEntity = organizationEntity.getSubEntityByClass(Classes.courseImage.courseImage);
			// TODO: Do we need to do something similar to this?
			// https://github.com/Brightspace/course-image/blob/master/d2l-course-image.js#L147
			if (imageEntity.href) {
				this._fetchEntity(imageEntity.href)
					.then(function(hydratedImageEntity) {
						this._courseImage = this.getDefaultImageLink(hydratedImageEntity, 'banner');
					}.bind(this));
			}
		}

		return Promise.resolve();
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
}

window.customElements.define('discovery-course', DiscoveryCourse);
