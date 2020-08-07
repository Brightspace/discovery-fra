'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import './activity-card-list.js';
import '../styles/discovery-styles.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { OrganizationCollectionEntity } from 'siren-sdk/src/organizations/OrganizationCollectionEntity.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';

class HomeListSection extends EntityMixinLit(RouteLocationsMixin(LitElement)) {

	render() {
		return html`
			<style include="discovery-styles"></style>
			<div class="d2l-typography">
				<div class="discovery-home-list-section-container" ?hidden="${!this._hasCourses(this._sortedCourses)}">
					<div class="activity-card-list-header">
						<h2 class="d2l-heading-2" aria-label="${this.sectionName}">${this.sectionName}</h2>
						<d2l-link
							aria-label="${this.linkLabel}"
							class="activity-card-list-header-view-all-link"
							href="javascript:void(0)"
							@click="${this._navigateToViewAll}">
							${this.linkName}
						</d2l-link>
					</div>
					<activity-card-list
						.activities="${this._sortedCourses}"
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
			sort: {
				type: String
			},
			sectionName: {
				type: String
			},
			linkLabel: {
				type: String
			},
			linkName: {
				type: String
			},
			href: {
				type: String
			},
			token: {
				type: String
			},
			pageSize: {
				type: Number
			},
			_sortedCourses: {
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
		this._sortedCourses = [];
		this._setEntityType(OrganizationCollectionEntity);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));

		// Fill with empty slots first - for loading
		this._sortedCourses = new Array(this.pageSize);
	}

	disconnectedCallback() {
		document.removeEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
		super.disconnectedCallback();
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			super._entity = entity;
			if (entity && entity.activities()) {
				this._sortedCourses = entity.activities();
			} else {
				this._sortedCourses = [];
			}
		}
	}

	_hasCourses(_sortedCourses) {
		return Array.isArray(_sortedCourses) && _sortedCourses.length > 0;
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

	_navigateToViewAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', { sort: this.sort })
			},
			bubbles: true,
			composed: true
		}));
	}
}

customElements.define('home-list-section', HomeListSection);
