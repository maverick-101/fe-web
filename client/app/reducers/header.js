import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as types from 'types'

const absolute = (state = false, action) => {
	switch(action.type) {
	case LOCATION_CHANGE:
		if (~['/'].indexOf(action.payload.pathname)) {
			return true
		}
		if (action.payload.pathname.includes('/hotel/')) {
			return true
		}
		else {
			return false
		}
	default:
		return state
  }
}

const absoluteTwo = (state = false, action) => {
	switch(action.type) {
	case LOCATION_CHANGE:
		if (~['/'].indexOf(action.payload.pathname)) {
			return true
		}
		if (~['/hotel'].indexOf(action.payload.pathname)) {
			return true
		}
		else if (~['//terms'].indexOf(action.payload.pathname)) {
			return true
    }
		else if (~['//policy'].indexOf(action.payload.pathname)) {
			return true
    }
		else if (~['//about'].indexOf(action.payload.pathname)) {
			return true
		}
		else if (~['//madewithlove'].indexOf(action.payload.pathname)) {
			return true
    }
		else if (~['//sitemap'].indexOf(action.payload.pathname)) {
			return true
    }
		else if (~['//contact'].indexOf(action.payload.pathname)) {
			return true
    }
		else {
			return false
		}
	default:
		return state
  }
}

const search = (state = false, action) => {
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
		else {
			return false
    }
	default:
		return state
  }
}

const title = (state = null, action) => {
	switch(action.type) {
	case types.CUSTOM_HEADER_TITLE:
		return action.payload
    case LOCATION_CHANGE:
		return null
    default:
		return state
  }
}

const prebootFlag = (state = false, action) => {
	switch(action.type) {
	case types.SET_PREBOOT_FLAG:
		return true
    default:
		return state
  }
}


const signup = (state = false, action) => {
	switch(action.type) {
	case types.OPEN_SIGNUP_MODAL:
		return true
    case types.CLOSE_SIGNUP_MODAL:
	case types.OPEN_LOGIN_MODAL:
	case types.SET_USER_FROM_TOKEN:
	case types.SIGNUP_USER_SUCCESS:
		return false
    default:
		return state
  }
}

const showFilterModal = (state = false, action) => {
	switch(action.type) {
		case types.FILTER_MODAL_CHANGE:
			return action.payload
			default:
			return state
		}
}

const login = (state = false, action) => {
	switch(action.type) {
	case types.OPEN_LOGIN_MODAL:
		return true
    case types.CLOSE_LOGIN_MODAL:
	case types.OPEN_SIGNUP_MODAL:
	case types.SET_USER_FROM_TOKEN:
	case types.LOGIN_USER_SUCCESS:
		return false
    default:
		return state
  }
}

export default combineReducers({
	absolute,
	absoluteTwo,
	search,
	title,
	signup,
	login,
	showFilterModal,
	prebootFlag,
})
