import React from 'react';
import Formsy from 'formsy-react';
import Modal from 'react-bootstrap/lib/Modal';
import axios from 'axios';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import {Popover, OverlayTrigger, Button } from 'react-bootstrap'
import style from './style.css';
import placeholder from 'images-comingsoon.svg';
import { imgUpload, checkForHttps, convertPrice } from 'helpers'
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import InquiryModal from 'components/InquiryModal';
import config from 'config'

const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');
const TwitterIcon = generateShareIcon('twitter')
const GooglePlusIcon = generateShareIcon('google')

export default class AreaProjectTile extends React.Component {
  constructor(props) {
    super(props);
    this.showInquiryDiv = this.showInquiryDiv.bind(this);
    this.showShareDiv = this.showShareDiv.bind(this);
    this.state = {
      url: window.location.origin + `/project/${props.project.id}/${props.project.name.split(" ").join("-").split('/').join('-').toLowerCase()}`,
      showInquiryDiv: false,
      showShareDiv: false,
      formEmail: false,
      proposalSent: false,
      liked: props.project.like ? true : false,
    }
  }
  resetLinkSend() {
    this.setState({formEmail: true,proposalSent: false,});
  }
  like(event) {
    event.preventDefault();
    return axios.post(`${config.apiPath}/api/user/like`, {
      [`project_id`]: this.props.project.id,
    })
    .then(response => {
      this.setState({liked: true})
    })
  }
  dislike(event) {
    event.preventDefault();
    return axios.post(`${config.apiPath}/api/user/dislike`, {
      [`project_id`]: this.props.project.id,
    })
    .then(response => {
      this.setState({liked: false})
    })
  }
  resetEmailField(){
    if(this.state.formEmail === true){
      this.setState({formEmail: false});
    }
  }
  sendToFriend(model) {
    this.setState({proposalSent: true,});
    return axios.post(`${config.apiPath}/api/property/sendToFriend`, {
        ...model,
        type: 'project',
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
  handleHide() {
    this.setState({ showShareDiv: false });
  }
  render(){
    var {project} = this.props;
    var minArray = (project && project.project_listings.length) ? (project.project_listings.map((listing,index) => {return parseInt(listing.min_price)})) : [];
		var maxArray = (project && project.project_listings.length) ? (project.project_listings.map((listing,index) => {return parseInt(listing.max_price)}))  : [];
		var minValue = _.min(minArray);
		var maxValue = _.max(maxArray);
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
              <img src={require('facebook.png')} width={35} height={35} alt="Facebook"/>
            </FacebookShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <WhatsappShareButton title={this.props.title} url={this.state.url}>
              <img src={require('whatsapp.png')} width={35} height={35} alt="WhatsApp"/>
            </WhatsappShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <TwitterShareButton title={this.props.title} url={this.state.url}>
              <img src={require('twitter.png')} width={35} height={35} alt="Twitter" />
            </TwitterShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <GooglePlusShareButton title={this.props.title} url={this.state.url}>
              <img src={require('google-plus.png')} width={35} height={35} alt="Google Plus" />
            </GooglePlusShareButton>
          </div>
        </div>
      </div>
    );
    var popoverInquiry = (
      <div className={style.inquiryPopCont}>
        <div className={`hidden-xs ${style.inquiryPop}`}>
          <Popover bsClass={`${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={project.agency}  Inquiry_user_id={project && project.agency ? project.agency.user_id: false} hideCloseButton={true} entityId={project.id} entityType="project" />
          </Popover>
        </div>
        <Popover bsClass={`visible-xs ${style.inquiryPopup}`} id="popover-inquiry">
            <InquiryModal marketer={project.agency}  Inquiry_user_id={project && project.agency ? project.agency.user_id: false} hideCloseButton={true} entityId={project.id} entityType="project" />
        </Popover>
      </div>
    );
    return(
      <div>
        <div className={style.tileContent}>
          <a href={`/project/${project.id}/${project.name.split(" ").join("-").split('/').join('-').toLowerCase()}`}>
            <div className={style.projBack} style={{
              backgroundImage: `url(${project.area_resources.length ? imgUpload(project.area_resources[0].url, 'h_250'):placeholder})`,
              backgroundColor: "#f5f5f5", backgroundSize: `${ project.area_resources.length ? "" : "50% auto" }`,
              backgroundRepeat: 'no-repeat'
              }}>
              {/* <span className={style.iconGrid}>
              { this.props.user && this.state.liked ?
                <a onClick={e => this.dislike(e)}><i className="fa fa-heart" style={{fontSize:'18px'}}></i><span style={{fontSize: '10px'}}>Save</span></a>
                : this.props.user ?
                <a onClick={e => this.like(e)}><i className="fa fa-heart-o" style={{fontSize:'18px'}}></i><span style={{fontSize: '10px'}}>Save</span></a> : null
              }
                {/*<a><i className="fa fa-map-marker" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Places</span></a>
                <a onClick={()=>{this.showShareDiv()}}><i className="fa fa-share-alt" style={{fontSize:'18px'}}></i><span style={{fontSize: '10px'}}>Share</span></a>
                {/*<a><i className="fa fa-pencil-square-o" style={{fontSize:'25px'}}></i><span style={{fontSize: '12px'}}>Notes</span></a>
                <a onClick={()=>{this.showInquiryDiv()}} style={{marginRight:'0'}}><i className="fa fa-comment-o" style={{fontSize:'18px'}}></i><span style={{fontSize: '10px'}}>Ask</span></a>
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
            </div>
            <div style={{paddingLeft: "2px", paddingRight: "2px", }}>
              <p className={`gray ${style.projTileLocation} text-ellipsis`}>{`${project.city.name}`}<span style={{color: "#afafaf", }}>&#32;-&#32;</span><span>{project.projectArea.name}</span></p>
              <h3 className={`${style.projTileName} space-0 text-ellipsis`}>{project.name}</h3>
              <span className={`${style.projTilePrice} text-ellipsis space-0`}>
                  {minValue && maxValue ? `${convertPrice(minValue, this.props.currency, this.props.currencyRates)} - ${convertPrice(maxValue, this.props.currency, this.props.currencyRates)} ${this.props.currency}`: 'Contact for Price'}
              </span>
              <span className={`${style.projTileAgency} text-ellipsis`}>{project.agency.name}</span>
            </div>
          </a>
        </div>
      </div>
    )
  }
}
