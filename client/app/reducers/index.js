import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import user from './user'
import header from './header'
import property from './property'
import city from './city'
import footer from './footer'

export default combineReducers({
	user,
	header,
	footer,
	routing,
	property,
	city,
})
