import axios from 'axios'
import config from 'config'

export function sendMessage(propertyId, receiverId , message) {
	var data = {
		property_id: propertyId,
		to_id: receiverId,
		body: message,
	}
	return axios.post(`${config.apiPath}/api/message`, data)
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}

export function getMessages() {
	return axios.get(`${config.apiPath}/api/message`)
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}

export function getMessageDetails(messageId) {
	return axios.get(`${config.apiPath}/api/message/${messageId}`)
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}

export function addMessageInThread(messageId, data) {
	return axios.post(`${config.apiPath}/api/message/${messageId}`, {message: data})
		.then(response => response.data)
		.catch(error => Promise.reject(error.response ? error.response.data : error.message))
}
