import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Rels } from 'd2l-hypermedia-constants';
import 'fastdom/fastdom.min.js';
import 'd2l-card/d2l-card.js';
import 'd2l-card/d2l-card-content-meta.js';
import 'd2l-course-image/d2l-course-image.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-organizations/components/d2l-organization-info/d2l-organization-info.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-typography/d2l-typography.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import SirenParse from 'siren-parser';
import { OrganizationEntity } from 'siren-sdk/src/organizations/OrganizationEntity.js';
import { classes as organizationClasses } from 'siren-sdk/src/organizations/OrganizationEntity.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

/**
 * @customElement
 * @polymer
 */
class D2lDiscoverCard extends LocalizeMixin(PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-typography-shared-styles">
				:host {
					display: block;
				}

				d2l-card {
					height: 100%;
					width: 100%;
				}

				.d2l-discover-card-header-container {
					height: var(--course-image-height);
					line-height: 0;
				}

				.d2l-discover-card-content-container {
					display: flex;
					flex-direction: column;
					text-align: center;
					margin: -0.35rem 0 -0.1rem;
					overflow-wrap: break-word; /* replaces 'word-wrap' in Firefox, Chrome, Safari */
					overflow: hidden;
					word-wrap: break-word; /* IE/Edge */
				}

				.d2l-discover-card-content-organization-info {
					display: block;
				}

				.d2l-discover-card-activity-information {
					display:inline-block;
				}

				@keyframes pulsingAnimation {
					0% { background-color: var(--d2l-color-sylvite); }
					50% { background-color: var(--d2l-color-regolith); }
					100% { background-color: var(--d2l-color-sylvite); }
				}

				.d2l-discover-list-item-pulse-placeholder {
					animation: pulsingAnimation 1.8s linear infinite;
					border-radius: 4px;
					height: 100%;
					width: 100%;
				}
			</style>

			<d2l-card text="[[_accessibilityText]]" href$="[[_activityHomepage]]" on-click="_sendClickEvent">
				<div class="d2l-discover-card-header-container" slot="header">
					<div class="d2l-discover-list-item-pulse-placeholder" hidden$="[[!_imageLoading]]"></div>
					<d2l-course-image
						hidden$="[[_imageLoading]]"
						image="[[_image]]"
						sizes="[[_tileSizes]]"
						type="tile">
					</d2l-course-image>
				</div>

				<div class="d2l-discover-card-content-container" slot="content">
					<d2l-organization-name href="[[_organizationUrl]]" token="[[token]]"></d2l-organization-name>
					<d2l-card-content-meta>
						<d2l-organization-info
							class="d2l-discover-card-content-organization-info"
							href="[[_organizationUrl]]"
							token="[[token]]"
							show-organization-code="[[showOrganizationCode]]"
							show-semester-name="[[showSemesterName]]"
						></d2l-organization-info>
						<template is="dom-if" if="[[_showActivityInformation(_organizationActivityLoaded, showActivityType)]]">
							<div class="d2l-discover-card-activity-information">
								<d2l-icon-custom size="tier1">
									<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
									<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
										viewBox="0 0 18 18" style="enable-background:new 0 0 18 18;" xml:space="preserve">
										<style type="text/css">
											.st0{fill:none;stroke:#4A4C4E;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
											.st1{fill:none;stroke:#4A4C4E;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
											.st2{fill:#4B4C4E;stroke:#4A4C4E;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
										</style>
										<rect x="1" y="2" class="st0" width="16" height="11"/>
										<path class="st1" d="M4,5.5v5c0,0,3-1,5,0v-5C9,5.5,7,3.5,4,5.5z"/>
										<path class="st1" d="M9,5.5v5c0,0,3-1,5,0v-5C14,5.5,12,3.5,9,5.5z"/>
										<polygon class="st2" points="8.5,14 5.5,17 12.5,17 9.5,14 "/>
									</svg>
								</d2l-icon-custom>
								<span>[[localize(_organizationActivityType)]]</span>
							</div>
						</template>
					</d2l-card-content-meta>
				</div>
			</d2l-card>
		`;
	}

	static get properties() {
		return {
			href: {
				type: String,
				observer: '_onHrefChange'
			},
			token: String,
			entity: {
				type: Object,
				value: function() {
					return {};
				},
				observer: '_onEntityChange'
			},
			/*
			* Presentation Attributes
			*/
			showOrganizationCode: {
				type: Boolean,
				value: false
			},
			showSemesterName: {
				type: Boolean,
				value: false
			},
			showActivityType: {
				type: Boolean,
				value: false
			},
			_tileSizes: {
				type: Object,
				value: function() {
					return {
						mobile: {
							maxwidth: 767,
							size: 100
						},
						tablet: {
							maxwidth: 1243,
							size: 67
						},
						desktop: {
							size: 25
						}
					};
				}
			},
			_image: Object,
			_accessibilityData: {
				type: Object,
				value: function() { return {}; }
			},
			_accessibilityText: {
				type: String,
			},
			_semester: String,
			_organizationUrl: String,
			_organizationCode: String,
			_organizationActivityType: String,
			_activityHomepage: String,
			_imageLoading: {
				type: Boolean,
				value: true
			},
			_organizationActivityLoaded: {
				type: Boolean,
				value: false
			},
			sendEventOnClick: {
				type: Boolean,
				value: false,
			}
		};
	}
	connectedCallback() {
		super.connectedCallback();
		const image = this.shadowRoot.querySelector('d2l-course-image');
		if (image) {
			image.addEventListener('course-image-loaded', this._activityImageLoaded.bind(this));
		}
		this.addEventListener('d2l-organization-accessible', this._onD2lOrganizationAccessible);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		const image = this.shadowRoot.querySelector('d2l-course-image');
		if (image) {
			image.removeEventListener('course-image-loaded', this._activityImageLoaded);
		}
		this.removeEventListener('d2l-organization-accessible', this._onD2lOrganizationAccessible);
	}
	focus() {
		this.shadowRoot.querySelector('d2l-card').focus();
	}
	_onHrefChange(href) {
		if (!href ||
			(this.entity.hasLinkByRel &&
				this.entity.hasLinkByRel('self') &&
				this.entity.getLinkByRel('self').href === href)) {
			return;
		}

		this._fetchEntity(href)
			.then((sirenEntity) => this.entity = sirenEntity);
	}
	_fetchEntity(url) {
		if (!url) {
			return;
		}

		return window.d2lfetch
			.fetch(new Request(url, {
				headers: { Accept: 'application/vnd.siren+json' },
			}))
			.then(this._responseToSirenEntity.bind(this));
	}
	_responseToSirenEntity(response) {
		if (response.ok) {
			return response
				.json()
				.then((json) => SirenParse(json));
		}
		return Promise.reject(response.status + ' ' + response.statusText);
	}
	_onEntityChange(sirenEntity) {
		if (!sirenEntity ||
			!sirenEntity.hasAction ||
			!sirenEntity.hasLink
		) {
			return;
		}

		if (sirenEntity.hasAction('assign') && !sirenEntity.hasClass('enroll')) {
			this._actionEnroll = sirenEntity.getAction('assign');
		}
		this._activityHomepage = sirenEntity.hasLink(Rels.Activities.activityHomepage) && sirenEntity.getLinkByRel(Rels.Activities.activityHomepage).href;
		this._organizationUrl = sirenEntity.hasLink(Rels.organization) && sirenEntity.getLinkByRel(Rels.organization).href;

		if (this._organizationUrl) {
			this._fetchEntity(this._organizationUrl)
				.then(this._handleOrganizationResponse.bind(this));
		}

		this.href = sirenEntity.hasLink('self') && sirenEntity.getLinkByRel('self').href;
	}
	_handleOrganizationResponse(organization) {
		if (!organization ||
			!organization.hasSubEntityByClass) {
			return;
		}

		const orgEntity = new OrganizationEntity(organization);
		this._organizationCode = orgEntity.code();
		this._organizationActivityType = orgEntity.hasClass(organizationClasses.learningPath) ? organizationClasses.learningPath : organizationClasses.course;
		this._organizationActivityLoaded = true;

		if (this.showActivityType) {
			this._accessibilityData.activityType = this._organizationActivityType;
			this._accessibilityText = this._accessibilityDataToString(this._accessibilityData);
		}

		const imageEntity = orgEntity.imageEntity();
		if (imageEntity && imageEntity.href) {
			this._fetchEntity(imageEntity.href)
				.then(function(hydratedImageEntity) {
					this._image = hydratedImageEntity;
				}.bind(this));
		} else {
			this._image = imageEntity;
		}

		return Promise.resolve();
	}

	_onD2lOrganizationAccessible(e) {
		if (e && e.detail && e.detail.organization) {
			if (e.detail.organization.name) {
				this._accessibilityData.organizationName = e.detail.organization.name;
			}
			if (e.detail.organization.code) {
				this._accessibilityData.organizationCode = e.detail.organization.code;
			}
		}
		if (e.detail.semesterName) {
			this._accessibilityData.semesterName = e.detail.semesterName;
		}
		this._accessibilityText = this._accessibilityDataToString(this._accessibilityData);
	}
	_accessibilityDataToString(accessibility) {
		if (!accessibility) {
			return;
		}

		const textData = [
			accessibility.organizationName,
			accessibility.organizationCode,
			accessibility.semesterName,
			accessibility.activityType,
		];
		return textData.filter(function(text) {
			return text && typeof text === 'string';
		}).join(', ');
	}
	_activityImageLoaded() {
		this._imageLoading = false;
	}
	_sendClickEvent(event) {
		if (!this.sendEventOnClick || !this._activityHomepage || event.ctrlKey || event.metaKey) {
			return;
		}

		this.dispatchEvent(new CustomEvent('d2l-discover-card-clicked', {
			detail: {
				path: this._activityHomepage,
				orgUnitId: this._getOrgUnitId()
			},
			bubbles: true,
			composed: true
		}));
		event.preventDefault();
	}
	_getOrgUnitId() {
		if (!this._organizationUrl) {
			return;
		}
		const match = /[0-9]+$/.exec(this._organizationUrl);

		if (!match) {
			return;
		}
		return match[0];
	}

	_showActivityInformation(_organizationActivityLoaded, showActivityType) {
		return _organizationActivityLoaded && showActivityType;
	}
}

window.customElements.define('d2l-discover-card', D2lDiscoverCard);
