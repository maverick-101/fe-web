import React from 'react';
import Formsy from 'formsy-react';
import Modal from 'react-bootstrap/lib/Modal';
import axios from 'axios';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import {Popover, OverlayTrigger, Button } from 'react-bootstrap'
import style from './style.css';
import placeholder from 'no-image.jpg';
import { imgUpload, checkForHttps, convertPrice } from 'helpers'
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import InquiryModal from 'components/InquiryModal';
import config from 'config';
const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');
const TwitterIcon = generateShareIcon('twitter')
const GooglePlusIcon = generateShareIcon('google')

export default class AreaPropertyTile extends React.Component {
  constructor(props) {
    super(props);
    this.showInquiryDiv = this.showInquiryDiv.bind(this);
    this.showShareDiv = this.showShareDiv.bind(this);
    this.state = {
      url: window.location.origin + `/property/${props.property.id}/${this.slug(props.property)}`,
      showShareDiv: false,
      showInquiryDiv: false,
      formEmail: false,
      proposalSent: false,
      liked: props.property.like ? true : false,
    }
  }
  resetEmailField(){
    if(this.state.formEmail === true){
      this.setState({formEmail: false});
    }
  }
  resetLinkSend() {
    this.setState({formEmail: true,proposalSent: false,});
  }
  like(event) {
    event.preventDefault();
    return axios.post(`${config.apiPath}/api/user/like`, {
      [`property_id`]: this.props.property.id,
    })
    .then(response => {
      this.setState({liked: true})
    })
  }
  dislike(event) {
    event.preventDefault();
    return axios.post(`${config.apiPath}/api/user/dislike`, {
      [`property_id`]: this.props.property.id,
    })
    .then(response => {
      this.setState({liked: false})
    })
  }
  sendToFriend(model) {
    this.setState({proposalSent: true,});
    return axios.post(`${config.apiPath}/api/property/sendToFriend`, {
        ...model,
        type: 'property',
        url: this.state.url,
      })
      .then(response => {
        // this.setState({
        //   showShareDiv: false,
        // })
      })
  }
  showShareDiv() {
    if (this.state.showShareDiv == false) {
      this.setState({
        showShareDiv: true,
      })
    } else {
      this.setState({
        showShareDiv: false,
      })
    }
  }
  showInquiryDiv() {
    if (this.state.showInquiryDiv == false) {
      this.setState({
        showInquiryDiv: true,
      })
    } else {
      this.setState({
        showInquiryDiv: false,
      })
    }
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
  render() {
    var {property} = this.props;
    var shareModal = (
      <div className={`${style.sendToFriendfixes}`}>
        <Formsy onValidSubmit={model => this.sendToFriend(model)}>
          <div style={{padding:"0 15px", }}>
            <Input type="email" resetfield={this.state.formEmail} resetEmailField={this.resetEmailField.bind(this)} autocomplete='email' name="email" display="Email" containerClass="space-2" placeholder="Email Address" required validations="isEmail" validationError="Please enter a valid email address" />
            <button className="btn red" style={{width: "100%", background: '#ef5350d5', }} disabled={this.state.proposalSent}>{this.state.proposalSent ? 'Link Sent' : 'Send Link'}</button>
            <button type="reset" onClick={ ()=>{this.resetLinkSend()} }
            style={{margin: "10px auto", padding: "8px 14px", backgroundColor: '#ef5350d5', color: "#fff", borderRadius: 2, border: "none", display: `${this.state.proposalSent ? 'block' : 'none'}`,}}>Send Another!</button>
          </div>
        </Formsy>
        <div className="separator">
        <span>or</span>
        </div>
        <div className="row no-margin">
          <div className='col-sm-3 col-xs-3'>
            <FacebookShareButton title={this.props.title} url={this.state.url}>
              <img src={require('facebook.png')} width={35} height={35} />
            </FacebookShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <WhatsappShareButton title={this.props.title} url={this.state.url}>
              <img src={require('whatsapp.png')} width={35} height={35} />
            </WhatsappShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <TwitterShareButton title={this.props.title} url={this.state.url}>
              <img src={require('twitter.png')} width={35} height={35} />
            </TwitterShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <GooglePlusShareButton title={this.props.title} url={this.state.url}>
              <img src={require('google-plus.png')} width={35} height={35} />
            </GooglePlusShareButton>
          </div>
        </div>
      </div>
    );
    var popoverInquiry = (
      <div className={style.inquiryPopCont}>
        <div className={`hidden-xs ${style.inquiryPop}`}>
          <Popover bsClass={`${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={property.agency} Inquiry_user_id={property.user_id ? property.user_id: false}entityId={property.id} hideCloseButton={true} entityType="property" />
          </Popover>
        </div>
        <Popover bsClass={`visible-xs ${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={property.agency} Inquiry_user_id={property.user_id ? property.user_id: false} entityId={property.id} hideCloseButton={true} entityType="property" />
        </Popover>
      </div>
    );
    return(
      <div>
        <a href={`/property/${property.id}/${this.slug(property)}`}>
          <div className={style.projBack} style={{backgroundImage: `url(${property.property_images.length ? property.property_images[0].url : ''})`}}></div>
        </a>
        <div className={style.tileContent}>
          <a href={`/property/${property.id}/${this.slug(property)}`}>
            <span className={`${style.propTileHeader} ${style.stopOverflow} space-0`} style={{fontSize:'26px'}}>{property.price ? convertPrice(property.price, this.props.currency, this.props.currencyRates): 'Contact for price'}</span>
            <span className={`${style.propTileHeader}  ${style.stopOverflow} space-0`} style={{color:'#ef5350'}} dangerouslySetInnerHTML={{__html: property.title}}></span>
            <p className={`gray ${style.stopOverflow}`}>{`${property.area.name}, ${property.city.name}`}</p>
            <span className={style.propTileSubHeader}>{`${property.bed || 'n\\a'} bd | ${property.bath || 'n\\a'} ba | ${property.size} ${property.size_unit}`}</span>
          </a>  
          {/* <span className={style.iconGrid}>
            { this.props.user && this.state.liked ?
              <a onClick={e => this.dislike(e)}><i className="fa fa-heart" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Save</span></a>
              : this.props.user ?
              <a onClick={e => this.like(e)}><i className="fa fa-heart-o" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Save</span></a> : null
            }
            <a onClick={()=>{this.showShareDiv()}}><i className="fa fa-share-alt" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Share</span></a>
            <a onClick={()=>{this.showInquiryDiv()}} style={{marginRight:'0'}}><i className="fa fa-comment-o" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Ask</span></a>
          </span> */}
          <Modal show={this.state.showShareDiv} onHide={this.showShareDiv}>
            <Modal.Header closeButton>
              <Modal.Title>Share</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.showShareDiv ? shareModal : null}
            </Modal.Body>
          </Modal>
          <Modal show={this.state.showInquiryDiv} onHide={this.showInquiryDiv}>
            <Modal.Header closeButton>
              <Modal.Title>Inquiry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.showInquiryDiv ? popoverInquiry : null}
            </Modal.Body>
          </Modal>
          {property.agency ?
            <a href={`/property/${property.id}/${this.slug(property)}`}>
              <p style={{marginTop:'20px',marginBottom:'1px'}} className={`${style.propTileSubHeader} ${style.stopOverflow}`}>{property.agency.name}
                <span className="green pull-right" style={{'height':'50px','width':'50px'}}><img src={property.agency ? property.agency.logo : null} width="100%" height="auto"/></span>
              </p>
            </a>
          :null}
        </div>
      </div>
    )
  }
}
