import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'
import placeholder from 'no-image.jpg';
import StarRatings from 'react-star-ratings';
import { imgUpload } from '../../helpers'


class Tile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <a href={`/experience/${this.props.data.ID}`}>
      <div className='text-left' style={{marginBottom: '30px', width:'100%', minWidth: '200px'}}>
        <div className={`${style.experiencePackagesTile}`}>
          <div className={`bgDiv ${style.experiencePackagesImg}`} style={{background:`url(${this.props.data.gallery && this.props.data.gallery.length ? imgUpload(this.props.data.gallery[0].url, 'h_400') : placeholder })` }}>
          </div>
          <div className={style.experiencePackagesText}>
            <div className='col'>
              <h5 className='text-capitalize' style={{marginBottom: '0px'}}>{this.props.data.experience_title}</h5>
              {/* <p style={{marginBottom: '6px'}}>{this.props.data.reviews}</p> */}
              <p style={{marginBottom: '6px', display: 'inline-block', fontSize: '14px'}}>
                {this.props.data.star_rating.toFixed(1)}&nbsp;&nbsp;
                <div style={{display: 'inline-block'}}>
                <StarRatings
                rating={this.props.data.star_rating}
                starRatedColor="#e3530d"
                numberOfStars={5}
                starDimension="15px"
                starSpacing="0px"
                svgIconViewBox={'0 0 20 20'}
                gradientPathName={window.location.pathname}
                svgIconPath="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
                name='rating'
              />
              </div>
              </p>
            </div>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile
