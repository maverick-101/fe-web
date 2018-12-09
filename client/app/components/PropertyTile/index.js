import React from 'react';
import axios from 'axios';
import moment from 'moment';
import InquiryModal from 'components/InquiryModal';
import { convertPrice, convertUnit, convertSize, imgUpload, sanitize } from 'helpers';
import config from 'config';

import { Carousel, Popover, OverlayTrigger, Button } from 'react-bootstrap'

import Slider from 'react-slick';

import style from './style.css';
import placeholder from 'images-comingsoon.svg';
import userPlaceholder from 'user.png';

// import { relative } from 'path';
import { connect } from 'react-redux';

function NextArrow(props) {
  const {onClick} = props
  return (
    <div
      className={style.nextArrow}
      onClick={onClick}
    > ❯ </div>
  );
}

function PrevArrow(props) {
  const {onClick} = props
  return (
    <div
      className={style.prevArrow}
      onClick={onClick}
    > ❮ </div>
  );
}

 class PropertyTile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showNumber: false,
      featHeight: 1,
      currentSlide: 1,
      amenitiesDataLength: 0,
    }

    this.popupNum = null;
  }
  slug(property){
  let slug = [];
  if(property.city && property.city.name !== null){
    slug.push(property.city.name.trim().split(' ').join('-').split('/').join('-'));    
   }
  if(property.area && property.area.name !== null){
    slug.push(property.area.name.trim().split('/').join('-').split(' ').join('-')); 
  }
  if(property.title !== null){
    var title = property.title.trim().split(" ");
    title.shift();
    title.shift();
    slug.push(`${parseInt(property.size)}-${property.size_unit}-${title.join("-")}`);
  }
    return `${slug.join("-").toLowerCase()}-${property.id}`;
  }

  stringToHTML(string) {
    const htmlStrippedString = string ? string.replace(/<[^>]+>/g, '').replace(/<[^>]+>/g, '') : '';
    return (<p className={`${style.description} ${style.descEllipses} no-margin`}>
      {htmlStrippedString}
    </p>);
  }
  
  featFunc() {
    if (this.state.amenitiesDataLength > 4) {
      if (this.state.featHeight == 1) {
        this.refs.propFeats.style.maxHeight = "106px";
        this.refs.propFeats.style.boxShadow = "2px 2px 4px #aaaaaacc";
        this.refs.propFeats.style.overflow = "auto";
        this.setState({featHeight: 0});
      }
      if (this.state.featHeight == 0) {
        this.refs.propFeats.style.maxHeight = "52px";
        this.refs.propFeats.style.boxShadow = "none";
        this.refs.propFeats.style.overflow = "hidden";
        this.setState({featHeight: 1});
      }
    }
  }

  renderAmenities(data) {
    let keyValues = [];
    let keyValue = Object.keys(JSON.parse(data)).forEach((key, index)=>{ keyValues.push(JSON.parse(data)[key]) });
    let keys = Object.keys(JSON.parse(data));
    let amenitiesData = [
      <div className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'none' }}>
        <p className={`${style.featType} text-ellipsis`}>Gas</p>
        <p/>
      </div>,
      <div className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'none' }}>
        <p className={`${style.featType} text-ellipsis`}>Electricity</p>
        <p/>
      </div>,
      <div className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'none' }}>
        <p className={`${style.featType} text-ellipsis`}>Water</p>
        <p/>
      </div>
    ];
    keys.map((objectNeeded, index) => {
      if(objectNeeded === 'gas' && !!keyValues[index]) {
        amenitiesData[0] = (
          <div key={index} className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'block' }}>
            <p className={`${style.featType} text-ellipsis`}>{objectNeeded.replace(/[_-]/g, " ")}</p>
            <p>{keyValues[index] === true || keyValues[index] === 'True'
            || keyValues[index] === 'TRUE' || keyValues[index] === 'Yes' || keyValues[index] === 'YES' || keyValues[index] === 'yes' ?
              (<img alt='tick' className={`${style.turnGreen}`} src={`${require('tick.png')}`}/>) : ''}</p>
          </div>
        )
      } else if (objectNeeded === 'electricity' && !!keyValues[index]) {
        amenitiesData[1] = (
          <div key={index} className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'block' }}>
            <p className={`${style.featType} text-ellipsis`}>{objectNeeded.replace(/[_-]/g, " ")}</p>
            <p>{keyValues[index] === true || keyValues[index] === 'True'
            || keyValues[index] === 'TRUE' || keyValues[index] === 'Yes' || keyValues[index] === 'YES' || keyValues[index] === 'yes' ?
              (<img alt='tick' className={`${style.turnGreen}`} src={`${require('tick.png')}`}/>) : ''}</p>
          </div>
        )
      } else if (objectNeeded === 'water' && !!keyValues[index]) {
        amenitiesData[2] = (
          <div key={index} className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`} style={{ display: 'block' }}>
            <p className={`${style.featType} text-ellipsis`}>{objectNeeded.replace(/[_-]/g, " ")}</p>
            <p>{keyValues[index] === true || keyValues[index] === 'True'
            || keyValues[index] === 'TRUE' || keyValues[index] === 'Yes' || keyValues[index] === 'YES' || keyValues[index] === 'yes' ?
              (<img alt='tick' className={`${style.turnGreen}`} src={`${require('tick.png')}`}/>) : ''}</p>
          </div>
        )
      } else if (!!keyValues[index]) {
        amenitiesData.push(
          <div key={index} className={`col-lg-3 col-sm-4 no-padding-right ${style.fixedAmenHeight}`}>
            <p className={`${style.featType} text-ellipsis`}>{objectNeeded.replace(/[_-]/g, " ")}</p>
            <p>{keyValues[index] === true || keyValues[index] === 'True'
            || keyValues[index] === 'TRUE' || keyValues[index] === 'Yes' || keyValues[index] === 'YES' || keyValues[index] === 'yes' ?
              (<img alt='tick' className={`${style.turnGreen}`} src={`${require('tick.png')}`}/>)
              : keyValues[index] !== 0 ? keyValues[index] : '' }</p>
          </div>
        )
      }
    });
    if (this.state.amenitiesDataLength !== amenitiesData.length) {
      this.setState({ amenitiesDataLength: amenitiesData.length });
    }
    return amenitiesData;
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
      Promise.all([
        axios.post(`${config.apiPath}/api/user/view`, {
          id: this.props.property.id,
          type: 'property',
          field: 'phone_view'
        }),
        axios.post(`${config.apiPath}/api/inquiry`, {
          type: 'phone_view',
          phone: phonenumber,
          user_id: this.props.property.user_id,
          inquireable_id: this.props.property.id,
          inquireable_type: 'property',
        })
      ]).then(response => {
        this.setState({showNumber: true});
      });
      document.body.click();
      document.body.style.overflow == 'hidden' ? document.body.style.overflow = 'unset' : null;
    }
  }
  getFileExtension(fname) {
    return fname ? fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1) : null
  }
  render() {
    var { property, grid } = this.props;

    var settings = {
      className: "slickInner",
      infinite: false,
      slidesToScroll: 1,
      variableWidth: true,
      swipeToSlide: true,
      speed: 300,
      nextArrow: <NextArrow className={style.nextArrow} />,
      prevArrow: <PrevArrow className={style.prevArrow}/>,
    };

    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const isWebkit = isChrome || isSafari;

    var popoverInquiry = (
      <div className={style.inquiryPopCont}>
        <div className={`${style.inquiryPop}`}>
          <Popover bsClass={`${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={property.user} Inquiry_user_id={property.user_id ? property.user_id: false} entityId={property.id} entityType="property" />
          </Popover>
        </div>
      </div>
    );
    
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
                      <input  tabIndex='1' type="number" required placeholder="Your Number"
                      ref={el => {this.popupNum = el}}
                      onChange={(e)=>{this.setState({phonenumber:e.target.value,isValidPhone:e.target.checkValidity()}); e.target.value = this.handleInput(e.target.value);}}
                      onKeyDown={e => {e.target.value = e.target.value === '' ? '' : this.handleInput(e.target.value); }}
                      onKeyPress={e=> (e.keyCode === 13||e.which === 13) ? this.showNumber(this.state.phonenumber):null}
                      style={{width: "100%", borderRadius: 0, padding: 8, margin:"10px 0 0", border: "1px solid #eee", }} 
                      onInput={(e) => {if (e.target.value.length > e.maxLength) {e.target.value = e.target.value.slice(0, e.maxLength)} }} maxLength = "6"  pattern="\d*" />
                    </div>
                    <div className="col-xs-2 no-padding">
                      <div className={`${style.phoneIconWrapper} text-center`}>
                        <i className="fa fa-mobile fa-2x red"></i>
                      </div>
                    </div>
                  </div>
                  <Button id={`${property.title}`} type='submit' onClick= {() => {this.showNumber(this.state.phonenumber)} }
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

    const AdditionalPhonesPopover = (phones) => (
      <Popover bsClass="with-arrow popover" id="popover-additional-phones" title="Additional Phone Numbers">
        {phones.length && phones.map((phone) => (
          <p className="text-center">
            <img
              style={{ display: 'inline-block', height: '15px', marginRight: 5, verticalAlign: 'text-bottom' }}
              src={require('phone.png')}
              className="img-responsive" alt="phone icon"/>
            {phone.phone}
          </p>
        ))}
      </Popover>
    );

    return (
      <div className={`panel panel-default ${style.getboxshadow} ${style[property.listing_type]} ${grid ? style.grid : ''}`} style={{maxHeight: "472px"}}>
        
        <div className={style.tileHeader}>
          {property.listing_type === "premium_plus" || property.listing_type === "premium" ?
            <div className={style.tileType}>
              <img
                src={property.listing_type === "premium_plus" ? require("diamond-red.png") : require("crown-green.png")}
                className={`img-responsive`}
                alt={property.listing_type ? property.listing_type : 'Property enlisting'}/>
              <p>{property.listing_type === "premium_plus" ? "Premium Plus" : (property.listing_type === "premium" ? "Premium" : "Standard")}</p>
            </div> : null
          }
          {!!property.verify ?
            <div className={`text-center ${style.verifiedListings}`}>
              <img src={require('tick.png')} className={`img-responsive`} alt="Verified"/>
              <p>Verified</p>
            </div> : null
          }
        </div>

        <div className="clearfix">

          {/* desktop version */}

          { grid ? ( <div className="hidden-xs">
            { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 1 ? ( <div>
                <Slider {...settings}>
                { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').map(
                    (image, index) => {
                      return (<div className={style.slickTile} key={index} onClick={()=>{window.location = `/property/${this.slug(property)}`}} style={{
                        background:`url(${imgUpload(image.url, 'h_400')}) center center / cover no-repeat`, cursor: "pointer",
                      }}></div>)
                    }
                  )
                }
                </Slider>
              </div> ) : ( property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 0 ? ( <div onClick={()=>{window.location = `/property/${this.slug(property)}`}}
                style={{
                  background: `url(${imgUpload(property.property_images.filter(image => image.type == 'image' || image.type === 'cover')[0].url, 'h_400')})`, height: '230px', cursor: "pointer",
                  backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: '100%', 
                }}>
                </div> ) : ( <img onClick={()=>{window.location = `/property/${this.slug(property)}`}}
                className={`img-responsive`} src={placeholder} style={{height: '230px', padding:'20px', objectFit: 'scale-down', backgroundColor: "#f5f5f5", width: '100%', cursor: "pointer", }} /> )
              )
            }

            </div> ) : ( <div className="hidden-xs">
              <div className={`${grid ? 'col-sm-12' : null} no-padding`}>
                
                <div className={`${style.imageContainer}`}>

                  <div className={`${style.priceTabView}`}><strong>{property.price != 0 && typeof(property.price) != 'object' ? `${this.props.currency} ${convertPrice(property.price, this.props.currency, this.props.currencyRates)}` : 'Call Us'}</strong></div>

                  { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 1 ? ( <Slider {...settings}>
                    { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').map(
                      (image, index) => {
                        return (<div className={style.slickTile} key={index} onClick={()=>{window.location = `/property/${this.slug(property)}`}} style={{
                          background:`url(${imgUpload(image.url, 'h_400')}) center center / cover no-repeat`, cursor: "pointer",
                        }}></div>)
                      })
                    }
                    </Slider> ) : ( property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 0 ? (
                      <div onClick={()=>{window.location = `/property/${this.slug(property)}`}} style={{ height: "270px", cursor: "pointer",
                        background:`url(${imgUpload(property.property_images.filter(image => image.type == 'image' || image.type === 'cover')[0].url, 'h_400')}) center center / cover no-repeat`,
                      }}></div> ) : (
                        <img onClick={()=>{window.location = `/property/${this.slug(property)}`}}
                        className={`img-responsive`} src={placeholder} style={{height: '270px', padding: '15px', objectFit: 'scale-down', backgroundColor: "#f5f5f5", cursor: "pointer", }} />)
                      )
                    }

                </div>

              </div>
            </div> )
          }

          {/* mobile version */}

          <div className="visible-xs" style={{ position: 'relative' }}>
            { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 1 ? (
              <div>
                <Slider {...settings} ref={slider => this.slider = slider } afterChange={
                  (currentSlide) => {
                    this.setState({ currentSlide: currentSlide + 1 })
                  }
                }>
                { property.property_images.filter(image => image.type == 'image' || image.type === 'cover').map(
                  (image, index) =>
                  <div className={style.slickTile} key={index} onClick={()=>{window.location = `/property/${this.slug(property)}`}} style={{
                    background:`url(${imgUpload(image.url, 'h_400')}) center center / cover no-repeat`,
                  }}></div>)
                }
                </Slider>
                <div
                  className="slider-count"
                  style={{
                    position: 'absolute',
                    padding: '5px 10px',
                    bottom: 0,
                    left: 0,
                    background: `rgba(0, 0, 0, 0.5)`,
                    color: '#ffffff'
                  }}
                >
                  {this.state.currentSlide} of {property.property_images.length}
                </div>
                  {(property.agency && property.agency.logo
                      ? (
                        <div
                        className="logo-background"
                        style={{
                          position: 'absolute',
                          padding: '5px',
                          bottom: 0,
                          right: 0,
                          background: `rgba(0, 0, 0, 0.5)`,
                          color: '#ffffff'
                        }}
                      >
                        <a href={`/agency/${property.agency.id}/${property.agency.name.split(" ").join("-").split("/").join("").toLowerCase()}`}>
                          <div
                            className={`${style.agencyLogo}`}
                            style={{
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              width: '50px',
                              height: '50px',
                              backgroundImage: !isWebkit || this.getFileExtension(property.agency.logo) !== 'png' ? `url(${imgUpload(property.agency.logo, 'h_100')})` : '',
                              WebkitMaskBoxImage: isWebkit && this.getFileExtension(property.agency.logo) === 'png' ? `url(${imgUpload(property.agency.logo, 'h_100')})` : '',
                              backgroundColor: isWebkit && this.getFileExtension(property.agency.logo) === 'png' ? 'white' : 'inherit',
                            }} />
                        </a>
                      </div>)
                      : null /* (property.user.profile_image
                        ? (<div
                          className={`${style.agencyLogo}`}
                          style={{
                            background: `url(${imgUpload(property.user.profile_image, 'h_100')})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            width: '50px',
                            height: '50px',
                            backgroundImage: !isWebkit || this.getFileExtension(property.user.profile_image) !== 'png' ? `url(${imgUpload(property.user.profile_image, 'h_100')})` : '',
                            WebkitMaskBoxImage: isWebkit && this.getFileExtension(property.user.profile_image) === 'png' ? `url(${imgUpload(property.user.profile_image, 'h_100')})` : '',
                            backgroundColor: isWebkit && this.getFileExtension(property.user.profile_image) === 'png' ? 'white' : 'inherit',
                          }} />)
                        : (<div
                          className={`${style.agencyLogo}`}
                          style={{
                            background: `url(${userPlaceholder})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            width: '50px',
                            height: '50px',
                            backgroundImage: !isWebkit || this.getFileExtension(userPlaceholder) !== 'png' ? `url(${userPlaceholder})` : '',
                            WebkitMaskBoxImage: isWebkit && this.getFileExtension(userPlaceholder) === 'png' ? `url(${userPlaceholder})` : '',
                            backgroundColor: isWebkit && this.getFileExtension(userPlaceholder) === 'png' ? 'white' : 'inherit',
                          }} />
                        )) */
                  )}
              </div>
            ) : ( property.property_images.filter(image => image.type == 'image' || image.type === 'cover').length > 0 ? <div><img onClick={()=>{window.location = `/property/${this.slug(property)}`}}
                className={`img-responsive`} src={imgUpload(property.property_images.filter(image => image.type == 'image' || image.type === 'cover')[0].url, 'h_250')} style={{height: '230px', width: '100%', objectFit: 'cover', cursor: "pointer", }} />
                {(property.agency && property.agency.logo
                      ? (
                        <div
                        className="logo-background"
                        style={{
                          position: 'absolute',
                          padding: '5px',
                          bottom: 0,
                          right: 0,
                          background: `rgba(0, 0, 0, 0.5)`,
                          color: '#ffffff'
                        }}
                      >
                        <a href={`/agency/${property.agency.id}/${property.agency.name.split(" ").join("-").split("/").join("").toLowerCase()}`}>
                          <div
                            className={`${style.agencyLogo}`}
                            style={{
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              width: '50px',
                              height: '50px',
                              backgroundImage: !isWebkit || this.getFileExtension(property.agency.logo) !== 'png' ? `url(${imgUpload(property.agency.logo, 'h_100')})` : '',
                              WebkitMaskBoxImage: isWebkit && this.getFileExtension(property.agency.logo) === 'png' ? `url(${imgUpload(property.agency.logo, 'h_100')})` : '',
                              backgroundColor: isWebkit && this.getFileExtension(property.agency.logo) === 'png' ? 'white' : 'inherit',
                            }} />
                        </a>
                      </div>)
                      : null 
                  )}
                </div>
                : <img onClick={()=>{window.location = `/property/${this.slug(property)}`}}
                className={`img-responsive`} src={placeholder} style={{height: '230px', padding: '15px', width: '100%', objectFit: 'scale-down', backgroundColor: "#f5f5f5", cursor: "pointer", }} />
              )
            }
          </div>

            {/* Details */}

          <div className={`${style.details} ${ grid ? (`col-sm-12 no-padding` ) :  '' }`}>
            <div className='row' style={{margin: `${grid ? "0" : "10px 0 5px"}`, height:`${grid ? '95px' : ''}`, overflowY: `${grid ? 'hidden' : ''}`, }}>
              <div className={`col-sm-12 col-xs-12 ${style.tileTitle}`}>
                <a href={`/property/${this.slug(property)}`}>
                  <h3 className="space-0 text-ellipsis" dangerouslySetInnerHTML={{__html: sanitize(property.title)}} style={{marginTop: `${grid ? '10px' : '0'}`, fontSize: 18 }}></h3>
                </a>
                {property.area ? 
                <a href={`/property/${this.slug(property)}`}>
                  <p className={`space-0 text-ellipsis greenHover`} style={{margin: '5px 0', }}>{property.area.name.replace(/\b\w/g, l => l.toUpperCase())}, {property.city.name.replace(/\b\w/g, l => l.toUpperCase())}</p>
                </a>:
                  <p className={`space-0 text-ellipsis`} style={{margin: '5px 0', }}>{property.area.name.replace(/\b\w/g, l => l.toUpperCase())}, {property.city.name.replace(/\b\w/g, l => l.toUpperCase())}</p>
                }
                <p className="gray small" style={{margin: '0 0 5px', }}>{property.bed ? (<span className="red">{property.bed}<i className="fa fa-bed gray" style={{margin: "0 7px", }}></i></span>) : ''}{property.bath ? <span className="red"><span style={{color: '#444', margin: '0 10px 0 7px', }}>|</span>{property.bath}<i className="fa fa-bath gray" style={{margin: "0 7px", }}></i></span> : ''}</p>
              </div>
              <a href={`/property/${this.slug(property)}`}>
                <div className={`${style.price}`}><strong>{property.price != 0 && typeof(property.price) != 'object' ? `${this.props.currency} ${convertPrice(property.price, this.props.currency, this.props.currencyRates)}` : 'Call Us'}</strong></div>
              </a>
            </div>

            {property.features && property.features !== null && property.features !== '{}' ? (
              <div className="col-sm-12 hidden-xs" style={{height: "52px", position: 'relative', }}>             
                <div className={style.tileFeats} ref="propFeats" onClick={()=>{this.featFunc()}}>
                  {this.renderAmenities(property.features)}
                </div>
                {this.state.amenitiesDataLength > 4 ?
                  <div className={style.clickToExpand} onClick={() => this.featFunc()}>
                    Click to Expand
                  </div>
                  : null
                }
              </div>
            ) : null}

            <a href={`/property/${this.slug(property)}`}>
              <div className="col-sm-12 col-xs-12 hidden-xs">{grid ? null : (this.stringToHTML(property.description))}</div>
            </a>
            <p className={`small text-ellipsis ${style.addedBy}`}>Posted on <strong>{moment(property.created_at).format('LL')}</strong> by {property.user.first_name}</p>
            
            <button
              onClick={() => {this.props.showFeedbackModal()}}
              className={`hidden-xs ${style.feedbackBtn}`}
              style={{ right: `${property.agency && property.agency.logo ? '80px' : '10px'}`, }}
            >
              Share Feedback
            </button>

            { !grid ? 
              ( property.agency && property.agency.logo ? (
                <a href={`/agency/${property.agency.id}/${property.agency.name.split(" ").join("-").split("/").join("").toLowerCase()}`}><div className={`hidden-xs ${style.agencyLogo}`} 
                  style={{
                  background: `url(${imgUpload(property.agency.logo, 'h_100', false)}) center center / cover no-repeat`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", }} />
                </a>  ) :  null
                  /*(property.user.profile_image ? (
                    <div className={`hidden-xs ${style.agencyLogo}`}
                      style={{
                      background: `url(${imgUpload(property.user.profile_image, 'h_100')})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", }} />
                  ) : (
                    <div className={`hidden-xs ${style.agencyLogo}`}
                      style={{
                      background: `url(${userPlaceholder})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", }} />
                  ))*/
              ) : null
            }

          </div>
        </div>

        {/* mobile footer */}

        <div className={`clearfix visible-xs ${style.footer}`}>
          <div className={style.btnCont}>
            {/* <div className="col-sm-4">{property.agency ? <img src={property.agency.logo} className="logo"/> : null}</div> */}
            <OverlayTrigger trigger="click" rootClose={true} overlay={popoverNumber}>
              <button className={`btn btn-default ${style.mobilesize}`} onClick={()=>{document.body.style.overflow = 'hidden'}}>
                <div className={style.btnImg}>
                  {/* <i className="fa fa-phone fa-lg"></i> */}
                  <img src={require('phone.png')} className="img-responsive" alt="phone icon"/>
                  {this.state.showNumber ? (<p>{property.phone ? property.phone : (property.user && property.user.phone ? property.user.phone : '' )}</p>) : (<p>View Number</p>)}
                </div>
              </button>
            </OverlayTrigger>
            <OverlayTrigger trigger="click" rootClose={true} overlay={popoverInquiry}>
              <button className={`btn btn-default ${style.mobilesize}`} onClick={()=>{document.body.style.overflow = 'hidden'}} style={{borderLeft: '1px solid #ddd', overflow: 'hidden', }}>
                <div className={style.btnImg}>
                  {/* <i className="fa fa-envelope fa-lg"></i> */}
                  <img src={require('mail.png')} className="img-responsive" alt="email icon"/>
                  <p>Send Inquiry</p>
                </div>
              </button>
            </OverlayTrigger>
          </div>
          <div className={style.priceContainer}>
            <p className={style.price2}><strong>{property.price != 0 && typeof(property.price) != 'object' ? `${this.props.currency} ${convertPrice(property.price, this.props.currency, this.props.currencyRates)}` : 'Call Us'}</strong></p>
          </div>
        </div>

        {/* desktop footer */}

        <div className={`clearfix hidden-xs ${style.footer}`}>

        {/* grid changes */}

        {grid ?
          (
          <div>
            <div className={style.btnCont}>
              {/* <div className="col-sm-4">{property.agency ? <img src={property.agency.logo} className="logo"/> : null}</div> */}
              {this.state.showNumber ?
                (<button className={`btn btn-default`} style={{borderRight: '1px solid #ddd', padding: 0}}>
                  <div className={style.btnImg}>
                    <p>
                      {property.phone ? property.phone : (property.user && property.user.phone ? property.user.phone : '')}
                      {property.phones && property.phones.length ?
                        (<OverlayTrigger trigger="click" rootClose placement="top" overlay={AdditionalPhonesPopover(property.phones)}>
                            <span className={style.additionalPhones}>+{property.phones.length}</span>
                          </OverlayTrigger>
                        ) : null
                      }
                    </p>
                  </div>
                </button>
                ) : (<OverlayTrigger trigger="click" rootClose={true} overlay={popoverNumber}>
                  <button className={`btn btn-default`} style={{borderRight: '1px solid #ddd',}} onClick={() => {
                    document.body.style.overflow = 'hidden'
                  }}>
                    <div className={style.btnImg}>
                      {/* <i className="fa fa-phone fa-lg"></i> */}
                      <img src={require('phone.png')} className="img-responsive" alt="phone icon"/>
                      <p><span>View Number</span></p>
                    </div>
                  </button>
                </OverlayTrigger>
                )
              }
              <OverlayTrigger trigger="click" rootClose={true} overlay={popoverInquiry}>
                <button className={`btn btn-default`} style={{overflow: 'hidden', }} onClick={()=>{document.body.style.overflow = 'hidden'}}>
                  <div className={style.btnImg}>
                    {/* <i className="fa fa-envelope fa-lg"></i> */}
                    <img src={require('mail.png')} className="img-responsive" alt="email icon"/>
                    <p>Send Inquiry</p>
                  </div>
                </button>
              </OverlayTrigger>
            </div>
            <div className={style.priceContainer}>
              <p className={style.price2}><strong>{property.price != 0 && typeof(property.price) != 'object' ? `${this.props.currency} ${convertPrice(property.price, this.props.currency, this.props.currencyRates)}` : 'Call Us'}</strong></p>
            </div>
          </div>
        ) : (
          <div>
            <div className={style.listTypeCont}>
              {/* <p className={`${style.price} ${grid ? style.priceg : ''}`}><strong>{this.props.currency} {convertPrice(property.price, this.props.currency)} </strong></p> */}
              <img src={`${property.listing_type == "premium_plus" ? require("diamond-red.png") : (property.listing_type == "premium" ? require("crown-green.png") : "")}`} className={`img-responsive ${style.listingType}`} />
              <h3 style={{cursor: 'default', paddingLeft: '10px'}}>{property.listing_type == "premium_plus" ? "Premium Plus" : (property.listing_type == "premium" ? "Premium" : "Standard")}</h3>
              {!!property.verify ?
                <div className={`text-center ${style.verifiedListings}`}>
                  <img src={require('tick.png')} className={`img-responsive`} alt="Verified"/>
                  <p>Verified</p>
                </div> : null
              }
            </div>
            <div className={style.btnCont}>
              {/* <div className="col-sm-4"> { property.agency ? <img src={property.agency.logo } className="logo"/> : null } </div > */}
              {this.state.showNumber ?
                (<button className={`btn btn-default`} style={{borderLeft: '1px solid #ddd'}}>
                  <div className={style.btnImg}>
                    <img src={require('phone.png')} className="img-responsive" alt="phone icon"/>
                    <p>
                      {property.phone ? property.phone : (property.user && property.user.phone ? property.user.phone : '')}
                      {property.phones && property.phones.length ?
                        (<OverlayTrigger trigger="click" rootClose placement="top" overlay={AdditionalPhonesPopover(property.phones)}>
                            <span className={style.additionalPhones}>+{property.phones.length}</span>
                          </OverlayTrigger>
                        ) : null
                      }
                    </p>
                  </div>
                </button>
                ) : (<OverlayTrigger trigger="click" rootClose={true} overlay={popoverNumber}>
                  <button className={`btn btn-default`} style={{borderLeft: '1px solid #ddd',}} onClick={() => {
                    document.body.style.overflow = 'hidden'
                  }}>
                    <div className={style.btnImg}>
                      {/* <i className="fa fa-phone fa-lg"></i> */}
                      <img src={require('phone.png')} className="img-responsive" alt="phone icon"/>
                      <p><span>View Number</span></p>
                    </div>
                  </button>
                </OverlayTrigger>
                )
              }
              <OverlayTrigger trigger="click" rootClose={true} overlay={popoverInquiry}>
                <button className={`btn btn-default`} style={{borderLeft: '1px solid #ddd', overflow: 'hidden', }} onClick={()=>{document.body.style.overflow = 'hidden'}}>
                  <div className={style.btnImg}>
                    {/* <i className="fa fa-envelope fa-lg"></i> */}
                    <img src={require('mail.png')} className="img-responsive" alt="email icon"/>
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
    currency: store.user.currency,
    unit: store.user.unit,
    user: store.user.user,
    currencyRates: store.user.currencyRates,
  }
})(PropertyTile);

