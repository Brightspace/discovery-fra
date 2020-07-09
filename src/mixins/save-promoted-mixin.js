import "./fetch-mixin";
import { fetchDedupe } from "d2l-fetch-dedupe";
import { FetchMixin } from "./fetch-mixin";

//Mixin for handling fra navigation.
export const SavePromotedMixin = FetchMixin => class extends FetchMixin {

	async savePromotedCourses(orgUrlArray) {
		orgUrlArray = this.parseCourseIDs(orgUrlArray);

		const url = await this._getActionUrl('get-promoted-courses');
		return await this.postData(url, { promotedCourses : orgUrlArray });
	}

	parseCourseIDs(orgUrlArray) {
		var courseArray = [];
		orgUrlArray.forEach(element => {
			courseArray.push(element.split('/').pop());
		});
		return courseArray;
	}

	async postData(url, data) {
		const token = await this._getToken();
		// Default options are marked with *
		const response = await fetch(url, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'Authorization' : 'Bearer ' + token
			// 'Content-Type': 'application/x-www-form-urlencoded',
		  },
		  body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		if(response.ok) {
			return response.json();
		}
		else {
			return Promise.reject(response.status + ' ' + response.statusText);
		}
	}
};
