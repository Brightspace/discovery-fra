'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import 'd2l-activities/components/d2l-activity-card/d2l-activity-card.js';
import 'd2l-typography/d2l-typography.js';

class ActivityCardList extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-typography">
				:host {
					display: inline;
				}

				.discovery-activity-card-list-container {
					display: -ms-grid;
					display: grid;
				}

				.discovery-activity-card-list-item {
					--course-image-height: var(--discovery-activity-card-list-image-height);
					box-sizing: border-box;
					height: 100%;
					padding-bottom: 0.75rem;
				}
			</style>

			<div class="d2l-typography">
				<h2 class="d2l-heading-2">[[header]]</h2>
				<div id="discovery-activity-card-list-container" class="discovery-activity-card-list-container">
					<template is="dom-repeat" items="[[activities]]">
						<d2l-activity-card
							class="discovery-activity-card-list-item"
							entity=[[item]]
							send-event-on-click
							presentation-href="src/presentation/presentation-href.json">
						</d2l-activity-card>
					</template>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			header: String,
			activities: Array,
			columnGap: {
				type: String,
				value: '0.75rem'
			}
		};
	}
	ready() {
		super.ready();
		this.addEventListener('iron-resize', this._onIronResize.bind(this));

		const activityCardListContainer = this.shadowRoot.querySelector('#discovery-activity-card-list-container');
		if (activityCardListContainer) {
			activityCardListContainer.style['grid-column-gap'] = this.columnGap;
		}

	}
	_generateIE11GridColumnsCss(numColumns, columnSize, columnGap) {
		var gridTemplateColumns = columnSize;
		for (var i = 1; i < numColumns; i++) {
			gridTemplateColumns = gridTemplateColumns.concat(` ${columnGap} ${columnSize}`);
		}
		return gridTemplateColumns;
	}
	_onIronResize() {
		const activityCardListContainer = this.shadowRoot.querySelector('#discovery-activity-card-list-container');
		if (!activityCardListContainer) {
			return;
		}

		// Calculate container width by walking up its parent;
		var containerWidth = this.offsetWidth;
		for (var parent = this.parentNode; containerWidth <= 0 && parent; parent = parent.parentNode) {
			containerWidth = parent.offsetWidth;
		}

		// Determine number of columns and its appropriate columns css
		const cardWidthInPx = 350;
		const maxColumns = 4;
		const columnSize = '1fr';
		const numColumns = Math.min(Math.floor(containerWidth / cardWidthInPx), maxColumns) + 1;

		this.updateStyles({'--discovery-activity-card-list-image-height': containerWidth / numColumns * 0.43 + 'px'});

		if (activityCardListContainer.style) {
			activityCardListContainer.style['-ms-grid-columns'] =
				this._generateIE11GridColumnsCss(numColumns, columnSize, this.columnGap);
			activityCardListContainer.style['grid-template-columns'] = `repeat(${numColumns}, minmax(0, ${columnSize}))`;
		}

		var cssGridStyle = document.body.style['grid-template-columns'];
		if (cssGridStyle !== undefined) {
			return;
		}

		// For browsers that don't support grid-template-columns: position every element
		const cardElements = this.shadowRoot.querySelectorAll('d2l-activity-card');
		if (cardElements.length) {
			for (var c = 0, cardIndex = 0; cardIndex < cardElements.length; cardIndex++, c++) {
				if (cardElements[cardIndex].style) {
					cardElements[cardIndex].style['-ms-grid-row'] = Math.floor(c / numColumns) + 1;
					cardElements[cardIndex].style['-ms-grid-column'] = (c % numColumns) * 2 + 1;
				}
			}
		}
	}
}

window.customElements.define('activity-card-list', ActivityCardList);
