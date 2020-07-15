'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/* @mixin */
const internalFeatureMixin = (superClass) => class extends superClass {
	constructor() {
		super();
	}

	_isPromotedCoursesEnabled() {
		const options = this._getOptions();
		return (options && options.promotedCourses && String(options.promotedCourses) === 'true') || false;
	}

	_isDiscoverCustomizationsEnabled() {
		const options = this._getOptions();
		return (options && options.discoverCustomizations && String(options.discoverCustomizations) === 'true') || false;
	}

	_canManageDiscover() {
		if (!this._isPromotedCoursesEnabled()) {
			return false;
		}
		const options = this._getOptions();
		return (options && options.canManageDiscover && String(options.canManageDiscover) === 'true') || false;
	}

	_getOptions() {
		return window.D2L && window.D2L.frau && window.D2L.frau.options;
	}
};

export const FeatureMixin = dedupingMixin(internalFeatureMixin);
