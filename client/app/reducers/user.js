import { combineReducers } from 'redux'
import * as types from 'types'
import Cookies from 'js-cookie'

const loading = (state = false, action) => {
	switch(action.type) {
	case types.SIGNUP_USER:
	case types.LOGIN_USER:
	case types.RESET_PASSWORD:
	case types.UPDATE_USER:
		return true
    case types.SIGNUP_USER_SUCCESS:
	case types.SIGNUP_USER_ERROR:
	case types.LOGIN_USER_SUCCESS:
	case types.LOGIN_USER_ERROR:
	case types.RESET_PASSWORD_SUCCESS:
	case types.RESET_PASSWORD_ERROR:
	case types.UPDATE_USER_SUCCESS:
	case types.UPDATE_USER_ERROR:
		return false
    default:
		return state
  }
}

const isMobile = (state = true, action) => {
	switch(action.type) {
		case types.SET_MOBILE_FLAG:
			return action.payload
			default:
			return state
	}
}

const searchType = (state = 'properties', action) => {
	switch(action.type) {
		case types.SET_SEARCH_TYPE:
			return action.payload
			default:
			return 'properties'
	}
}

const message = (state = null, action) => {
	switch (action.type) {
	case types.SIGNUP_USER_ERROR:
	case types.LOGIN_USER_ERROR:
	case types.RESET_PASSWORD_ERROR:
	case types.UPDATE_USER_ERROR:
		return action.payload
    case types.SIGNUP_USER:
	case types.LOGIN_USER:
	case types.RESET_PASSWORD:
		return null
    default:
		return state
  }
}

const user = (state = null, action) => {
	switch (action.type) {
	case types.SIGNUP_USER_SUCCESS:
	case types.SET_USER_FROM_TOKEN:
	case types.LOGIN_USER_SUCCESS:
		return action.payload || null
    case types.UPDATE_USER:
		return {
			...state, ...action.payload
		}
	case types.LOGOUT_USER:
		return null
    default:
		return state
  }
}

const phone = (state = '', action) => {
	switch (action.type) {
	case types.SET_USER_PHONE:
		return action.payload
    default:
		return state
  }
}

const currency = (state = Cookies.get('currency') || 'PKR', action) => {
	switch (action.type) {
	case types.CURRENCY_CHANGE:
		return action.payload
    default:
		return state
  }
}

const unit = (state = Cookies.get('unit') || 'standard', action) => {
	switch (action.type) {
	case types.UNIT_CHANGE:
		return action.payload
	default:
		return state
  }
}
const notifications = (state = 0, action) => {
	switch (action.type) {
	case types.NOTIFICATION_READ:
		return action.payload
	default:
		return state
  }
}

const currencyRates = (state = 0, action) => {
	switch (action.type) {
	case types.SET_CURRENCY_RATES:
		return action.payload
	default:
		return state
  }
}

const apiLoading = (state = 0, action) => {
	switch (action.type) {
	case types.API_LOADING:
		return true
		case types.API_LOADED:
		return false
	default:
		return false
  }
}

export default combineReducers({
	loading,
	message,
	user,
	phone,
	currency,
	unit,
	notifications,
	currencyRates,
	apiLoading,
	searchType,
	isMobile,
})
