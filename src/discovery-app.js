import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './components/app-location-ifrau.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
window.DiscoveryApp = window.DiscoveryApp || {};
setRootPath(window.DiscoveryApp.rootPath);

class DiscoveryApp extends RouteLocationsMixin(PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>

			<app-location-ifrau
				query-params="[[queryParams]]">
			</app-location-ifrau>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/:page"
				data="[[routeData]]"
				tail="[[subroute]]">
			</app-route>

			<iron-pages
				selected="[[routeData.page]]"
				attr-for-selected="name"
				selected-attribute="visible"
				role="main">
				<discovery-home name="home"></discovery-home>
				<discovery-course name="course"></discovery-course>
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
	constructor() {
		super();
		this._routeDataChangedHandled = this._routeDataChanged.bind(this);
	}
	ready() {
		super.ready();
		this.addEventListener('navigate', this._navigate);

		const location = this.shadowRoot.querySelector('app-location-ifrau');
		location.addEventListener('route-changed', this._routeChanged.bind(this));
		location.addEventListener('query-params-changed', this._queryParamsChanged.bind(this));

		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('tail-changed', this._subrouteChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_navigate(e) {
		if (e && e.detail && e.detail.path) {
			this.set('route.path', e.detail.path);
		}
	}
	_routeChanged(route) {
		route = route.detail.value || {};
		this.route = route;
		const path = route.path || '/d2l/le/discovery/view/';
		if (path === '/d2l/le/discovery/view/') { // navlink home
			var appLocationIfrau = this.shadowRoot.querySelector('app-location-ifrau');
			if (appLocationIfrau) {
				appLocationIfrau.rewriteTo(this.routeLocations().home());
			}
		}
	}
	_routeDataChanged(routeData) {
		routeData = routeData.detail.value || {};
		this.routeData = routeData;
		const page = routeData.page || null;
		if (page && ['home', 'course'].indexOf(page) !== -1) {
			this.page = page;
		} else if (page) {
			this.page = '404';
		}
	}
	_subrouteChanged(subroute) {
		subroute = subroute.detail.value || {};
		this.subroute = subroute;
	}
	_queryParamsChanged(queryParams) {
		queryParams = queryParams.detail.value || {};
		this.queryParams = queryParams;
	}
	_pageChanged(page) {
		// Import the page component on demand.
		//
		// Note: `polymer build` doesn't like string concatenation in the import
		// statement, so break it up.
		//
		// Polymer lint issue with import: https://github.com/Polymer/polymer-linter/issues/96
		switch (page) {
			case 'course':
				import('./discovery-course.js');
				break;
			case 'home':
				import('./discovery-home.js');
				break;
			case '404':
				import('./discovery-404.js');
				this.set('routeData.page', '404');
				break;
		}
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
