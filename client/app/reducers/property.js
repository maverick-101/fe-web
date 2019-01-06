import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as types from 'types'

const loading = (state = false, action) => {
	switch(action.type) {
	case types.SAVE_PROPERTY:
	case types.SEARCH_PROPERTY:
		return true
		case types.SAVE_PROPERTY_SUCCESS:
	case types.NOT_ENOUGH_CREDITS:
	case types.SAVE_PROPERTY_ERROR:
	case types.SEARCH_PROPERTY_SUCCESS:
	case types.SEARCH_PROPERTY_ERROR:
	case types.SET_PROPERTY_SEARCH_FOOTER:
	case types.SEARCH_NO_PROPERTY_SUCCESS:
		return false
    default:
		return state
  }
}

const message = (state = false, action) => {
	switch(action.type) {
	case types.SAVE_PROPERTY_ERROR:
	case types.SEARCH_PROPERTY_ERROR:
		return action.payload
    default:
		return state
  }
}

const cancelToken = (state = false, action) => {
	switch(action.type) {
	case types.SET_CANCEL_TOKEN:
		return action.payload
    default:
		return state
  }
}

const erroredOutImages = (state = [], action) => {
	switch(action.type) {
		case types.IMAGE_UPLOAD:
		return [
			...state, false
		]
		case types.IMAGE_REMOVE:
		return [
			...state.slice(0, action.payload), ...state.slice(action.payload + 1)
		]
		case types.IMAGE_UPLOAD_ERROR:
		var a = Object.assign([], state);
			a[action.payload] = true;
		 return a
		default: 
		 return state
	}
}

const images = (state = [], action) => {
	switch(action.type) {
	case types.IMAGE_UPLOAD:
		return [
			...state, action.payload
		]
	case types.IMAGE_UPLOAD_PROGRESS:
		return state.map((image, index) => {
			if(action.payload.index == index) {
				image.progress = action.payload.progress
        }
			return image
      })
	case types.IMAGE_UPLOAD_SUCCESS:
		return state.map((image, index) => {
			if(action.payload.index == index) {
				image.id = action.payload.id
        }
			return image
			})
	case types.IMAGE_UPLOAD_ERROR:
			var a = Object.assign([], state);
			a[action.payload].error = true;
		return a
  case types.IMAGE_REMOVE:
		return [
			...state.slice(0, action.payload), ...state.slice(action.payload + 1)
		]
	case types.IMAGE_COVER_PHOTO:
    return state.map((image, index) => {
      if(action.payload.index == index) {
        image.coverPhoto = action.payload.value
      }
      return image
    })
	default:
		return state
  }
}

const uploading = (state = [], action) => {
	switch(action.type) {
	case types.IMAGE_UPLOAD_ERROR:
		var a = Object.assign([], [...state.slice(0, action.payload), ...state.slice(action.payload + 1)])
		// a[action.payload].progress = 100
		return a
	case types.IMAGE_REMOVE:
		return [
			...state.slice(0, action.payload), ...state.slice(action.payload + 1)
		]
	case types.SAVE_IMAGE_PROMISE:
		return [
			...state, action.payload
		]
	default:
		return state
  }
}

const waiting = (state = {}, action) => {
	switch(action.type) {
	case types.BLOCK_PROPERTY_SAVE:
		return action.payload
	case types.UNBLOCK_PROPERTY_SAVE:
		return {}
	default:
		return state
  }
}

const query = (state = {}, action) => {
	switch(action.type) {
	case types.SET_PROPERTY_SEARCH_QUERY:
		return {
			...state, ...action.payload
		}
    case LOCATION_CHANGE:
		if(action.payload.pathname.toLowerCase() == '/search') {
			return {
				...action.payload.query, ...state, 
			}
		}
		case types.RESET_FILTERS:
		return {purpose: 'sale'}
	default:
		return state
  }
}

const listings = (state = {}, action) => {
	switch(action.type) {
	case types.SEARCH_PROPERTY_SUCCESS:
		return action.payload
	case types.SEARCH_NO_PROPERTY_SUCCESS:
		return {}
	default:
		return state
  }
}

const searchAreas = (state = {}, action) => {
	switch(action.type) {
	case types.SET_SEARCH_AREAS:
		return action.payload
	default:
		return state
  }
}

const noListingsItems = (state = {}, action) => {
	switch(action.type) {
	case types.SEARCH_NO_PROPERTY_SUCCESS:
		return action.payload
	default:
		return state
  }
}

const searchPageFooterDetails = (state = {cityFooterDetails:{}, areaFooterDetails:{}}, action) => {
	switch(action.type) {
	case types.SET_PROPERTY_SEARCH_FOOTER:
		return {...state, ...action.payload}
	default:
		return state
  }
}

export default combineReducers({
	loading,
	message,
	images,
	uploading,
	waiting,
	query,
	listings,
	searchAreas,
	cancelToken,
	searchPageFooterDetails,
	noListingsItems,
	erroredOutImages
})
