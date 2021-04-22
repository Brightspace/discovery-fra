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

		// Converts the query of the url into an object containing each separate parameter.
		//Taken from lit-element-router.
		parseQuery(querystring) {
			return querystring ? JSON.parse('{"' + querystring.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {}
		}

		//Triggers upon this.navigate.
		//Divides the resulting query up into components to be passed to child components as necessary, based on route name and pattern.
		router(route, params, query) {
			this.route = route; //The name of the route
			this.params = params; //The parameters passed to the route ie courseId

			// Lit-element-router runs decodeURI on the query.
			// This converts '%25' to '%' which breaks decodeURIComponent-only conversions.
			// We must parse it ourselves to retain these symbols in search results.
			let queryObj = this.parseQuery(window.location.search);
			query.query = queryObj.query ? decodeURIComponent(queryObj.query) : '';

			//Chrome converts '%22' to '"' in the url, which breaks lit-element-router's parseQuery()."
			query.query = query.query.replaceAll("&quot;",'"')
			this.query = query;// The query of the route, ie search query and sort.
		}

		search(query, queryParams = {}) {
			//Chrome converts '%22' to '"' in the url, which breaks lit-element-router's parseQuery()."
			query = query.replaceAll('"', "&quot;")
			let queryParamsUrl = `query=${encodeURIComponent(query)}`;
			let queryParamsKeys = Object.keys(queryParams);

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
	};

export const RouteLocationsMixin = dedupingMixin(internalRouteLocationsMixin);
