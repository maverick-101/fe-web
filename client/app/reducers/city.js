import { combineReducers } from 'redux'
import * as types from 'types'

const loading = (state = false, action) => {
	switch(action.type) {
	case types.GET_CITIES:
	case types.GET_AREAS:
	case types.GET_AREAS:
		return true
    case types.GET_CITIES_SUCCESS:
	case types.GET_CITIES_ERROR:
	case types.GET_AREAS_SUCCESS:
	case types.GET_AREAS_ERROR:
	case types.GET_GRID_SUCCESS:
	case types.GET_GRID_ERROR:
		return false
    default:
		return state
  }
}

const message = (state = null, action) => {
	switch(action.type) {
	case types.GET_CITIES_ERROR:
	case types.GET_AREAS_ERROR:
	case types.GET_GRID_ERROR:
		return action.payload
    default:
		return state
  }
}

const list = (state = [], action) => {
	switch(action.type) {
	case types.GET_CITIES_SUCCESS:
		return action.payload
    default:
		return state
  }
}

const areas = (state = [], action) => {
	switch(action.type) {
	case types.GET_AREAS_SUCCESS:
		return action.payload
	case types.REMOVE_AREAS:
		return []
    default:
		return state
  }
}

const grid = (state = [], action) => {
	switch(action.type) {
	case types.GET_GRID_SUCCESS:
		return action.payload
    default:
		return state
  }
}

const projectSearch = (state = '', action) => {
	switch(action.type) {
	case types.SET_PROJECT_SEARCH:
		return action.payload
    default:
		return state
  }
}


export default combineReducers({
	loading,
	message,
	list,
	areas,
	grid,
	projectSearch,
})
