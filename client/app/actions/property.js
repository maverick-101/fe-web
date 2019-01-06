import axios from 'axios'
import * as types from 'types'
import defer from 'promise-defer'
import Qs from 'qs'
import { push } from 'react-router-redux'
import _ from 'lodash'
import config from 'config'
import swal from 'sweetalert2'
axios.defaults.withCredentials = true;

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

export function saveProperty(property, deletedImages) {
	return (dispatch, getState) => {
		var propertyReducer = getState().property

		dispatch({type: types.SAVE_PROPERTY})

		  return Promise.all([propertyReducer.waiting.promise, ...propertyReducer.uploading])
			.then((images) => {
        var image_ids = images.slice(1).map(image => image.id)
        _.pullAt(image_ids, deletedImages);
        image_ids = image_ids.map(img => {
          let isCoverPhoto = _.find(propertyReducer.images, (image) => {
          	return image.id === img && image.coverPhoto
					});
        	return {id: img, type: isCoverPhoto ? 'cover' : 'image'}
				});
        property.image_ids = image_ids;
				return axios.post(`${config.apiPath}/api/property`, property)
			})
			.then(response => {
				if (response.data==='Not Enough Credits') {
					var span = document.createElement('span');
					span.innerHTML = `<p>${response.data}</p> <a href='/dashboard/credits'><button class="btn red">Buy Credits</button></a>`
					swal({
						title: 'Sorry',
						html: span,
						type: 'info',
					})
					dispatch({
						type: types.NOT_ENOUGH_CREDITS,
						payload: response.data
					})
					throw new Error("Not Enough Cedits");
				}
				else {
					swal({
						title: 'Success!',
						text: 'Property Added',
						type: 'success',
					}) 
					dispatch({
						type: types.SAVE_PROPERTY_SUCCESS,
						payload: response.data
					})
				}
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
export function updatePropertyData(property, existingImageId, deletedImages) {
    return (dispatch, getState) => {
    var propertyReducer = getState().property;

    return Promise.all([propertyReducer.waiting.promise, ...propertyReducer.uploading])
      .then(images => {
       var image_ids = images.slice(1).map(image => image.id);
      image_ids = _.concat(image_ids,existingImageId);
       var index = deletedImages.map((item) => _.indexOf(image_ids,item));
        _.pullAt(image_ids, index);
		image_ids = image_ids.map(img => {
		  let isCoverPhoto = _.find(propertyReducer.images, (image) => {
			  return image.id === img && image.coverPhoto
		  });
		  return {id: img, type: isCoverPhoto ? 'cover' : 'image'}
		});
        property.image_ids = image_ids;
        return axios.put(`${config.apiPath}/api/property/update/${property.id}`, property)
      })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response ? error.response.data : error.message))
  }
}
export function updateProperty(propertyId, property) {
	return axios.put(`${config.apiPath}/api/property/${propertyId}`, property)
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}

export function uploadImage(image) {
	return (dispatch, getState) => {
		image.progress = 0
		var index = getState().property.images.length

		var fd = new FormData()
		fd.append('image', image)

		dispatch({
			type: types.IMAGE_UPLOAD,
			payload: image
		})

		var promise  = axios.post(`${config.apiPath}/api/property/image`, fd, {
			onUploadProgress: (event) => {
				var progress = parseInt(event.loaded/event.total * 100)
				dispatch({
					type: types.IMAGE_UPLOAD_PROGRESS,
					payload: { index, progress }
				})
			}
		}).then(response => {
			dispatch({
				type: types.IMAGE_UPLOAD_SUCCESS,
				payload: {
					index,
          id: response.data.id,
				}
			})
			return response.data
		}).catch(response => {
			dispatch({
				type: types.IMAGE_UPLOAD_ERROR,
				payload: index
			})
			return Promise.reject(error.response ? error.response.data : error.message)
		})

		dispatch({
			type: types.SAVE_IMAGE_PROMISE,
			payload: promise
		})

		return promise
	}
}

export function removeImage(index) {
	return {
		type: types.IMAGE_REMOVE,
		payload: index,
	}
}

export function makeCoverPhoto(index, value) {
  return {
    type: types.IMAGE_COVER_PHOTO,
    payload: { index, value }
  }
}

export function setSearchQuery(payload) {
	if (payload && payload.type == 'all') {
		delete payload.type
	}
	return {
		type: types.SET_PROPERTY_SEARCH_QUERY,
		payload,
	}
}

export function setSearchFooter(payload) {
	return {
		type: types.SET_PROPERTY_SEARCH_FOOTER,
		payload,
	}
}

export function search() {
	return (dispatch, getState) => {
		var query = getState().property.query
		query.amenities = query.amenities && typeof(query.amenities) == 'string' ? [query.amenities] : ( query.amenities ? query.amenities : []);
		dispatch(push(`/search?${Qs.stringify(query, { indices: false })}`))
	}
}


export function searchProperty(type = 'default') {
	return (dispatch, getState) => {
		var params = getState().property.query
		var loading = getState().property.loading
		var CancelToken = axios.CancelToken
		var previousCancelToken = getState().property.cancelToken
		params.amenities = params.amenities && typeof(params.amenities) == 'string' ? [params.amenities] : ( params.amenities ? params.amenities : []);

		previousCancelToken ? previousCancelToken.cancel('cancelled') : null
		var source = CancelToken.source();
		dispatch({type: types.SEARCH_PROPERTY})
		dispatch({
			type: types.SET_CANCEL_TOKEN,
			payload: source,
		})

		return axios.get(`${config.apiPath}/api/property/search`, {params, cancelToken: source.token,withCredentials:true}, {
			params
		})
			.then(response => {
				if(!response.data.items.length) {
					// dispatch({
					// 	type: types.NO_LISTINGS_FOUND,
					// 	payload: response.data
					// })
					return axios.get(`${config.apiPath}/api/property/search`, {params: {
						purpose: params.purpose
					},
					cancelToken: source.token,
					withCredentials:true}, {
					})
					.then((resp) => {
						dispatch({
							type: types.SEARCH_NO_PROPERTY_SUCCESS,
							payload: resp.data
						})
					})
				} else {
					dispatch({
						type: types.SEARCH_PROPERTY_SUCCESS,
						payload: response.data
					})
					dispatch({
						type: types.SET_PROPERTY_SEARCH_QUERY,
						payload: {
							price_max: getState().property.query.price_max && getState().property.query.price_max > response.data.max ? response.data.max : getState().property.query.price_max,
							price_min: getState().property.query.price_min && getState().property.query.price_min > response.data.max ? 0 : getState().property.query.price_min
						}
					})
				}
				return response.data
			})
			.catch(error => {
				if (axios.isCancel(error)) {
					// dispatch({
					// 	type: types.SEARCH_PROPERTY_ERROR,
					// 	payload: error.response ? error.response.data : error.message
					// })
					// return error.response ? error.response.data : error.message
				} else {
					dispatch({
						type: types.SEARCH_PROPERTY_ERROR,
						payload: error.response ? error.response.data : error.message
					})
					return error.response ? error.response.data : error.message
				}
			})
	}
}

