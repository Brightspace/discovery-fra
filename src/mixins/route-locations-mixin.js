'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

var discoveryBasePath = '/d2l/le/discovery/view';

/* @polymerMixin */
const internalRouteLocationsMixin = (superClass) =>
	class extends superClass {
		constructor() {
			super();
		}

		search(query, queryParams = {}) {
			var queryParamsKeys = Object.keys(queryParams);
			var queryParamsUrl = '';
			if (queryParamsKeys.length) {
				queryParamsUrl = queryParamsKeys.map(key => `${key}=${queryParams[key]}`).join('&');
			}
			return `${discoveryBasePath}/search/${encodeURIComponent(query)}/${queryParamsUrl ? `?${queryParamsUrl}` : ''}`;
		}

		routeLocations() {
			return {
				navLink: () => `${discoveryBasePath}/`,
				home: () => `${discoveryBasePath}/home`,
				course: (courseId) => `${discoveryBasePath}/course/${encodeURIComponent(courseId)}`,
				manage: (courseId) => `${discoveryBasePath}/manage/${encodeURIComponent(courseId)}`,
				search: (query, queryParams = {}) => this.search(query, queryParams),
				myList: () => this.search('', {
					'onMyList': true
				}),
			};
		}
	};

export const RouteLocationsMixin = dedupingMixin(internalRouteLocationsMixin);
