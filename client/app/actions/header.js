import * as types from 'types'

export function setCustomHeaderTitle(title) {
	return {
		type: types.CUSTOM_HEADER_TITLE,
		payload: title,
	}
}

export function openSignup() {
	return {
		type: types.OPEN_SIGNUP_MODAL
	}
}

export function setPrebootFlag() {
	return {
		type: types.SET_PREBOOT_FLAG
	}
}

export function closeSignup() {
	return {
		type: types.CLOSE_SIGNUP_MODAL
	}
}

export function openLogin() {
	return {
		type: types.OPEN_LOGIN_MODAL
	}
}

export function closeLogin() {
	return {
		type: types.CLOSE_LOGIN_MODAL
	}
}

export function changeFilterModal(value) {
	return {
		type: types.FILTER_MODAL_CHANGE,
		payload: value,
	}
}

