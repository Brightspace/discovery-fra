'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import './activity-card-list.js';
import '../styles/discovery-styles.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { OrganizationCollectionEntity } from 'siren-sdk/src/organizations/OrganizationCollectionEntity.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';

class FeaturedListSection extends EntityMixinLit(RouteLocationsMixin(LocalizeMixin(LitElement))) {

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	render() {
		return html`
			<style include="discovery-styles"></style>
			<div class="d2l-typography">
				<div class="discovery-home-list-section-container" ?hidden="${!this._hasCourses(this._promotedCourses)}">
					<div class="activity-card-list-header">
						<h2 class="d2l-heading-2">${this.localize('featured')}</h2>
					</div>
					<activity-card-list
						.activities="${this._promotedCourses}"
						token="${this.token}"
						?show-organization-code="${this.showOrganizationCode}"
						?show-semester-name="${this.showSemesterName}">
					</activity-card-list>
				</div>
			</div>
		`;
	}

	static get styles() {
		return [
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
				.discovery-home-list-section-container {
					display: flex;
					flex-direction: column;
				}

				.activity-card-list-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.activity-card-list-header-view-all-link {
					@apply --d2l-body-compact-text;
				}

				@media only screen and (max-width: 615px) {
					.activity-card-list-header-view-all-link {
						font-size: 0.7rem;
					}
				}
			`
		];
	}

	static get properties() {
		return {
			href: {
				type: String
			},
			token: {
				type: String
			},
			_pageSize: {
				type: Number
			},
			_promotedCourses: {
				type: Array,
			},
			showOrganizationCode: {
				type: Boolean
			},
			showSemesterName: {
				type: Boolean,
			}
		};
	}

	constructor() {
		super();
		this._promotedCourses = [];
		this._pageSize = 4;
		this._setEntityType(OrganizationCollectionEntity);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));

		// Fill with empty slots first - for loading
		this._promotedCourses = new Array(this._pageSize);
	}

	disconnectedCallback() {
		document.removeEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
		super.disconnectedCallback();
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			super._entity = entity;
			if (entity && entity.activities()) {
				this._promotedCourses = entity.activities();
				this.dispatchEvent(new CustomEvent('d2l-discover-home-featured-section-courses', {
					detail: {
						value: this._promotedCourses.length
					},
					bubbles: true,
					composed: true
				}));
			} else {
				this._promotedCourses = [];
			}
		}
	}

	_hasCourses(_promotedCourses) {
		return Array.isArray(_promotedCourses) && _promotedCourses.length > 0;
	}

	_navigateToCourse(e) {
		e.stopPropagation();
		if (e && e.detail && e.detail.orgUnitId) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().course(e.detail.orgUnitId)
				},
				bubbles: true,
				composed: true
			}));
		}
	}
}

customElements.define('featured-list-section', FeaturedListSection);
