import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './components/app-location-ifrau.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
window.DiscoveryApp = window.DiscoveryApp || {};
setRootPath(window.DiscoveryApp.rootPath);

class DiscoveryApp extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>

			<app-location-ifrau
				route="{{route}}"
				query-params="{{queryParams}}">
			</app-location-ifrau>

			<app-route
				route="{{route}}"
				pattern="/d2l/le/discovery/view/:page"
				data="{{routeData}}"
				tail="{{subroute}}">
			</app-route>

			<iron-pages
				selected="[[routeData.page]]"
				attr-for-selected="name"
				selected-attribute="visible"
				fallback-selection="discovery-404"
				role="main">
				<discovery-home
					name="home">
				</discovery-home>

				<discovery-404 name="404"></discovery-404>
			</iron-pages>
		`;
	}
	static get properties() {
		return {
			page: {
				type: String,
				reflectToAttribute: true,
				observer: '_pageChanged',
			},
			routeData: Object,
			subroute: Object,
		};
	}
	static get observers() {
		return [
			'_routePathChanged(route.path)',
			'_routeDataPageChanged(routeData.page)',
		];
	}
	ready() {
		super.ready();
		this.addEventListener('navigate', this._navigate);
	}
	_navigate(e) {
		if (e && e.detail && e.detail.path) {
			this.set('route.path', e.detail.path);
		}
	}
	_routePathChanged(path) {
		if (path === '/d2l/le/discovery/view/') { // navlink home
			var appLocationIfrau = this.shadowRoot.querySelector('app-location-ifrau');
			if (appLocationIfrau) {
				appLocationIfrau.rewriteTo('/d2l/le/discovery/view/home');
			}
		}
	}
	_routeDataPageChanged(page) {
		if (page) {
			this.page = page;
		}
	}
	_pageChanged(page) {
		// Import the page component on demand.
		//
		// Note: `polymer build` doesn't like string concatenation in the import
		// statement, so break it up.
		//
		// Polymer lint issue with import: https://github.com/Polymer/polymer-linter/issues/96
		switch (page) {
			case 'home':
				import('./discovery-home.js');
				break;
			case '404':
				import('./discovery-404.js');
				break;
		}
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
