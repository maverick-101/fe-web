import React from 'react';
import Formsy from 'formsy-react';
import axios from 'axios';
import swal from 'sweetalert2';
import Input from 'components/Input';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config';
import style from './style.css';
import Recaptcha from 'react-google-invisible-recaptcha';

class InquiryModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      requestSent: false,
      recaptchaVerified: false,
    }
  }
  onAccept() {
    this.props.onAccept();
    this.setState({show: false})
  }
  recaptchaResolved(inquiry) {
    this.setState({inquiry}, ()=>this.recaptcha.execute())
  }
  sendMessage(message) {
    var inquiry;

    if (message) {
      inquiry = message
    } else {
      inquiry = this.state.inquiry
    }
    
    return axios.post(`${config.apiPath}/api/inquiry`, {
      ...inquiry,
      type: 'request_info',
      // user_id: this.props.marketer ? this.props.marketer.id : null,
      inquireable_id: this.props.entityId,
      inquireable_type: this.props.entityType,
      user_id: this.props.Inquiry_user_id,
    })
    .then(response => {
      swal("Success", "Inquiry has been Sent!", "success");
      this.setState({
        requestSent: true,
      })
      document.body.click();
      document.body.style.overflow = 'unset';
    })
  }
  // dataLayer(){
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push [{
  //     inquiry: 'leads'
  //   }];
  // }
  render () {
    const { requestSent } = this.state;
    return (
      <div>
        { requestSent ?  <Helmet async defer={false}>
        <script>{ `window.dataLayer = window.dataLayer || [];
    window.dataLayer.push [{
      inquiry: 'leads'
    }];`}</script>
        </Helmet> : '' }
       
        <div style={{display: 'none', }}><Recaptcha
          ref={ ref => this.recaptcha = ref }
          sitekey={'6LdEy2MUAAAAACk0oiSLbgjEQbWBW4vFwu8C94Kb'}
          onResolved={() => {this.sendMessage()}} /></div>
        { !this.props.hideCloseButton ? 
            <img className={`${style.inquiryPopupClose}`} src={require('cross.svg')} onClick= {() => {document.body.click(); document.body.style.overflow = 'unset'}} /> : null }
        <div className= 'row'>
          <div className={`col-sm-12 col-xs-12 text-center ${style.inquiryBlock}`}>
            <img src={require('inquiry.svg')} className="img-responsive space-4" alt="Modal Image"/>
            <p><strong>Inquiry Listing</strong></p>
            <p>Need to Inquire About This Listing?</p>
            <p>Enter Your Details and We Will Get Back To You</p>
          </div>
          <div className={`col-sm-12 col-xs-12 ${style.paddingfix} hidden-xs`}>
            <Formsy onValidSubmit={model => this.recaptchaResolved(model)}>
              <Input tabIndex='1' required={true} name="name" type="text" display="Name" defaultValue={this.props.user ? `${this.props.user.first_name} ${this.props.user.last_name}` : null} placeholder="Name" className="space-1" required/>
              <Input tabIndex='2' required={true} name="email" type="email" display="Email" defaultValue={this.props.user ? `${this.props.user.email}` : null} placeholder="Email" className="space-1" required/>
              <Input tabIndex='3' required={true} name="phone" type="number" display="Phone" defaultValue={this.props.user ? `${this.props.user.phone}` : null} placeholder="Phone" className="space-1" required/>
              {/*<Textarea style={{"resize":"none"}} required={true} name="message" rows="3" placeholder="Enter your message..." className="space-1" />*/}
              <button className="btn btn-block red" disabled={this.state.requestSent}>{this.state.requestSent ? 'Request Sent' : 'Request Info'}</button>
            </Formsy>
          </div>
          <div className={`col-sm-12 col-xs-12 ${style.paddingfix} visible-xs`}>
            <Formsy onValidSubmit={model => {this.sendMessage(model)}}>
              <Input tabIndex='1' required={true} name="name" type="text" display="Name" defaultValue={this.props.user ? `${this.props.user.first_name} ${this.props.user.last_name}` : null} placeholder="Name" className="space-1" required/>
              <Input tabIndex='2' required={true} name="email" type="email" display="Email" defaultValue={this.props.user ? `${this.props.user.email}` : null} placeholder="Email" className="space-1" required/>
              <Input tabIndex='3' required={true} name="phone" type="number" display="Phone" defaultValue={this.props.user ? `${this.props.user.phone}` : null} placeholder="Phone" className="space-1" required/>
              {/*<Textarea style={{"resize":"none"}} required={true} name="message" rows="3" placeholder="Enter your message..." className="space-1" />*/}
              <button className="btn btn-block red" disabled={this.state.requestSent}>{this.state.requestSent ? 'Request Sent' : 'Request Info'}</button>
            </Formsy>
          </div>
        </div>
        <a href="#" onClick={e => this.showModal(e)}>
          {this.props.children}
        </a>
      </div>
    )
  }
}
export default connect(store => {
  return {
    user: store.user.user
  }
})(InquiryModal)
