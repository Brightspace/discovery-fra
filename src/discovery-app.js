import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './components/app-location-ifrau.js';
import './discovery-404.js';
import './discovery-course.js';
import './discovery-home.js';
import './discovery-search.js';

import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
window.DiscoveryApp = window.DiscoveryApp || {};
setRootPath(window.DiscoveryApp.rootPath);

class DiscoveryApp extends RouteLocationsMixin(IfrauMixin(PolymerElement)) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>

			<app-location-ifrau
				route="[[route]]"
				query-params="[[queryParams]]">
			</app-location-ifrau>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/:page"
				data="[[routeData]]"
				tail="[[subroute]]">
			</app-route>

			<iron-pages
				selected="[[page]]"
				attr-for-selected="name"
				selected-attribute="visible"
				role="main">
				<discovery-home name="home"></discovery-home>
				<discovery-course name="course" route="[[route]]"></discovery-course>
				<discovery-search name="search" route="[[route]]"></discovery-search>
				<discovery-404 name="404"></discovery-404>
			</iron-pages>
		`;
	}
	static get properties() {
		return {
			page: {
				type: String,
				reflectToAttribute: true
			},
			queryParams: {
				type: Object,
				value: () => {
					return {};
				}
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
		this.addEventListener('navigate-parent', this._navigateParent);

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
			if (e.detail.resetPages) {
				e.detail.resetPages.forEach((page) => {
					const pageElement = this.shadowRoot.querySelector(`[name="${page}"`);
					if (pageElement && typeof pageElement._reset === 'function') {
						pageElement._reset();
					}
				});
			}
			if (e.detail.path) {
				this.set('route.path', e.detail.path);
			}
		}
	}
	_navigateParent(e) {
		if (e && e.detail && e.detail.path) {
			this._ifrauNavigationGo(e.detail.path);
		}
	}
	_routeChanged(route) {
		route = route.detail.value || {};
		this.route = route;
		if (route.path === '/d2l/le/discovery/view/') { // navlink home
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
		if (page && ['home', 'course', 'search'].indexOf(page) !== -1) {
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
}

window.customElements.define('discovery-app', DiscoveryApp);
