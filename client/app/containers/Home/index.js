import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';

import style from './style.css'


class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    return (
		<div>
			<div className="home-screen" style={{paddingLeft: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<div className={style.homeCoverStyle} style={{background: `url(${require('../../../site-specs/sliced-images/background-bg.png')})`}}>
				</div>
					<p style={{color: 'white', fontWeight: 'bolder', fontSize: '45px', position: 'absolute', marginTop: '-75px', letterSpacing: '4px'}}>LETS EXPLORE TOGETHER</p>
					<button className="btn btn-lg view-btn" style={{zIndex: 10, margin: 'auto', position: 'absolute', color: 'white', paddingLeft: '50px', paddingRight: '50px', width: '211.45px', border: '1px solid white'}}>VIEW MORE</button>
				</div>
					<div className="col-sm-12 no-padding">
						<div style={{background: `url(${require('../../../site-specs/sliced-images/package-thumb-01.png')})`}} className={`col-sm-4 ${style.featuredTile} ${style.bgDiv}`}>
							<div className={`${style.featuredTilePriceDiv}`}>
								<p className={'no-padding no-margin'}>
								<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS</p>
								5000+ 
									<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>/Night</p>
								</p>
							</div>
						</div>
						<div style={{background: `url(${require('../../../site-specs/sliced-images/package-thumb-02.png')})`}} className={`col-sm-4 ${style.featuredTile}  ${style.bgDiv}`}>
							<div className={`${style.featuredTilePriceDiv}`}>
								<p className={'no-padding no-margin'}>
								<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS</p>
								5000+ 
									<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>/Night</p>
								</p>
							</div>
						</div>
						<div style={{background: `url(${require('../../../site-specs/sliced-images/package-thumb-03.png')})`}} className={`col-sm-4 ${style.featuredTile}  ${style.bgDiv}`}>
							<div className={`${style.featuredTilePriceDiv}`}>
								<p className={'no-padding no-margin'}>
								<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS</p>
								5000+ 
									<p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>/Night</p>
								</p>
							</div>
						</div>
					</div>

					<div className="container">
					<div className="row" style={{marginTop: '10px'}}/> 
						<h1>Hotel Resorts & their Packages</h1>
						<p style={{marginBottom: '35px'}}>Best Hotels and resorts yet affordable for your next trip</p>
						<div className="col-sm-12 no-padding">
						<div className="row">
							<div className="col-sm-4">
								<Card style={{border: '1px solid #d9d9d9', textAlign: 'left', position: 'none', borderRadius: '7px'}}>
									<CardImg top width="100%" src={require('../../../site-specs/sliced-images/hotel-resort-01.png')} alt="Card image cap" />
									<CardBody style={{padding: '6px 23px 6px 16px', display: '-webkit-box'}}>
									<div className="col-sm-8">
										<h4 style={{marginBottom: '6px'}}>Hunza Valley</h4>
										<p style={{marginBottom: '6px', fontWeight: '200', fontSize: '14px'}}>Starting Price <span style={{color: '#e3530d'}}>Rs.3000+</span></p>
									</div>
										<button style={{backgroundColor: '#00b3b3', color: 'white', border: 'none', marginTop: '5px'}} className="btn btn-lg btn-primary">Book Now</button>
										</CardBody>
								</Card>
							</div>

							<div className="col-sm-4">
								<Card style={{border: '1px solid #d9d9d9', textAlign: 'left', position: 'none', borderRadius: '7px'}}>
									<CardImg top width="100%" src={require('../../../site-specs/sliced-images/hotel-resort-02.png')} alt="Card image cap" />
									<CardBody style={{padding: '6px 23px 6px 16px', display: '-webkit-box'}}>
									<div className="col-sm-8">
										<h4 style={{marginBottom: '6px'}}>Hunza Valley</h4>
										<p style={{marginBottom: '6px', fontWeight: '200', fontSize: '14px'}}>Starting Price <span style={{color: '#e3530d'}}>Rs.3000+</span></p>
									</div>
										<button style={{backgroundColor: '#00b3b3', color: 'white', border: 'none', marginTop: '5px'}} className="btn btn-lg btn-primary">Book Now</button>
										</CardBody>
								</Card>
							</div>

							<div className="col-sm-4">
								<Card style={{border: '1px solid #d9d9d9', textAlign: 'left', position: 'none', borderRadius: '7px'}}>
									<CardImg top width="100%" src={require('../../../site-specs/sliced-images/hotel-resort-03.png')} alt="Card image cap" />
									<CardBody style={{padding: '6px 23px 6px 16px', display: '-webkit-box'}}>
									<div className="col-sm-8">
										<h4 style={{marginBottom: '6px'}}>Hunza Valley</h4>
										<p style={{marginBottom: '6px', fontWeight: '200', fontSize: '14px'}}>Starting Price <span style={{color: '#e3530d'}}>Rs.3000+</span></p>
									</div>
										<button style={{backgroundColor: '#00b3b3', color: 'white', border: 'none', marginTop: '5px'}} className="btn btn-lg btn-primary">Book Now</button>
										</CardBody>
								</Card>
							</div>
						</div>
					</div>
					</div>

					<div className="container">
						<div className="row" style={{marginTop: '10px'}}/> 
						<h1>Top Traveller Packages by Tour Guide</h1>
						<p style={{marginBottom: '35px'}}>Discover places with one of these popular guides</p>
						<div className="col-sm-12 no-padding">
							<div style={{background: `url(${require('../../../site-specs/sliced-images/traveller-package-01.png')})`, border: '1px solid #d9d9d9'}} className={`col-sm-4 ${style.featuredTile} ${style.bgDiv}`}>
								<div className={`${style.tourTileDescriptionDiv}`}>
									<p className='text-center'>3 days Trip to Hunza Valley</p>
								</div>
							</div>
							<div style={{background: `url(${require('../../../site-specs/sliced-images/traveller-package-02.png')})`, border: '1px solid #d9d9d9'}} className={`col-sm-4 ${style.featuredTile}  ${style.bgDiv}`}>
								<div className={`${style.tourTileDescriptionDiv}`}>
									<p className='text-center'>5 days Trip to Shangrilla</p>
								</div>
							</div>
							<div style={{background: `url(${require('../../../site-specs/sliced-images/traveller-package-03.png')})`, border: '1px solid #d9d9d9'}} className={`col-sm-4 ${style.featuredTile}  ${style.bgDiv}`}>
								<div className={`${style.tourTileDescriptionDiv}`}>
									<p className='text-center'>5 days Trip to Naran Kaghan</p>
								</div>
						</div>
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