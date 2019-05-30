import React, { Component } from 'react';

import style from './style.css'; 

class Footer extends Component {
  render() {
    return(
        <div className={`container text-center ${style.footer}`}>
          <div className="text-center col-sm-4">
          <img style={{paddingTop: '20px'}} src={require('../../../site-specs/sliced-images/logo-footer.png')}></img>
          </div>
        <div className="text-right hidden-xs col-sm-8">
          {/* <div className="col-sm-2"></div> */}
          <div className="text-right col-sm-12" style={{marginTop: '35px'}}> 
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/" target="new"> Home </a>
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/hotels" target="new"> Hotels </a>
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/packages" target="new"> Packages </a>
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/events" target="new"> Events </a>
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/blog" target="new"> Blog </a>
              <a style={{fontSize: '18px', margin: '15px'}} className={style.footerLinks} href="/contactUs" target="new"> Contact Us </a>
          </div>
        </div>
  </div>
    )
  }
}

export default Footer;
