import React from 'react'
import { connect } from 'react-redux'
import HotelPackageTile from 'components/HotelPackageTile';
import axios from 'axios';
import 'react-select/dist/react-select.css'
import _ from 'lodash'
import style from './style.css'
import RecommendationTile from 'components/RecommendationTile';


import config from 'config'


class Contactus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      locations: [],
		}
		super(props);
	}

	componentDidMount() {
    this.props.done();
    axios.get(`${config.apiPath}/fetch/locations-fetch`)
		.then((response) => {
			var locations = _.shuffle(response.data && response.data.items);
			this.setState({
				locations,
			})
		})
	}

	render() {
    return (
      <div>
        <div className={`${style.aboutCover} bgDiv space-8`} style={{background: `url(${require('contact_cover.jpg')})`}}>
          <h5 className={style.heading}>Home | Contact Us</h5>
        </div>
        <div className='container'>
          <div className='col-sm-6 space-4'>
            <input type="text" className='form-input space-4' placeholder='Your name'/>
            <input type="text" className='form-input space-4' placeholder='Email'/>
            <input type="text" className='form-input space-4' placeholder='Subject'/>
            <textarea rows={5} type="text" className='form-input space-4' placeholder='Subject'/>
            <button className='btn btn-orange btn-block'>Submit</button>
          </div>
          <div className='col-sm-6  space-4'>
            <iframe width="100%" height="400" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${'33.720021'},${'73.0720398'}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
          </div>
          <div className='space-8'></div>

              <h3 className={'no-margin-bottom'}>Recommended Locations for you</h3>
              <p className='space-4'>We recommend you visit these places</p>
          <div className='horizontalScrollContainer row'>
          { 
            this.state.locations.length ?
            <div className="col-sm-12 space-4">
              <div className='row'>
                <div className={style.horizontalScrollContainer}>
                {/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items= */}
                  {this.state.locations.map((data, index) => {
                    return index <=9 ? 
                    <div id='tileCol' className='per-row-5 no-padding-right'>
                        <RecommendationTile data={data} />
                      </div>
                    : null
                  })}
                  {/* ></Fader> */}
                </div>
              </div>
            </div>
            : null
            }
            </div>
        </div>
      </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Contactus)