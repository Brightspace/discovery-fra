'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import 'd2l-colors/d2l-colors.js';
import './components/course-action.js';
import './components/course-summary.js';
import './components/search-header.js';
import './styles/discovery-styles.js';

class DiscoveryCourse extends RouteLocationsMixin(LocalizeMixin(IfrauMixin(PolymerElement))) {
	static get template() {
		return html `
			<style include="discovery-styles">
				:host {
					display: inline;
				}

				.discovery-course-container {
					align-items: flex-start;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					overflow: auto;
				}

				.discovery-course-summary {
					border-radius: 5px;
					display: flex;
					height: auto;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 2rem;
					max-width: 760px;
					min-width: 560px;
				}

				.discovery-course-action {
					background-color: white;
					border: 1px solid var(--d2l-color-mica);
					border-radius: 5px;
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					display: flex;
					height: auto;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 2rem;
					max-width: 350px;
					min-width: 250px;
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
					}
					.discovery-course-action {
						margin-left: 2.1rem;
						margin-right: 2.1rem;
						margin-top: 1rem;
						max-width: 645px;
						min-width: 532px;
					}
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-summary {
						max-width: 579px;
						min-width: 384px;
					}
					.discovery-course-action {
						margin-left: 1.8rem;
						margin-right: 1.8rem;
						max-width: 542px;
						min-width: 348px;
					}
				}

				@media only screen and (max-width: 419px) {
					.discovery-course-summary,
					.discovery-course-action {
						background: var(--d2l-color-regolith);
						border: none;
						box-shadow: none;
						margin-left: 0;
						margin-right: 0;
						min-width: 320px;
					}
				}
			</style>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/course/:courseId"
				data="[[routeData]]">
			</app-route>

			<div>
				<search-header query=[[searchQuery]]></search-header>
			</div>

			<div class="d2l-typography discovery-course-container">
				<div class="discovery-course-summary">
					<course-summary
						course-category=[[courseCategory]]
						course-title=[[courseTitle]]
						course-description=[[courseDescription]]
						course-duration=[[courseDuration]]
						course-last-updated=[[courseLastUpdated]]
						format=[[format]]
						is-in-my-learning=[[isInMyLearning]]
						is-on-my-list=[[isOnMyList]]>
					</course-summary>
				</div>

				<div class="discovery-course-action">
					<course-action
						course-code=[[courseCode]]
						course-tags=[[courseTags]]
						end-date=[[endDate]]
						first-published=[[firstPublished]]
						start-date=[[startDate]]>
					</course-action>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			route: Object,
			routeData: Object,

			visible: {
				type: Boolean,
				observer: '_visible'
			},

			searchQuery: String,

			courseCategory: String,
			courseCode: String,
			courseDescription: String,
			courseDuration: Number,
			courseLastUpdated: String,
			courseTags: Array,
			courseTitle: String,
			endDate: String,
			firstPublished: String,
			isInMyLearning: Boolean,
			isOnMyList: Boolean,
			startDate: String,
		};
	}
	ready() {
		super.ready();
		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_routeChanged(route) {
		route = route.detail.value || {};
		this.route = route;
	}
	_routeDataChanged(routeData) {
		routeData = routeData.detail.value || {};
		this.routeData = routeData;
	}
	_visible() {
		const searchHeader = this.shadowRoot.querySelector('search-header');
		if (searchHeader) {
			searchHeader.clear();
		}

		// data for the course summary
		this.courseCategory = 'Financial Planning';
		this.courseTitle = 'Financial Planning and you';
		this.courseDescription = 'An overview of the ideas, methods, and institutions that permit human society to manage risks and foster enterprise.  Emphasis on financially-savvy leadership skills. Description of practices today and analysis of prospects for the future. Introduction to risk management and behavioral finance principles to understand the real-world functioning of securities, insurance, and banking industries.  The ultimate goal of this course is using such industries effectively and towards a better society.';
		this.courseDuration = 45;
		this.courseLastUpdated = 'April 27th, 2018';
		this.format = 'Online';
		this.isInMyLearning = false;
		this.isOnMyList = false;

		// data for course action
		this.courseCode = 'FIN101';
		this.courseTags = [
			'Boots',
			'Bears',
			'Beets',
			'Battlestar Gallactica',
			'Business Intelligence',
			'Learning about Stuff',
		];
		this.endDate = 'Dec 1st, 2019';
		this.firstPublished = 'Jan 1st, 2018';
		this.startDate = 'Jan 1st, 2019';
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
