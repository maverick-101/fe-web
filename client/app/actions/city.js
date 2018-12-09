import axios from 'axios'
import * as types from 'types'
import config from 'config'

export function getCities() {
	return (dispatch, getState) => {
		var city = getState().city
    if(city.loading) {
			return Promise.resolve()
    }
		if(city.list.length) {
			return Promise.resolve(city.list)
    }

		dispatch({type: types.GET_CITIES})

		return axios.get(`${config.apiPath}/api/city`)
			.then(response => {
				dispatch({
					type: types.GET_CITIES_SUCCESS,
					payload: response.data
				})
				return response.data
      })
			.catch(error => {
				dispatch({
					type: types.GET_CITIES_ERROR,
					payload: error.response ? error.response.data : error.message
				})
				return Promise.reject(error.response ? error.response.data : error.message)
      })
	}
}

export function getAreas(params) {
	return (dispatch, getState) => {
		var city = getState().city
    if(city.loading && !params.city_id) {
			return Promise.resolve()
    }

		dispatch({type: types.GET_AREAS})

		return axios.get(`${config.apiPath}/api/city/areas`, {
			params
		})
			.then(response => {
				dispatch({
					type: types.GET_AREAS_SUCCESS,
					payload: response.data
				})
				return response.data
    })
			.catch(error => {
				dispatch({
					type: types.GET_AREAS_ERROR,
					payload: error.response ? error.response.data : error.message
				})
				return Promise.reject(error.response ? error.response.data : error.message)
    })
	}
}

export function getGrid(q) {
	return (dispatch) => {
		dispatch({type: types.GET_GRID})

		return axios.get(`${config.apiPath}/api/city/areas`, {
			params: {
				q,
				grid: 1
			}
		})
			.then(response => {
				dispatch({
					type: types.GET_GRID_SUCCESS,
					payload: response.data
				})
				return response.data
    })
			.catch(error => {
				dispatch({
					type: types.GET_GRID_ERROR,
					payload: error.response ? error.response.data : error.message
				})
				return Promise.reject(error.response ? error.response.data : error.message)
    })
	}
}

export function setProjectSearch(area) {
	return (dispatch) => {
		return dispatch({
			type: types.SET_PROJECT_SEARCH,
			payload: area,
		})
	}
}

export function removeAreas() {
	return (dispatch, getState) => {
		var areas = getState().city.areas;
		var removableArray = getState().property.query.area_id || [];
		var city = getState().property.query.city_id;	
		if (removableArray && removableArray.length > 0) {
			var removedAreas = (removableArray && typeof(removableArray) != `string`) ?  areas.filter((area) => removableArray.indexOf(area.id) == -1) : areas.filter((area) => area.id != removableArray) 
			dispatch({
				type: types.GET_AREAS_SUCCESS,
				payload: removedAreas,
			})
		} 
		if (!city) {
			return dispatch({
				type: types.REMOVE_AREAS,
				payload: [],
			})
		}
	}
}

export function setSearchAreas() {
	return (dispatch, getState) => {
		var areas = getState().property.query.area_names
		return dispatch({
			type: types.SET_SEARCH_AREAS,
			payload: (areas && areas.length) ? areas : [areas],
		})
	}
}

export function getProjectSearch(areaId) {
	return (dispatch) => {
		axios.get(`${config.apiPath}/api/area/${areaId}`)
		.then((response) => {
			
			return dispatch({
				type: types.SET_PROJECT_SEARCH,
				payload: {
					id: response.data.id,
					area: `${response.data.name}, ${response.data.city.name}`,
					
				},
			})
		})
	}
}
