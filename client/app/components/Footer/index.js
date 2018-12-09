import React from 'react';
import { connect } from 'react-redux';
import {Carousel} from 'react-bootstrap'
import { Link } from 'react-router'
import {checkForHttps, imgUpload, sanitize} from 'helpers'
import style from './style.css';
import bottomImage from 'mall.jpg';
import config from 'config';
import Cookies from 'js-cookie'
import placeholder from 'no-image.jpg';
import googleAppStore from 'google-play.png';
import appleAppStore from 'appstore.png';
import {Popover, OverlayTrigger, Button } from 'react-bootstrap'

import { DropdownButton, MenuItem } from 'react-bootstrap'
import { unitChange, currencyChange } from 'actions/user'


import axios from 'axios';


class AreaOrCityDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    
  }
  render() {
    const { city, area, query } = this.props;
    let { purpose, type, subtype } = query;
    let title = ''
    if(purpose === 'sale'){
      purpose = 'Buying'
    } else {
      purpose = 'Renting'
    }
    if(subtype){
        const upper = Array.isArray(subtype) ? type : subtype;
        title += upper ? ` ${upper.toString()}` : '';
      }
    if( type !== 'plot' && (!subtype || (Array.isArray(subtype) && subtype.length !== 1))){
      title += ` Properties`
    }
    title = titleCase(title);
    return (
      this.props.isMobile && this.props.prebootFlag ? <div className="row hidden-xs" style={{margin: "30px 0 0", padding: '50px 0 70px', background: '#f5f5f5', borderTop: '1px solid #eee', }}>
        <div className="container">
        {city && city.id ? (area && area.id ? <div className="col-sm-12">
            <div className={style.descriptionImg} style={{background: `url(${ imgUpload("https://res.cloudinary.com/graanacom/image/upload/v1535442386/photo-1512699355324-f07e3106dae5.jpg", 'h_250') })`, }}></div>
            <div style={{width: 'calc(100% - 220px)', float: 'left', padding: '0 25px', }}>
              <h2 style={{marginTop: 0, fontSize: 20 }}>Things You Need To Know Before {purpose} {title} in {area.name}</h2>
              <div dangerouslySetInnerHTML={{__html: sanitize(area.description)}}></div>
            </div>
          </div> : <div className="col-sm-12">
            <div className={style.descriptionImg} style={{background: `url(${city.city_resources && city.city_resources.length ? imgUpload(city.city_resources[0].url, 'h_250') : placeholder})`, }}></div>
            <div style={{width: 'calc(100% - 220px)', float: 'left', padding: '0 25px', }}>
              <h2  style={{marginTop: 0, fontSize: 20 }}>Things You Need To Know Before {purpose} {title} in {city.name}</h2>
              { city.description ? <div dangerouslySetInnerHTML={{__html: sanitize(city.description)}}></div> : 
                <React.Fragment>
                  <p>
Lorem ipsum dolor sit amet, et eius delectus sed, affert dolorum dolores has an. Quo esse elitr et. Dicat soluta viderer eu mea, sit aeterno scribentur at, vel pericula contentiones eu. Eu pro habeo meliore ponderum, eam eu homero epicuri, in quaeque copiosae his. At pro esse dolorum meliore. Sit elaboraret consequuntur at, ad iudico oratio ius.
                  </p>
                  <p>
Ei sit quod solet, ne soleat patrioque vulputate usu. Cetero audiam alienum pro eu, eu has graeci feugiat placerat. Dissentias necessitatibus at vis, ex altera debitis reprehendunt vix. Nihil ubique eu mea, nobis labore sadipscing vis ut, cum quem mollis in. His et euripidis urbanitas.
                  </p>
                  <p>
Eum voluptua conclusionemque at, mel ea persius equidem tractatos. Vis in pericula hendrerit, id vix vide ancillae principes, stet nulla voluptatum vix cu. Iracundia honestatis ex mea, qui quem essent te. Sit eu fuisset sapientem.
                  </p>
                </React.Fragment>
              }

            </div>
          </div>) : (<React.Fragment>
            <div className={style.descriptionImg} style={{background: `url("https://res.cloudinary.com/graanacom/image/upload/v1537856544/Pak_Intro_edited.jpg")` }}></div>
            <div style={{width: 'calc(100% - 220px)', float: 'left', padding: '0 25px', }}>
              <h2 style={{marginTop: 0, fontSize: 20 }}>Things You Need To Know Before {purpose} {title} in Pakistan</h2>
              <p>
              Pakistan, sitting at one of the most strategically important locations in the world, has shown signs of a rapidly burgeoning economy. Among other factors, this growth has been stimulated by the upswing of the real estate industry in the country.              </p>
              <p>
              According to Pakistan Real Estate Investment Forum President Shaban Elahi, the country receives around 40-50% of total remittances in this particular sector. Government’s own estimates, as of July 2018, showed Pakistan received $8-10 billion of total remittances of $20 billion in property and real estate sector from overseas Pakistanis.
              </p>
              <p>
              The signs for real estate in Pakistan look even more promising in the near future. The current government’s plan to construct 5 million homes in a period of five years is expected to set the wheels rolling for the real estate industry. This is complemented by the ongoing China Pakistan Economic Corridor (CPEC); political stability; and push towards improvements implementation of laws and regulations.              </p>
            </div>
          </React.Fragment>)
        }
        </div>
      </div> : null
    );
  }
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footer: [],
      showLove: 0
    }
  }
  componentWillMount() {
    axios.get(`${config.apiPath}/api/coverFooter/footers`)
        .then((response) => {
          this.setState({footer: response.data.items})
        })
  }
  changeCurrency(currency) {
		Cookies.set('currency', `${currency}`, {domain: config.domain})
    this.props.dispatch(currencyChange(currency))
  }
	changeUnit(unit) {
		Cookies.set('unit', `${unit}`, {domain: config.domain})
    this.props.dispatch(unitChange(unit))
    window.location.reload()
  }
  getFileExtension(fname) {
    return fname ? fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1) : null
  }
  render() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const isWebkit = isChrome || isSafari;
    return (
      <div className={style.block}>
        {this.props.footer.searchAreasInfo ?
          <AreaOrCityDetails city={this.props.property.searchPageFooterDetails.cityFooterDetails ? this.props.property.searchPageFooterDetails.cityFooterDetails : null} area={this.props.property.searchPageFooterDetails.areaFooterDetails ? this.props.property.searchPageFooterDetails.areaFooterDetails : null} query={this.props.property.query} />
          : null
        }
        {this.props.footer.ad ?
          <Carousel prevIcon={null} nextIcon={null} indicators={false} >
          {
            this.state.footer.map(
              (footer, index) => {
                return (
                  <Carousel.Item key={index}>
                    <a id={`footer-${index}`} href={footer.link || null}>
                      <div className={style.footer} style={{background: `url(${imgUpload(footer.url, 'h_600')})`}}>
                        <div className={style.footerCaption}>
                          <p className='no-margin white'>{`${footer.agency.name ? `${footer.agency.name} - ${footer.agency.phone ? footer.agency.phone : ''}` : '' }`}</p>
                        </div>
                      </div>
                    </a>
                    {footer.area && footer.area.agency && footer.area.agency.logo ?
                      <div className={`${style.infoDiv}`}>
                        <a href={footer.link ? !(/^https?:\/\//i).test(footer.link) ? `http://${footer.link}` : footer.link : '#'} className={`${style.detailsText} text-center white`}>{footer.area ? footer.area.name : ''}</a>
                        {/* <img alt='graana home banner' className={style.projectLogo} src={`https://res.cloudinary.com/graanacom/image/upload/${cover.area.area_resources[0].cloudinary_public_id}`}/> */}
                        <a href={footer.link ? !(/^https?:\/\//i).test(footer.link) ? `http://${footer.link}` : footer.link : '#'}>
                          <div
                            className={style.projectLogo}
                            style={{
                              backgroundImage: !isWebkit || this.getFileExtension(footer.area.agency.logo) !== 'png' ? `url(${checkForHttps(footer.area.agency.logo)})` : '',
                              WebkitMaskBoxImage: isWebkit && this.getFileExtension(footer.area.agency.logo) === 'png' ? `url(${checkForHttps(footer.area.agency.logo)})` : '',
                            }}
                          />
                        </a>
                        {/*<img alt='graana footer banner' className={style.projectLogo} src={footer.area.agency.logo}/>*/}
                      </div> : null
                    }
                  </Carousel.Item>
                )
              }
            )
          }
          </Carousel> : null
        }
        <hr style={{marginTop: 0, borderTopColor: '#eaeaea',}}/>
        <div className="container">
          <div className="row">
            {/* <div className='row hidden'>
              <div className='col-xs-6'>
                <div className={`footerDropdown col-xs-12 no-padding-right`}>
                  <DropdownButton style={{width:'100%', marginRight:'10px', padding: '7px 10px', textTransform: "capitalize", }}  onSelect={(unit) => {this.changeUnit(unit)}} title={`Unit: ${this.props.user.unit}`} id="dropdown-size-medium">
                    {
                      ['standard', 'sqft', 'sqyd','sqm','marla','kanal'].map((unit, index) =>
                        <MenuItem key={index} className='text-capitalize' eventKey={unit}>{unit}</MenuItem>
                      )
                    }
                    </DropdownButton>
                </div>
              </div>
              <div className='col-xs-6'>
                <div className='footerDropdown col-xs-12 no-padding-left'>
                  <DropdownButton style={{width:'100%', marginRight:'10px', padding: '7px 10px', textTransform: "capitalize", }}  onSelect={(currency) => {this.changeCurrency(currency)}} title={`Currency: ${this.props.currency}`} id="dropdown-size-medium">
                    {
                      ['PKR','AED','AUD','CAD','CNY','EUR','GBP','JPY','SAR','USD'].map((currency, index) =>
                        <MenuItem key={index} eventKey={currency}>{currency}</MenuItem>
                      )
                    }
                    </DropdownButton>
                </div>
              </div>
              <div className='col-xs-12'>
                <hr />
              </div>
            </div> */}
            {!this.props.isMobile && this.props.prebootFlag ? <div className="col-sm-4 col-xs-12 hidden-xs">
              <h4 className="gothicHeading black">About Us</h4>
              <p style={{fontSize: 12, fontWeight: 400, }}>Welcome to Graana.com - Pakistan’s Smartest Property Portal!<br />
              For more than a decade our intention has been to revolutionise the real estate industry in Pakistan. The same belief drove the vision of our real estate team, Graana; where quality beats quantity.<br />
              Graana is a result of simplified essential components of  real estate into a more efficient and user friendly portal. We are introducing an extremely transparent and purposeful portal where we will help you buy, rent, sell or even rent out your property, a place where you can sit back relax and let us market your projects and listings. We believe we have set a new standard for the future of real estate in Pakistan by providing the smartest property portal.
              </p>
              {/* <p style={{fontSize: 12, fontWeight: 400, }}>Welcome to Graana- Pakistan’s Smartest Property Portal.<br />
The right place to buy, sell or rent property you have been dreaming of!<br />
Whether you are an investor looking to invest in an opportunity that will pay you in the years to come or looking for a cozy house to call home, it is all here and better verified than anywhere else. We are here to help you search from the ideal inventory of property products carefully selected to provide the best value for your money.<br />
Graana is your first choice to select the right property product in a few clicks. 
              </p> */}
            </div> : null}
            <div className={`col-sm-2 col-xs-6 ${this.props.showFooterLinks ? '' : 'hidden-xs' }`}>
              <h4 className="black gothicHeading">Graana</h4>
              <ul className="list-unstyled">
                <li><a id="footer-about" href={"/graana/about"}>Our Story</a></li>
                <li><a id="footer-contact" href={"/graana/contact"}>Contact Us</a></li>
                <li><a id="footer-terms" href={"/graana/terms"}>Terms & Conditions</a></li>
                <li><a id="footer-policy" href={"/graana/policy"}>Privacy Policy</a></li>
                {/* <li><Link to={"/graana/sitemap"}>Sitemap</Link></li> */}
              </ul>
            </div>
            <div className={`col-sm-2 col-xs-6 ${this.props.showFooterLinks ? '' : 'hidden-xs' }`}>
              <h4 className='gothicHeading'>Quick Links</h4>
              <ul className="list-unstyled">
                <li><a id="footer-projects" href="/projects">Projects in Pakistan</a></li>
                <li><a id="footer-developers" href="/developers">Developers in Pakistan</a></li>
              </ul>
            </div>
            <div className={`col-xs-12 no-padding ${this.props.showFooterLinks ? 'visible-xs' : 'hidden' }`}>
              <hr />
            </div>
            <div className={`col-sm-4 col-xs-12 ${this.props.showFooterLinks ? '' : 'hidden-xs' }`}>
              <h4 className='gothicHeading'>Contact Us</h4>
              <ul className="list-unstyled">
                <li className="space-2">
                  <span className={style.contactIcon}>
                    <i className="fa fa-envelope-o fa-lg"></i>
                  </span>
                  <a className={`green`} href="mailto:info@graana.com" target="_blank">info@graana.com</a>
                </li>
                <li className="space-2">
                  <span className={style.contactIcon}>
                    <i className="fa fa-phone fa-lg"></i>
                  </span>
                  <span style={{marginRight: 5, }}>UAN:</span><a className={`green`} href="tel:111-555-555">111-555-555</a>
                </li>
                <li className="space-2">
                  <span className={style.contactIcon}>
                    <i className="fa fa-map-marker fa-lg"></i>
                  </span>
                  <span className={style.contactDetail}>
                    Level 5,
                    44 East Plaza,
                    Fazl ul Haq Road,
                    Blue Area,
                    Islamabad.
                  </span>
                </li>
                <li>
                  <div className="row">
                    <div className="col-xs-12">
                      <a className={`${style.appStoreLink}`} style={{ margin: '20px 5px 0 7px' }} href="https://play.google.com/store/apps/details?id=com.graanaapp&hl=en" target="_blank" rel="noreferrer noopener">
                        <img src={googleAppStore} style={{ height: '40px' }} />
                      </a>
                      <a className={`${style.appStoreLink}`} style={{ margin: '20px 0 0 0' }} href="https://itunes.apple.com/pk/app/graana/id1438849353?mt=8" target="_blank" rel="noreferrer noopener">
                        <img src={appleAppStore} style={{ height: '40px' }} />
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <hr className="hidden-xs" />
          <p className='col-sm-2 no-padding hidden-xs'><b className='gothicHeading black'>Disclaimer</b></p>
          { !this.props.isMobile && this.props.prebootFlag ? 
          <div className='col-sm-10 no-padding hidden-xs'>
            <p className='small'>Welcome to Graana.com. Our standard Terms of Use and Privacy Policy applies to all visits to, and use of, Graana.com or any services provided herein. Please note that Graana.com is not intended to provide professional, financial, legal or real-estate advice.</p>
            <p className='small'>Graana.com, its officers, affiliates, directors, employees and consultants make no representation and provide no warranty as to the accuracy or reliability of any information at Graana.com. The user, and not Graana.com, shall be liable for any direct or indirect loss, claim, damage (of whatsoever nature), loss of profits etc. in relation to the use of any information displayed at Graana.com.</p>
            <p className='small'>Please refer to our Terms of Use, the Privacy Policy and the Cookies Policy for further details.</p>
            {/* <p className='small'>Information on the graana.com should not be regarded as a substitute for professional, legal, financial or real estate advice.</p>
            <p className='small'>The directors, officers, agents and related entities of Graana.com have made their best efforts to ensure that the information contained on www.graana.com is correct. However, no warranty is made as to the accuracy or reliability of the information on the website. Graana.com disclaims all liability and responsibility for any direct or indirect injury, loss, claim, damage or any incidental or consequential damages, including but not limited to lost profits or savings arising out of or in any way connected with the use of any information displayed on its website.</p> */}
          </div>
          : null
        }
          <hr style={{width: '100%', display: this.props.showFooterLinks ? 'block' : 'none' }}/>
          <div className="row space-4">
            <div className={`${style.copyrightLogoMobile} space-1 vcenter visible-xs`}>
              <svg xmlns={`${require('logo.svg')}#onlyLogo`} id="logo" x="0px" y="0px" viewBox="0 0 222.8 222.8">
                <g>
                  <path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9      c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20      C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6      c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30      c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14      c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6      c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4      c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1      c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3      c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7      c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1      c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"></path>
                  <path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"></path>
                </g>
              </svg>
            </div>
            <div className="col-xs-12 no-padding" style={{}}>
              <div className="col-sm-6 col-xs-12 vcenter">
                <div className={`${style.copyrightLogo} vcenter text-center hidden-xs`}>
                  <svg xmlns={`${require('logo.svg')}#onlyLogo`} id="logo" x="0px" y="0px" viewBox="0 0 222.8 222.8">
                    <g>
                      <path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9      c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20      C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6      c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30      c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14      c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6      c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4      c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1      c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3      c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7      c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1      c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"></path>
                      <path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"></path>
                    </g>
                  </svg>
                </div>
                <p className='visible-xs small text-center'>Copyright &#xa9; 2018 Graana Pvt Ltd. All Rights Reserved.</p>
                { !this.props.isMobile && this.props.prebootFlag ? 
                <span className="small hidden-xs">Copyright &#xa9; 2018 Graana Pvt Ltd. All Rights Reserved.</span>
                : null
                }
              </div>
              {
                this.state.showLove > 0 && this.state.showLove % 5 == 0 ? 
                <div className='text-center'>
                  <hr/>
                  <h5>This product was made possible with the efforts of following people</h5>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Haseeb Khattak </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Yasser Zubair  </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Awais Farooq   </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Shakir Ullah   </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Summer Kiflain </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Muhtasham Nawaz</p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Zill-e-Abbas   </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Maryam Fatima  </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Faysal Kayani  </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Hammad Ahmad   </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Hamid Raza     </p>
                  <p style={{ display: 'inline-block' , padding: '5px'}}> Bilal Shafi    </p>
                  <hr/>
                </div>
                : null
              }
              <div className="col-sm-6 col-xs-12 vcenter">
                { !this.props.isMobile && this.props.prebootFlag ? 
                <div className="pull-right hidden-xs">
                <a onClick={() => {this.setState({showLove: this.state.showLove + 1 })}}  style={{marginRight: '30px', }}>
                    Made with &nbsp;<i className={`red fa ${this.state.showLove > 0 && this.state.showLove % 5 == 0 ? 'fa-heart' : 'fa-heart-o' } fa-lg`}></i>
                  </a>
                  <a href="https://www.facebook.com/GraanaCom">
                    <i className="fa fa-facebook fa-lg"></i>
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <a href="https://twitter.com/GraanaCom">
                    <i className="fa fa-twitter fa-lg"></i>
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <a href="https://www.instagram.com/graanacom/">
                    <i className="fa fa-instagram fa-lg"></i>
                  </a>
                </div>
                : null
              }
                <div className="visible-xs" style={{marginTop: '10px', }}>
                  <div className="pull-left">
                    <a onClick={() => {this.setState({showLove: this.state.showLove + 1 })}} style={{marginRight: '30px', }} to={"/graana/madewithlove"}>
                      Made with &nbsp;<i className={`red fa ${this.state.showLove > 0 && this.state.showLove % 5 == 0 ? 'fa-heart' : 'fa-heart-o' } fa-lg`}></i>
                    </a>
                  </div>
                  <div className="pull-right" style={{paddingRight: '15px', }}>
                    <a href="https://www.facebook.com/GraanaCom">
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a href="https://twitter.com/GraanaCom">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a href="https://www.instagram.com/graanacom/">
                      <i className="fa fa-instagram fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const titleCase = str => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
      if(splitStr[i] !== 'in')
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

export default connect(store => {
  return {
    footer: store.footer,
    user: store.user,
    currency: store.user.currency,
    property: store.property,
		isMobile: store.user.isMobile,
		prebootFlag: store.header.prebootFlag,
  }
})(Footer)
