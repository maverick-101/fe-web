import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import withLockScreen from 'hoc/withLockScreen'

import Header from 'components/Header'
// import Footer from 'components/Footer'
import Footer from 'components/NewFooter';
import { StickyContainer, Sticky } from 'react-sticky';
import Raven from 'raven-js';
import { getCurrentUser, setMobile } from 'actions/user'
import { setPrebootFlag } from 'actions/header'

import config from 'config'


import LazyLoad from 'react-lazyload';

import style from './style.css'


class ErrorBoundary extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { hasError: false };
	  Raven.config('https://4700c8f8bd564ab9895815339539342a@sentry.io/1206166').install()
	}
  
	componentDidCatch(error, info) {
	  this.setState({ hasError: true });
	  Raven.captureException(error, { extra: info });
	}
  
	render() {
	  if (this.state.hasError) {
		return (
			<div className="container-fluid" style={{position: "relative", height: '100vh', }}>
				<div style={{position: "absolute", top: "600px", left: 0,  width: "50%", }}>
					<div className={`text-center`} style={{fontSize: 30, fontWeight: 700, }}>Sorry! Something Went Wrong...</div>
				</div>
				{/* <div className="row" style={{position: 'absolute', bottom: 0, right: 0, width: '50%', }}><img className="img-responsive" src={require('Still_02.png')} alt="Something Went Wrong" style={{width: '100%', height: '100%', }} /></div> */}
			</div>
		);
	  }
	  return this.props.children;
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			done: false,
			loading: true,
			showFooterLinks: false,
			prebootComplete: false,
			loader: [
				<div key={1} className={style.loaderOverlay}>
					<div className={style.logoCenter}>
						<div className={style.logoWrapper}>
							<svg xmlns={`${require('logo.svg')}#onlyLogo`} id="logo" x="0px" y="0px" viewBox="0 0 222.8 222.8">
								<g>
									<path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9      c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20      C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6      c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30      c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14      c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6      c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4      c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1      c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3      c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7      c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1      c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"></path>
									<path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"></path>
								</g>
							</svg>
						</div>
					</div>
				</div>
			],
			prebootLoader: [
				<div key={1} className={style.loaderOverlay}>
					<div className={style.logoCenter}>
						<div className={style.logoWrapper}>
							<svg xmlns={`${require('logo.svg')}#onlyLogo`} id="logo" x="0px" y="0px" viewBox="0 0 222.8 222.8">
								<g>
									<path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9      c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20      C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6      c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30      c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14      c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6      c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4      c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1      c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3      c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7      c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1      c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"></path>
									<path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"></path>
								</g>
							</svg>
						</div>
					</div>
				</div>
			],
		}

		this.resize = this.resize.bind(this);
	}
	bodyClass() {
		var classState = false;
		// var classArray = ["developers", "agents", "property", "project", "area", "search", "projects"];
		var classArray = ["agency", "property", "project", "area", "project-listing"];
		// if (window.location.pathname == "/") {
		// 	classState = true;
		// }
		// else if (classArray.indexOf(window.location.pathname.split('/')[1]) != -1) {
		if (classArray.indexOf(window.location.pathname.split('/')[1]) != -1) {
			classState = true;
		}
		else {
			classState = false;
		}
		return classState;
	}
	componentDidMount() {
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
			if(/Android/.test(navigator.appVersion)){
				window.addEventListener("resize", function(){
					if(document.activeElement.tagName=="INPUT"){
							window.setTimeout(function(){
								document.activeElement.scrollIntoViewIfNeeded();
							},0);
					}
				})
		}
		if(process.env.NODE_ENV !== `production`) {
			this.props.setPrebootFlag()
			this.setState({prebootComplete: true})
		}
		window.onPrerendercloudPrebootComplete = () => {
			this.props.setPrebootFlag()
			this.setState({
				prebootComplete: true
			})
			this.resize();
		}
		setTimeout(() => this.setState({prebootLoader: []}), 2)
		this.props.getCurrentUser()
			.then(response => {
				// console.log(response)
				if(response.screen_lock && config.lockScreen) {
					this.props.lockScreen()
				}
				this.setState({done: true})
			})
		// this.refs.stickyRefApp ?
		// 	(this.refs.stickyRefApp.children[0].style.position = "relative",
		// 	this.refs.stickyRefApp.children[0].style.height = "100%")
		// 	: "";
		if (window.location.pathname === '/') {
			this.setState({ showFooterLinks: true });
		}
	}
	resize() {
		let isMobile = (window.innerWidth <= 760);
    if (isMobile !== this.props.isMobile) {
			this.props.setMobile(isMobile);
		}
}
	hideLoader() {
		this.props.setPrebootFlag()
		this.setState({loader: []})
	}
	renderlayout(child) {
		if (!this.props.absoluteTwo) {document.getElementById('app').classList.add('appClass');}
		
		var bodyClass = this.bodyClass();
		if (bodyClass) {
			document.getElementById('app').classList.add("bodyPadds")
			// document.body.classList.add('bodyClass');
		}

		if(this.props.full) {
			return (
				<div style={{minHeight:'100vh', paddingLeft: '0', paddingRight: '0'}} className="container-fluid">
					{child}
				</div>
			)
    } else {
			return (
				<React.Fragment>
					{this.props.top}
					<div className="container">
						<div className="row" style={{position: 'relative', minHeight: '1300px', }}>
							<div className={`col-sm-12 col-md-9 col-xs-12 ${style.smspace}`}>
								{child}
							</div>
							<div className={`col-md-3 col-xs-12 ${style.smspace2}`} style={{borderLeft: '1px solid #ebebeb'}}>
							{/* sidebar can go here */}
                                {/* <Sidebar type={this.props.location.pathname}/> */}
							</div>
						</div>
					</div>
				</React.Fragment>
			)
		}
	}
	render() {
		// console.log('parent preboot ------ ----- ' , this.state.prebootComplete)
		return (
			<div className={`${this.state.loader.length ? style.appWrapper : ''}`}>
				{/* <Loader position={'fixed'} loading={!this.state.prebootComplete} transparent={false}/> */}
				<ErrorBoundary>
					<ReactCSSTransitionGroup transitionName="loader" transitionEnterTimeout={500} transitionLeaveTimeout={1000}>
						{[]}
					</ReactCSSTransitionGroup>
					<Header></Header>
					{this.renderlayout(
						this.state.done && React.cloneElement(this.props.full || this.props.main, {
							done: () => this.hideLoader()
						})
					)}
					<LazyLoad height={400}>
						{/* <Footer style={{display: 'block !important'}} showFooterLinks={this.state.showFooterLinks}></Footer> */}
						<Footer />
					</LazyLoad>
				</ErrorBoundary>
			</div>
		)
  }
}

export default withLockScreen(connect(store => {
	return {
		isMobile: store.user.isMobile,
	}
}, dispatch => {
		return {
		getCurrentUser: () => dispatch(getCurrentUser()),
		setPrebootFlag: () => dispatch(setPrebootFlag()),
		setMobile: (flag) => dispatch(setMobile(flag)),
	}
})(App))
