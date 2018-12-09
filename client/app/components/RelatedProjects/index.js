import React from 'react'
import { Link } from 'react-router'
import Slider from 'react-slick'
import axios from 'axios'
import Fader from 'components/Fader'
import { convertPrice, convertUnit, convertSize, imgUpload, sanitize } from 'helpers'

import placeholder from 'images-comingsoon.svg'
import style from './style.css'
export class Tile extends React.Component {
	render() {
		return (
			<div className='clearfix'>
			<a href={`/project/${this.props.data.id}/${this.props.data.name.split(' ').join('-').split('/').join('-').toLowerCase()}`} style={{'padding':'10px'}}>
				<div style={{'position':'relative', 'border':'1px solid #eee'}}>
          {this.props.data.area_resources.filter(image => (image.type == 'cover')).length ?
            <div style={{
              width: 'auto',
              height: '300px',
              'overflow': 'hidden',
              background: `url(${imgUpload(this.props.data.area_resources.filter(image => (image.type == 'cover'))[0].url, 'h_250')}) 50% 50%`,
              backgroundSize: 'cover'
            }}/> :
            <div style={{
              width: 'auto',
              height: '300px',
              'overflow': 'hidden',
              background: `url(${placeholder}) center center / 48% auto no-repeat #f5f5f5`,
            }}/>
          }
					<div className={style.projectContainer}>
						<h4 className="space-0" dangerouslySetInnerHTML={{__html: sanitize(this.props.data.name)}}></h4>
						<p className="space-0">{this.props.data.city.name.replace(/\b\w/g, l => l.toUpperCase())}
							<span className="green pull-right" style={{'height':'50px','width':'50px'}}>
              <img src={(this.props.data.marketedBy && !this.props.data.show_developer) ? imgUpload(this.props.data.marketedBy.logo, 'h_100', false) : (this.props.data.agency ? imgUpload(this.props.data.agency.logo, 'h_100', false) : placeholder)}
              style={{backgroundColor: `${this.props.data.agency ? "" : "#f5f5f5"}`, objectFit: `${this.props.data.agency ? "" : "scale-down"}`, }} alt={this.props.data.agency && this.props.data.agency.name ? this.props.data.agency.name : 'Agency Logo'} width="100%" height="auto"/></span>
						</p>
					</div>
				</div>
			</a>
			</div>
		)
  }
} 
function NextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', fontSize: 32, color: "#999", }}
      onClick={onClick}
    > ❯ </div>
  );
}

function PrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', fontSize: 32, color: "#999", }}
      onClick={onClick}
    > ❮ </div>
  );
}
// export default class RelatedCarousel extends React.Component {
// 	render() {
// 		var settings = {
//       speed: 700,
//       fade: true,
//       draggable: false,
//       swipe: false,
//       nextArrow: <NextArrow />,
// 			prevArrow: <PrevArrow />,
// 			slidesToShow: 1,
// 			variableWidth: true,
// 			centerMode: true,
//     }

// 		if (!this.props.projects) {
// 			return null
//     }
// 		return (
// 			<div className="clearfix row text-center">
// 				<Slider {...settings} ref={slider => this.slider = slider }>
// 						{this.props.projects.map((project, index) => <div className={'col-xs-3'}><Tile key={index} data={project}/></div>)}
// 				</Slider>
// 			</div>
// 		)
//   }
// }

export default class RelatedCarousel extends React.Component {
  render() {
    if (!this.props.relatedProjects || !this.props.relatedProjects.length) {
      return null;
    }
    return (
      <div className={`clearfix text-center ${style.properties}`}>
        <Fader width={'100%'} notHere={this.props.notHere ? true : false} maxWidth={700} unSlickTill={1024} items={this.props.relatedProjects.map((project, index) => <Tile key={index} data={project}/>)}/>
      </div>
    );
  }
}
