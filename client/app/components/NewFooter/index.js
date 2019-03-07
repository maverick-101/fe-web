import React, { Component } from 'react';

import style from './style.css'; 

class Footer extends Component {
  render() {
    return(
        <div className={`container text-center ${style.footer}`}>
          <div className="text-left col-sm-4">
          <img style={{paddingTop: '7px'}} src={require('../../../site-specs/sliced-images/logo-footer.png')}></img>
          </div>
        <div className="text-right col-sm-8">
          {/* <div className="col-sm-2"></div> */}
          <div className="text-right col-sm-12" style={{marginTop: '25px'}}> 
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Home </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Hotels </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Packages </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Events </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Blog </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Contact Us </a>
          </div>
        </div>
  </div>
    )
  }
}

export default Footer;
