import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'
import placeholder from 'no-image.jpg';
import StarRatings from 'react-star-ratings';

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
          <div className={`bgDiv ${style.experiencePackagesImg}`} style={{background:`url(${this.props.data.gallery.length ? this.props.data.gallery[0].url : placeholder })` }}>
          </div>
          <div className={style.experiencePackagesText}>
            <div className='col'>
              <h5 style={{marginBottom: '6px'}}>{this.props.data.experience_title}</h5>
              {/* <p style={{marginBottom: '6px'}}>{this.props.data.reviews}</p> */}
              <p style={{marginBottom: '6px'}}>
                {this.props.data.star_rating}&nbsp;Stars
                <div>
                <StarRatings
                rating={this.props.data.star_rating}
                starRatedColor="#e3530d"
                numberOfStars={5}
                starDimension="20px"
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
