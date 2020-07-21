import './fetch-mixin';

const getPromotedAction = 'get-promoted-courses';
const setDiscoverSettings = 'set-discover-settings';
const discoverRel =  'https://discovery.brightspace.com';

//Mixin for handling promoted fetching and saving.
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

	//Takes an array of org URLs and writes them as the new set of promoted courses.
	async saveDiscoverSettings(orgUrlArray) {
		orgUrlArray = this._parseCourseIDs(orgUrlArray);

		const url = await this._getActionUrl(setDiscoverSettings);
		return await this._postData(url, { promotedCourses : orgUrlArray });
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
