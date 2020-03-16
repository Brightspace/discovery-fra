import { css, html, LitElement } from 'lit-element/lit-element.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-course-image/d2l-course-image.js';
import 'd2l-button/d2l-button.js';
import 'd2l-colors/d2l-colors.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import 'fastdom/fastdom.min.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-organizations/components/d2l-organization-image/d2l-organization-image.js';
import SirenParse from 'siren-parser';
import { Rels } from 'd2l-hypermedia-constants';
import { heading1Styles, heading2Styles, heading4Styles, bodyCompactStyles, bodyStandardStyles, labelStyles} from '@brightspace-ui/core/components/typography/styles.js';
import { DiscoverListItemResponsiveConstants } from './DiscoverListItemResponsiveConstants.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from './localization.js';

const baseUrl = import.meta.url;
class D2lDiscoverList extends LocalizeMixin(DiscoverListItemResponsiveConstants(LitElement)) {
	constructor() {
		super();
		this._descriptionPlaceholderLines = [{}, {}];
		this._footerPlaceholderItems = [{}, {}];
		this._items = [];
		this._loadedTextCount = 0;
		this._loadedImageCount = 0;
		this._loadedText = false;
		this._loadedImages = false;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this._resizeHandler.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._resizeHandler.bind(this));
	}

	_resizeHandler() {
		//Redraw to update the description length to fit the new amount of space.
		this.requestUpdate();
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs, baseUrl);
	}

	updated(changedProperties) {
		super.update();
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'hrefs') {
				this._onHrefsChange(this.hrefs);
			}
			if (propName === 'entities') {
				this._onEntitiesChange(this.entities);
			}
		});
	}

	_onHrefsChange(hrefs) {
		this._items = [];
		hrefs.forEach(href => {
			const item = {};
			item.activityHomepage = '';
			this._items.push(item);
			this._fetchEntity(href).then((sirenEntity) => {
				item.entity = sirenEntity;
				this._onSirenEntityChange(sirenEntity, item);
			});
		});
	}

	_onEntitiesChange(entities) {
		this._items = [];
		entities.forEach(entity => {
			if (!entity) {
				entity = {};
			}
			const item = {};
			item.activityHomepage = '';
			this._items.push(item);
			item.entity = entity;
			this._onSirenEntityChange(entity, item);
		});
	}

	_onSirenEntityChange(sirenEntity, item) {
		if (!sirenEntity ||
			!sirenEntity.hasAction ||
			!sirenEntity.hasLink
		) {
			return;
		}

		item.activityHomepage = sirenEntity.hasLink(Rels.Activities.activityHomepage) && sirenEntity.getLinkByRel(Rels.Activities.activityHomepage).href;
		item.organizationUrl = sirenEntity.hasLink(Rels.organization) && sirenEntity.getLinkByRel(Rels.organization).href;
		if (item.organizationUrl) {
			this._fetchEntity(item.organizationUrl).then((organization) => {
				this._handleOrganizationResponse(organization, item);
				this.requestUpdate();
			});
		}

		item.href = sirenEntity.hasLink('self') && sirenEntity.getLinkByRel('self').href;
	}

	_handleOrganizationResponse(organization, item) {
		let description = organization.properties && organization.properties.description;

		//Use a temporary div to strip html out of the content and display html entities.
		if (description) {
			description = description.replace(/<[^>]*>/g, '');
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = description;
			description = tempDiv.textContent || tempDiv.innerText;
		}
		item.description = description;
	}

	Reset() {
		this._loadedTextCount = 0;
		this._loadedImageCount = 0;
	}

	_createDescriptionElement(description) {
		if (!description) return html ``;
		const div = document.createElement('div');
		div.classList.add('d2l-body-compact');

		const p = document.createElement('p');
		div.appendChild(p);
		p.textContent = description;

		let height = 0;
		window.fastdom.measure(() => {
			height = window.getComputedStyle(p).getPropertyValue('line-height').match(/\d+/);
		});

		window.fastdom.mutate(() => {
			const lineHeight = height && height[0];
			p.textContent = description;
			const currentLineNumber = p.offsetHeight / lineHeight;
			if (currentLineNumber <= this._descriptionLineCount) {
				return html ``;
			}
			// The idea is to mathematically find the most probable point to clamp.
			// Take the average per line while distrbuting the characters from the last line between all the lines.
			// So the average line length is between 1 to (1 + 1/(this._descriptionLineCount+1)) the actual average.
			// The `+1` in the previous line is because the description has to be more than the this._descriptionLineCount
			// For example if the description max number of lines is 2 then the average count would be between 1 to 1.33 times the actual average.
			const avgCharPerLine = description.length / ((currentLineNumber - 1));

			// This is where we clamp using the ~average length of a line. We want the clamp to not be exactly at the edge
			// so clamp 75% of the last line. Since the average line could be larger we need to make sure that this cut
			// is still lower then the average line.
			// So we need to prove 1 <= 3/4*(1 + 1/(this._descriptionLineCount+1))
			// The above line simplifies to this._descriptionLineCount >= 2
			// So as long as we clamp down to two lines this will work.
			p.textContent = description.substring(0, avgCharPerLine * (this._descriptionLineCount - 0.75));

			// Okay what about when this._descriptionLineCount = 1? We will do a loop through this step to solve that case.
			// This loop will make sure the clamping is done on words and will make sure that if our quick cut above
			// wasn't enough to fix that too.
			do {
				p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '');
			} while (p.offsetHeight > this._descriptionLineCount * lineHeight && p.textContent);
			p.textContent += '...';
		});

		return div;
	}

	_onResize() {
		this.requestUpdate();
	}

	_onD2lOrganizationAccessible(e, item) {
		if (!item) {
			return;
		}
		item.accessibilityData = {};
		item.accessibilityData.organizationName = e.detail.organization && e.detail.organization.name;
		item.accessibilityData.semesterName = e.detail.semesterName;
		item.accessibilityData.ariaContext = this.localize('clickToViewActivity');
		item.accessibilityData.description = item.description;
		this.requestUpdate();

		this._loadedTextCount++;
		if (this._loadedTextCount === this._items.length) {
			this._loadedText = true;
			this.dispatchEvent(new CustomEvent('d2l-discover-text-loaded', {
				bubbles: true,
				composed: true
			}));
		}
	}

	_onOrgImageLoaded() {
		this._loadedImageCount++;
		if (this._loadedImageCount === this._items.length) {
			this._loadedImages = true;
			this.dispatchEvent(new CustomEvent('d2l-discover-image-loaded', {
				bubbles: true,
				composed: true
			}));
		}
	}

	_accessibilityDataToString(accessibility) {
		if (!accessibility) {
			return;
		}

		const textData = [
			accessibility.ariaContext,
			accessibility.organizationName,
			accessibility.description
		];
		const accessibilityText =  textData.filter(function(text) {
			return text && typeof text === 'string';
		}).join(', ');
		return accessibilityText;
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
				.then(function(json) {
					return SirenParse(json);
				});
		}
		return Promise.reject(response.status + ' ' + response.statusText);
	}

	_shouldRenderTextSkeletons() {
		return !this._loadedText || this.textPlaceholder;
	}

	_shouldRenderImageSkeletons() {
		return !this._loadedImages || this.imagePlaceholder;
	}

	static get properties() {
		return {
			token: String,
			_items: {
				type: Array
			},
			hrefs: {
				type: Array
			},
			entities: {
				type: Array
			},
			displayAdditionalPlaceholders: {
				type: Boolean,
				value: false
			},
			imagePlaceholder: {
				type: Boolean,
				value: false
			},
			textPlaceholder: {
				type: Boolean,
				value: false
			},
			_loadedTextCount: {
				type: Number,
				value: 0
			},
			_loadedImageCount: {
				type: Number,
				value: 0
			},
			_loadedText: {
				type: Boolean,
				value: false
			},
			_loadedImages: {
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
			_descriptionPlaceholderLines: {
				type: Array,
				value: [{}, {}]
			},
			_footerPlaceholderItems: {
				type: Array,
				value: [{}, {}]
			}
		};
	}

	static get styles() {
		return [ heading1Styles, heading2Styles, heading4Styles, bodyCompactStyles, bodyStandardStyles, labelStyles, css`
			:host {
				display: block;
			}

			.d2l-discover-list-item-container:hover {
				background-color: var(--d2l-color-regolith);
			}

			.d2l-discover-list-item-container {
				position: relative;
				height: 100%;
			}
			.d2l-discover-list-item-image {
				flex-shrink: 0;
				margin-right: 1.2rem;
				width: 216px;
				height: 120px;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 6px;
			}
			:host(:dir(rtl)) .d2l-discover-list-item-image {
				margin-right: 0;
				margin-left: 1.2rem;
			}
			.d2l-discover-list-item-title {
				flex-shrink: 0;
				font-size: 0.95rem;
				line-height: 1.58rem;
				max-height: 3.16rem;
				overflow: hidden;
				color: var(--d2l-color-celestine);
				margin: 0.2rem 0;
			}
			.d2l-discover-list-item-container:hover .d2l-discover-list-item-title ,
			:host([active]) .d2l-discover-list-item-title {
				color: var(--d2l-color-celestine-minus-1);
				text-decoration: underline;
			}
			.d2l-discover-list-item-description p {
				margin: 0;
				padding: 0;
				color: var(--d2l-color-ferrite);
			}
			.d2l-discover-list-item-footer,
			.d2l-discover-list-item-footer span d2l-icon {
				flex-shrink: 0;
				color: var(--d2l-color-tungsten);

			}
			.d2l-discover-list-item-footer {
				height: 1rem;
				margin: 0;
				margin-top: 0.45rem;
				overflow: hidden;
			}
			.d2l-discover-list-item-footer span d2l-icon {
				--d2l-icon-width: 18px;
				--d2l-icon-height: 18px;
			}
			.d2l-discover-list-item-footer span:first-child d2l-icon {
				display: none;
			}
			.d2l-discover-list-item-footer span {
				white-space: nowrap;
			}
			.d2l-discover-list-item-content {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				width: 100%;
			}

			:host d2l-discover-list-item-enroll {
				margin: 0.5rem 1rem;
			}
			.d2l-discover-list-item-category {
				flex-shrink: 0;
				line-height: 0.9rem;
				margin: 0;
				overflow: hidden;
				height: 0.9rem;
				white-space: nowrap;
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
			.d2l-discover-list-item-category-placeholder {
				display: block;
				height: 0.5rem;
				margin: 0.2rem 0;
				width: 30%;
			}
			.d2l-discover-list-item-title-placeholder {
				display: block;
				height: 1.2rem;
				margin-top: 0.2rem;
				margin-bottom: 0.6rem;
				width: 50%;
			}
			.d2l-discover-list-item-description-placeholder-container {
				padding: 0.325rem 0;
			}
			.d2l-discover-list-item-description-placeholder {
				display: block;
				height: 0.55rem;
				width: 95%;
			}
			.d2l-discover-list-item-footer-placeholder-container {
				display: flex;
				flex-direction: row;
				width: 30%;
			}
			.d2l-discover-list-item-footer-placeholder {
				display: block;
				height: 0.5rem;
				margin-bottom: 0.25rem;
				margin-top: 0.7rem;
				margin-right: 0.5rem;
			}
			:host(:dir(rtl)) .d2l-discover-list-item-footer-placeholder {
				margin-right: 0;
				margin-left: 0.5rem;
			}
			.d2l-discover-list-item-header-no-margin {
				margin: 0;
			}

			.d2l-enrollment-collection-view-organization-image {
				grid-column: 1;
				grid-row: 1;
			}

			@media (max-width: 385px) {
				.d2l-discover-list-item-description {
					display: none;
				}
			}
			`
		];
	}

	render() {
		const listItems = this._items.map(item =>
			html`
			<d2l-list-item class="d2l-discover-list-item-container" href="${item.activityHomepage}">
					<div slot="illustration" class="d2l-discover-list-item-image">
						<div class="d2l-discover-list-item-pulse-placeholder" ?hidden="${!this._shouldRenderImageSkeletons()}"></div>

						${item.organizationUrl && item.organizationUrl.length > 0 && this.token ? html`
							<d2l-organization-image href="${item.organizationUrl}" token="${this.token}" ?hidden="${this._shouldRenderImageSkeletons()}" @d2l-organization-image-loaded="${(e) => {this._onOrgImageLoaded(e, item);}}"></d2l-organization-image>
						` : null }
					</div>
					<d2l-list-item-content class="d2l-discover-list-item-content" aria-label="${this._accessibilityDataToString(item.accessibilityData)}">
						<div>
							<div ?hidden="${!this._shouldRenderTextSkeletons() || !this.displayAdditionalPlaceholders}">
								<div class="d2l-discover-list-item-pulse-placeholder d2l-discover-list-item-category-placeholder"></div>
							</div>
							<div ?hidden="${this._shouldRenderTextSkeletons()}">
								<div class="d2l-body-small d2l-discover-list-item-category" ?hidden="${!item.category}">${item.category}</div>
							</div>
						</div>
						<div ?hidden="${!this._shouldRenderTextSkeletons()}">
							<div class="d2l-discover-list-item-pulse-placeholder d2l-discover-list-item-title-placeholder"></div>
						</div>
						<div ?hidden="${this._shouldRenderTextSkeletons()}">
							<h2 class="d2l-heading-2 d2l-discover-list-item-title">
							${item.organizationUrl && item.organizationUrl.length > 0 && this.token ? html`
								<d2l-organization-name id="d2l-discover-list-item-organization-name" href="${item.organizationUrl}" token="${this.token}" @d2l-organization-accessible="${(e) => this._onD2lOrganizationAccessible(e, item)}}"></d2l-organization-name>
							` : null}
							</h2>
						</div>

						<div class="d2l-discover-list-item-description">
							<div ?hidden="${this._shouldRenderTextSkeletons()}">
								${this._createDescriptionElement(item.description)}
							</div>

							<div ?hidden="${!this._shouldRenderTextSkeletons()}">
								${this._descriptionPlaceholderLines.map(() => html`
									<div class="d2l-discover-list-item-description-placeholder-container">
										<div class="d2l-discover-list-item-pulse-placeholder d2l-discover-list-item-description-placeholder"></div>
									</div>
								`)}
							</div>
						</div>

						<div ?hidden="${!this._shouldRenderTextSkeletons() || !this.displayAdditionalPlaceholders}">
							<div class="d2l-discover-list-item-footer-placeholder-container">
								${this._footerPlaceholderItems.map(() => html`
									<div class="d2l-discover-list-item-pulse-placeholder d2l-discover-list-item-footer-placeholder"></div>
								`)}
							</div>
						<div>
					</d2l-list-item-content>
			</d2l-list-item>
			`
		);

		return html`
			<d2l-list>
				${listItems}
			</d2l-list>
		`;
	}
}
customElements.define('d2l-discover-list', D2lDiscoverList);
