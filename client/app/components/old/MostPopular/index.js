import React from 'react'
import axios from 'axios'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import _ from 'lodash'
import {Tooltip} from 'react-bootstrap'
import config from 'config'

import style from './style.css'


export default class MostPopular extends React.Component {
	constructor(props) {
		super(props)
    	this.state = {
			activeMostPop: 'propertiesSale',
			isMore: false,
			projects: [],
			properties: [],
			areas: [],
			topProjects: [],
			topProperties: [],
			topAreas: [],
			totalTopAreas: [],
			totalTopCities: [],
			topCities: [],
			popularAreas: [],
			popularCities: [],
			popPlots: [],
			propertySale: [],
			commercialSale: [],
			flatsSale: [],
			propertyRent: [],
			commercialRent: [],
			flatsRent: [],
		}
	}
	componentDidMount() {
		Promise.all([
			// axios.get(`${config.apiPath}/api/city`,{params: {area:true}}),
			// axios.get(`${config.apiPath}/api/area`,{params:{all:true, cities: true}}),
			// axios.get(`${config.apiPath}/api/area`, {params:{all:true, project: true, cities: true}}),
			axios.get(`${config.apiPath}/api/property/home/mostpopular`),
		]).then((results)=>{
			const [mostPopularList] = results;
			const { cities, areas, projects } = this.props;

			var totalTopCities = [];
			cities.map((item)=> {if(item.areas.length > 0) {totalTopCities.push(item);}});

			const popAreas = mostPopularList.data.areaall;
			const popCities = mostPopularList.data.cityall;
			const plots = mostPopularList.data.saleplot;
			const propSale = mostPopularList.data.salehouse;
			const commSale = mostPopularList.data.salecomm;
			const flatSale = mostPopularList.data.saleflat;
			const propRent = mostPopularList.data.renthouse;
			const commRent = mostPopularList.data.rentcomm;
			const flatRent = mostPopularList.data.rentflat;

			var totalTopAreas = [];
			areas.map((item)=> {if(item.AreaProjects.length > 0) {totalTopAreas.push(item);}});
			this.setState({
					areas: areas,
					cities: cities,
					projects: projects,
					totalTopAreas,
					totalTopCities,
					topCities: totalTopCities.slice(0, 10),
					topAreas: totalTopAreas.slice(0,10),
					topProjects: projects.slice(0,10),
					popularAreas: popAreas,
					popularCities: popCities,
					popPlots: plots,
					propertySale: propSale,
					commercialSale: commSale,
					flatsSale: flatSale,
					propertyRent: propRent,
					commercialRent: commRent,
					flatsRent: flatRent,
			})
		})
	}
	handleTopPopular(status){
		if(status === 'more'){
			this.setState({
				topAreas: this.state.totalTopAreas,
				topProjects: this.state.projects,
				topCities: this.state.totalTopCities,
				isMore: true
			});
		} else {
			this.setState({
				topAreas: this.state.totalTopAreas.slice(0,10),
				topProjects: this.state.projects.slice(0,10),
				topCities: this.state.totalTopCities.slice(0, 10),
				isMore: false
			});
		}
	}
	mostPopular(activeState) {
		const fullTitlePopup = (title) => {
			return (
				<Tooltip id="tooltip-positioned-top">
					<p style={{margin: 0, }}>{title}</p>
				</Tooltip>
			)
		};
		if (activeState == "projects") {return (this.state.projects.map((item, index) => <li className={`${style.mostPopList} col-sm-4 text-ellipsis`} key={index}><img src={require('arrow-right.svg')} alt="Most Popular"/><a href={`/project/${item.id}/${item.name.split(' ').join('-').split(',').join('').split('/').join('-').toLowerCase()}`}>{item.name}</a></li>))}
		if (activeState == "propertiesSale") {
			return (
				<React.Fragment>
					{this.state.propertySale ? (
						<div className="row no-margin" style={{marginBottom: '20px', }}>
							<h4 style={{marginLeft: 15, }}>House for Sale</h4>
							{this.state.propertySale.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular" />
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=sale&city_id=${item.city_id}&area_id=${item.id}&type=residential&subtype=house`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
					{this.state.commercialSale ? (
						<div className="row no-margin" style={{marginBottom: '20px',}}>
							<h4 style={{marginLeft: 15, }}>Commercial Property for Sale</h4>
							{this.state.commercialSale.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular"/>
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=sale&city_id=${item.city_id}&area_id=${item.id}&type=commercial`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
					{this.state.flatsSale ? (
						<div className="row no-margin" style={{marginBottom: '20px',}}>
							<h4 style={{marginLeft: 15, }}>Apartment for Sale</h4>
							{this.state.flatsSale.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular"/>
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=sale&city_id=${item.city_id}&area_id=${item.id}&type=residential&subtype=apartment`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
				</React.Fragment>
			)
		}
		if (activeState == "propertiesRent") {
			return (
				<React.Fragment>
					{this.state.propertyRent ? (
						<div className="row no-margin" style={{marginBottom: '20px',}}>
							<h4 style={{marginLeft: 15, }}>House for Rent</h4>
							{this.state.propertyRent.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular"/>
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=rent&city_id=${item.city_id}&area_id=${item.id}&type=residential&subtype=house`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
					{this.state.commercialRent ? (
						<div className="row no-margin" style={{marginBottom: '20px',}}>
							<h4 style={{marginLeft: 15, }}>Commercial Property for Rent</h4>
							{this.state.commercialRent.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular"/>
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=rent&city_id=${item.city_id}&area_id=${item.id}&type=commercial`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
					{this.state.flatsRent ? (
						<div className="row no-margin" style={{marginBottom: '20px',}}>
							<h4 style={{marginLeft: 15, }}>Apartment for Rent</h4>
							{this.state.flatsRent.map(
								(item, index) => {
									return (
										<li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}>
											<img src={require('arrow-right.svg')} alt="Most Popular"/>
											<OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={fullTitlePopup(item.title)}>
												<a id={item.title} href={`/search?purpose=rent&city_id=${item.city_id}&area_id=${item.id}&type=residential&subtype=apartment`}>
													{item.title}
													<span>({item.property})</span>
												</a>
											</OverlayTrigger>
										</li>
									)
								}
							)}
						</div>
					) : null}
				</React.Fragment>
			)
		}
		if (activeState == "cities") {return (this.state.popularCities ? this.state.popularCities.map((item, index) => <li className={`${style.mostPopList} col-sm-4 text-ellipsis`} key={index}><img src={require('arrow-right.svg')} alt="Most Popular"/><a id={item.title} href={`/search?city_id=${item.id}`}>{item.title} <span>({item.property})</span></a></li>) : null)}
		if (activeState == "areas") {return (this.state.popularAreas ? this.state.popularAreas.map((item, index) => <li className={`${style.mostPopList} col-sm-4 text-ellipsis`} key={index}><img src={require('arrow-right.svg')} alt="Most Popular"/><a id={item.title} href={`/search?city_id=${item.city_id}&area_id=${item.id}`}>{item.title} <span>({item.property})</span></a></li>) : null)}
		if (activeState == "plots") {return (<div className="row no-margin" style={{marginBottom: '20px',}}><h4 style={{marginLeft: 15, }}>Plot For Sale</h4>{this.state.popPlots.map((item, index) => <li className={`${style.mostPopList} col-lg-4 col-sm-6 text-ellipsis`} key={index}><img src={require('arrow-right.svg')} /><a id={item.title} href={`/search?purpose=sale&city_id=${item.city_id}&area_id=${item.id}&type=plot`}>{item.title} <span>({item.property})</span></a></li>)}</div>)}
		
		return null
	}
	render() {
		return (
			<div className="container hidden-xs">
				<h3 className='gothicHeading text-center'>Most Popular</h3>
				<div className='headingUnderline'/>
				<div className="row hidden-xs" style={{marginBottom: '80px', marginTop: '35px', position: "relative", }}>
					<p style={{position: "absolute", top: 0, left: 0, }}>Search by</p>
					<div className={`${style.popHeadingCont} col-sm-3 col-xs-6`} style={{marginTop: '30px', }}>
						<div id="propertiesSale" className={`${style.popHeadings} ${this.state.activeMostPop == "propertiesSale" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "propertiesSale"})}}>Properties For Sale</div>
						<div id="propertiesRent" className={`${style.popHeadings} ${this.state.activeMostPop == "propertiesRent" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "propertiesRent"})}}>Properties For Rent</div>
						<div id="plots" className={`${style.popHeadings} ${this.state.activeMostPop == "plots" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "plots"})}}>Plot For Sale</div>
						<div id="projects" className={`${style.popHeadings} ${this.state.activeMostPop == "projects" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "projects"})}}>Most Searched Projects</div>
						<div id="cities" className={`${style.popHeadings} ${this.state.activeMostPop == "cities" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "cities"})}}>Cities</div>
						<div id="areas" className={`${style.popHeadings} ${this.state.activeMostPop == "areas" ? style.red : ""}`} onClick={()=>{this.setState({activeMostPop: "areas"})}}>Areas</div>
					</div>
					<div className={`${style.popListCont} col-sm-9 col-xs-6`}>
						<div className={`custom-scroll ${style.pops}`}>
							<ul className="list-unstyled" style={{'textTransform': 'capitalize'}}>
								{this.mostPopular(this.state.activeMostPop)}
							</ul>
						</div>
					</div>
				</div>
				<div className="row visible-xs" style={{'marginBottom': 58}}>
					<div className="col-sm-12">
					{ !this.state.isMore ?
						<a className={`pull-left ${style.link}`} onClick={()=> this.handleTopPopular('more')}>more</a> :
						<a className={`pull-left ${style.link}`} onClick={()=> this.handleTopPopular('less')}>less</a>
					}
					</div>
				</div>
			</div>
		)
	}
}
