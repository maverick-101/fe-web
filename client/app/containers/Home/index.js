import React from 'react'
import { connect } from 'react-redux'


import style from './style.css'


class Home extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const isWebkit = isChrome || isSafari;
    return (
			<div>Home</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Home)
