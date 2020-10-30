'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import createDOMPurify from 'dompurify/dist/purify.es.js';
const DOMPurify = createDOMPurify(window);

var discoveryBasePath = '/d2l/le/discovery/view';

/* @polymerMixin */
const internalRouteLocationsMixin = (superClass) =>
	class extends superClass {
		constructor() {
			super();
		}

		search(query, queryParams = {}) {
			const sanitizedQuery = DOMPurify.sanitize(query, {ALLOWED_TAGS: []});
			var queryParamsKeys = Object.keys(queryParams);
			var queryParamsUrl = `query=${encodeURIComponent(sanitizedQuery)}`;
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
				notFound: () => `${discoveryBasePath}/404`,
				noQuerySearch: () => `${discoveryBasePath}/search/`
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
