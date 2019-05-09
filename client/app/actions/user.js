import axios from 'axios'
import Cookies from 'js-cookie'
import * as types from 'types'
import { push } from 'react-router-redux'
import { unblockPropertySave } from './property'
import config from 'config'
import swal from 'sweetalert2'
axios.defaults.withCredentials = true;

function storeToken(token, remember = false) {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  if (process.env.NODE_ENV === 'production') {
		if (remember) {
			Cookies.set('graana_access_token', `${token}`, { expires: 14, domain: `${config.domain}` })
		}
		else {
			Cookies.set('graana_access_token', `${token}`, { domain: `${config.domain}` })
		}
  }
	else {
				if (remember) {
			Cookies.set('graana_access_token', `${token}`, { expires: 14 })
		}
		else {
			Cookies.set('graana_access_token', `${token}`, {domain: config.domain})
		}
  }
}

export function setverifiedToken(token, user) {
	return (dispatch) => {
		dispatch(signupLoginSuccess(types.LOGIN_USER_SUCCESS, {user, remember: false}))
		// storeToken(token);
	}
}

function removeToken() {
	axios.defaults.headers.common['Authorization'] = ''
  if (process.env.NODE_ENV === 'production') {
		Cookies.remove('graana_access_token', {domain: `${config.domain}`})
		Cookies.remove('graana_access_token')
  }
	else {
		Cookies.remove('graana_access_token', {domain: `${config.domain}`})
		Cookies.remove('graana_access_token')
  }
}

function setHeader(pathname) {
	var token = Cookies.get('graana_access_token')
	
  //Don't set header if user logging out
  if(token && pathname != '/logout') {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

function signupLoginSuccess(type, payload) {
	return dispatch => {
		storeToken(payload.token, payload.remember)
    dispatch({
			type,
			payload: payload.user,
		})
		dispatch(unblockPropertySave())
	}
}

export function signUp(user) {
	return (dispatch) => {
		dispatch({type: types.SIGNUP_USER})

		const fd = new FormData();
		fd.append('user', JSON.stringify(user));

    return axios.post(`${config.apiPath}/user/save`, fd, {
			// headers: {"Access-Control-Allow-Origin": "https://dev.saaditrips.com"}
			headers: {"Access-Control-Allow-Origin": "*"}
		})
			.then(response => {
				dispatch({
					type: types.SIGNUP_USER_SUCCESS,
				})
				// dispatch(signupLoginSuccess(types.SIGNUP_USER_SUCCESS, response.data))
        return response.data
      })
			.catch(error => {
				dispatch({
					type: types.SIGNUP_USER_ERROR,
					payload: error.response ? error.response.data : error.message
				})
        return Promise.reject(error.response ? error.response.data : error.message)
      })
	}
}

export function searchType(type) {
	return ((dispatch) => {
		dispatch({
			payload: type || 'properties',
			type: types.SET_SEARCH_TYPE
		})
	})
}

export function checkEmail(email) {
	return (dispatch) => {
		return axios.post(`${config.apiPath}/api/user/exists`, {email})
			.then(response => {
				return response.data && response.data.exists
      })
	}
}

export function getCurrentUser() {
	return (dispatch, getState) => {
		setHeader(getState().routing.locationBeforeTransitions.pathname)
    return axios.get(`${config.apiPath}/api/user/me`)
			.then(response => {
				dispatch({
					type: types.SET_USER_FROM_TOKEN,
					payload: response.data
				})
				dispatch(unblockPropertySave())
				return axios.get(`${config.apiPath}/api/inquiry/count`)
					.then(count => {
						dispatch(notificationRead(count.data))
          return response.data
        })
			})
			.catch(error => {
				return error.response ? error.response.data : error.message
      })
	}
}

export function beginLogin() {
	return { type: types.LOGIN_USER }
}

export function setMobile(flag) {
	return {
		type: types.SET_MOBILE_FLAG,
		payload: flag,
	}
}

export function logIn(user) {
	return (dispatch) => {
		dispatch(beginLogin())

		let requestBody = { 'user' : JSON.stringify(user)};

		return axios.post(`${config.apiPath}/user/signIn/`, requestBody)
			.then(response => {
				dispatch(signupLoginSuccess(types.LOGIN_USER_SUCCESS, response.data))
        return response.data
      })
			.catch(error => {
				dispatch({
					type: types.LOGIN_USER_ERROR,
					payload: error.response ? error.response.data : error.message
				})
        return Promise.reject(error.response ? error.response.data : error.message)
      })
	}
}

export function resendVerificationEmail(user) {
	return (dispatch) => {
		// dispatch(beginLogin())
		return axios.post(`${config.apiPath}/api/user/resend-verification`, user)
			.then((response) => {
				swal({
					title: 'Email Sent!',
					text: 'Verification Email has been sent.',
					type: 'success',
				})
				dispatch({
					type: types.LOGIN_USER_ERROR,
					payload: null,
				})
			})
			.catch(() => {
				swal({
					title: 'Incorrect Email or Password',
					text: 'Please enter correct email and password',
					type: 'error',
				})
			})
	}
}

export function oauthLogin(provider) {
	return (dispatch, getState) => {
		function watchDialog(dialog, interval) {
			var cookie = Cookies.get('oauth_success')
      if(cookie) {
				var oauth = JSON.parse(decodeURIComponent(cookie))
        dialog.close()
				clearInterval(interval)
				if(oauth && oauth.success) {
					dispatch(getCurrentUser())
						.then(user => {
							var user = getState().user
              if(user.phone) {
								dispatch(updateUser({phone: user.phone}))
              }
						})
				}
			}
		}

		//Clear any old oauth_success calls
		Cookies.remove('oauth_success')
		var dialog = window.open(`${config.apiPath}/auth/${provider}`, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
    var interval = setInterval(() => {
			watchDialog(dialog, interval)
		}, 200)
	}
}

export function logOut() {
	return (dispatch) => {
		removeToken()
    dispatch({ type: types.LOGOUT_USER })
    window.location = '/'
  }
}

export function forgotPassword(email) {
	return axios.post(`${config.apiPath}/api/user/forgot-password`, email)
		.then(response => {
			return reponse.data
    })
		.catch(error => {
			return error.response ? error.response.data : error.message
    })
}

export function resetPassword(password) {
	return (dispatch, getState) => {
		dispatch({type: types.RESET_PASSWORD})

    var token = getState().routing.locationBeforeTransitions.query.token
    return axios.post(`${config.apiPath}/api/user/reset-password?token=${token}`, password)
			.then(response => {
				dispatch({
					type: types.RESET_PASSWORD_SUCCESS
				})
				return response.data
      })
			.catch(error => {
				dispatch({
					type: types.RESET_PASSWORD_ERROR,
					payload: error.response ? error.response.data : error.message
				})
        return error.response ? error.response.data : error.message
      })
	}
}

export function signUpTeamMember(user) {
	return (dispatch, getState) => {
    var token = getState().routing.locationBeforeTransitions.query.token
    return axios.post(`${config.apiPath}/api/user`, user)
			.then(response => {
				dispatch(signupLoginSuccess(types.SIGNUP_USER_SUCCESS, response.data))
				dispatch({
					type: types.SIGNUP_TEAM_MEMBER_SUCCESS
				})
				return response.data
      })
			.catch(error => {
				dispatch({
					type: types.LOGIN_USER_ERROR,
					payload: error.response ? error.response.data : error.message
				})
				dispatch({
					type: types.SIGNUP_TEAM_MEMBER_ERROR,
					payload: error.response ? error.response.data : error.message
				})
        return error.response ? error.response.data : error.message
      })
	}
}

export function updateUser(user, image) {
	return (dispatch, getState) => {
		var state = getState().user

    var fd = new FormData()
    fd.append('user', JSON.stringify(user))
    if(image) {
			fd.append('image', image)
    }

		dispatch({type: types.UPDATE_USER})

    return axios.put(`${config.apiPath}/api/user/${state.user.id}`, fd)
			.then(response => {
				dispatch({
					type: types.UPDATE_USER_SUCCESS,
					payload: response.data
				})
				return response.data
      })
			.catch(error => {
				dispatch({
					type: types.RESET_PASSWORD_ERROR,
					payload: error.response ? error.response.data : error.message
				})
        return error.response ? error.response.data : error.message
      })
	}
}

export function setUserPhone(phone) {
	return {
		type: types.SET_USER_PHONE,
		payload: phone
	}
}

export function setCurrencyRates() {
	return (dispatch, getState) => {
		axios.get(`${config.apiPath}/api/user/currency`)
		.then((response) => {
			var currencyRates = {};
			response.data.map((currency) => {
				currencyRates[currency.name] = currency.rate;
			})
			dispatch ({
				type: types.SET_CURRENCY_RATES,
				payload: currencyRates,
			})
			return response.data
		})
	}
}

export function currencyChange(currency) {
	Cookies.set('currency', `${currency}`, {domain: config.domain})
  return {
		type: types.CURRENCY_CHANGE,
		payload: currency
	}
}

export function unitChange(unit) {
	Cookies.set('unit', `${unit}`, {domain: config.domain})
  return {
		type: types.UNIT_CHANGE,
		payload: unit
	}
}
export function notificationRead(count) {
	return {
		type: types.NOTIFICATION_READ,
		payload: count
	}
}

export function apiLoading(state) {
	if(state) {
		return {
			type: types.API_LOADING,
			payload: true,
		}
	} 
	else {
		return {
			type: types.API_LOADED,
			payload: false,
		}
	}
}
