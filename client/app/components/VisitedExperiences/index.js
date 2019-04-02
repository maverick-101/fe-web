import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'
import placeholder from 'no-image.jpg';

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
                {this.props.data.star_rating} &nbsp;
                <i style={{color: '#00b3b3'}} className="fa fa-star"></i>
                <i style={{color: '#00b3b3'}} className="fa fa-star"></i>
                <i style={{color: '#00b3b3'}} className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
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
