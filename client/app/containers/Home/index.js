import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'


class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    return (
		<div>
			<div className="home-screen" style={{paddingLeft: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<img className="background-image" src={require('../../../site-specs/sliced-images/background-bg.png')} />
					<p style={{color: 'white', fontWeight: 'bolder', fontSize: '45px', position: 'absolute', marginTop: '-75px', letterSpacing: '4px'}}>LETS EXPLORE TOGETHER</p>
					<button className="btn btn-lg view-btn" style={{zIndex: 10, margin: 'auto', position: 'absolute', color: 'white', paddingLeft: '50px', paddingRight: '50px', width: '211.45px', border: '1px solid white'}}>VIEW MORE</button>
				</div>
					<div className="col" style={{display: 'inline-flex'}}>
						<div className="col-xs-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto">
						<img src={require('../../../site-specs/sliced-images/package-thumb-01.png')} style={{height: 350, width: 480}}></img>
						</div>
						<div className="col-xs-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto">
						<img src={require('../../../site-specs/sliced-images/package-thumb-02.png')} style={{height: 350, width: 480}}></img>
						</div>
						<div className="col-xs-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto">
						<img src={require('../../../site-specs/sliced-images/package-thumb-03.png')} style={{height: 350, width: 480}}></img>
						</div>
					</div>
		</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Home)