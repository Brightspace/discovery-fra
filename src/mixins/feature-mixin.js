'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/* @mixin */
const internalFeatureMixin = (superClass) => class extends superClass {
	constructor() {
		super();
	}

	_isPromotedCoursesEnabled() {
		const options = window.D2L && window.D2L.frau && window.D2L.frau.options;
		const isEnabled = options && options.promotedCourses && String(options.promotedCourses) === 'true';
		return isEnabled || false;
	}
};

export const FeatureMixin = dedupingMixin(internalFeatureMixin);
