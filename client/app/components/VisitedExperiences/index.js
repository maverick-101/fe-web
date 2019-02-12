import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'

class Tile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div className='col-sm-3 inline-block' style={{marginBottom: '30px', minWidth: '200px'}}>
        <div className={`${style.experiencePackagesTile}`}>
          <div className={`${style.bgDiv} ${style.experiencePackagesImg}`} style={{background:`url(${this.props.data.url})` }}>
          </div>
          <div className={style.experiencePackagesText}>
            <div className='col'>
              <h5 style={{marginBottom: '6px'}}>{this.props.data.name}</h5>
              <p style={{marginBottom: '6px'}}>{this.props.data.reviews}</p>
              <p style={{marginBottom: '6px'}}>
                {this.props.data.rating} &nbsp;
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
    )
  }
}

export default Tile
