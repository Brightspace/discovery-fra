'use strict';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-organizations/components/d2l-organization-image/d2l-organization-image.js';
import './d2l-discover-list/d2l-discover-list.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Rels } from 'd2l-hypermedia-constants';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';
import { FetchMixin } from '../mixins/fetch-mixin.js';
import { entityFactory, dispose } from 'siren-sdk/src/es6/EntityFactory';
import { OrganizationCollectionEntity } from 'siren-sdk/src/organizations/OrganizationCollectionEntity';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { DiscoverSettingsMixin } from '../mixins/discover-settings-mixin.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import './loading-skeleton.js';

class DiscoverSettingsPromotedContent extends SkeletonMixin(DiscoverSettingsMixin(RouteLocationsMixin(FetchMixin(LocalizeMixin(LitElement))))) {

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this.maxPromotedCourses = 4;
		this._loadedCandidateImages = 0;
		this._loadedCandidateText = 0;
		this._promotedItemsLoading = true;
		this._candidateItemsLoading = true;
		this._currentSelection = new Set();
		this._selectionCount = 0;
		this._lastLoadedListItem = null;
		this._promotedActivities = [];
		this._candidateActivities = [];
		this._savedPromotedActivities = [];

		this._loadPromotedCourses();
		this._getSortUrl().then((url) => {
			this._loadCandidateCourses(url);
		});
	}

	static get properties() {
		return {
			token: { type: String},
			maxPromotedCourses: {type: Number }, //Limits the number of selectable items in the dialog's list to this number.

			_promotedDialogOpen: { type: Boolean}, //True iff the dialog is open

			_promotedItemsLoading: { type: Boolean}, //True until the saved promoted items are loaded.
			_candidateItemsLoading: { type: Boolean}, //True iff any candidate image or text has not fully loaded.
			_candidateEntityCollection: { type: Object}, //OrganizationEntityCollection siren object.

			_candidateActivities: { type: Array}, //Array of objects containing properties of OrganizationEntities within the currently loaded candidates
			_promotedActivities: { type: Array}, //Array of objects containing properties of the currently promoted activities

			_loadedCandidateImages: { type: Number}, //Count of total candidate images ready to be displayed
			_loadedCandidateText: { type: Number}, //Count of total candidate text ready to be displayed

			_currentSelection: { type: Object}, //Hash of checked/unchecked organizationURLs. All true items are selected.

			_selectionCount: { type: Number}, //Count of currently checked candidate entities
			_lastLoadedListItem: {type: Object}, //Tracks the last loaded activity, to focus its new sibling after loading more.
			_savedPromotedActivities: { type: Array}, //initial load of promoted courses
		};
	}

	static get styles() {
		return [
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
			.discover-featured-header {
				display:flex;
				justify-content: flex-start;
				align-items: center;
			}
			.discover-featured-title {
				margin-right: 1rem;
			}
			.discover-featured-empty {
				background-color: var(--d2l-color-regolith);
				border: solid 1px var(--d2l-color-gypsum);
				border-radius: 8px;
				padding: 2.1rem 2rem;
			}
			.discover-featured-list {
				max-width: 40rem
			}
			.discover-featured-dialog {
				height: 100%;
			}
			.discover-featured-dialog-list {
				height:25rem;
			}
			.discover-featured-dialog-header {
				display:flex;
				justify-content: space-between;
				margin-bottom: 1rem;
			}
			.discover-featured-input-search {
				width: 50%;
			}
			discover-featured-list {
				padding: 2.1rem 2rem;
			}
			.discover-featured-selected-nav {
				display:flex;
				justify-content: flex-end;
				width: 50%;
				height: fit-content;
			}
			.discover-featured-selected-nav-count {
				margin-left: 1rem;
				margin-right: .5rem;
				word-break: break-word;
			}
			.discover-featured-selected-nav-clear {
				height: fit-content;
			}
			.discover-featured-dialog-load-more {
				margin-top: .5rem;
				margin-bottom: .5rem;
			}
			.img-skeleton {
				width: 180px;
				height: 76.66px;
			}
			.discovery-featured-placeholder-container {
				width: 100%
			}
			.discovery-featured-title-placeholder {
				height: 1.1rem;
				margin: 0.17rem 0rem;
				width: 50%;
			}
		`];
	}

	cancel() {
		if (this._promotedItemsLoading === true || this._candidateItemsLoading === true) {
			return;
		}

		this._promotedItemsLoading = true;
		this._currentSelection = new Set();
		this._savedPromotedActivities = [];
		this._loadPromotedCourses();
	}

	save() {
		this._savedPromotedActivities = this._copySelection(this._currentSelection);
	}

	render() {
		const featuredSection = this._renderFeaturedSection();
		const candidates = this._renderCandidates();
		const selectedNav = this._renderSelectedNav();
		const loadMore = this._renderLoadMore();

		return html`
			<div class="discover-featured-header">
				<h2 class="discover-featured-title">${this.localize('settingsFeaturedSection')}</h2>
				<d2l-button primary @click="${this._openPromotedDialogClicked}">${this.localize('featureContent')}</d2l-button>
			</div>

			${featuredSection}

			<d2l-dialog class="discover-featured-dialog" title-text="${this.localize('browseDiscoverLibrary')}" ?opened="${this._promotedDialogOpen}" @d2l-dialog-close="${this._closePromotedDialogClicked}">
				<div class="discover-featured-dialog-list" aria-live="polite" aria-busy="${this._candidateItemsLoading}">
					<div class="discover-featured-dialog-header">
						<d2l-input-search class="discover-featured-input-search" label="${this.localize('search')}" placeholder=${this.localize('searchPlaceholder')} @d2l-input-search-searched=${this._handleSearch}></d2l-input-search>
						${selectedNav}
					</div>
					<div>
						${candidates}
					</div>
					<div class="discover-featured-dialog-load-more">
						${loadMore}
					</div>
				</div>

				<d2l-button slot="footer" primary dialog-action="add" @click=${this._addActivitiesClicked}>${this.localize('add')}</d2l-button>
				<d2l-button slot="footer" dialog-action>${this.localize('cancel')}</d2l-button>

			</d2l-dialog>
		`;
	}

	_renderFeaturedSection() {
		return html`
			${this._promotedActivities.length > 0 ? html`
				<d2l-list class="discover-featured-list">
					${this._promotedActivities.map((activity) => html`
						<d2l-list-item>
							<d2l-organization-image href="${activity.organizationUrl}" slot="illustration" token="${this.token}" class="img-skeleton" ?skeleton="${!activity.loaded}"></d2l-organization-image>
							<d2l-organization-name href="${activity.organizationUrl}" token="${this.token}" ?hidden="${!activity.loaded}" @d2l-organization-accessible="${(e) => this._handleSavedOrgAccessible(e, activity)}"></d2l-organization-name>

							${activity.loaded ? html`
								<div slot="actions">
									<d2l-button-icon text="${this.localize('removeFromFeatured', 'course', activity.organizationName)}" icon="tier1:close-default" @click="${(() => this._removeFromFeatured(activity.organizationUrl))}"></d2l-button-icon>
								</div>
							` : html`
								<div class="discovery-featured-placeholder-container">
									<loading-skeleton class="discovery-featured-title-placeholder"></loading-skeleton>
								</div>
							`}
						</d2l-list-item>
					`)}
				</d2l-list>
			` : html`
				<div class="discover-featured-empty" ?hidden="${this._promotedItemsLoading}">
					${this.localize('noFeaturedActivities')}
				</div>
			`}
		`;
	}

	_renderCandidates() {
		return html`
			${this._candidateEntityCollection === undefined || this._candidateEntityCollection === null ? null : html`
				${this._candidateActivities.length <= 0 && !this._candidateItemsLoading && !this._promotedItemsLoading ? html`
					<div class="discover-featured-empty">${this.localize('noActivitiesFound')}</div>` : html`

					<d2l-list @d2l-list-selection-change=${this._handleSelectionChange}>
					${this._candidateActivities.map(activity => html`
						<d2l-list-item selectable ?hidden="${!activity.loaded}" key="${activity.organizationUrl}"
							?selected="${this._isCandidateSelected(activity)}" ?disabled="${this._isCandidateDisabled(activity)}">

							<d2l-organization-image href="${activity.organizationUrl}" slot="illustration" token="${this.token}" @d2l-organization-image-loaded="${this._handleOrgImageLoaded}"></d2l-organization-image>
							<d2l-organization-name href="${activity.organizationUrl}" token="${this.token}" @d2l-organization-accessible="${this._handleCandidateOrgAccessible}"></d2l-organization-name>
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
				<div class="d2l-body-compact discover-featured-selected-nav">
					<div class="discover-featured-selected-nav-count">
						${this.localize('selectedFromMaximum', 'count', this._selectionCount, 'maximum', this.maxPromotedCourses)}
					</div>
					<d2l-link class="discover-featured-selected-nav-clear" tabindex="0" role="button" @click="${this._clearAllSelected}">
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
					<d2l-button @click=${this._loadMoreCandidates}>${this.localize('loadMore')}</d2l-button>
				`}
			`}
		`;
	}

	hasChanges() {
		if (this._savedPromotedActivities.length !== this._currentSelection.size) {
			return true;
		}

		const arr = [...this._currentSelection];
		for (let i = 0; i < this._savedPromotedActivities.length; i++) {
			if (arr[i] !== this._savedPromotedActivities[i]) {
				return true;
			}
		}
		return false;
	}

	_sendSelection(currentSelection) {
		const selections = [];
		currentSelection.forEach(s => {
			selections.push(s);
		});
		this.dispatchEvent(new CustomEvent('discover-settings-promoted-content-selection', {
			detail: {
				selection: selections,
			},
			bubbles: true,
			composed: true,
		}));
	}

	_clearAllSelected() {
		this._currentSelection = new Set();
		this._selectionCount = 0;
		this._sendSelection(this._currentSelection);
	}
	_openPromotedDialogClicked() {
		this._promotedDialogOpen = true;
	}

	_addActivitiesClicked() {
		this._updateFeaturedList();
	}

	_closePromotedDialogClicked() {
		this._promotedDialogOpen = false;
		this._resetCheckedCandidates();
	}

	_isCandidateSelected(activity) {
		return this._currentSelection.has(activity.organizationUrl);
	}

	_isCandidateDisabled(activity) {
		return !this._isCandidateSelected(activity) &&
		this._selectionCount >= this.maxPromotedCourses &&
		this.maxPromotedCourses > 0;
	}

	_handleSearch(e) {
		this._getSortUrl(e.detail.value).then(url => {
			this._loadCandidateCourses(url);
		});
	}

	_handleSelectionChange(e) {
		if (e.detail.selected) {
			this._currentSelection.add(e.detail.key);
		} else {
			this._currentSelection.delete(e.detail.key);
		}
		this._selectionCount = this._currentSelection.size;
		this._sendSelection(this._currentSelection);
	}

	_loadPromotedCourses() {
		this.fetchPromotedActivities().then (activities => {
			activities.forEach(entity => {
				const organizationUrl = entity.hasLink(Rels.organization) && entity.getLinkByRel(Rels.organization).href;
				this._currentSelection.add(organizationUrl);
				this._savedPromotedActivities.push(organizationUrl);
			});
			this._selectionCount = this._currentSelection.size;
			this._updateFeaturedList();
			this._promotedItemsLoading = false;
			this._sendSelection(this._currentSelection);
		});
	}

	_loadCandidateCourses(url) {
		if (this._candidateEntityCollection !== null && this._candidateEntityCollection !== undefined) {
			dispose(this._candidateEntityCollection);
		}
		this._loadedCandidateImages = 0;
		this._loadedCandidateText = 0;
		this._candidateItemsLoading = true;
		this._candidateActivities = [];
		this.requestUpdate();
		this._lastLoadedListItem = null;

		entityFactory(OrganizationCollectionEntity, url, this.token, (entity) => {
			if (entity === null) {
				return;
			}
			this._candidateEntityCollection = entity;
			const organizationArray = this._candidateEntityCollection.activities();
			this._loadNewCandidateOrganizations(organizationArray);
			this.requestUpdate();
		});
	}

	_loadMoreCandidates() {
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

	_handleCandidateOrgAccessible() {
		this._loadedCandidateText++;
		this._updateItemLoadingState();
	}

	_handleOrgImageLoaded() {
		this._loadedCandidateImages++;
		this._updateItemLoadingState();
	}

	_handleSavedOrgAccessible(e, activity) {
		if (!activity) {
			return;
		}
		activity.loaded = true;
		activity.organizationName = e.detail.organization && e.detail.organization.name;
		this.requestUpdate();
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

	//Returns a deep copy of the passed object property collection.
	_copySelection(selectionObject) {
		const selection = [];
		selectionObject.forEach((activity) => {
			selection.push(activity);
		});
		return selection;
	}

	//Updates the data for the displayed promoted selection based on the current selection of checked candidates.
	_updateFeaturedList() {
		const lastSavedSelection = this._currentSelection;
		const newPromotedActivities = [];

		//Rebuild our list of featured activities, mantaining unchanged items.
		let index = 0;
		lastSavedSelection.forEach((orgUrl) => {

			//If the orgUrl between the current list and the new list exactly matches for a given index, maintain the prior loaded object.
			//Since the orgUrl of the inner <d2l-organization-x> components will not be changed, they will not re-fire accessibility/loaded events.
			if (index < this._promotedActivities.length && orgUrl === this._promotedActivities[index].organizationUrl) {
				newPromotedActivities.push(this._promotedActivities[index]);
			} else {
				//As the OrgUrl for this index has changed, create an object to be updated when the inner components load.
				const newPromotedActivity = {};
				newPromotedActivity.organizationName = '';
				newPromotedActivity.loaded = false;
				newPromotedActivity.organizationUrl = orgUrl;
				newPromotedActivities.push(newPromotedActivity);
			}
			index++;
		});

		this._promotedActivities = newPromotedActivities;
	}

	//set the list of checked candidates to match the last saved list.
	_resetCheckedCandidates() {
		const newSelection = new Set();
		this._promotedActivities.forEach((activity) => {
			newSelection.add(activity.organizationUrl);
		});

		this._currentSelection = newSelection;
		this._selectionCount = this._currentSelection.size;
		this._sendSelection(this._currentSelection);
	}

	//Removes an item from the promoted list via its 'x' button.
	_removeFromFeatured(organizationUrl) {
		this._currentSelection.delete(organizationUrl);
		this._selectionCount = this._currentSelection.size;
		this._updateFeaturedList();
		this._sendSelection(this._currentSelection);
	}

	_getSortUrl(query) {
		const searchAction = 'search-activities';
		const parameters = {
			q: query,
			page: 0,
			pageSize: this._pageSize
		};

		if (query === '') {
			delete parameters.q;
		}
		return this._getActionUrl(searchAction, parameters);
	}
}

window.customElements.define('discover-settings-promoted-content', DiscoverSettingsPromotedContent);
