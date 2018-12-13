import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import Helmet from 'react-helmet';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import {Popover, OverlayTrigger, Button } from 'react-bootstrap'
import swal from 'sweetalert2';
import { openSignup, closeSignup, openLogin, closeLogin } from 'actions/header'

import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import Modal from 'react-bootstrap/lib/Modal';
import { imgUpload } from 'helpers'
import style from './style.css';
import placeholder from 'images-comingsoon.svg';
import config from 'config';

const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');
const TwitterIcon = generateShareIcon('twitter')
const GooglePlusIcon = generateShareIcon('google')

class ContactCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNumber: this.props.graanaCom,
      requestSent: false,
      proposalSent: false,
      showShareDiv: false,
      //TODO: Fetch liked from the backend with property/project get
      liked: props.like ? true : false,
      formEmail: false
    }

    this.popupNum = null;
  }
  resetEmailField(){
    if(this.state.formEmail === true){
      this.setState({formEmail: false});
    }
  }
  sendMessage(inquiry) {
    return axios.post(`${config.apiPath}/api/inquiry`, {
      ...inquiry,
      type: 'request_info',
      user_id: this.props.Inquiry_user_id,
      inquireable_id: this.props.entityId,
      inquireable_type: this.props.entityType,
    })
    .then(response => {
      swal({
        title: "Inquiry Sent",
        text: "Your inquiry has been sent",
        type: "success",
      });
      
      this.setState({
        requestSent: true
      })
    })
  }
  sendToFriend(model) {
    this.setState({proposalSent: true,});
    return axios.post(`${config.apiPath}/api/property/sendToFriend`, {
        ...model,
        type: this.props.entityType,
        url: window.location.href,
      })
      .then(response => {
        this.props.onHide();
      })
  }

  like(event) {
    if(this.props.user) {
      event.preventDefault();
      return axios.post(`${config.apiPath}/api/user/like`, {
        [`${this.props.entityType}_id`]: this.props.entityId,
      })
      .then(response => {
        this.setState({liked: true})
      })
    } else {
      this.props.closePopover && this.props.closePopover();
      this.props.dispatch(openSignup())
    }
  }
  dislike(event) {
    event.preventDefault();
    return axios.post(`${config.apiPath}/api/user/dislike`, {
      [`${this.props.entityType}_id`]: this.props.entityId,
    })
    .then(response => {
      this.setState({liked: false})
    })
  }
  showShareDiv() {
    if (this.state.showShareDiv == false) {
      this.props.showShare == false ? document.getElementById('fixStutter').style.marginTop = "-190px" : null;
      this.setState({
        showShareDiv: true,
      })
    } else {
      this.props.showShare == false ? document.getElementById('fixStutter').style.marginTop = "1px" : null;
      this.setState({
        showShareDiv: false,
      })
    }
  }
  onHide() {
    this.setState({
      showShareModal: false,
    })
  }
  resetLinkSend() {
    this.setState({formEmail: true,proposalSent: false,});
  }

  handleInput(value){
    if(value < 0 || value.indexOf('-') !== -1){
      value = 0;
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
  showNumber(phonenumber) {
    if (phonenumber && this.state.isValidPhone) {
      // this.refs.overlay && this.refs.overlay.hide();
      document.body.click();
      Promise.all([
        axios.post(`${config.apiPath}/api/user/view`, {
          id: this.props.entityId,
          type: this.props.entityType,
          field: 'phone_view'
        }),
        axios.post(`${config.apiPath}/api/inquiry`, {
          phone: phonenumber,
          inquireable_id: this.props.entityId,
          inquireable_type: this.props.entityType,
          type: 'phone_view',
          user_id: this.props.Inquiry_user_id,
    })
      ])
      this.setState({showNumber: true});
      this.refs.overlay.hide()
    }
  }
  sendInquiry(phonenumber){
    document.body.click();
    if(phonenumber) {
      axios.post(`${config.apiPath}/api/inquiry`, {
        phone: phonenumber,
        inquireable_id: this.props.entityId,
        inquireable_type: this.props.entityType,
      })  
    }
  }
  showNumberInputInView() {
    this.popupNum.scrollIntoView();
  }

  nameInputCCinView() {
    this.ref('nameInputCC').scrollIntoView();
  }

  emailInputCCinView() {
    this.ref('emailInputCC').scrollIntoView();
  }

  numberInputCCinView() {
    this.ref('numberInputCC').scrollIntoView();
  }
  // dataLayer(){
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push [{
  //     inquiry: 'leads'
  //   }];
  // }

 render() {
   const { requestSent  } = this.state;
    var shareModal = (
      <div className={`${style.sendToFriendfixes}`}>
        <hr />
        <Formsy onValidSubmit={model => this.sendToFriend(model)}>
          <div style={{padding:"0 15px", }}>
            <Input type="email" resetfield={this.state.formEmail} resetEmailField={this.resetEmailField.bind(this)} autocomplete='email' name="email" display="Email" containerClass="space-2" placeholder="Email Address" required validations="isEmail" validationError="Please enter a valid email address" />
            <button className="btn btn-block red" disabled={this.props.pending ? true : this.state.proposalSent ? true : false}>{this.state.proposalSent ? 'Link Sent' : 'Send Link'}</button>
            <button className="btn btn-block red" type="reset" onClick={ ()=>{this.resetLinkSend()} }
            style={{margin: "10px auto", display: `${this.state.proposalSent ? 'block' : 'none'}`,}}>Send Another!</button>
          </div>
        </Formsy>
        <div className="separator" style={{display: `${this.props.pending ? 'none' : 'block'}`, }}>
        <span>or</span>
        </div>
        <div className="row no-margin" style={{display: `${this.props.pending ? 'none' : 'block'}`, }}>
          <div className='col-sm-3 col-xs-3'>
            <FacebookShareButton title={document.getElementsByTagName("title")[0].innerHTML} url={window.location.href}>
              <img src={require('facebook.png')} width={35} height={35} alt="Facebook" />
            </FacebookShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <WhatsappShareButton title={document.getElementsByTagName("title")[0].innerHTML} url={window.location.href}>
              <img src={require('whatsapp.png')} width={35} height={35} alt="WhatsApp" />
            </WhatsappShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <TwitterShareButton title={document.getElementsByTagName("title")[0].innerHTML} url={window.location.href}>
              <img src={require('twitter.png')} width={35} height={35} alt="Twitter"/>
            </TwitterShareButton>
          </div>
          <div className='col-sm-3 col-xs-3'>
            <GooglePlusShareButton title={document.getElementsByTagName("title")[0].innerHTML} url={window.location.href}>
              <img src={require('google-plus.png')} width={35} height={35} alt="Google Plus"/>
            </GooglePlusShareButton>
          </div>
        </div>
      </div>
    )

    var popoverNumber = (
      <div className={style.numberPopCont}>
        <div className={`${style.numberPop}`}>
          <Popover bsClass={`${style.numberPopup}`} id="popover-number-contact-card">
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
                    <input ref={(e)=>{this.popupNum = e}} type="number" required onFocus={()=>{this.showNumberInputInView()}} className={style.noFocus} placeholder="Your Number"
                    onChange={(e)=>{e.target.value = this.handleInput(e.target.value);this.setState({phonenumber:e.target.value,isValidPhone:e.target.checkValidity()});}}
                    onKeyDown={e => {e.target.value = e.target.value === '' ? '' : this.handleInput(e.target.value); }}
                    onKeyPress={e=> (e.keyCode === 13||e.which === 13) ? this.showNumber(this.state.phonenumber):null}
                    style={{width: "100%", borderRadius: 3, padding: 8, margin:"10px 0 0", border: "1px solid #eee", }}/>
                    </div>
                    <div className="col-xs-2 no-padding">
                      <div className={`${style.phoneIconWrapper} text-center`}>
                        <i className="fa fa-mobile fa-2x red"></i>
                      </div>
                    </div>
                  </div>
                  <Button id="getNumberContactCard" type='submit' 
                    onClick= {() => {this.showNumber(this.state.phonenumber);} }
                    style={{
                      margin: "5px auto 10px auto", padding: 8, width: "100%",
                      backgroundColor: "#ef5350", color: "#fff", border: "none",
                      borderRadius: 3,
                    }}>Get Number</Button>
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    );
    if(this.state.showNumber) {
      var button = (
        <React.Fragment>
        <p className={`green text-center col-sm-12 col-xs-12 no-padding ${style.phone}`}>
          <a href={`tel:${this.props.phoneNumber ? this.props.phoneNumber : (this.props.marketer.phone ? this.props.marketer.phone : 'No contact no. Provided')}`}>
          <i className="fa fa-phone fa-lg"></i>
          &nbsp;
          {this.props.phoneNumber ? this.props.phoneNumber : (this.props.marketer.phone ? this.props.marketer.phone : 'No contact no. Provided')}
          </a>
        </p>
        {this.props.additionalPhones && this.props.additionalPhones.map(({ phone }, index) => {
          return (index < 2) ?
            (<p className={`green text-center col-sm-12 col-xs-12 no-padding ${style.additionalPhone}`}>
              <a href={`tel:${phone}`}>
                <i className="fa fa-phone fa-lg" /> {phone}
              </a>
            </p>
            ) : null
          }
        )}
        </React.Fragment>
      )
    } else {
      var button = (
        <OverlayTrigger trigger="click" ref="overlay" rootClose={true} placement="top" overlay={popoverNumber}>
          <button id="showNumberButton" className={`btn btn-block ${this.props.pending ? null : style.greenOut}`} disabled={this.props.pending ? true : false}>
            <i className="fa fa-phone fa-lg"></i> &nbsp; Show Phone Number
          </button>
        </OverlayTrigger>
      )
    }
    
    return (
      <div>
      {requestSent ? <Helmet defer={false} async>
        <script>
          { `window.dataLayer = window.dataLayer || [];
    window.dataLayer.push [{
      inquiry: 'leads'
    }];`}
        </script>
      </Helmet> : ''}
        <div className={`panel panel-default ${style.getboxshadow} hidden-xs`} style={{border: 0,}}>
          <div className="panel-body">
            <div className="clearfix space-4">
              {this.props.entityType == 'project' || this.props.entityType == 'project_listing' ? (
                  <React.Fragment>
                    <span style={{fontSize: '14px', marginRight: 7, color: '#acacac'}}>Pricing: </span>
                    <h3 style={{fontSize: `${this.props.entityType == 'project' ? "20px" : ""}`, marginBottom: 15, marginTop: 5, color: `${this.props.pricingColor}`}}>{this.props.pricing}</h3>
                  </React.Fragment>
                ) : null
              }
              {this.props.entityType == 'property' && (this.props.marketer.first_name || this.props.marketer.name) ?
                <div>
                  <p className='space-3' style={{fontSize: '13px', }}><b>This property is marketed by</b></p>
                  {<div className="space-2" style={{display: 'inline-block', width: '100%', }}>
                    {this.props.marketer.hasOwnProperty('profile_image') || this.props.marketer.profile_image || this.props.marketer.logo ? (
                      <div className={`pull-left medium ${this.props.entityType !== 'property' ? 'vcenter' : ''} no-padding`} style={{marginRight:15, display: this.props.marketer.hasOwnProperty('profile_image') ? 'none' : 'block' }}>
                        {this.props.marketer.logo ?
                          (<a href={`/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('').toLowerCase()}`}>
                            <div style={{
                              border: "none", height: 65, width: 70,
                              background: `url("${imgUpload(this.props.marketer.logo, "h_100")}")`,
                              backgroundSize: 'contain', backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                            }}/>
                          </a>)
                          : null
                          /*(<div style={{
                            border: "none", height: 65, width: 70,
                            background: `url("${imgUpload(this.props.marketer.profile_image, "h_100")}")`,
                            backgroundSize: 'contain', backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}/>)*/
                        }
                      </div>
                    ) : (
                      <div className={`pull-left medium ${this.props.entityType !== 'property' ? 'vcenter' : ''} no-padding`} style={{marginRight:15}}>
                        <div style={{height: 65, width: 70,
                        background: `url("${require('user.png')}")`, 
                        backgroundSize: 'contain', backgroundPosition: 'center',  backgroundRepeat: 'no-repeat', }}/>
                      </div>
                    )}
                    <div className={`col-sm-8 col-xs-8 ${this.props.entityType !== 'property' ? 'vcenter' : ''} no-padding`}>
                      {this.props.marketer.name ?
                        <a href={`/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('').toLowerCase()}`}><h4 className="no-margin text-capitalize ellipses-2">{this.props.marketer.name}</h4></a>
                        :
                        <React.Fragment>
                          <h4 className="no-margin text-capitalize ellipses-2">{this.props.marketer.first_name} {this.props.marketer.last_name}</h4>
                          <p className="space-0 text-capitalize ellipses-2">{this.props.marketer.agency ? this.props.marketer.agency.name : null}</p>
                        </React.Fragment>
                      }

                    </div>
                  </div>}
                  {button}
                </div> :

                <div>
                  {this.props.entityType == 'area' ? <div className={'space-2'} style={{display: 'inline-block', width: '100%', }}>
                    <a href={!this.props.graanaCom ? `/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('-').toLowerCase()}` : null}>
                      {this.props.marketer.logo ? (
                        <div className="col-sm-4 col-xs-4 medium vcenter no-padding" style={{width:80}}>
                          <div className="logo" style={{border: "none", 
                            background: `url('${imgUpload(this.props.marketer.logo, "h_100", false)}')`,
                            backgroundPosition: 'center', backgroundSize: 'contain', height: 65, width: 65, backgroundRepeat: 'no-repeat', 
                          }}/>
                        </div>
                      ) : (
                        <div className="col-sm-4 col-xs-4 medium vcenter no-padding" style={{width:80}}>
                          <div className="logo" style={{border: "none", 
                            background: `url('${placeholder}')`,
                            backgroundPosition: 'center', backgroundSize: '68% auto', backgroundColor: "#f5f5f5", height: 65, width: 65, backgroundRepeat: 'no-repeat', 
                          }}/>
                        </div>
                      )}
                    </a>
                    <div className="col-sm-8 col-xs-8 vcenter no-padding" style={{height: 65, }}>
                      <a href={!this.props.graanaCom ? `/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('-').toLowerCase()}` : null}>
                        <h4 className={`ellipses-2`} style={{margin: 0, }}>{this.props.marketer.name}</h4>
                      </a>
                      {this.props.marketer.agency_areas.length !== 0 ?
                        this.props.graanaCom ?
                          <p>Call us for inquiries</p>
                          :
                          <a href={`/area/${this.props.marketer.agency_areas[0].area.id}/${this.props.marketer.agency_areas[0].area.name.split(' ').join('-').split(',').join('').split('/').join('-').toLowerCase()}`}>
                            <p className={`ellipses-2 greenHover`} style={{margin: 0,}}>{(this.props.marketer.agency_areas && this.props.marketer.agency_areas[0].area.name) || null}, {this.props.marketer.agency_areas[0].area.city.name}</p>
                          </a>
                        : null
                      }
                    </div>
                  </div> : null}
                  {button}
                </div>

              }
            </div>
            <div className={style.wrapper}>
              <Formsy onValidSubmit={model => this.sendMessage(model)}>
                <div><Input autocomplete='off' name="name" type="text" display="Name" defaultValue={this.props.user ? `${this.props.user.first_name} ${this.props.user.last_name}` : null} placeholder="Name" className="space-1" required={true}/></div>
                <div><Input autocomplete='off' name="email" type="email" display="Email" defaultValue={this.props.user ? `${this.props.user.email}` : null} placeholder="Email" className="space-1" required={true}/></div>
                <div><Input autocomplete='off' name="phone" type="number" display="Phone" defaultValue={this.props.user ? `${parseInt(this.props.user.phone)}` : null} placeholder="Phone" className="space-1" required={true}/></div>
                <div><button id="requestSent" className="btn btn-block red" disabled={this.props.pending ? true : this.state.requestSent ? true : false }>{this.state.requestSent ? 'Request Sent' : 'Request Info'}</button></div>
              </Formsy>
            </div>
            <div className={`row ${style.actions} text-capitalize`}>

            { !this.props.pending ?

                this.props.entityType == 'project' || this.props.entityType == 'property' ? (<div>
                  <hr />
                  {    this.state.liked?
                  (<div className={style.action} onClick={e => this.dislike(e)}>
                    <i className='fa fa-heart fa-lg red'></i> &nbsp;&nbsp; Saved
                  </div>) :
                  (<div id="SaveProperty" className={style.action} onClick={e => this.like(e)}>
                    <i className='fa fa-heart-o fa-lg red text-capitalize'></i> &nbsp;&nbsp; Save {this.props.entityType}
                  </div>)}
                </div>
                ) : null

                : null
            }
            </div>
            {this.props.entityType == 'project' || this.props.entityType == 'property' || this.props.entityType == 'agency' || this.props.entityType == 'developer' ? (
              <div className={`row ${style.actions} text-capitalize`}>


                <hr />
                <div id="shareDiv" className={style.action} onClick={()=>{this.showShareDiv()}}>
                  <i className="fa fa-send-o fa-lg red"></i> &nbsp;&nbsp; {this.state.showShareDiv ? "Hide" : "Send to Friend"}
                </div>
                <div style={{display: `${this.state.showShareDiv ? 'block' : 'none'}`, }}>
                  {this.state.showShareDiv ? shareModal : null}
                </div>
              </div>
            ) : null}
            {/*{this.props.entityType == 'property' ? (
              <div className={`row ${style.actions} text-capitalize`}>
                <hr />
                <div className={style.action} onClick={()=>{window.print()}}>
                  <i className="fa fa-print fa-lg red"></i> &nbsp;&nbsp; Print Property Details
                </div>
              </div>
            ) : null}*/}
          </div>
        </div>

        {/* mobile */}
        <div className={`visible-xs`} style={{padding: 10}}>
          <div className="clearfix space-4">
            {this.props.entityType === 'project' && this.props.isMarketedBy
              ? <p className='space-4' style={{fontSize: '13px'}}><b>Authorised Agent</b></p> : null}
            {this.props.entityType === 'project' && !this.props.isMarketedBy
              ? <p className='space-4' style={{fontSize: '13px'}}><b>This project is marketed by</b></p> : null}
            {this.props.entityType === 'property'
              ? <p className='space-4' style={{fontSize: '13px', }}><b>This property is marketed by</b></p> : null}
            {this.props.marketer.first_name ?
              <div>


                <div className={'col-xs-12 no-padding space-4'}>
                  {/*{this.props.marketer.profile_image ? (
                    <div className="col-sm-4 col-xs-4 medium no-padding" style={{width:80}}>
                      <div className="logo" style={{border: "none",
                        background: `url('${imgUpload(this.props.marketer.profile_image, "h_100")}')`,
                        backgroundPosition: 'center', backgroundSize: 'contain', height: 65, width: 65, backgroundRepeat: 'no-repeat',
                      }}/>
                    </div>
                  ) : (
                    <div className="col-sm-4 col-xs-4 medium no-padding" style={{width:80}}>
                      <div className="logo" style={{
                        background: `url('${require('user.png')}')`,
                        backgroundPosition: 'center', backgroundSize: 'contain', height: 65, width: 65, backgroundRepeat: 'no-repeat',
                      }}/>
                    </div>
                  )}*/}
                  {this.props.marketer.name ?
                    <a href={`/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}><h4 className="no-margin text-capitalize ellipses-2">{this.props.marketer.name}</h4></a>
                    :
                    <div className="col-sm-8 col-xs-8 no-padding">
                      <h4 className="space-0 ellipses-2" style={{marginTop: 0, }}>{this.props.marketer.first_name} {this.props.marketer.last_name}</h4>
                      <p className="space-0 ellipses-2 greenHover">{this.props.marketer.agency ? this.props.marketer.agency.name : null}</p>
                    </div>
                  }
                </div>
                {button}
              </div> :

              <div>
                <div className={'col-xs-12 no-padding space-4'}>
                  <a href={`/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
                    {this.props.marketer.logo ? (
                      <div className="col-sm-4 col-xs-4 medium no-padding" style={{width:80}}>
                        <div className="logo" style={{border: "none", 
                          background: `url('${imgUpload(this.props.marketer.logo, "h_100", false)}')`,
                          backgroundPosition: 'center', backgroundSize: 'contain', height: 65, width: 65, backgroundRepeat: 'no-repeat', 
                        }}/>
                      </div>
                    ) : (
                      <div className="col-sm-4 col-xs-4 medium no-padding" style={{width:80}}>
                        <div className="logo" style={{
                          background: `url('${placeholder}')`,
                          backgroundPosition: 'center', backgroundSize: '68% auto', backgroundColor: "#f5f5f5", height: 65, width: 65, backgroundRepeat: 'no-repeat',
                        }}/>
                      </div>
                    )}
                  </a>
                  <div className="col-sm-8 col-xs-8 no-padding">
                    <a href={`/agency/${this.props.marketer.id}/${this.props.marketer.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
                      <h4 className="space-0 ellipses-2" style={{marginTop: 0, }}>{this.props.marketer.name}</h4>
                    </a>
                    {this.props.marketer.agency_areas.length !== 0 ?
                      <a href={`/area/${this.props.marketer.agency_areas[0].area.id}/${this.props.marketer.agency_areas[0].area.name.split(' ').join('-').split(',').join('').split('/').join('-').toLowerCase()}`}>
                        <p className="space-0 ellipses-2 greenHover">{(this.props.marketer.agency_areas && this.props.marketer.agency_areas[0].area.name) || null}, {this.props.marketer.agency_areas[0].area.city.name}</p>
                      </a> : null
                    }
                  </div>
                </div>
                {button}
              </div>

            }
          </div>
          <div className={style.wrapper}>
            <Formsy onValidSubmit={model => this.sendMessage(model)}>
              <div><Input autocomplete='off' ref="numberInputCC" onFocus={()=>{numberInputCCinView()}} name="phone" type="number" display="Phone" defaultValue={this.props.user ? `${this.props.user.phone}` : null} placeholder="Phone" className="space-1" required={true}/></div>
              <div><button id="requestSent" className="btn btn-block red" disabled={this.props.pending ? true : this.state.requestSent ? true : false }>{this.state.requestSent ? 'Request Sent' : 'Request Info'}</button></div>
            </Formsy>
          </div>
          <div className={`row ${style.actions} text-capitalize`}>

            { !this.props.pending ?
              this.props.entityType == 'project' || this.props.entityType == 'property'  ? (<div>
                <hr />
                  {    this.state.liked?
                  (<div className={style.action} onClick={e => this.dislike(e)}>
                    <i className='fa fa-heart fa-lg red'></i> &nbsp;&nbsp; Saved
                  </div>) :
                  (<div id="SaveProperty" className={style.action} onClick={e => this.like(e)}>
                    <i className='fa fa-heart-o fa-lg red text-capitalize'></i> &nbsp;&nbsp; Save {this.props.entityType}
                  </div>)}
                </div>
                ) : null

              : null
            }
            
          </div>
          {this.props.entityType == 'project' || this.props.entityType == 'property' || this.props.entityType == 'agency' || this.props.entityType == 'developer' ? (
            <div className={`row ${style.actions} text-capitalize`}>
              <hr />
              <div id="shareDiv" className={style.action} onClick={()=>{this.showShareDiv()}}>
                <i className="fa fa-send-o fa-lg red"></i> &nbsp;&nbsp; {this.state.showShareDiv ? "Hide" : "Send to Friend"}
              </div>
              <div style={{display: `${this.state.showShareDiv ? 'block' : 'none'}`, }}>
                {this.state.showShareDiv ? shareModal : null}
              </div>
            </div>
          ) : null}
          {/*{this.props.entityType == 'property' ? (
            <div className={`row ${style.actions} text-capitalize`}>
              <hr />
              <div className={style.action} onClick={()=>{window.print()}}>
                <i className="fa fa-print fa-lg red"></i> &nbsp;&nbsp; Print Property Details
              </div>
            </div>
          ) : null}*/}
        </div>
      </div>
    )
  }
}

export default connect(store => {
  return {
    user: store.user.user
  }
})(ContactCard)
