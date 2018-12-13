import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import InquiryModal from 'components/InquiryModal';
import { convertPrice, convertUnit, convertSize, imgUpload, sanitize } from 'helpers';
import _ from 'lodash';
import config from 'config';

import {Popover, OverlayTrigger, Button } from 'react-bootstrap'

import Slider from 'react-slick';

import style from './style.css';
import placeholder from 'images-comingsoon.svg';


function NextArrow(props) {
  const {className, onClick} = props
  return (
    <div
      className={style.nextArrow}
      style={{...style, display: 'block', fontSize: 24, color: "#fff", backgroundColor: "rgba(0,0,0,0.4)", padding: '5px 10px', }}
      onClick={onClick}
    > ❯ </div>
  );
}

function PrevArrow(props) {
  const {className, onClick} = props
  return (
    <div
      className={style.prevArrow}
      style={{...style, display: 'block', fontSize: 24, color: "#fff", backgroundColor: "rgba(0,0,0,0.4)", padding: '5px 10px', }}
      onClick={onClick}
    > ❮ </div>
  );
}

class PropertyTile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showNumber: false
    }

    this.popupNum = null;
  }

  createMarkup() {
    return {__html: sanitize(this.props.project.description)};
  }

  stringToHTML() {
	  return <div dangerouslySetInnerHTML={this.createMarkup()} />;
	}
  handleInput(value){
    if(value < 0 || value.indexOf('-') !== -1){
      value = 0
    }
    if(value.toString().indexOf('.')!== -1){
      var index = value.toString().indexOf('.');
      value = value.toString().slice(0, index) + value.toString().slice(index + 1);
    }
    if (value.toString().length > 20) {
      value = value.toString().slice(0, 20);
    }
    return value;
  }
  showNumber(phonenumber){
    if ( this.popupNum.value == "" || this.popupNum.value == null ) {
      return false
    } else {
      document.body.click();
      document.body.style.overflow = 'unset';
      if(phonenumber && this.state.isValidPhone) {
        this.refs.overlay && this.refs.overlay.hide();
        this.refs.overlayMobile && this.refs.overlayMobile.hide();
        this.refs.overlayGrid && this.refs.overlayGrid.hide();
        
        Promise.all([
          axios.post(`${config.apiPath}/api/user/view`, {
            id: this.props.project.id,
            type: 'project',
            field: 'phone_view'
          }),
          axios.post(`${config.apiPath}/api/inquiry`, {
            type: 'phone_view',
            phone: phonenumber,
            inquireable_id: this.props.project.id,
            inquireable_type: 'project',
            user_id: this.props.project && this.props.project.agency ? this.props.project.agency.user_id: null
          })
        ]).then(response => {
          this.setState({showNumber: true});
        })
      }
    }
  }

  sendInquiry(phonenumber){
    document.body.click();
    document.body.style.overflow = 'unset';
    if(phonenumber) {
      axios.post(`${config.apiPath}/api/inquiry`, {
        type: 'request_info',
        phone: phonenumber,
        inquireable_id: this.props.entityId,
        inquireable_type: this.props.entityType,
      })  
    }
  }

  render() {
    var { project, grid } = this.props;

    var settings = {
      className: "slickInner",
      infinite: false,
      slidesToScroll: 1,
      variableWidth: true,
      swipeToSlide: true,
      speed: 300,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    }

    var popoverNumber = (
      <div className={style.numberPopCont}>
        <div className={`${style.numberPop}`}>
          <Popover bsClass={`${style.numberPopup}`} id="popover-number">
            <img className={`${style.numberPopupClose}`} src={require('cross.svg')} onClick= {() => {document.body.click(); document.body.style.overflow = 'unset'}} />
            <div className='text-center row no-margin'>
              <div className={`row no-margin`}>
                <div style={{width: '100%', padding: '20px 0', }}>
                  <div className="img-responsive" style={{
                    background: `url(${require('view-number.svg')})`,
                    backgroundSize: "contain",
                    width: "100%", height: "70px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }} />
                </div>
                <h4 className='text-center'>Enter Phone Number</h4>
                <p>Enter your phone number to reveal contact information.</p>
                <p>Our Representative will call you with details</p>
              </div>
              <div className="row no-margin" style={{position:"relative",}}>
                <div className={`col-sm-12 col-xs-12 ${style.paddingChange}`}>
                  <div>
                    <div className="col-xs-10 no-padding">
                    <input tabIndex='1' type="number" required className={style.noFocus} placeholder="Your Number"
                    ref={el => {this.popupNum = el}}
                    onChange={(e)=>{this.setState({phonenumber:e.target.value,isValidPhone:e.target.checkValidity()}); e.target.value = this.handleInput(e.target.value);}}
                    onKeyDown={e => {e.target.value = e.target.value === '' ? '' : this.handleInput(e.target.value); }}
                    onKeyPress={e=> (e.keyCode === 13||e.which === 13) ? this.showNumber(this.state.phonenumber):null}
                    style={{width: "100%", borderRadius: 0, padding: 8, margin:"10px 0 0", border: "1px solid #eee", }} 
                    onInput={(e) => {if (e.target.value.length > e.maxLength) {e.target.value = e.target.value.slice(0, e.maxLength)} }} maxLength = "6"  pattern="\d*"/>
                    </div>
                    <div className="col-xs-2 no-padding">
                      <div className={`${style.phoneIconWrapper} text-center`}>
                        <i className="fa fa-mobile fa-2x red"></i>
                      </div>
                    </div>
                  </div>
                  <Button id={`${project.name}`} type='submit'
                    onClick= {() => {this.showNumber(this.state.phonenumber); this.setState({popover: false})} }
                    style={{
                    margin: "5px auto 10px auto", padding: 8, width: "100%",
                    backgroundColor: "#ef5350", color: "#fff", border: "none",
                    borderRadius: 0,
                  }}>Get Number</Button>
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    );
    var popoverInquiry = (
      <div className={style.inquiryPopCont}>
        <div className={`${style.inquiryPop}`}>
          <Popover bsClass={`${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={project.agency} Inquiry_user_id={project && project.agency ? project.agency.user_id: false} entityId={project.id} entityType="project" />
          </Popover>
        </div>
      </div>
    );

  //   var minArray = (project) ? ((project.area_rates && project.area_rates.length) ? project.area_rates.map((rate,index) => {return rate.min_price}) : []) : []
		// var maxArray = (project) ? ((project.area_rates && project.area_rates.length) ? project.area_rates.map((rate,index) => {return rate.max_price}) : []) : []
		var minArray = (project && project.project_listings && project.project_listings.length) ? (project.project_listings.map((listing,index) => {return parseInt(listing.min_price)})) : [];
    var maxArray = (project && project.project_listings && project.project_listings.length) ? (project.project_listings.map((listing,index) => {return parseInt(listing.max_price)}))  : [];
    var minValue = _.min(minArray);
    var maxValue = _.max(maxArray);
    return (
      <div className={`panel panel-default ${style.getboxshadow} ${style[this.props.type]} ${grid ? style.grid : ''}`} style={{marginBottom: 30, border: `${this.props.type == "project" ? "2px solid #444" : ""}`,
      maxHeight: this.props.isMobile ? "500px" : "472px" 
      }}>
        <div className={style.header}>
          <p className={`space-0 ${style.typolist}`}></p>
          <div className={`text-center ${style.verifiedlistings}`}>
            <div className={`${style.verifytick}`}>
            <img src={require('tick.png')} className="img-responsive" alt="Tick"/></div>
            <p>Verified</p>
          </div>
        </div>
        <div className="clearfix">

          {/* desktop version */}

          {grid ? (
            <div className={`hidden-xs`}>
              {project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length > 1 ? (
                <div>
                  <Slider {...settings}>
                  {project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).map(
                    (image, index) => {
                      return (<div key={index} onClick={()=>this.props.dispatch(push(`/project/${project.id}/${project.name.split(' ').join('-').split('/').join('-')}`))} className={style.slickTile} style={{
                        background:`url(${imgUpload(image.url, 'h_250')}) center center / cover no-repeat`,
                        height: "200px", cursor:'pointer',
                      }}></div>)
                    }
                  )}
                  </Slider>
                </div>
              ) : ( project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length > 0 ? (
                  <div onClick={()=>this.props.dispatch(push(`/project/${project.id}/${project.name.split(' ').join('-').split(' ').join('-').split('/').join('-')}`))} style={{
                    background:`url(${imgUpload(project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover'))[0].url, 'h_250')}) center center / cover no-repeat`,
                    height: "200px", cursor:'pointer',
                  }}></div>
                ) : ( 
                  <div style={{
                    background: `url(${placeholder})`, height: "200px", backgroundColor: '#f5f5f5',
                    backgroundSize: "68% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                  }}></div>
                )
              )}
            </div>
          ) : (
            <a href={`/project/${project.id}/${project.name.split(' ').join('-').split('/').join('-')}`}>
              <div className={`hidden-xs`}>
                <div className={`${style.tileImages} col-sm-7 no-padding`}>
                  <div className={`${style.imageContainer} ${style.separator}`}
                  style={{
                    backgroundImage: `url(${project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length ? imgUpload(project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover'))[0].url, 'h_250') : placeholder})`,
                    backgroundSize: `${project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length ? '' : '68% auto'}`, backgroundColor: '#f5f5f5',
                  }}>
                  </div>
                  <div className={`col-sm-4 no-padding ${style.sideImages} hidden-xs`}>
                    <ul className="list-unstyled space-0">
                      {project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length > 2 ? (
                        project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).map(
                          (image, index) => (index && index < 3) ? (
                              <li key={index} style={{backgroundImage: `url(${imgUpload(image.url, 'h_250')})`, }}></li>
                          ) : null
                        )
                      ) : (
                        project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length == 2 ? (
                          <div>
                            <li style={{backgroundImage: `url(${imgUpload(project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover'))[1].url, 'h_250')})`, height: 124, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", }}></li>
                            <li style={{backgroundImage: `url(${placeholder})`, backgroundColor: '#f5f5f5', height: 124, backgroundSize: "68% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center", }}></li>
                          </div>
                        ) : (
                          <div>
                            <li style={{backgroundImage: `url(${placeholder})`, backgroundColor: '#f5f5f5', height: 124, backgroundSize: "68% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center", borderBottom: "1px solid #fff", }}></li>
                            <li style={{backgroundImage: `url(${placeholder})`, backgroundColor: '#f5f5f5', height: 124, backgroundSize: "68% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center", }}></li>
                          </div>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* mobile version */}

          <div className={`visible-xs`}>
            {project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).length > 0 ? (
              <Slider {...settings} ref={slider => this.slider = slider }>
              {project.area_resources.filter(image => (image.type == 'image' || image.type == 'cover')).map(
                (image, index) => {
                  return (<div key={index} className={style.slickTile}
                   onClick={()=>this.props.dispatch(push(`/project/${project.id}/${project.name.split(' ').join('-').split('/').join('-')}`))}
                    style={{
                    background:`url(${imgUpload(image.url, 'h_250')}) center center / cover no-repeat`,
                    height: "200px", cursor: 'pointer',
                  }}></div>)
                }
              )}
              </Slider>
            ) : (
              <div style={{
                background: `url(${placeholder})`, height: "200px", backgroundColor: '#f5f5f5',
                backgroundSize: "68% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center",
              }}>
              </div>
            )}
          </div>

          <div className={`${style.details} col-sm-12 col-xs-12`} style={{borderLeft: `${grid ? "" : "1px solid #ddd"}`, borderTop: `${grid ? "1px solid #ddd" : ""}`}}>
            <div className={`${style.logoTitleCont} row`}>
              {
                project.marketedBy && !project.show_developer ? 
                  <div className={`${style.logoCont}`}>
                    <a href={`/agency/${project.agency.id}/${project.agency.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
                      <div className={`${style.agencyLogo}`} style={{ background: `url('${imgUpload(project.marketedBy.logo, 'h_250', false)}')`, }} />
                    </a>
                  </div>

                  :
                
                (
                project.agency ? (
                  <div className={`${style.logoCont}`}>
                    <a href={`/agency/${project.agency.id}/${project.agency.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
                      <div className={`${style.agencyLogo}`} style={{ background: `url('${imgUpload(project.agency.logo, 'h_250', false)}')`, }} />
                    </a>
                  </div>
                ) : null
              )
              }
              <div className={`${style.titleCont} col-sm-9 col-xs-9`}>
                <a href={`/project/${project.id}/${project.name.split(' ').join('-')}`}>
                  <h4 className={`space-0 ellipses-2`} dangerouslySetInnerHTML={{__html: sanitize(project.name)}}></h4>
                </a>
                {/*<p className={`space-0 text-ellipsis`}>{project.agency.name.replace(/\b\w/g, l => l.toUpperCase())} </p>*/}
                {project.projectArea ? 
                <a href={`/area/${project.projectArea.id}/${project.projectArea.name.split(' ').join('-').split(',').join('').split('/').join('-').toLowerCase()}`}>
                  <p className={`space-0 greenHover text-ellipsis`}>{project.projectArea ? `${project.projectArea.name.replace(/\b\w/g, l => l.toUpperCase())},` : ''} {project.projectArea.city.name.replace(/\b\w/g, l => l.toUpperCase())} </p>
                </a>:
                  <p className={`space-0 text-ellipsis`} style={{color: "#aeaeae"}}>{project.projectArea ? `${project.projectArea.name.replace(/\b\w/g, l => l.toUpperCase())},` : ''} {project.projectArea.city.name.replace(/\b\w/g, l => l.toUpperCase())} </p>
                }
                {/* <p className="gray small">{property.bed ? `${property.bed} bed`:''}{property.bath ? `,${property.bath} baths` : ''}</p> */}
              </div>
            </div>
            <a href={`/project/${project.id}/${project.name.split(' ').join('-').split('/').join('-')}`}>
              <div className={`${style.description} ellipses-6`}>{this.stringToHTML()}</div>
            </a>
            <p className={`small text-ellipsis ${style.addedBy}`}>Added on <strong>{moment(project.created_at).format('LL')}</strong></p>
          </div>
        </div>

        {/* mobile footer */}

        <div className={`clearfix visible-xs ${style.footer}`}>
          <div className={`col-xs-12 no-padding`}>
            <OverlayTrigger ref="overlayMobile" trigger="click" rootClose={true} placement="top" overlay={popoverNumber} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
              <button className={`btn btn-default`} onClick={() => {this.setState({popover: true}) }} style={{width: "50%",}}>
                <div className={`${style.containinner}`}>
                  {this.state.showNumber ?
                    // project.marketedBy && !project.show_developer ?
                    //   <p>{project.marketedBy.phone}</p>
                    //   : project.show_developer ?
                    //   <p>{project.agency.phone}</p>
                    //   : <p>{project.phone || project.agency.phone}</p>
                    project.phone ? 
                    <p>{project.phone}</p>
                    : (
                      project.marketedBy && !project.show_developer ?
                      <p>{project.marketedBy.phone}</p>
                      : <p>{project.agency.phone}</p>
                    )
                  : (
                    <div>
                      <img src={require('phone.png')} className="img-responsive" alt="Phone Icon"/>
                      <p>View Number</p>
                    </div>
                  )}
                </div>
              </button>
            </OverlayTrigger>
            <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={popoverInquiry} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
              <button className={`btn btn-default ${style.mobilesize}`} style={{borderLeft: '1px solid #ddd', overflow: 'hidden', width: "50%",}}>
                <div className={`${style.containinner}`}>
                  <img src={require('mail.png')} className="img-responsive" alt="Email Icon"/>
                  <p>Send Inquiry</p>
                </div>
              </button>
            </OverlayTrigger>
          </div>
          <div className={`col-xs-12 no-padding ${style.priceContainer}`}>
            <div className={`${style.price}`}>
              { minValue && maxValue ?
              <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {this.props.currency} {minValue ? convertPrice(minValue, this.props.currency, this.props.currencyRates): 'N/A'} - {maxValue ? convertPrice(maxValue, this.props.currency, this.props.currencyRates) : 'N/A'}
              </p> : 
              <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Contact For Price</p>
              }
            </div>
          </div>
        </div>

        {/* desktop footer */}

        <div className={`clearfix ${style.footer} hidden-xs`}
        style={{borderBottom: `${grid ? "0" : (this.props.type == "project" ? "" : (this.props.type == "megaProject" ? "2px solid #ef5350" : "2px solid #26a59a"))}`}}>

        {/* grid changes */}

        {grid ? (
          <div>
            <div className={`col-sm-12 no-padding`}>
              <OverlayTrigger ref="overlay" trigger="click" rootClose={true} placement="top" overlay={popoverNumber} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
                <button className={`btn btn-default`} onClick={() => {this.setState({popover: true})}}
                style={{borderTop: '1px solid #dddddd', borderBottom: '1px solid #dddddd', borderRight: `${grid ? '1px solid #ddd' : ''}`, width: "50%",}}>
                  <div className={`${style.containinner}`}>
                    {/* <i className="fa fa-phone fa-lg"></i> */}
                    {this.state.showNumber ?
                      // project.marketedBy && !project.show_developer ?
                      //   <p>{project.marketedBy.phone}</p>
                      //   : project.show_developer ?
                      //   <p>{project.agency.phone}</p>
                      //   : <p>{project.phone || project.agency.phone}</p>
                      project.phone ? 
                    <p>{project.phone}</p>
                    : (
                      project.marketedBy && !project.show_developer ?
                      <p>{project.marketedBy.phone}</p>
                      : <p>{project.agency.phone}</p>
                    )
                    : (
                      <div>
                        <img src={require('phone.png')} className="img-responsive" alt="Phone Icon"/>
                        <p>View Number</p>
                      </div>
                    )}
                  </div>
                </button>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={popoverInquiry} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
                  <button className={`btn btn-default`} style={{borderTop: '1px solid #dddddd', borderBottom: '1px solid #dddddd', overflow: 'hidden', width: "50%", }}>
                  <div className={`${style.containinner}`}>
                    <img src={require('mail.png')} className="img-responsive" alt="Email Icon"/>
                    <p>Send Inquiry</p>
                  </div>
                </button>
              </OverlayTrigger>
            </div>
            <div className={`col-sm-12 no-padding ${style.priceContainer}`}>
              <div className={`${style.price}`}>
              { minValue && maxValue ?
                <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {this.props.currency} {minValue ? convertPrice(minValue, this.props.currency, this.props.currencyRates): 'N/A'} - {maxValue ? convertPrice(maxValue, this.props.currency, this.props.currencyRates) : 'N/A'}
                </p> : 
                <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Contact For Price</p>
                }
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`col-sm-7 no-padding ${style.priceContainer}`}>
              <div className={`${style.price}`}>
              { minValue && maxValue ?
                <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {this.props.currency} {minValue ? convertPrice(minValue, this.props.currency, this.props.currencyRates): 'N/A'} - {maxValue ? convertPrice(maxValue, this.props.currency, this.props.currencyRates) : 'N/A'}
                </p> : 
                <p className='no-margin' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Contact For Price</p>
              }
              </div>
            </div>
            <div className={`${style.buttonWrapper} col-sm-5 no-padding`}>
              {/* <div className="col-sm-4"> { property.agency ? <img src={property.agency.logo } className="logo"/> : null } </div > */}
              <OverlayTrigger ref="overlayGrid" trigger="click" rootClose={true} placement="top" overlay={popoverNumber} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
                <button className={`btn btn-default`} onClick={() => {this.setState({popover: true})}} style={{borderLeft: '1px solid #ddd', width: "50%", }}>
                  <div className={`${style.containinner}`}>
                    {/* <i className="fa fa-phone fa-lg"></i> */}
                    {this.state.showNumber ?
                      // project.marketedBy && !project.show_developer ?
                      //   <p>{project.marketedBy.phone}</p>
                      //   : project.show_developer ?
                      //     <p>{project.agency.phone}</p>
                      //   : <p>{project.phone || project.agency.phone}</p>
                      project.phone ? 
                    <p>{project.phone}</p>
                    : (
                      project.marketedBy && !project.show_developer ?
                      <p>{project.marketedBy.phone}</p>
                      : <p>{project.agency.phone}</p>
                    )
                      : (
                      <div>
                        <img src={require('phone.png')} className="img-responsive" alt="Phone Icon"/>
                        <p>View Number</p>
                      </div>
                      )
                    }
                  </div>
                </button>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={popoverInquiry} onEnter={()=>{document.body.style.overflow = 'hidden'}}>
                <button className={`btn btn-default`} style={{borderLeft: '1px solid #ddd', overflow: 'hidden', width: "50%", }}>
                  <div className={`${style.containinner}`}>
                    <img src={require('mail.png')} className="img-responsive" alt="Email Icon"/>
                    <p>Send Inquiry</p>
                  </div>
                </button>
              </OverlayTrigger>
            </div>
          </div>
        )}

        </div>
      </div>
    )
  }
}
export default connect(store => {
  return {
    city: store.city,
    currency: store.user.currency,
    currencyRates: store.user.currencyRates,
		isMobile: store.user.isMobile,
  }
})(PropertyTile)
