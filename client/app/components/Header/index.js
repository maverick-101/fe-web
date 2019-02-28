import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
// import OverlayTrigger from 'components/OverlayTrigger'
import Popover from 'react-bootstrap/lib/Popover'
import Formsy from 'formsy-react'
import Input from 'components/Input'
// import Autosearch from 'components/Autosearch'
import { convertUnit } from 'helpers'
import Cookies from 'js-cookie'
import swal from 'sweetalert2';
import config from 'config';
import axios from 'axios';

import userPlaceholder from 'user.png';
import { checkForHttps } from 'helpers'

import { getAreas } from 'actions/city'
import { setSearchQuery, search, searchProperty } from 'actions/property'
import { openSignup, closeSignup, openLogin, closeLogin } from 'actions/header'
import { signUp, logIn, oauthLogin, checkEmail, forgotPassword, unitChange, currencyChange, setCurrencyRates, getCurrentUser, resendVerificationEmail } from 'actions/user'

import Recaptcha from 'react-recaptcha'

import style from './style.css'
import google from 'google.svg'

class Header extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showForm: false,
			forgot: false,
			remember: false,
			showPassword: false,
			showPasswordSignUp: false,
			inputValues: {
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				validating: false,
			}
		}
		this.slideState = true
	}
	getArray(length) {
		return new Array(length).fill(undefined)
	}
	slide() {
		document.body.classList.toggle('slide', this.slideState)
		document.documentElement.classList.toggle('slide', this.slideState)
		this.slideState = !this.slideState
	}
	registerUser(user) {
		this.checkEmail(user.email)
			.then(exists => !exists ? this.props.dispatch(signUp(user)) : '')
			.then((user) => {
				this.props.dispatch(closeSignup())
				if (user) {
					swal("Account has been created!", "We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrive. ", "success"); 
				}
				else {
					window.alert('no user found')
				}
			})
			// .then(response => window.alert('response'))
	}
	loginUser(user) {
		this.props.dispatch(logIn(user))
			.then((user) => {
				this.props.dispatch(getCurrentUser());
				return this.props.dispatch(closeLogin());
			})
	}
	checkEmail(email) {
		
		return this.props.dispatch(checkEmail(email))
			.then(exists => {
				if(exists) {
					this.refs.signupForm.updateInputsWithError({email: 'Email already exists'})
				}
			})
	}
	resendVerificationEmail(event) {
		event.preventDefault();
		this.props.dispatch(resendVerificationEmail(this.loginFormRef.getModel()))
		.then(() => {
			this.props.dispatch(closeLogin());
		})
	}
	setInputState(value, type) {
		let inputValues = this.state.inputValues;
		inputValues[type] = value;
		this.setState({
			inputValues: inputValues,
		});
	}
	renderSignupModal() {
		var modalBody = (
			<div>
				<button className={`btn btn-block btn-xlg space-1 ${style.facebookBtn}`} onClick={() => this.props.dispatch(oauthLogin('facebook'))}>
					<i className="fa fa-facebook fa-lg vcenter-absolute"></i>
          Continue with Facebook
				</button>
				<button className="btn btn-block btn-xlg hollow" style={{position: 'relative', boxShadow: '0px 3px 10px rgba(0,0,0,0.10)', }} onClick={() => this.props.dispatch(oauthLogin('google'))}>
					<span className={`${style.googleLogo} vcenter-absolute`}>
						<svg>
							<use xlinkHref={`${google}#Google-Button`}></use>
						</svg>
					</span>
					<span>Continue with Google</span>
				</button>
				<div className="separator">
					<span>or</span>
				</div>
				<button className="btn btn-block btn-xlg red space-2" onClick={() => this.setState({showForm: true})} style={{boxShadow: '0px 3px 10px rgba(0,0,0,0.20)',}}>Signup with Email</button>
			</div>
		)

    var modalFormBody = (
			<div>
				<p className="text-center">
				Sign up with <a href="#" onClick={() => this.props.dispatch(oauthLogin('facebook'))} className="green">Facebook</a> or <a onClick={() => this.props.dispatch(oauthLogin('google'))} href="#" className="green">Google</a>
				</p>
				<div className="separator">
					<span>or</span>
				</div>
				<Formsy onSubmit={(model) => {this.checkEmail(model.email)}} onValidSubmit={model => this.props.user.loading || this.registerUser(model)} ref="signupForm">
					<Input type="text" onChange
					={(e)=>{this.setInputState(e, "first_name")}} defaultValue={this.state.inputValues['first_name']} name="first_name" display="First name" placeholder="First name*" containerClass="space-1" required/>
					<Input type="text" onChange={(e)=>{this.setInputState(e, "last_name")}} defaultValue={this.state.inputValues['last_name']} name="last_name" display="Last name" placeholder="Last name*" containerClass="space-1" required/>
					<Input type="email" onChange={(e)=>{this.setInputState(e, "email")}} defaultValue={this.state.inputValues['email']} name="email" display="Email" placeholder="Email Address*" containerClass="space-1" required validations="isEmail"
						validationError="Please enter a valid email address"
						onBlur={(email) => this.checkEmail(email)}
					/>
					<div className="col-xs-12 vcenter no-padding">
					{/* $^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,90}$ */}
						<Input type={`${this.state.showPasswordSignUp ? "text" : "password"}`} defaultValue={this.state.password} validations={{ matchRegexp: /^(?=.*[A-Za-z])(?=.*\d).{8,30}$/ }} validationErrors={{matchRegexp: 'Your password is not strong enough. Please make sure your passsword contains minimum eight characters, at least one letter and one number'}} name="password" display="Password"  placeholder="Password*" containerClass="space-1" required/>
						{/* <Input type={`${this.state.showPasswordSignUp ? "text" : "password"}`} name="password" display="Password" placeholder="Password*" containerClass="space-1" required/> */}
					{
						!this.props.isMobile && this.props.prebootFlag ? 
							<div className={`${style.showPassSignUp} hidden-xs`} onMouseDown={() => {this.setState({showPasswordSignUp: true})}} 
							onMouseUp={() => {this.setState({showPasswordSignUp: false})}} draggable={false} onMouseOut={() => {this.setState({showPasswordSignUp: false})}}  onTouchStart={() => {this.setState({showPasswordSignUp: true})}} onTouchEnd={() => {this.setState({showPasswordSignUp: false})}}>
								<i className="fa fa-eye"></i>
							</div> : null
					}
					{
					this.props.isMobile && this.props.prebootFlag ? 
						<div className={`${style.showPassSignUp} visible-xs`} onTouchStart={() => {this.setState({showPasswordSignUp: true})}} 
						onTouchEnd={() => {this.setState({showPasswordSignUp: false})}} draggable={false} onMouseOut={() => {this.setState({showPasswordSignUp: false})}} >
							<i className="fa fa-eye"></i>
						</div> : null
					}
					</div>
					<Input type="text" onChange={(e)=>{this.setInputState(e, "phone")}} defaultValue={this.state.inputValues['phone']} name="phone" type='number' placeholder="Contact No." containerClass="space-1" />
					<h5>Birthday</h5>
					<div className="row space-2">
						<div className="col-xs-5">
							<select name="month" className="form-control">
								<option value="">Month</option>
								{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
									(month, index) => <option key={index} value={index}>{month}</option>
								)}
							</select>
						</div>
						<div className="col-xs-3 no-padding">
							<select name="day" className="form-control">
								<option value="">Day</option>
								{this.getArray(31).map((val, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
							</select>
						</div>
						<div className="col-xs-4">
							<select name="year" className="form-control">
								<option value="">Year</option>
								{this.getArray(100).map((val, index) => <option key={index} value={2016 - index}>{2016 - index}</option>)}
							</select>
						</div>
					</div>
					<label>
						<input type="checkbox"/> I’d like to receive coupons, promotions, surveys, and updates via email about Graana and its partners.
					</label>
					<Recaptcha elementID='signup-recaptcha' verifyCallback={ ()=> this.recaptchaVerified() } sitekey="6LcC4zwUAAAAAEeei0rX2ExGx6pPiZ9kqGBtdSDT" render="explicit" onloadCallback={()=> {}} />
					<button className={`btn btn-block btn-xlg red space-1 ${this.props.user.loading ? 'loading' : ''}`}>Sign Up</button>
				</Formsy>
			</div>
		)

    return (
			<Modal show={this.props.header.signup} onHide={() => this.props.dispatch(closeSignup())} dialogClassName="reveal">
				<Modal.Header closeButton>
					<h4 className="gray">Sign Up</h4>
				</Modal.Header>
				<Modal.Body>
					{this.state.showForm ? modalFormBody : modalBody}
					<p className="small">
            By signing up, I agree to Graana’s <a href="/graana/terms" className="green">Terms & Conditions</a>.
					</p>
					<hr/>
					<div className="row">
						<span className="col-sm-8 col-xs-6 vcenter">Already have a Graana account?</span>
						<div className="col-sm-4 col-xs-6 vcenter text-right">
							<button className="btn red hollow" onClick={() => this.props.dispatch(openLogin())}>Log in</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		)
  }
	sendForgotPasswordMail(model) {
		forgotPassword(model)
			.then((response) => {
				if(response == 'Email not found'){
					swal("Account not found", "Please enter a valid email", "error");
				}
				else {
					swal("Email Sent!", "An email containing password reset information has been sent to your email", "success");
				}
			})
			.catch((error) => {
			})
	}
	openForgotPassword(event) {
		event.preventDefault()
    this.props.dispatch(closeLogin())
		this.setState({forgot: true})
	}
	renderForgotPassModal() {
		return (
			<Modal show={this.state.forgot} onHide={() => this.setState({forgot: false})} dialogClassName="reveal">
				<Modal.Header closeButton>
					<h4>Forgot password?</h4>
				</Modal.Header>
				<Modal.Body>
					<p>Enter the email address you used to register, and we will send you a secure link to reset your password.</p>
					<Formsy onValidSubmit={this.sendForgotPasswordMail.bind(this)}>
						<Input type="email" name="email" display="Email" containerClass="space-2" placeholder="Email Address" required validations="isEmail" validationError="Please enter a valid email address"/>
						<button className="btn red">Send Link</button>
					</Formsy>
				</Modal.Body>
			</Modal>
		)
	}
	renderLoginModal() {
		return (
			<Modal show={this.props.header.login} onHide={() => this.props.dispatch(closeLogin())} dialogClassName="reveal">
				<Modal.Header closeButton>
					<h4 className="gray">Log In</h4>
				</Modal.Header>
				<Modal.Body>
					{/* <svg style={{ fill:'#ef5350', padding: '0px 30px 30px 30px' }} xmlns={`${require('logo.svg')}#logo`} id="logo" x="0px" y="0px" viewBox="0 0 801.4 222.8">
						<g>
							<path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9     c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20     C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6     c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30     c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14     c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6     c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4     c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1     c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3     c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7     c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1     c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z" />
							<path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z" />
							<g>
								<path d="M400.8,105.8h0.3c4.8-7.3,11.9-11.4,20.7-11.4c3.4,0,6.8,0.8,9.8,2l-2.9,22.1c-2.9-2-6.3-3.1-9.8-3.1      c-16.5,0-18.2,14.6-18.2,27.5v37.5h-23.8V97.2h23.8v8.6C400.7,105.8,400.8,105.8,400.8,105.8z"></path>
								<path d="M518,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8H518V180.5z M497,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2s7.5,23.4,19.7,23.4      C489.4,162.2,497,150,497,138.8z"></path>
								<path d="M613.9,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L613.9,180.5L613.9,180.5z M592.9,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4S592.9,150,592.9,138.8z"></path>
								<path d="M654.8,104.8h0.3c4.9-7.5,13.2-10.3,21.7-10.3c22.4,0,28.8,15.8,28.8,35.1v50.9h-23.8v-44.1c0-10,0.5-22.9-12.9-22.9      c-14.1,0-14.3,15.8-14.3,25.8v41.2H631V97.2h23.8V104.8z"></path>
								<path d="M801.4,180.5H778v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L801.4,180.5L801.4,180.5z M780.3,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4C772.7,162.2,780.3,150,780.3,138.8z"></path>
								<path d="M302,110.3h62.7c0.4,1.4,0.7,3.2,0.9,5.2c0.2,2,0.4,4,0.4,6.1c0,8.2-1.2,15.9-3.7,23.2s-6.4,13.7-11.8,19.5      c-5.7,6.1-12.6,10.8-20.5,14.1c-8,3.3-17.1,5-27.3,5c-9.3,0-18-1.7-26.2-5s-15.4-8-21.4-13.9c-6.1-5.9-10.9-13-14.5-21.2      s-5.4-17-5.4-26.7s1.8-18.5,5.4-26.7c3.6-8.1,8.4-15.2,14.5-21.2c6.1-5.9,13.2-10.6,21.4-13.9c8.2-3.3,17-5,26.2-5      c10.4,0,19.6,1.8,27.8,5.4c8.1,3.6,15.1,8.5,21,14.8l-16.6,16.2c-4.2-4.4-8.8-7.8-13.9-10.1c-5.1-2.3-11.2-3.5-18.4-3.5      c-5.8,0-11.4,1-16.6,3.1s-9.8,5-13.7,8.8c-3.9,3.8-7.1,8.4-9.4,13.8s-3.5,11.5-3.5,18.1c0,6.7,1.2,12.7,3.5,18.1s5.5,10,9.5,13.8      s8.6,6.8,13.8,8.8c5.2,2.1,10.8,3.1,16.8,3.1c6.8,0,12.5-1,17.2-2.9c4.7-2,8.7-4.5,12-7.6c2.4-2.1,4.4-4.8,6.2-8.1      c1.7-3.3,3.1-6.9,4-11H302V110.3z"></path>
							</g>
						</g>
					</svg> */}
					<Formsy ref={(loginFormRef)=> this.loginFormRef = loginFormRef} onValidSubmit={model => this.props.user.loading || this.loginUser(model)}>
						<Input type="email" name="email" display="Email" className="large" containerClass="space-1" placeholder="Email Address" required validations="isEmail" validationError="Please enter a valid email address"/>
						<div className="row no-margin" style={{position: "relative", }}>
							<Input type={this.state.showPassword ? "text" : "password"} ref="logInPass" name="password" display="Password" className="large" placeholder="Password" required/>
							<div className={`${style.showPass}`} onMouseDown={() => {this.setState({showPassword: true})}} 
							onMouseUp={() => {this.setState({showPassword: false})}} draggable={false} onMouseOut={() => {this.setState({showPassword: false})}} onTouchStart={() => {this.setState({showPassword: true})}} onTouchEnd={() => {this.setState({showPassword: false})}}>
								<i className="fa fa-eye"></i>
							</div>
							<p className="error">{this.props.user.message}</p>
							{ this.props.user.message == 'Kindly verify via email.' ? 
								<p>Did not get Verification Email? <a onClick={ (e) => { this.resendVerificationEmail(e) } } className={style.verification} style={{textAlign: 'center'}}>Resend Verification Email</a></p> : null
							}
							<div className="row space-1">
								<div className="col-xs-6 vcenter no-padding-right">
									<Input value='remember' value={this.state.remember} onChange={() => {this.setState({remember: !this.state.remember})}} className={style.checkBox} name='remember' type="checkbox"/>
									<label style={{float:'left'}}>
											Remember me
									</label>
								</div>
								<a href="#" className="green col-xs-6 vcenter text-right" onClick={(event) => this.openForgotPassword(event)}>Forgot Password?</a>
							</div>
						</div>
						<button className={`btn btn-block btn-xlg red ${this.props.user.loading ? 'loading' : ''}`} style={{'box-shadow': '0px 3px 10px rgba(0,0,0,0.20)',outline: 'none'}}>Log In</button>
					</Formsy>
					<div className="separator">
						<span>or</span>
					</div>
					<button className={`btn btn-block btn-xlg space-1 ${style.facebookBtn}`} onClick={() => this.props.dispatch(oauthLogin('facebook'))}>
						<i className="fa fa-facebook fa-lg vcenter-absolute"></i>
            Continue with Facebook
					</button>
					<button className="btn btn-block btn-xlg hollow" style={{position: 'relative', 'box-shadow': '0px 3px 10px rgba(0,0,0,0.10)',}} onClick={() => this.props.dispatch(oauthLogin('google'))}>
						<span className={`${style.googleLogo} vcenter-absolute`}>
							<svg>
								<use xlinkHref={`${google}#Google-Button`}></use>
							</svg>
						</span>
						<span>Continue with Google</span>
					</button>
					{/* <hr/>
					<div className="row">
						<span className="col-sm-8 col-xs-6 vcenter">Don’t have a Graana account?</span>
						<div className="col-sm-4 col-xs-6 vcenter text-right">
							<button className="btn red hollow" onClick={() => this.props.dispatch(openSignup())}>Sign Up</button>
						</div>
					</div> */}
				</Modal.Body>
			</Modal>
		)
	}
	searchAreas(q) {
		q = q ? q.split(',')[0].toLowerCase() : ''
    this.props.dispatch(setSearchQuery({q, aread_id: '', city_id: ''}))
		this.props.dispatch(getAreas({q, cities: 1}))
	}
	renderHeaderTitle() {
		// if (this.props.header.search) {
		// 	return (
		// 		<Autosearch
		// 			name="search"
		// 			placeholder="Search..."
		// 			data={this.props.city.areas}
		// 			value={`${this.props.query.q ? `${this.props.query.q},` : ''} ${this.props.query.city ? ` ${this.props.query.city}` : ''}`.replace(/\b\w/g, l => l.toUpperCase())}
		// 			renderInputComponent={(props) => (
		// 				<div className={style.headerSearch}>
		// 					<i className="fa fa-search fa-lg gray"></i>
		// 					<input type="text" autoComplete="off" {...props}/>
		// 				</div>
		// 			)}
		// 			getSuggestionValue={suggestion => `${suggestion.name}, ${suggestion.city.name}`.replace(/\b\w/g, l => l.toUpperCase())}
		// 			renderSuggestion={suggestion => `${suggestion ? suggestion.name : ''} ${suggestion ? `, ${suggestion.city.name}` : ''}`.replace(/\b\w/g, l => l.toUpperCase())}
		// 			focusFirstSuggestion={true}
		// 			onFocus={q => this.searchAreas(q)}
		// 			onType={q => this.searchAreas(q)}
		// 			onSelect={area => {
		// 				this.props.dispatch(setSearchQuery({area_id: area.id, city_id: area.city ? area.city.id : ''}))
		// 				this.props.dispatch(search())
		// 				this.props.dispatch(searchProperty())
		// 			}}
		// 		/>
		// 	)
		// } else if (this.props.header.title) {
		// 	return this.props.header.title
    // } else {
		// 	return null
    // }
	}
	openSignup(event) {
		event.preventDefault()
    this.props.dispatch(openSignup())
	}
	openLogin(event) {
		event.preventDefault()
    this.props.dispatch(openLogin())
	}
	searchByPropertyId(event) {
		this.setState({validating: true})
		event.preventDefault();
		if (event.target.elements.property_id.value <= 999999999) {
		var idValue = event.target.elements.property_id.value;
		axios.get(`${config.apiPath}/api/property/${idValue}`)
			.then((response) => {
				this.setState({validating: false});
				window.location.href = `/property/property-by-id-${idValue}`
			})
			.catch(() => {
				this.setState({validating: false});
				swal("Invalid ID", "Please enter a valid ID", "error");
			})
		}
		else {
				this.setState({validating: false})
				swal("Invalid ID", "Please enter a valid ID", "error");
		}
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
	componentDidMount () {
		this.props.dispatch(setCurrencyRates());
		if (document.body.offsetWidth < 768 && (window.location.pathname != '/')) {
			document.getElementById('appHeader').style.transition = "ease 0.5s";
			document.getElementById('appHeader').style.transform = "translate3d(0, 0, 0)";
			var lastST = document.getElementById('app').scrollTop;
			var scrollingState = false;
			document.getElementById('app').addEventListener('scroll', function() {
				var st = document.getElementById('app').scrollTop;
				var closeToBottom = st > (document.getElementById('app').children[0].offsetHeight - (window.innerHeight + 250));
				var closeToTop = st < (document.body.clientHeight + 150);
				var scrollingDown = st > (lastST + 10);
				var scrollingUp = st < (lastST - 30);
				if ((scrollingDown || closeToBottom) && (scrollingState != true)) {
					document.getElementById('appHeader').style.top = "-66px";
					scrollingState = true;
				}
				if ((scrollingUp || closeToTop) && (scrollingState != false)) {
					document.getElementById('appHeader').style.top = "0px";
					scrollingState = false;
				}
				lastST = st;
				return true;
			})
		}
	}
	render() {
		var userDropdown = (
			<Popover id="user-dropdown" className={`${style.userDropdown}`}>
				<ul className={`list-unstyled no-margin ${style.userNav}`}>
					<li>
						<div className={style.hoverItem}>
							<div className="profile-image vcenter" style={{marginRight: 10}}>
								<img src={this.props.user.user && this.props.user.user.profile_image ? checkForHttps(this.props.user.user.profile_image) : userPlaceholder} alt={this.props.user.user && this.props.user.user.first_name ? this.props.user.user.first_name : 'user'} />
							</div>
							<div className="vcenter">
								<p className="black space-0">{this.props.user.user && `${this.props.user.user.first_name} ${this.props.user.user.last_name}`}</p>
								{/* <p className="small space-0">Edit Profile</p> */}
							</div>
						</div>
					</li>
					{/* {this.props.user.user && this.props.user.user.agency ? (
						<li>
							<div className={style.hoverItem}>
								<div className="vcenter" style={{marginRight: 10}}>
									<img className="logo small" src={this.props.user.user.agency.logo ? this.props.user.user.agency.logo : null}/>
								</div>
								<div className="vcenter">
									<p className="black space-0">{this.props.user.user.agency.name}</p>
									<p className="small space-0">View Agency</p>
								</div>
							</div>
						</li>
					) : null} */}
					<li>
						<Link to={this.props.user && this.props.user.user && this.props.user.user.agency && this.props.user.user.agency.developer ? "/dashboard/project-dashboard" : "/dashboard"}>
							<div className={style.hoverItem}>Dashboard</div>
						</Link>
					</li>
					<li>
						<a href="/dashboard/listings">
							<div className={style.hoverItem}>Listings</div>
						</a>
					</li>
					<li>
						<a href="/dashboard/account-settings">
							<div className={style.hoverItem}>Account</div>
						</a>
					</li>
					<li>
						<Link to="/logout">
							<div className={style.hoverItem}>Logout</div>
						</Link>
					</li>
				</ul>
			</Popover>
		)
    var unitDropdown = (
			<Popover id="price-dropdown" className={`${style.slimDropdown}`}>
				<ul className="list-unstyled no-margin">
					<li onClick={() => this.changeUnit('standard')}>Standard</li>
					<li onClick={() => this.changeUnit('sqft')}>SqFt</li>
					<li onClick={() => this.changeUnit('sqyd')}>SqYd</li>
					<li onClick={() => this.changeUnit('sqm')}>M<sup>2</sup></li>
					<li onClick={() => this.changeUnit('marla')}>Marla</li>
					<li onClick={() => this.changeUnit('kanal')}>Kanal</li>
				</ul>
			</Popover>
		)
    var priceDropdown = (
			<Popover id="price-dropdown" className={`${style.slimDropdown}`}>
				<ul className="list-unstyled no-margin">
					<li onClick={() => this.changeCurrency('PKR')}>PKR</li>
					<li onClick={() => this.changeCurrency('AED')}>AED</li>
					<li onClick={() => this.changeCurrency('AUD')}>AUD</li>
					<li onClick={() => this.changeCurrency('CAD')}>CAD</li>
					<li onClick={() => this.changeCurrency('CNY')}>CNY</li>
					<li onClick={() => this.changeCurrency('EUR')}>EUR</li>
					<li onClick={() => this.changeCurrency('GBP')}>GBP</li>
					<li onClick={() => this.changeCurrency('JPY')}>JPY</li>
					<li onClick={() => this.changeCurrency('SAR')}>SAR</li>
					<li onClick={() => this.changeCurrency('USD')}>USD</li>
				</ul>
			</Popover>
		)
    return (
			<header className={`clearfix ${style.headerContainer} ${this.props.user.user ? style.loggedIn : ''} ${this.props.header.absolute ? ((document.body.clientWidth > 768) ? (style.absolute) : '') : ''} ${this.props.header.absoluteTwo ? style.absoluteTwo : ''}`}>
				{
				// 	!this.props.isMobile && this.props.prebootFlag ? 
				// <div className={`${style.miniHeader} hidden-xs`}>
				// 	<ul className={`list-inline no-margin pull-right ${style.miniHeader_nav}`}>
				// 		<li className={style.miniHeader_input}>
				// 			{/* <form onSubmit={event => this.searchByPropertyId(event)}>
				// 				{this.state.validating ? 
				// 				<div style={{position: 'absolute', top: '1px', right: '2px', display: 'inline-block', padding: '0px, 10px'}}>
				// 						<p style={{display: 'inline-block', padding: '0px, 10px'}} className='space-0'>Validating </p>
				// 						<i className="fa fa-spinner fa-pulse fa-spin" style={{fontSize:'18px'}}/>
				// 				</div> : null}
				// 				<input style={{width: '120px'}} required={true} type="number" name="property_id" placeholder="Property ID" autoComplete="off"/>
				// 			</form> */}
				// 		</li>
				// 		{/* <li>
				// 			<OverlayTrigger trigger={['focus', 'hover']} container={() => ReactDOM.findDOMNode(this.refs.price)} placement="bottom" overlay={priceDropdown}>
				// 				<div ref="price" style={{position: 'relative'}}>
				// 					{this.props.user.currency} <i className="fa fa-caret-down"></i>
				// 				</div>
				// 			</OverlayTrigger>
				// 		</li> */}
				// 		{/* <li>
				// 			<OverlayTrigger trigger={['focus', 'hover']} container={() => ReactDOM.findDOMNode(this.refs.unit)} placement="bottom" overlay={unitDropdown}>
				// 				<div ref="unit" style={{position: 'relative'}}>
				// 					{convertUnit(this.props.user.unit)} <i className="fa fa-caret-down"></i>
				// 				</div>
				// 			</OverlayTrigger>
				// 		</li> */}
				// 		<li id="signUpBtn" className={style.showLogout}>
				// 			<a href="#" onClick={event => this.openSignup(event)}>Sign Up</a>
				// 		</li>
				// 		<li id="loginBtn" className={style.showLogout}>
				// 			<a href="#" onClick={event => this.openLogin(event)}>Log In</a>
				// 		</li>
				// 		<li className={`pointer ${style.showLogin}`}>
				// 			{/* <OverlayTrigger trigger={['focus', 'hover']} container={() => ReactDOM.findDOMNode(this.refs.target)} placement="bottom" overlay={userDropdown}>
				// 				<div ref="target" style={{margin:0, position: 'relative'}}>
        //           Welcome {this.props.user.user ? this.props.user.user.first_name : ''} <i className="fa fa-caret-down"></i>
				// 				</div>
				// 			</OverlayTrigger> */}
				// 		</li>
				// 		<li className={`pointer ${style.showLogin}`}><Link  to="/dashboard/leads"><i className="fa fa-envelope"></i>{this.props.user.notifications > 0 ? <span className="badge badge-pill red" style={{ marginLeft: '5px' }}>{this.props.user.notifications}</span>: null}</Link></li>
				// 	</ul>
				// </div> : null
			}
				<div id="appHeader" className={style.headerWrapper}>
					<div id="HeaderLogo" className={style.headerWrapper_logo}>
						<a href="/">
							<img className={`header-logo ${style.headerLogo} ${style.lightLogo}`} src={require('../../../site-specs/sliced-images/logo.header.png')}/>
							<img className={`header-logo ${style.headerLogo} ${style.darkLogo}`} src={require('../../../site-specs/sliced-images/logo.header-dark.png')}/>
						</a>
					</div>
					{
						!this.props.isMobile && this.props.prebootFlag ? 
					<ul className={`list-inline pull-right hidden-xs no-margin ${style.headerWrapper_nav}`}>
						<li><a id="home" href="/home" className={["home"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Home</a></li>
						<li><a id="hotels" href="/hotels" className={["hotels"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Hotels</a></li>
						<li><a id="packages" href="/packages" className={["packages"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Packages</a></li>
						{/* <li><a id="Wanted" href="/wanted" className={`${style.headerWrapper_wantedButton}`}>Wanted</a></li> */}
						<li><a id="events" href="/events" className={["events"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Events</a></li>
						<li><a id="blog" href="/blog" className={["blog"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Blog</a></li>
						<li><a id="contactus" href="/contactus" className={["contactus"].indexOf(window.location.pathname.split('/')[1]) != -1 ? style.headerWrapper_navActive : ''}>Contact Us</a></li>
					</ul> : null
				}
				{ 
						!this.props.isMobile && this.props.prebootFlag ? 
					<div className={`${style.headerWrapper_title} hidden-xs`}>
						{this.renderHeaderTitle()}
					</div> : null
				}
					<div className={`visible-xs-block pull-right ${style.hamburger}`} onClick={() => this.slide()}>
						<span></span>
					</div>
				</div> 
				<div className={style.animateCover} onClick={()=>{this.slide()}}></div>
				{ this.props.isMobile && this.props.prebootFlag ? 
				<div style={{overflow: 'scroll'}} className={`${this.props.user.user ? style.loggedIn : ''} ${style.mobileNavWrapper} visible-xs`}>
					<div style={{padding: '0 10px'}}>
						{/* <div className={style.headerWrapper_logo}>
							<a href="/">
								<svg xmlns={`${require('logo.svg')}#logo`} id="logo" x="0px" y="0px" viewBox="0 0 801.4 222.8">
									<g>
										<path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9
											c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20
											C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6
											c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30
											c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14
											c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6
											c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4
											c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1
											c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3
											c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7
											c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1
											c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"/>
										<path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"
											/>
										<g>
											<path d="M400.8,105.8h0.3c4.8-7.3,11.9-11.4,20.7-11.4c3.4,0,6.8,0.8,9.8,2l-2.9,22.1c-2.9-2-6.3-3.1-9.8-3.1
												c-16.5,0-18.2,14.6-18.2,27.5v37.5h-23.8V97.2h23.8v8.6C400.7,105.8,400.8,105.8,400.8,105.8z"/>
											<path d="M518,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9
												c8.7,0,17.5,3.7,23.2,10.5v-7.8H518V180.5z M497,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2s7.5,23.4,19.7,23.4
												C489.4,162.2,497,150,497,138.8z"/>
											<path d="M613.9,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9
												c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L613.9,180.5L613.9,180.5z M592.9,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2
												s7.5,23.4,19.7,23.4S592.9,150,592.9,138.8z"/>
											<path d="M654.8,104.8h0.3c4.9-7.5,13.2-10.3,21.7-10.3c22.4,0,28.8,15.8,28.8,35.1v50.9h-23.8v-44.1c0-10,0.5-22.9-12.9-22.9
												c-14.1,0-14.3,15.8-14.3,25.8v41.2H631V97.2h23.8V104.8z"/>
											<path d="M801.4,180.5H778v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9
												c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L801.4,180.5L801.4,180.5z M780.3,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2
												s7.5,23.4,19.7,23.4C772.7,162.2,780.3,150,780.3,138.8z"/>
											<path d="M302,110.3h62.7c0.4,1.4,0.7,3.2,0.9,5.2c0.2,2,0.4,4,0.4,6.1c0,8.2-1.2,15.9-3.7,23.2s-6.4,13.7-11.8,19.5
												c-5.7,6.1-12.6,10.8-20.5,14.1c-8,3.3-17.1,5-27.3,5c-9.3,0-18-1.7-26.2-5s-15.4-8-21.4-13.9c-6.1-5.9-10.9-13-14.5-21.2
												s-5.4-17-5.4-26.7s1.8-18.5,5.4-26.7c3.6-8.1,8.4-15.2,14.5-21.2c6.1-5.9,13.2-10.6,21.4-13.9c8.2-3.3,17-5,26.2-5
												c10.4,0,19.6,1.8,27.8,5.4c8.1,3.6,15.1,8.5,21,14.8l-16.6,16.2c-4.2-4.4-8.8-7.8-13.9-10.1c-5.1-2.3-11.2-3.5-18.4-3.5
												c-5.8,0-11.4,1-16.6,3.1s-9.8,5-13.7,8.8c-3.9,3.8-7.1,8.4-9.4,13.8s-3.5,11.5-3.5,18.1c0,6.7,1.2,12.7,3.5,18.1s5.5,10,9.5,13.8
												s8.6,6.8,13.8,8.8c5.2,2.1,10.8,3.1,16.8,3.1c6.8,0,12.5-1,17.2-2.9c4.7-2,8.7-4.5,12-7.6c2.4-2.1,4.4-4.8,6.2-8.1
												c1.7-3.3,3.1-6.9,4-11H302V110.3z"/>
										</g>
									</g>
								</svg>
							</a>
						</div> */}
						{/* <p style={{marginTop: 10, padding: '0 10px', marginBottom: '10px', textAlign: 'center', }}>Pakistan&#39;s Smartest Property Portal</p> */}
					</div>

					<ul className={`list-unstyled ${style.mobileNav}`} onClick={() => this.slide()}>
						{/* {this.props.user.user ? <li className={`pointer`}>
								<div className='text-center' style={{padding: '25px 15px', }}>
									<Link to="/dashboard/account-settings">
										<img style={{marginBottom:'10px', borderRadius:'50%', width:'70px', height:'70px'}} src={this.props.user.user && this.props.user.user.profile_image ? checkForHttps(this.props.user.user.profile_image) : userPlaceholder} alt="user profile image"/>
										<div className='text-captilize' style={{position: 'relative'}}>
											<p style={{fontSize:'18px', margin: '0px'}} className='text-capitalize'>Welcome {this.props.user.user ? this.props.user.user.first_name : ''}</p>
											{this.props.user.user.agency ? <p className="black space-0">{this.props.user.user.agency.name}</p> : null}
										</div>
									</Link>
								</div>
						</li> :  <li><br /></li>} */}
						 {/*<li className={`pointer`}>
							<p className="text-center lead" style={{fontSize: 20, padding: "25px 15px", }}>GUEST USER</p>
						</li>*/}
						<li className={style.lead}>
								<Link to="/home">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Home</p>
								</Link>
						</li>
						<li className={style.lead}>
								<Link to="/hotels">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Hotels</p>
								</Link>
						</li>
						<li className={style.lead}>
								<Link to="/packages">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Packages</p>
								</Link>
						</li>
						<li className={style.lead}>
								<Link to="/events">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Events</p>
								</Link>
						</li>
						<li className={style.lead}>
								<Link to="/blog">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Blog</p>
								</Link>
						</li>
						<li className={style.lead}>
								<Link to="/contactus">
										<p className={`lead large`} style={{fontSize: 18, padding: "20px 15px", }}>Contact us</p>
								</Link>
						</li>
						{/* <li className={style.lead}>
							<a href="/wanted">
								<p className={`lead large ${style.wantedButton}`} style={{fontSize: 18, padding: "20px 15px", }}>Wanted</p>
							</a>
						</li> */}
						{/* {this.props.user.user ? <li className={style.lead}>
							<Link to={this.props.user && this.props.user.user && this.props.user.user.agency && this.props.user.user.agency.developer ? "/dashboard/project-dashboard" : "/dashboard"}>
								<p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Dashboard</p>
							</Link>
						</li> : null}
						<li className={style.lead}>
							<a href="/"><p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Home</p></a>
						</li>
						{this.props.user.user ? null : <li className={style.lead}>
							<a onClick={() => this.props.dispatch(openSignup())}><p className="lead large" style={{fontSize: 18, padding: "20px 15px", }}>Sign Up</p></a>
						</li>}
						{this.props.user.user ? null : <li className={style.lead}>
							<a onClick={() => this.props.dispatch(openLogin())}><p className="lead large" style={{fontSize: 18, padding: "20px 15px", }}>Log In</p></a>
						</li>}
						<li className={style.lead}><a href="/agents"><p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Agents</p></a></li>
						<li className={style.lead}><a href="/developers"><p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Developers</p></a></li>
						<li className={style.lead}><a href="/projects"><p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Projects</p></a></li>
					
						{this.props.user.user ? <li>
							<Link to="/logout">
								<p className="lead" style={{fontSize: 18, padding: "20px 15px", }}>Logout</p>
							</Link>
						</li> : null}
            <li className={style.miniHeader_inputxs} onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
              <form onSubmit={event => this.searchByPropertyId(event)}>
							{this.state.validating ? 
								<div style={{position: 'absolute', top: '20px', right: '2px', display: 'inline-block', padding: '0px, 10px'}}>
										<i className="fa fa-spinner fa-pulse fa-spin" style={{fontSize:'28px'}}/>
								</div> : null}
                <input type="number" required={true}  name="property_id" placeholder="Search by Property ID" autoComplete="off"/>
              </form>
            </li> */}
						{/* <li>
							<a href="#"><p className="lead large" style={{fontSize: 18, padding: "20px 15px", marginBottom: 30, }}>Help</p></a>
						</li> */}
					</ul>
				</div> : null
			}
				{this.renderSignupModal()}
				{this.renderLoginModal()}
				{this.renderForgotPassModal()}
			</header>
		)
  }
}

export default connect(store => {
	return {
		user: store.user,
		header: store.header,
		city: store.city,
		query: store.property.query,
		isMobile: store.user.isMobile,
		prebootFlag: store.header.prebootFlag,
	}
})(Header)
