import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import withLockScreen from 'hoc/withLockScreen'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Loader from 'components/Loader'
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
				<div style={{width: '200px', position: "absolute", top: '20px', left: '40px', }}>
					<a href="/">
						<svg xmlns={`${require('logo.svg')}#logo`} id="logo" x="0px" y="0px" viewBox="0 0 801.4 222.8" style={{fill: "#ef5350", }}>
							<g>
								<path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9      c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20      C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6      c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30      c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14      c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6      c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4      c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1      c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3      c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7      c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1      c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z"></path>
								<path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z"></path>
								<g>
									<path d="M400.8,105.8h0.3c4.8-7.3,11.9-11.4,20.7-11.4c3.4,0,6.8,0.8,9.8,2l-2.9,22.1c-2.9-2-6.3-3.1-9.8-3.1      c-16.5,0-18.2,14.6-18.2,27.5v37.5h-23.8V97.2h23.8v8.6C400.7,105.8,400.8,105.8,400.8,105.8z"></path>
									<path d="M518,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8H518V180.5z M497,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2s7.5,23.4,19.7,23.4      C489.4,162.2,497,150,497,138.8z"></path>
									<path d="M613.9,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L613.9,180.5L613.9,180.5z M592.9,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4S592.9,150,592.9,138.8z"></path>
									<path d="M654.8,104.8h0.3c4.9-7.5,13.2-10.3,21.7-10.3c22.4,0,28.8,15.8,28.8,35.1v50.9h-23.8v-44.1c0-10,0.5-22.9-12.9-22.9      c-14.1,0-14.3,15.8-14.3,25.8v41.2H631V97.2h23.8V104.8z"></path>
									<path d="M801.4,180.5H778v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L801.4,180.5L801.4,180.5z M780.3,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4C772.7,162.2,780.3,150,780.3,138.8z"></path>
									<path d="M302,110.3h62.7c0.4,1.4,0.7,3.2,0.9,5.2c0.2,2,0.4,4,0.4,6.1c0,8.2-1.2,15.9-3.7,23.2s-6.4,13.7-11.8,19.5      c-5.7,6.1-12.6,10.8-20.5,14.1c-8,3.3-17.1,5-27.3,5c-9.3,0-18-1.7-26.2-5s-15.4-8-21.4-13.9c-6.1-5.9-10.9-13-14.5-21.2      s-5.4-17-5.4-26.7s1.8-18.5,5.4-26.7c3.6-8.1,8.4-15.2,14.5-21.2c6.1-5.9,13.2-10.6,21.4-13.9c8.2-3.3,17-5,26.2-5      c10.4,0,19.6,1.8,27.8,5.4c8.1,3.6,15.1,8.5,21,14.8l-16.6,16.2c-4.2-4.4-8.8-7.8-13.9-10.1c-5.1-2.3-11.2-3.5-18.4-3.5      c-5.8,0-11.4,1-16.6,3.1s-9.8,5-13.7,8.8c-3.9,3.8-7.1,8.4-9.4,13.8s-3.5,11.5-3.5,18.1c0,6.7,1.2,12.7,3.5,18.1s5.5,10,9.5,13.8      s8.6,6.8,13.8,8.8c5.2,2.1,10.8,3.1,16.8,3.1c6.8,0,12.5-1,17.2-2.9c4.7-2,8.7-4.5,12-7.6c2.4-2.1,4.4-4.8,6.2-8.1      c1.7-3.3,3.1-6.9,4-11H302V110.3z"></path>
								</g>
							</g>
						</svg>
					</a>
				</div>
				<div style={{position: 'absolute', width: '50%', left: 0, top: '250px', }}>
					<div style={{borderRadius: "100%", position: "absolute", top: 0, left: '50%', transform: 'translateX(-50%)', background: "#ef5350", color: "#fff", width: "300px", height: "300px", }}>
						<div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", }}>
							<div style={{fontSize: 44, fontWeight: 700, marginLeft: "-10px", }}>OOPS!</div>
						</div>
					</div>
				</div>
				<div style={{position: "absolute", top: "600px", left: 0,  width: "50%", }}>
					<div className={`text-center`} style={{fontSize: 30, fontWeight: 700, }}>Sorry! Something Went Wrong...</div>
					<div className={`text-center`} style={{fontSize: 30, color: "#bbb", fontWeight: 700, }}>Go get some Coffee while we do our thing!</div>
				</div>
				<div className="row" style={{position: 'absolute', bottom: 0, right: 0, width: '50%', }}><img className="img-responsive" src={require('Still_02.png')} alt="Something Went Wrong" style={{width: '100%', height: '100%', }} /></div>
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
			console.log(this.props)
			console.log(child)
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
				<Loader position={'fixed'} loading={!this.state.prebootComplete} transparent={false}/>
				<ErrorBoundary>
					<ReactCSSTransitionGroup transitionName="loader" transitionEnterTimeout={500} transitionLeaveTimeout={1000}>
						{[]}
					</ReactCSSTransitionGroup>
					<Header header={{search:true}}></Header>
					{this.renderlayout(
						this.state.done && React.cloneElement(this.props.full || this.props.main, {
							done: () => this.hideLoader()
						})
					)}
					<LazyLoad height={400}>
						<Footer style={{display: 'block !important'}} showFooterLinks={this.state.showFooterLinks}></Footer>
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
