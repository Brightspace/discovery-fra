'use strict';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-organizations/components/d2l-organization-image/d2l-organization-image.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Rels } from 'd2l-hypermedia-constants';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';
import { FetchMixin } from '../mixins/fetch-mixin.js';
import { entityFactory, dispose } from 'siren-sdk/src/es6/EntityFactory';
import { OrganizationCollectionEntity } from 'siren-sdk/src/organizations/OrganizationCollectionEntity';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class DiscoverSettingsPromotedContent extends RouteLocationsMixin(FetchMixin(LocalizeMixin(LitElement))) {

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this._loadedCandidateImages = 0;
		this._loadedCandidateText = 0;
		this._candidateItemsLoading = true;
		this._currentSelection = {};
		this._lastSavedSelection = {};
		this._selectionCount = 0;
		this._lastLoadedListItem = null;
	}

	static get properties() {
		return {
			token: { type: String},
			promotedSort: { type: String}, //Pass in a sort string to calculate the promotedHref instead of passing in promotedHref
			candidateSort: { type: String}, //Pass in a sort string to calculate the candidateHref instead of passing in candidateHref

			promotedHref: { type: String}, //URL towards the promoted courses organizationCollection entity
			candidateHref: { type: String}, //URL towards the candidate courses organizationCollection entity

			_promotedDialogOpen: { type: Boolean}, //True iff the dialog is open

			_promotedEntityCollection: { type: Object}, //OrganizationEntityCollection siren object.
			_promotedActivities: { type: Array}, //Array of objects containing useful properties of OrganizationEntities within _candidateEntityCollection

			_candidateItemsLoading: { type: Boolean}, //True iff any candidate image or text has not fully loaded.
			_candidateEntityCollection: { type: Object}, //OrganizationEntityCollection siren object.
			_candidateActivities: { type: Array}, //Array of objects containing useful properties of OrganizationEntities within _candidateEntityCollection

			_loadedCandidateImages: { type: Number}, //Count of total candidate images ready to be displayed
			_loadedCandidateText: { type: Number}, //Count of total candidate text ready to be displayed

			_currentSelection: { type: Object}, //Hash of checked/unchecked organizationURLs. All true items are selected.
			_lastSavedSelection: { type: Object}, //Copy of last accepted state of _currentSelection. Revert to this on cancel.
			_selectionCount: { type: Number}, //Count of currently checked candidate entities

			_lastLoadedListItem: {type: Object} //Tracks the last loaded activity, to focus its new sibling after loading more.
		};
	}

	firstUpdated(changedProperties) {
		super.updated();
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'promotedSort') {
				this._getSortUrl(this.promotedSort).then(url => {
					this.promotedHref = url;
					this._loadPromotedCourses();
				});
			}
			if (propName === 'candidateSort') {
				this._getSortUrl(this.candidateSort).then(url => {
					this.candidateHref = url;
					this._loadCandidateCourses();
				});
			}

			if (propName === 'promotedHref') {
				this._loadPromotedCourses();
			}
			if (propName === 'candidateHref') {
				this._loadCandidateCourses();
			}
		});
	}

	getSelectedActivities() {
		return Object.keys(this._currentSelection).filter((key) => this._currentSelection[key]);
	}

	clearAllSelected() {
		this._currentSelection = {};
		this._selectionCount = 0;
	}

	static get styles() {
		return [
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
			.discovery-featured-header {
				display:flex;
				justify-content: flex-start;
				align-items: center;
			}
			.discovery-featured-title {
				margin-right: 1rem;
			}
			.discovery-featured-empty {
				background-color: var(--d2l-color-regolith);
				border: solid 1px var(--d2l-color-gypsum);
				border-radius: 8px;
				padding: 2.1rem 2rem;
			}
			.discovery-featured-dialog {
				height: 100%;
			}
			.discovery-featured-dialog-list {
				height:25rem;
			}
			.discovery-featured-dialog-header {
				display:flex;
				justify-content: space-between;
				margin-bottom: 1rem;
			}
			.discovery-featured-input-search {
				width: 50%;
			}
			discovery-featured-list {
				padding: 2.1rem 2rem;
			}
			.discovery-featured-selected-nav {
				display:flex;
				justify-content: flex-end;
				width: 50%
				height: fit-content;
			}
			.discovery-featured-selected-nav-count {
				margin-right: .5rem;
			}
			.discovery-featured-dialog-load-more {
				margin-top: .5rem;
				margin-bottom: .5rem;
			}
		`];
	}

	render() {
		const featuredSection = this._renderFeaturedSection();
		const candidates = this._renderCandidates();
		const selectedNav = this._renderSelectedNav();
		const loadMore = this._renderLoadMore();

		return html`
			<div class="discovery-featured-header">
				<h2 class="discovery-featured-title">Featured Section</h2>
				<d2l-button primary @click="${this._openPromotedDialogClicked}">${this.localize('promoteContent')}</d2l-button>
			</div>

			${featuredSection}

			<d2l-dialog class="discovery-featured-dialog" title-text="${this.localize('browseDiscoverLibrary')}" ?opened="${this._promotedDialogOpen}" @d2l-dialog-close="${this._closePromotedDialogClicked}">
				<div class="discovery-featured-dialog-list" aria-live="polite" aria-busy="${this._candidateItemsLoading}">
					<div class="discovery-featured-dialog-header">
							<d2l-input-search class="discovery-featured-input-search" label="${this.localize('search')}" placeholder=${this.localize('searchPlaceholder')} @d2l-input-search-searched=${this._handleSearch}></d2l-input-search>
							${selectedNav}
					</div>
					<div>
						${candidates}
					</div>
					<div class="discovery-featured-dialog-load-more">
						${loadMore}
					</div>
				</div>

				<d2l-button slot="footer" primary dialog-action="add" @click=${this._addActivitiesClicked} ?disabled="${!this._selectionCount}">${this.localize('add')}</d2l-button>
				<d2l-button slot="footer" dialog-action>${this.localize('cancel')}</d2l-button>

			</d2l-dialog>
		`;
	}

	_renderFeaturedSection() {
		//US116080
	}

	_renderCandidates() {
		return html`
			${this._candidateEntityCollection === undefined || this._candidateEntityCollection === null ? null : html`
				${this._candidateActivities.length <= 0 && !this._candidateItemsLoading ? html`
					<div class="discovery-featured-empty">${this.localize('noActivitiesFound')}</div>` : html`

					<d2l-list @d2l-list-selection-change=${this._handleSelectionChange}>
					${this._candidateActivities.map(activity => html`
						<d2l-list-item selectable ?hidden="${!activity.loaded}" ?selected="${this._currentSelection[activity.organizationUrl]}" key="${activity.organizationUrl}">
							<d2l-organization-image href="${activity.organizationUrl}" slot="illustration" token="${this.token}" @d2l-organization-image-loaded="${this._handleOrgImageLoaded}}"></d2l-organization-image>
							<d2l-organization-name href="${activity.organizationUrl}" token="${this.token}" @d2l-organization-accessible="${this._handleOrgAccessible}}"></d2l-organization-name>
						</d2l-list-item>
					`)}
					</d2l-list>
				`}
			`}
		`;
	}

	_renderSelectedNav() {
		return html`
			${this._selectionCount > 0 ? html`
				<div class="d2l-body-compact discovery-featured-selected-nav">
					<div class="discovery-featured-selected-nav-count">
						${this.localize('selected', 'count', this._selectionCount)}
					</div>
					<d2l-link tabindex="0" role="button" @click="${this.clearAllSelected}">
						${this.localize('clearSelected')}
					</d2l-link>
				</div>
			` : null }
		`;
	}

	_renderLoadMore() {
		return html`
			${this._candidateItemsLoading ? html`<d2l-loading-spinner size="85"></d2l-loading-spinner>` : html`
				${!this._candidateEntityCollection || !this._candidateEntityCollection.hasNextPage() ? null : html`
					<d2l-button @click=${this._loadMore}>${this.localize('loadMore')}</d2l-button>
				`}
			`}
		`;
	}

	_openPromotedDialogClicked() {
		this._promotedDialogOpen = true;
	}

	_addActivitiesClicked() {
		this._lastSavedSelection = this._copyCurrentSelection();
	}

	_closePromotedDialogClicked() {
		this._promotedDialogOpen = false;
		this._currentSelection = this._lastSavedSelection;
		this._lastSavedSelection = this._copyCurrentSelection();
		this._selectionCount = this.getSelectedActivities().length;
	}

	_handleSearch(e) {
		this._getSortUrl('', e.detail.value).then(url => {
			this.candidateHref = url;
			this._loadCandidateCourses();
		});
	}

	_handleSelectionChange(e) {
		this._currentSelection[e.detail.key] = e.detail.selected;
		this._selectionCount = this.getSelectedActivities().length;
	}

	_loadPromotedCourses() {
		if (this.promotedHref === null || this.promotedHref === undefined) {
			return;
		}

		entityFactory(OrganizationCollectionEntity, this.promotedHref, this.token, (entity) => {
			if (entity === null) {
				return;
			}
			this._promotedEntityCollection = entity;
			const activities = this._promotedEntityCollection.activities();

			activities.forEach(entity => {
				const organizationUrl = entity.hasLink(Rels.organization) && entity.getLinkByRel(Rels.organization).href;
				this._currentSelection[organizationUrl] = true;
				this._selectionCount = this.getSelectedActivities().length;
			});
			this._lastSavedSelection = this._copyCurrentSelection();
		});
	}

	_loadCandidateCourses() {
		if (this.candidateHref === null || this.candidateHref === undefined) {
			return;
		}

		if (this._candidateEntityCollection !== null && this._candidateEntityCollection !== undefined) {
			dispose(this._candidateEntityCollection);
		}
		this._loadedCandidateImages = 0;
		this._loadedCandidateText = 0;
		this._candidateItemsLoading = true;
		this._candidateActivities = [];
		this.requestUpdate();
		this._lastLoadedListItem = null;

		entityFactory(OrganizationCollectionEntity, this.candidateHref, this.token, (entity) => {
			if (entity === null) {
				return;
			}
			this._candidateEntityCollection = entity;
			const organizationArray = this._candidateEntityCollection.activities();
			this._loadNewCandidateOrganizations(organizationArray);
			this.requestUpdate();
		});
	}

	_loadMore() {
		this._candidateItemsLoading = true;
		this._lastLoadedListItem = this.shadowRoot.querySelector('d2l-dialog d2l-list d2l-list-item:last-of-type');
		const loadMoreHref = this._candidateEntityCollection.nextPageHref();
		entityFactory(OrganizationCollectionEntity, loadMoreHref, this.token, (entity) => {
			if (entity === null) {
				return;
			}
			dispose(this._candidateEntityCollection);
			this._candidateEntityCollection = entity;
			const organizationArray = this._candidateEntityCollection.activities();
			this._loadNewCandidateOrganizations(organizationArray);
		});

	}

	_loadNewCandidateOrganizations(entityArray) {
		this._candidateItemsLoading = entityArray.length > 0;
		entityArray.forEach(entity => {
			const newOrganizationEntity = {};
			newOrganizationEntity.organizationUrl = entity.hasLink(Rels.organization) && entity.getLinkByRel(Rels.organization).href;
			newOrganizationEntity.loaded = false;
			this._candidateActivities.push(newOrganizationEntity);
		});
	}

	_handleOrgAccessible() {
		this._loadedCandidateText++;
		this._updateItemLoadingState();
	}

	_handleOrgImageLoaded() {
		this._loadedCandidateImages++;
		this._updateItemLoadingState();
	}

	//When all items in candidate list load, clear loading spinner and show them.
	async _updateItemLoadingState() {
		if (this._candidateActivities.length === this._loadedCandidateText && this._candidateActivities.length === this._loadedCandidateImages) {
			this._candidateItemsLoading = false;
			this._candidateActivities.forEach(activity => {
				activity.loaded = true;
			});

			//Focus the first newly loaded list item if we are loading additional items.
			if (this._lastLoadedListItem && this._lastLoadedListItem.nextElementSibling) {
				await this.updateComplete;
				this._lastLoadedListItem.nextElementSibling.focus();
			}
		}
	}

	//Returns a clone of the current activities list.
	_copyCurrentSelection() {
		const selection = {};
		const currentActivities = this.getSelectedActivities();
		currentActivities.forEach((activity) => {
			selection[activity] = true;
		});
		return selection;
	}

	_getSortUrl(sort, query) {
		const searchAction = 'search-activities';
		const parameters = {
			q: query,
			page: 0,
			pageSize: this._pageSize,
			sort: sort
		};

		if (query === '') {
			delete parameters.q;
		}
		if (sort === '') {
			delete parameters.sort;
		}
		return this._getActionUrl(searchAction, parameters);
	}
}

window.customElements.define('discover-settings-promoted-content', DiscoverSettingsPromotedContent);
