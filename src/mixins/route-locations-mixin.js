'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import createDOMPurify from 'dompurify/dist/purify.es.js';
const DOMPurify = createDOMPurify(window);

const discoveryBasePath = '/d2l/le/discovery/view';

/* @polymerMixin */
const internalRouteLocationsMixin = (superClass) =>
	class extends superClass {
		constructor() {
			super();
		}

		//Manages the expected routes and the names of associated pages for each route.
		static get routes() {
			return [
				{
					name: 'home',
					pattern: discoveryBasePath + '/'
				},
				{
					name: 'home',
					pattern: discoveryBasePath + '/home'
				},
				{
					name: 'settings',
					pattern: discoveryBasePath + '/settings'
				},
				{
					name: 'course',
					pattern: discoveryBasePath + '/course/:id'
				},
				{
					name: 'search',
					pattern: discoveryBasePath + '/search'
				},
				{
					name: 'notFound',
					pattern: '*'
				}
			];
		}

		//Triggers upon this.navigate.
		//Divides the resulting query up into components to be passed to child components as necessary, based on route name and pattern.
		router(route, params, query) {
			this.route = route; //The name of the route
			this.params = params; //The parameters passed to the route ie courseId
			query.query = decodeURIComponent(query.query);
			this.query = query;// The query of the route, ie search query and sort.
		}

		search(query, queryParams = {}) {
			const sanitizedQuery = DOMPurify.sanitize(query, {ALLOWED_TAGS: []});
			var queryParamsKeys = Object.keys(queryParams);
			var queryParamsUrl = `query=${this.encodeURITwice(sanitizedQuery)}`;
			if (queryParamsKeys.length) {
				queryParamsUrl = `${queryParamsUrl}&${queryParamsKeys.map(key => `${key}=${queryParams[key]}`).join('&')}`;
			}
			return `${discoveryBasePath}/search/?${queryParamsUrl}`;
		}

		routeLocations() {
			return {
				navLink: () => `${discoveryBasePath}/`,
				home: () => `${discoveryBasePath}/home`,
				course: (courseId) => `${discoveryBasePath}/course/${encodeURIComponent(courseId)}`,
				manage: (courseId) => `${discoveryBasePath}/manage/${encodeURIComponent(courseId)}`,
				search: (query, queryParams = {}) => this.search(query, queryParams),
				settings: () => `${discoveryBasePath}/settings`,
				myList: () => this.search('', {
					'onMyList': true
				}),
				notFound: () => `${discoveryBasePath}/404`
			};
		}

		valenceHomeHref() {
			window.D2L = window.D2L || {};
			window.D2L.frau = window.D2L.frau || {};
			const valenceHost = window.D2L.frau.valenceHost;
			return valenceHost + this.routeLocations().navLink();
		}

		encodeURITwice(query) {
			return encodeURI(encodeURIComponent(query));
		}
	};

export const RouteLocationsMixin = dedupingMixin(internalRouteLocationsMixin);
