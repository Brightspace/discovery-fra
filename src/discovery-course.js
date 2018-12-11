'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { LocalizeMixin } from './mixins/localize-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';
import './components/course-action.js';
import './components/course-summary.js';
import './components/search-header.js';

class DiscoveryCourse extends RouteLocationsMixin(LocalizeMixin(IfrauMixin(PolymerElement))) {
	static get template() {
		return html `
			<style>
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
					background-color: white;
					border-radius: 5px;
					height: auto;
					margin-bottom: 10rem;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 2rem;
					min-width: 680px;
					width: 680px;
				}

				.discovery-course-action {
					background-color: white;
					border-radius: 5px;
					height: auto;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					margin-top: 2rem;
					min-width: 435px;
					width: 435px;
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

			<div class="discovery-course-container">
				<div class="discovery-course-summary">
					<course-summary
						course-category=[[courseCategory]]
						course-title=[[courseTitle]]
						course-key-outcomes=[[courseKeyOutcomes]]
						course-description=[[courseDescription]]>
					</course-summary>
				</div>

				<div class="discovery-course-action">
					<course-action
						course-title=[[courseTitle]]
						course-thumbnail-link=[[courseThumbnailLink]]
						course-duration=[[courseDuration]]
						course-last-updated=[[courseLastUpdated]]
						course-tags=[[courseTags]]
						is-in-my-learning=[[isInMyLearning]]
						is-on-my-list=[[isOnMyList]]>
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
			courseTitle: String,
			courseKeyOutcomes: Array,
			courseDescription: String,
			courseDuration: Number,
			courseLastUpdated: String,
			courseTags: Array,
			courseThumbnailLink: String,
			isInMyLearning: Boolean,
			isOnMyList: Boolean,
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
		this.courseCategory = 'Finance Skills';
		this.courseTitle = 'Excel and Other Tips to Improve Efficiency';
		this.courseKeyOutcomes = [
			"You'll be an advanced level user after taking this Microsoft Excel Course",
			'Use advanced graphs in minutes instead of wasting hours trying to figure them out',
			'Increase interactivity by automating your spreadsheets with macros and VBA',
			'Solve complex problems with superpower functions',
			"Turn raw data into 'must make' decisions using PivotTables and PowerPivots",
		];
		this.courseDescription =
'Excel is hype! (Helping Young People Excel) \n\n\
Common macros and shortcuts in Excel can save tons of time. Here you will learn almost 200 excel shortcuts, with their usage properly demonstrated, to help you become an absolute Excel speedster. You can navigate much faster through worksheets, select and edit cell contents, work on multiple worksheets, work on pivot tables more efficiently, and do most tasks on excel without touching the mouse, and thus saving a whole lot of time. Learning and using these keyboard excel shortcuts will multiply your confidence and add a whole new weapon in your armory, which you can use to impress your bosses and colleagues.\n\n\
Excel shortcuts can be learned by anybody, but a proper and systematic guidance is necessary to make sure you achieve the best possible speed while working on Excel.';

		// data for course action
		this.courseThumbnailLink = 'https://www.d2l.com/wp-content/uploads/2017/02/img_D2L_knockout.jpg';
		this.courseDuration = 45;
		this.courseLastUpdated = 'April 1st, 2018';
		this.courseTags = [
			'Accounting',
			'Business Skills',
			'Finance',
			'Software',
			'Microsoft',
			'Accounting',
			'Business Skills',
			'Finance',
			'Software',
			'Microsoft',
			'Accounting',
			'Business Skills',
			'Finance',
			'Software',
			'Microsoft',
		];
		this.isInMyLearning = false;
		this.isOnMyList = false;
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
