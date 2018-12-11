import axios from 'axios'
import * as types from 'types'
import defer from 'promise-defer'
import Qs from 'qs'
import { push } from 'react-router-redux'
import config from 'config'

export function blockPropertySave() {
	return {
		type: types.BLOCK_PROPERTY_SAVE,
		payload: defer()
	}
}

export function unblockPropertySave() {
	return (dispatch, getState) => {
		var deferred = getState().property.waiting
    if(deferred.resolve) {
			deferred.resolve()
		}
		return dispatch({type: types.UNBLOCK_PROPERTY_SAVE})
	}
}

export function saveProperty(property) {
	return (dispatch, getState) => {
		var propertyReducer = getState().property

    dispatch({type: types.SAVE_PROPERTY})

		return Promise.all([propertyReducer.waiting.promise])
			.then(images => {
				return axios.post(`${config.apiPath}/api/property/add-wanted`, property)
			})
			.then(response => {
				dispatch({
					type: types.SAVE_PROPERTY_SUCCESS,
					payload: response.data
				})
				return response.data
      })
			.catch(error => {
				var message = error.response ? error.response.data : error.message
        dispatch({
					type: types.SAVE_PROPERTY_ERROR,
					payload: message
				})
				return Promise.reject(message)
      })
	}
}

export function updateProperty(propertyId, property) {
	return axios.put(`${config.apiPath}/api/property/${propertyId}`, property)
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}

export function setSearchQuery(payload) {
	return {
		type: types.SET_PROPERTY_SEARCH_QUERY,
		payload,
	}
}

export function search() {
	return (dispatch, getState) => {
		var query = getState().property.query
    dispatch(push(`/search?${Qs.stringify(query)}`))
	}
}

export function searchProperty() {
	return (dispatch, getState) => {
		var params = getState().property.query
    dispatch({type: types.SEARCH_PROPERTY})

		return axios.get(`${config.apiPath}/api/property`, {
			params
		})
			.then(response => {
				dispatch({
					type: types.SEARCH_PROPERTY_SUCCESS,
					payload: response.data
				})
				return response.data
			})
			.catch(error => {
				dispatch({
					type: types.SEARCH_PROPERTY_ERROR,
					payload: error.response ? error.response.data : error.message
				})
				return error.response ? error.response.data : error.message
    })
	}
}
