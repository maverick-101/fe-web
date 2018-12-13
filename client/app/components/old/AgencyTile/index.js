import React from 'react'
import moment from 'moment'
import placeholder from 'images-comingsoon.svg'
import style from './style.css'
import { imgUpload } from 'helpers'
import _ from 'lodash';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


export default class AgencyTile extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = {
			anchors: []
		}
		this.currentIndex = 0
	}
	_onImageClick() {
		this.currentIndex = this._imageGallery.getCurrentIndex();
		window.location.pathname = `project/${this.state.anchors[this.currentIndex].id}/${this.state.anchors[this.currentIndex].name.split(' ').join('').split('/').join('-').toLowerCase()}`;
	}	
	componentDidMount() {
		let anchors = [];
		this.props.type == "developer" ? (this.props.developerProjects && this.props.developerProjects.length ? this.props.developerProjects.forEach(project => {
				anchors.push(
					{
						id: project.id,
						name: project.name
					}
				);
			}) : null
		) : null
		this.setState({anchors: anchors});
	}
	render() {
		var {agency,type,grid} = this.props;
		let images = [];
		this.props.developerProjects && this.props.developerProjects.length ? this.props.developerProjects.forEach(project => {
			project.area_resources.length ? images.push({url: project.area_resources[0].url, thumbnail: ''}) : null
		}) : null;
		let galleryItems = _.map(images, (CNI) => {
			return { original: imgUpload(CNI.url, "h_250", false), thumbnail: imgUpload(CNI.url, "h_100", false) }
		});
		return(
			<div className={`col-sm-12 no-padding ${type != "developer" ? (grid ? style.gridStyles : style.listStyles) : (grid ? style.devGridStyles : style.devListStyles)}`} style={{borderRadius: '0px', border: 0, marginTop: 10,}}>
				
					<div className='col-sm-12 no-padding'>
						<a href={`/agency/${agency.id}/${agency.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
						<div className={style.imageContainer}>
							<div className={style.imageCont}>
								{agency.logo ? (
									<div className={style.image} style={{backgroundImage: `url(${imgUpload(agency.logo, 'h_250', false)})`, }}/>
								) : (
									<div className={style.image} style={{backgroundImage: `url(${placeholder})`, backgroundColor: "#f5f5f5", }}/>
								)}
							</div>
							{!grid ? (<div style={{height: '100%', marginLeft: '25%', padding: '10px', }}><h4 className={`text-capitalize text-ellipsis ${style.agencyTitle}`}>{agency.name}</h4>
							<div className={`text-capitalize ${style.listPadding} ${style.limitContent}`} style={{paddingBottom: '10px', display: 'inline-block', width: '100%', }}>
								<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 382.6 477" style={{float: 'left', width: "18px", height: '18px', paddingTop: 2, enableBackground: "new 0 0 382.6 477", }} xmlSpace="preserve">
									<g>
										<g>
											<path className={style.location} d="M191.2,0C85.8,0,0,85.8,0,191.2c0,12,1.1,24.1,3.4,35.9c0.1,0.7,0.5,2.8,1.3,6.4c2.9,12.9,7.2,25.6,12.8,37.7    c20.6,48.5,65.9,123,165.3,202.8c2.5,2,5.5,3,8.5,3s6-1,8.5-3c99.3-79.8,144.7-154.3,165.3-202.8c5.6-12.1,9.9-24.7,12.8-37.7    c0.8-3.6,1.2-5.7,1.3-6.4c2.2-11.8,3.4-23.9,3.4-35.9C382.4,85.8,296.6,0,191.2,0z M352.4,222.4c0,0.2-0.1,0.4-0.1,0.6    c-0.1,0.5-0.4,2-0.9,4.3c0,0.1,0,0.1,0,0.2c-2.5,11.2-6.2,22.1-11.1,32.6c-0.1,0.1-0.1,0.3-0.2,0.4    c-18.7,44.3-59.7,111.9-148.9,185.6C102,372.4,61,304.8,42.3,260.5c-0.1-0.1-0.1-0.3-0.2-0.4c-4.8-10.4-8.5-21.4-11.1-32.6    c0-0.1,0-0.1,0-0.2c-0.6-2.3-0.8-3.8-0.9-4.3c0-0.2-0.1-0.4-0.1-0.7c-2-10.3-3-20.7-3-31.2c0-90.5,73.7-164.2,164.2-164.2    s164.2,73.7,164.2,164.2C355.4,201.7,354.4,212.2,352.4,222.4z"/>
											<path className={style.location} d="M191.2,71.9c-66.9,0-121.4,54.5-121.4,121.4s54.5,121.4,121.4,121.4s121.4-54.5,121.4-121.4    S258.1,71.9,191.2,71.9z M191.2,287.7c-52.1,0-94.4-42.4-94.4-94.4s42.4-94.4,94.4-94.4s94.4,42.4,94.4,94.4    S243.3,287.7,191.2,287.7z"/>
										</g>
									</g>
								</svg>
								<span style={{float: 'left', }}>&nbsp;&nbsp;</span><span className={style.getEllipses2} style={{float: 'left', width: "calc(100% - 26px)"}}>{agency.address}, {agency.city ? agency.city.name : ''}</span>
							</div>
							{type == "developer" ? <p className={`${style.listPadding}`} style={{borderBottom: 0, }}>
								<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="_x2014_ÎÓÈ_x5F_1" x="0px" y="0px" viewBox="0 0 103.6 136" style={{enableBackground: 'new 0 0 103.6 136', width: '18px', height: '18px', marginBottom: '-2px', }} xmlSpace="preserve">
									<g id="XMLID_51_">
										<line id="XMLID_1969_" className="listingSvg" x1="25.2" y1="73.6" x2="47.5" y2="73.6"/>
										<line id="XMLID_1968_" className="listingSvg" x1="25.2" y1="90.7" x2="47.5" y2="90.7"/>
										<line id="XMLID_1967_" className="listingSvg" x1="47.5" y1="107.8" x2="25.2" y2="107.8"/>
										<polyline id="XMLID_1966_" className="listingSvg" points="70.3,8.1 70.3,1.5 33.9,1.5 33.9,8.1  "/>
										<path id="XMLID_1965_" className="listingSvg" d="M33.9,8.1c0,6.9,5.6,12.4,12.4,12.4h11.5c6.9,0,12.4-5.6,12.4-12.4"/>
										<polyline id="XMLID_1964_" className="listingSvg" points="70.3,9.6 92.9,9.6 92.9,124.6 12.1,124.6 12.1,9.4 33.9,9.4  "/>
										<line id="XMLID_1963_" className="listingSvg" x1="41.4" y1="8.1" x2="63.2" y2="8.1"/>
										<polyline id="XMLID_1962_" className="listingSvg" points="33.9,1.5 1.5,1.5 1.5,134.5 102.1,134.5 102.1,1.5 70.3,1.5  "/>
										<rect id="XMLID_1955_" x="25.2" y="31.8" className="listingSvg" width="54.2" height="23"/>
									</g>
								</svg>&nbsp;&nbsp;<span>Number of Projects</span>
								<span className="green" style={{paddingTop: '2px', paddingLeft: '30px', }}>{type == "agency" ? agency.properties.length : agency.areas.length}</span>
							</p> : null}</div>) : null}
						</div>
						</a>
						{/* type==='agency' ? <p className={`text-capitalize`}>Active Listings: {agency.properties.length}</p> : '' */}
						<div className={`${style.infoBlock}`}>
							{grid ? (<a href={`/agency/${agency.id}/${agency.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
							<div><h4 className={`text-capitalize text-ellipsis ${style.agencyTitle}`}>{agency.name}</h4>
							<div className={`text-capitalize ${style.listPadding} ${style.limitContent}`} style={{paddingBottom: '10px', display: 'inline-block', width: '100%', }}>
								<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 382.6 477" style={{float: 'left', width: "18px", height: '18px', paddingTop: 2, enableBackground: "new 0 0 382.6 477", }} xmlSpace="preserve">
									<g>
										<g>
											<path className={style.location} d="M191.2,0C85.8,0,0,85.8,0,191.2c0,12,1.1,24.1,3.4,35.9c0.1,0.7,0.5,2.8,1.3,6.4c2.9,12.9,7.2,25.6,12.8,37.7    c20.6,48.5,65.9,123,165.3,202.8c2.5,2,5.5,3,8.5,3s6-1,8.5-3c99.3-79.8,144.7-154.3,165.3-202.8c5.6-12.1,9.9-24.7,12.8-37.7    c0.8-3.6,1.2-5.7,1.3-6.4c2.2-11.8,3.4-23.9,3.4-35.9C382.4,85.8,296.6,0,191.2,0z M352.4,222.4c0,0.2-0.1,0.4-0.1,0.6    c-0.1,0.5-0.4,2-0.9,4.3c0,0.1,0,0.1,0,0.2c-2.5,11.2-6.2,22.1-11.1,32.6c-0.1,0.1-0.1,0.3-0.2,0.4    c-18.7,44.3-59.7,111.9-148.9,185.6C102,372.4,61,304.8,42.3,260.5c-0.1-0.1-0.1-0.3-0.2-0.4c-4.8-10.4-8.5-21.4-11.1-32.6    c0-0.1,0-0.1,0-0.2c-0.6-2.3-0.8-3.8-0.9-4.3c0-0.2-0.1-0.4-0.1-0.7c-2-10.3-3-20.7-3-31.2c0-90.5,73.7-164.2,164.2-164.2    s164.2,73.7,164.2,164.2C355.4,201.7,354.4,212.2,352.4,222.4z"/>
											<path className={style.location} d="M191.2,71.9c-66.9,0-121.4,54.5-121.4,121.4s54.5,121.4,121.4,121.4s121.4-54.5,121.4-121.4    S258.1,71.9,191.2,71.9z M191.2,287.7c-52.1,0-94.4-42.4-94.4-94.4s42.4-94.4,94.4-94.4s94.4,42.4,94.4,94.4    S243.3,287.7,191.2,287.7z"/>
										</g>
									</g>
								</svg>
								<span style={{float: 'left', }}>&nbsp;&nbsp;</span><span className={style.getEllipses2} style={{float: 'left', width: "calc(100% - 26px)"}}>{agency.address}, {agency.city ? agency.city.name : ''}</span>
							</div>
							{type == "developer" ? <p className={`${style.listPadding}`} style={{borderBottom: 0, }}>
								<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="_x2014_ÎÓÈ_x5F_1" x="0px" y="0px" viewBox="0 0 103.6 136" style={{enableBackground: 'new 0 0 103.6 136', width: '18px', height: '18px', marginBottom: '-2px', }} xmlSpace="preserve">
									<g id="XMLID_51_">
										<line id="XMLID_1969_" className="listingSvg" x1="25.2" y1="73.6" x2="47.5" y2="73.6"/>
										<line id="XMLID_1968_" className="listingSvg" x1="25.2" y1="90.7" x2="47.5" y2="90.7"/>
										<line id="XMLID_1967_" className="listingSvg" x1="47.5" y1="107.8" x2="25.2" y2="107.8"/>
										<polyline id="XMLID_1966_" className="listingSvg" points="70.3,8.1 70.3,1.5 33.9,1.5 33.9,8.1  "/>
										<path id="XMLID_1965_" className="listingSvg" d="M33.9,8.1c0,6.9,5.6,12.4,12.4,12.4h11.5c6.9,0,12.4-5.6,12.4-12.4"/>
										<polyline id="XMLID_1964_" className="listingSvg" points="70.3,9.6 92.9,9.6 92.9,124.6 12.1,124.6 12.1,9.4 33.9,9.4  "/>
										<line id="XMLID_1963_" className="listingSvg" x1="41.4" y1="8.1" x2="63.2" y2="8.1"/>
										<polyline id="XMLID_1962_" className="listingSvg" points="33.9,1.5 1.5,1.5 1.5,134.5 102.1,134.5 102.1,1.5 70.3,1.5  "/>
										<rect id="XMLID_1955_" x="25.2" y="31.8" className="listingSvg" width="54.2" height="23"/>
									</g>
								</svg>&nbsp;&nbsp;<span>Number of Projects</span>
								<span className="pull-right green" style={{paddingTop: '2px', paddingRight: '10px', }}>{type == "agency" ? agency.properties.length : agency.areas.length}</span>
							</p> : null}</div></a>) : null}
							{type != "developer" ? <a href={`/agency/${agency.id}/${agency.name.split(' ').join('-').split('/').join('-').toLowerCase()}`}>
							<div>
								<p className={`${style.listPadding}`}>
									<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="_x2014_ÎÓÈ_x5F_1" x="0px" y="0px" viewBox="0 0 117 138.9" style={{enableBackground: 'new 0 0 117 138.9', width: '18px', height: '18px', marginBottom: '-2px', }} xmlSpace="preserve">
										<g id="XMLID_854_">
											<rect id="XMLID_2093_" x="80.4" y="110.2" className="agentSvg" width="26.4" height="15.9"/>
											<g id="XMLID_2078_">
												<path id="XMLID_2092_" className="agentSvg" d="M64,81.1L64,81.1c0.2-1.1-0.3-2.1-1.2-2.7l-2.6-1.7c-1.8-1.2-4.2-0.9-5.6,0.7    c-0.5,0.6-0.8,1.2-0.9,2l0,0c-0.1,0.8,0,1.5,0.2,2.2c0.7,2,2.9,3,5,2.5"/>
												<path id="XMLID_2091_" className="agentSvg" d="M65.6,75.3c6.6-5.5,11-12.9,12.7-21.1c0.5-2.5,2.7-21.8,1.9-24c-1.4,1.2-3.6,2.8-6.8,3.9    c-6.2,2.2-15.9,2.4-22.7-2.5c-1.2-0.9-5.3-4.2-9-4.9c-0.7-0.1-2.1-0.4-3.7,0.1c-0.8,0.2-1.9,0.5-2.7,1.5c-0.7,0.9-0.9,1.8-1,2.7    c-0.2,1.3-0.1,2.3,0,3c0.4,3.9,0.7,7.8,1.1,11.6L36,50c0,0,0.2,1.7,0.7,4.2c1.6,8.2,6.1,15.6,12.7,21.1"/>
												<line id="XMLID_2090_" className="agentSvg" x1="42.1" y1="84.3" x2="42.1" y2="67.2"/>
												<line id="XMLID_2089_" className="agentSvg" x1="72.7" y1="74.8" x2="72.7" y2="67.8"/>
												<polygon id="XMLID_2088_" className="agentSvg" points="57.7,93.7 40.5,83.4 40.5,83.4 45.3,106.7   "/>
												<polyline id="XMLID_2087_" className="agentSvg" points="74.8,83.4 70.9,106.7 57.7,93.7 74.8,83.4   "/>
												<path id="XMLID_2086_" className="agentSvg" d="M40.5,83.5l-28.4,2.9c-0.3,0-0.6,0.1-0.9,0.1c-5.7,1-9.7,6.2-9.7,12l0,27.9    c0,6,4.9,10.9,10.9,10.9l92.1,0.1c6.2,0,11.2-5.1,10.9-11.3c-0.4-11.9-1.2-29.3-2.3-31.9c-1.7-4.4-5.8-7.5-10.5-8l-27.9-2.9"/>
												<polyline id="XMLID_2085_" className="agentSvg" points="51,101 53.1,105.3 62.3,105.3 64.7,101   "/>
												<polyline id="XMLID_2084_" className="agentSvg" points="49.1,125.4 53.1,105.3 62.3,105.3 66.3,125.4   "/>
												<path id="XMLID_2083_" className="agentSvg" d="M84.7,60.4l-0.9,5.2C82.2,75.3,73.5,81.9,64,81.1"/>
												<g id="XMLID_2079_">
													<path id="XMLID_2082_" className="agentSvg" d="M91,43.6l-1.4,12.8c-0.3,2.5-2.2,4.3-4.4,4l0,0c-2.1-0.2-3.6-2.4-3.4-4.9l0.9-8.3     c0.3-2.5,2.2-4.3,4.4-4L91,43.6z"/>
													<path id="XMLID_2081_" className="agentSvg" d="M24.2,43.6l1.4,12.8c0.3,2.5,2.2,4.3,4.4,4h0c2.1-0.2,3.6-2.4,3.4-4.9l-0.9-8.3     c-0.3-2.5-2.2-4.3-4.4-4L24.2,43.6z"/>
													<path id="XMLID_2080_" className="agentSvg" d="M25,43.5l-0.5-3.7c-1.4-10.9,2.3-22,10.3-29.4c6-5.5,14-8.9,22.8-8.9     c7.2,0,14,2.3,19.5,6.2c5.5,3.9,9.8,9.4,12.2,15.8c1.8,4.8,2.3,10.1,1.7,15.2l-0.5,4.8"/>
												</g>
											</g>
										</g>
									</svg>&nbsp;&nbsp;<span>Number of Agents</span>
									<span className="pull-right green" style={{paddingTop: '2px', }}>{agency.users ? agency.users.length : 'None'}</span>
								</p>
								<p className={`${style.listPadding}`} style={{borderBottom: 0, }}>
									<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="_x2014_ÎÓÈ_x5F_1" x="0px" y="0px" viewBox="0 0 103.6 136" style={{enableBackground: 'new 0 0 103.6 136', width: '18px', height: '18px', marginBottom: '-2px', }} xmlSpace="preserve">
										<g id="XMLID_51_">
											<line id="XMLID_1969_" className="listingSvg" x1="25.2" y1="73.6" x2="47.5" y2="73.6"/>
											<line id="XMLID_1968_" className="listingSvg" x1="25.2" y1="90.7" x2="47.5" y2="90.7"/>
											<line id="XMLID_1967_" className="listingSvg" x1="47.5" y1="107.8" x2="25.2" y2="107.8"/>
											<polyline id="XMLID_1966_" className="listingSvg" points="70.3,8.1 70.3,1.5 33.9,1.5 33.9,8.1  "/>
											<path id="XMLID_1965_" className="listingSvg" d="M33.9,8.1c0,6.9,5.6,12.4,12.4,12.4h11.5c6.9,0,12.4-5.6,12.4-12.4"/>
											<polyline id="XMLID_1964_" className="listingSvg" points="70.3,9.6 92.9,9.6 92.9,124.6 12.1,124.6 12.1,9.4 33.9,9.4  "/>
											<line id="XMLID_1963_" className="listingSvg" x1="41.4" y1="8.1" x2="63.2" y2="8.1"/>
											<polyline id="XMLID_1962_" className="listingSvg" points="33.9,1.5 1.5,1.5 1.5,134.5 102.1,134.5 102.1,1.5 70.3,1.5  "/>
											<rect id="XMLID_1955_" x="25.2" y="31.8" className="listingSvg" width="54.2" height="23"/>
										</g>
									</svg>&nbsp;&nbsp;<span>Number of Listings</span>
									<span className="pull-right green" style={{paddingTop: '2px', }}>{type == "agency" ? agency.properties.length : "3"}</span>
								</p>
								<p className={`${style.listPadding}`} style={{borderBottom: 0, }}>
									<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="_x2014_ÎÓÈ_x5F_1" x="0px" y="0px" viewBox="0 0 115.9 138" style={{enableBackground: 'new 0 0 115.9 138', width: '18px', height: '18px', marginBottom: '-2px', }} xmlSpace="preserve">
										<g id="XMLID_1522_">
											<polyline id="XMLID_1535_" className="joiningSvg" points="1.5,31.6 90.5,31.6 90.5,99.7  "/>
											<path id="XMLID_1534_" className="joiningSvg" d="M54,136.5H9.4c-4.4,0-7.9-3.5-7.9-7.9V46.7"/>
											<path id="XMLID_1533_" className="joiningSvg" d="M12.7,24.4c-6.2,0-11.2-5.1-11.2-11.4c0-6.3,5-11.4,11.2-11.4c6.2,0,11.2,5.1,11.2,11.4"/>
											<path id="XMLID_1532_" className="joiningSvg" d="M35,24.4c-6.2,0-11.2-5.1-11.2-11.4c0-6.3,5-11.4,11.2-11.4c6.2,0,11.2,5.1,11.2,11.4"/>
											<path id="XMLID_1531_" className="joiningSvg" d="M57,24.4c-6.2,0-11.2-5.1-11.2-11.4c0-6.3,5-11.4,11.2-11.4c6.2,0,11.2,5.1,11.2,11.4"/>
											<path id="XMLID_1530_" className="joiningSvg" d="M79.3,24.4c-6.2,0-11.2-5.1-11.2-11.4c0-6.3,5-11.4,11.2-11.4c6.2,0,11.2,5.1,11.2,11.4"/>
											<path id="XMLID_1529_" className="joiningSvg" d="M90.5,31.6l23.7,88.5c0.9,3.5-1.7,6.9-5.3,6.9H82.8"/>
											<polygon id="XMLID_1528_" className="joiningSvg" points="90.5,12.9 1.5,12.9 1.5,31.6 90.5,31.6  "/>
											<line id="XMLID_1527_" className="joiningSvg" x1="58.4" y1="103.5" x2="11.6" y2="103.5"/>
											<path id="XMLID_1526_" className="joiningSvg" d="M54,136.5c0,0,8.5-10.1,9.8-22.8c0.7-6.6,5.9-11.5,11.9-10.7c5,0.7,10.4,0.2,14.8-3.3   c-1,4.6-3.5,13-9.9,21C70.7,132.9,58.1,135.8,54,136.5z"/>
											<rect id="XMLID_39_" x="17.4" y="48" className="joiningSvg" width="56.2" height="33.2"/>
										</g>
									</svg>&nbsp;&nbsp;<span>Joined</span>
									<span className="pull-right green" style={{paddingTop: '2px', }}>{moment(agency.created_at).format('LL')}</span>
								</p>
								</div></a>
								:
								<div
									className={`${style.imgGallery}`}
									style={{
										display: `${ grid == false ? '' : 'none' }`,
										background: `url(${require('no-projects-placeholder.svg')}) bottom center / auto no-repeat`,
									}}>
									{ images.length ? <ImageGallery
											items={galleryItems}
											showPlayButton={false}
											showFullscreenButton={false}
											ref={i => this._imageGallery = i}
											onClick={this._onImageClick.bind(this)}
											showNav={false}
											autoPlay={true}
											showThumbnails={false}
										/>
										:
                    this.props.developerProjects && this.props.developerProjects.length
											?
											<div className={style.placeholderDiv}>
												<p>No Project Photos</p>
												<p className="red">Added Yet</p>
											</div>
											:
											<div className={style.placeholderDiv}>
												<p>No Projects</p>
												<p className="red">Added Yet</p>
											</div>
									}
								</div>
							}
						</div>
					</div>

			</div>
		)
	}
}
