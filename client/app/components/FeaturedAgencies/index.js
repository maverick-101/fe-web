import React from 'react';
import { Link } from 'react-router';
import Fader from 'components/Fader';
import axios from 'axios';
import {imgUpload} from 'helpers';

import style from './style.css';

class Logo extends React.Component {
  getFileExtension(fname) {
    return fname ? fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1) : null
  }
  render() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const isWebkit = isChrome || isSafari;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    return (
      <div style={{margin: "10px 0"}}>
      {this.props.agency ?
        <a className={style.boxLink} id={`${this.props.agency && this.props.agency.name ? this.props.agency.name : ''}`} href={`/agency/${this.props.agency.id}/${this.props.agency.name.split(" ").join("-").split('/').join('-').toLowerCase()}`}>
          <div
            className={isFirefox ? style.mozillaWebKitMaskBox : style.webKitMaskBox}
            style={{
              backgroundImage: !isWebkit || this.getFileExtension(this.props.agency.logo) !== 'png' ? `url(${imgUpload(this.props.agency.logo, 'h_100', false)})` : '',
              WebkitMaskBoxImage: isWebkit && this.getFileExtension(this.props.agency.logo) === 'png' ? `url(${imgUpload(this.props.agency.logo, 'h_100', false)})` : '',
            }}
          />
          <img alt={this.props.agency.name} className={style.logo} src={imgUpload(this.props.agency.logo, 'h_100', false)}/>
        </a> : null
      }
      </div>
    )
  }
}

export default class FeaturedAgencies extends React.Component {
  render() {
    if (!this.props.agencies || !this.props.agencies.length) {
      return null;
    }
    return (
      <div className="clearfix text-center">
        <div className={style.sliderWrapper}>
          <Fader width={window.innerWidth > 767 ? 140 : 100 } maxWidth={1550} items={this.props.agencies.map((val, index) => <Logo agency={val.entity}/>)}/>
        </div>
      </div>
    );
  }
}
