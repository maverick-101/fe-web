import React from 'react'
import { connect } from 'react-redux'
import HotelPackageTile from 'components/HotelPackageTile';
import axios from 'axios';
import 'react-select/dist/react-select.css'
import _ from 'lodash'
import style from './style.css'
import RecommendationTile from 'components/RecommendationTile';


import config from 'config'


class About extends React.Component {
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
        <div className={`${style.aboutCover} bgDiv space-8`} style={{background: `url(${require('terms_cover.jpg')})`}}>
          <h5 className={style.heading}>Terms | Contact Us</h5>
        </div>
        <div className='container'>
          <div className='col-sm-12 space-4'>
            <h3>About Us</h3>
            <p>Amet velit ea veniam ullamco excepteur do nisi. Cillum pariatur laboris Lorem dolore ut dolore esse aute tempor enim dolor aliqua consequat proident. Enim quis nisi reprehenderit dolore tempor aute pariatur. Ex aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Amet velit ea veniam ullamco excepteur do nisi. Aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Cillum pariatur laboris Lorem dolore ut dolore esse aute tempor enim dolor aliqua consequat proident. Enim quis nisi reprehenderit dolore tempor aute pariatur. Ex aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Occaecat aliquip officia aute pariatur exercitation duis velit. Tempor cupidatat sunt adipisicing minim tempor cupidatat qui esse mollit ullamco. </p>
            <p>Mollit culpa aute proident dolor elit enim exercitation consectetur id do qui. Sunt sunt ut est qui eu qui sit.</p>
            <p>Amet velit ea veniam ullamco excepteur do nisi. Cillum pariatur laboris Lorem dolore ut dolore esse aute tempor enim dolor aliqua consequat proident. Enim quis nisi reprehenderit dolore tempor aute pariatur. Ex aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Amet velit ea veniam ullamco excepteur do nisi. Aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Cillum pariatur laboris Lorem dolore ut dolore esse aute tempor enim dolor aliqua consequat proident. Enim quis nisi reprehenderit dolore tempor aute pariatur. Ex aliqua laborum non reprehenderit. Exercitation elit nulla pariatur magna ut exercitation cupidatat reprehenderit. Do sunt ad do sit duis proident id duis Lorem fugiat eiusmod. Mollit quis aliquip consectetur do amet qui laborum in magna proident mollit nulla deserunt.</p>
            <p>Occaecat aliquip officia aute pariatur exercitation duis velit. Tempor cupidatat sunt adipisicing minim tempor cupidatat qui esse mollit ullamco. </p>
          </div>
          {/* <div className='col-sm-6  space-4'>
            <iframe width="100%" height="400" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${'33.720021'},${'73.0720398'}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
          </div> */}
          <div className='space-8'></div>
          { 
            this.state.locations.length ?
            <div className="container col-sm-12 space-4">
              <h3 className={'no-margin-bottom'}>Recommended Locations for you</h3>
              <p className='space-4'>We recommend you visit these places</p>
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
		)
  }
}

export default connect(store => {
	return {
	}
})(About)