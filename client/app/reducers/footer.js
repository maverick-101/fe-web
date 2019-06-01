import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux'

const ad = (state = false, action) => {
	switch(action.type) {
	case LOCATION_CHANGE:
		if (~['/'].indexOf(action.payload.pathname)) {
			return false
    }
		else if (~['//terms'].indexOf(action.payload.pathname)) {
			return false
    }
		else if (~['//policy'].indexOf(action.payload.pathname)) {
			return false
		}
		else if (~['//madewithlove'].indexOf(action.payload.pathname)) {
			return false
    }
		else if (~['//about'].indexOf(action.payload.pathname)) {
			return false
    }
		else if (~['//sitemap'].indexOf(action.payload.pathname)) {
			return false
    }
		else if (~['//contact'].indexOf(action.payload.pathname)) {
			return false
		}
		else if (action.payload.pathname.split('/')[1] == 'project') {
			return false
    }
		else if (action.payload.pathname.split('/')[1] == 'agency') {
			return false
    }
		else if (action.payload.pathname.split('/')[1] == 'developer') {
			return false
    }
		else {
			return true
    }
	default:
		return state
  }
}

const searchAreasInfo = (state = false, action) => {
	switch(action.type) {
	case LOCATION_CHANGE:
		if (~['/search'].indexOf(action.payload.pathname)) {
			return true
    }
		else {
			return false
    }
	default:
		return state
  }
}

export default combineReducers({
	ad,
	searchAreasInfo
})
