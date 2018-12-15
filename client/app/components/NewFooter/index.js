import React, { Component } from 'react';

import style from './style.css'; 

class Footer extends Component {
  render() {
    return(
        <div className={`container ${style.footer}`}>
          <div className="col-sm-4">
          <img style={{paddingTop: '7px'}} src={require('../../../site-specs/sliced-images/logo-footer.png')}></img>
          </div>
        <div className="col-sm-8">
          <div className="col-sm-2"></div>
          <div className="col-sm-10" style={{marginTop: '25px'}}> 
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Home </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Rooms </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Pages </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Blog </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Portfolio </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Shop </a>
              <a style={{fontSize: '18px', paddingRight: '35px'}} href="mailto:bookings@roomy.pk" target="new"> Elements </a>
          </div>
        </div>
  </div>
    )
  }
}

export default Footer;
