import React, { Component } from 'react';

import style from './style.css'; 

class Footer extends Component {
  render() {
    return(
        <div className={`container text-center ${style.footer}`}>
          <div className="col-sm-4">
          <img style={{paddingTop: '7px'}} src={require('../../../site-specs/sliced-images/logo-footer.png')}></img>
          </div>
        <div className="col-sm-8">
          {/* <div className="col-sm-2"></div> */}
          <div className="col-sm-12" style={{marginTop: '25px'}}> 
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> HOME </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> ROOMS </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> PAGES </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> BLOG </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> PORTFOLIO </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> SHOP </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> ELEMENTS </a>
          </div>
        </div>
  </div>
    )
  }
}

export default Footer;
