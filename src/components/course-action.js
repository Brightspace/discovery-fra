import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';
import 'fastdom/fastdom.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseAction extends mixinBehaviors([IronResizableBehavior], LocalizeMixin(RouteLocationsMixin(PolymerElement))) {
	static get template() {
		return html `
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-course-action-container {
					display: flex;
					flex-direction: column;
					margin: 1.5rem 1.5rem 2.4rem;
				}

				.discovery-course-action-d2l-heading-3 {
					margin-bottom: 0.9rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-action-description-list {
					margin: 0;
				}

				.discovery-course-action-description-list-row {
					display: flex;
					margin-bottom: 0.6rem;
				}

				.discovery-course-action-description-list-gutter {
					flex-grow: 1;
					max-width: 1.5rem;
					min-width: 0.6rem;
				}

				.discovery-course-action-description-list-gutter-multiline {
					flex: 0 0 0.6rem;
				}

				.discovery-course-action-description-list-term {
					color: var(--d2l-color-tungsten);
					margin: 0;
				}

				.discovery-course-action-description-list-data {
					color: var(--d2l-color-ferrite);
					margin: 0;
				}

				.discovery-course-action-tags-container {
					display: flex;
					flex-direction: column;
					margin-top: 1.5rem;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-action-container {
						margin: 1.2rem 0.9rem 1.8rem;
					}
				}
			</style>

			<div class="d2l-typography discovery-course-action-container">
				<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('courseInfo')]]</h3>

				<dl class="discovery-course-action-description-list">
					<template is="dom-repeat" items="[[courseDescriptionItems]]" on-dom-change='_setInitialDescriptionListSizes'>
						<div class="discovery-course-action-description-list-row">
						<dt class="d2l-body-compact discovery-course-action-description-list-term">[[item.term]]</dt>
						<div class="discovery-course-action-description-list-gutter"></div>
						<dd class="d2l-body-compact discovery-course-action-description-list-data">[[item.description]]</dd>
						</div>
					</template>
				</dl>

				<template is="dom-if" if="[[tagsExist]]">
					<div class="discovery-course-action-tags-container">
						<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('searchKeywords')]]</h3>
						<div>
							<template is="dom-repeat" items="[[courseTags]]">
								<d2l-link href="javascript:void(0)" on-click="_navigateToSearch">
									<span value="[[item]]">[[item]][[_getTagSuffix(index)]]</span>
								</d2l-link>
							</template>
						</div>
					</div>
				</template>
			</div>
		`;
	}

	constructor() {
		super();
		this.descriptionListElements = [];
		this.descriptionListGutters = [];
		this.descriptionListElementsInitialHeight = 0;
		this.descriptionListElementsMaxWidth = 0;
		this.addEventListener('iron-resize', this._onIronResize.bind(this));

	}

	static get properties() {
		return {
			courseTags: Array,
			tagsExist: {
				type: Boolean,
				computed: '_tagsExist(courseTags)',
			},
			courseDescriptionItems: Array
		};
	}

	_setInitialDescriptionListSizes()  {
		this.descriptionListElements = this.shadowRoot.querySelectorAll('dt')
			.concat(this.shadowRoot.querySelectorAll('dd'));
		this.descriptionListGutters = this.shadowRoot
			.querySelectorAll('.discovery-course-action-description-list-gutter');

		if (!this.descriptionListElements.length) {
			return;
		}

		// The initial height of the element is used to determine whether a word wrap has occurred
		this.descriptionListElementsInitialHeight =
			this._getInitialElementWidthAndHeight(this.descriptionListElements[0]).initialHeight;

		// The flex-basis is set to the max width of all elements, so that it only takes up the space
		// required to fit on one line
		this.descriptionListElementsMaxWidth = this.descriptionListElements
			.map(e => this._getInitialElementWidthAndHeight(e).initialWidth)
			.reduce((acc, currentWidth) => Math.max(acc, currentWidth));

		// Setting the flex basis of the max width element to its max width still wraps it: add 1 pixel to accomodate this
		if (this.descriptionListElementsMaxWidth) {
			this.descriptionListElementsMaxWidth = this.descriptionListElementsMaxWidth + 1;
		}

		// IE11 doesn't seem to have width for any elements on initial load
		if (this.descriptionListElementsMaxWidth > 0) {
			this.descriptionListElements.forEach(e => {
				fastdom.mutate(() => {
					e.style.flex = `0 1 ${this.descriptionListElementsMaxWidth}px`;
				});
			});
		}

		beforeNextRender(this, () => {
			this._onIronResize();
		});
	}

	_onIronResize() {
		if (!this.descriptionListElements.length ||
			!this.descriptionListGutters.length) {
			return;
		}

		// If the word wrap has occurred, we switch to the resizing (10-30px) gutter class
		if (this.descriptionListElements.some(e => e.clientHeight > this.descriptionListElementsInitialHeight)) {
			this.descriptionListGutters.forEach(g => {
				// IE11 doesn't like replace
				g.classList.remove('discovery-course-action-description-list-gutter');
				g.classList.add('discovery-course-action-description-list-gutter-multiline');
			});
		} else {
			this.descriptionListGutters.forEach(g => {
				g.classList.remove('discovery-course-action-description-list-gutter-multiline');
				g.classList.add('discovery-course-action-description-list-gutter');
			});
		}
	}

	_getInitialElementWidthAndHeight(e) {
		// Set nowrap so that the initial height/width is not affected by word wrapping
		e.style.setProperty('white-space', 'nowrap');
		const initialValues = {
			initialHeight: e.clientHeight,
			initialWidth: e.clientWidth
		};
		e.style.removeProperty('white-space');
		return initialValues;
	}

	_tagsExist(courseTags) {
		return courseTags && courseTags.length;
	}

	_getTagSuffix(index) {
		if (index !== undefined && this.courseTags) {
			if (index === this.courseTags.length - 1) {
				return '';
			} else {
				return ', ';
			}
		}
		return '';
	}

	_navigateToSearch(e) {
		if (e && e.target && e.target.value) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().search(e.target.value),
				},
				bubbles: true,
				composed: true,
			}));
		}
	}
}

window.customElements.define('course-action', CourseAction);
