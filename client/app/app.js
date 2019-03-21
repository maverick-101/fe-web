import 'array.prototype.fill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store'
import ReactGA from 'react-ga'
import Helmet, { HelmetProvider } from 'react-helmet-async';

import 'common/loader.less'
import 'rheostat/css/slider.css'
import 'rheostat/css/slider-horizontal.css'
import 'slick-carousel/slick/slick.css'
import 'common/common.css'

import App from 'containers/App'
import Loadable from 'react-loadable';

const Home = Loadable({
	loader: () => import('containers/Home'),
	loading: () => null
});
const HotelPage = Loadable({
	loader: () => import('containers/HotelPage'),
	loading: () => null
});
const LocationPage = Loadable({
	loader: () => import('containers/LocationPage'),
	loading: () => null
});
const PackagePage = Loadable({
	loader: () => import('containers/PackagePage'),
	loading: () => null
});
import config from 'config';

const store = configureStore(browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

if(config.analytics){
	ReactGA.initialize(config.analytics); // add your UA cod

}
function logPageView() { // add this function to your component
  if(config.analytics) {
    ReactGA.set({page: window.location.pathname + window.location.search});
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
}

ReactDOM.hydrate(<Provider store={store}>
		<Router history={history} onUpdate={() => {window.scrollTo(0, 0); logPageView()}}>
			<Route path="/" components={App}>
				<IndexRoute components={{full: Home}}/>
				<Route path="/home" components={{full: Home}}/>
				<Route path="/hotel/:hotelId" components={{full: HotelPage}}/>
				<Route path="/location/:locationId" components={{full: LocationPage}}/>
				<Route path="/package/:packageId" components={{full: PackagePage}}/>
				<Route path="/experience/:experienceId" components={{full: PackagePage}}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('app')
)
