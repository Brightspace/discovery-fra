import './fetch-mixin';

const getPromotedAction = 'get-promoted-courses';
const setDiscoverSettings = 'set-discover-settings';
const getDiscoverSettings = 'get-discover-settings';
const discoverRel =  'https://discovery.brightspace.com';

//Mixin for handling promoted fetching and saving.
/* @polymerMixin */
export const DiscoverSettingsMixin = FetchMixin => class extends FetchMixin {

	//Returns an array containing the current set of promoted activities.
	async fetchPromotedActivities() {
		const url = await this._getActionUrl(getPromotedAction);
		const promotedCollectionEntity = await this._fetchEntity(url);

		if (promotedCollectionEntity !== null) {
			const activities = promotedCollectionEntity.getSubEntitiesByRel(discoverRel);
			return activities;
		}
		return null;
	}

	async fetchDiscoverSettings() {
		const url = await this._getActionUrl(getDiscoverSettings);
		const discoverSettingsEntity = await this._fetchEntityWithoutCache(url);
		return discoverSettingsEntity && discoverSettingsEntity.properties;
	}

	//Takes an array of org URLs and writes them as the new set of promoted courses.
	async saveDiscoverSettings(orgUrlArray, showCourseCode, showSemester, showUpdatedSection, showNewSection) {
		orgUrlArray = this._parseCourseIDs(orgUrlArray);

		const url = await this._getActionUrl(setDiscoverSettings);
		const data = { promotedCourses : orgUrlArray };
		if (showCourseCode !== undefined) {
			data.showCourseCode = showCourseCode;
		}
		if (showSemester !== undefined) {
			data.showSemester = showSemester;
		}
		if (showUpdatedSection !== undefined) {
			data.showUpdatedSection = showUpdatedSection;
		}
		if (showNewSection !== undefined) {
			data.showNewSection = showNewSection;
		}
		return await this._postData(url, data);
	}

	_parseCourseIDs(orgUrlArray) {
		var courseArray = [];
		orgUrlArray.forEach(element => {
			courseArray.push(element.split('/').pop());
		});
		return courseArray;
	}

	async _postData(url, data) {
		const token = await this._getToken();
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer ' + token
			},
			body: JSON.stringify(data)
		});
		if (response.ok) {
			return response.json();
		}
		else {
			return Promise.reject(response.status + ' ' + response.statusText);
		}
	}
};
