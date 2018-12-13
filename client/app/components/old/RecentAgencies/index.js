import React from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import axios from 'axios';
import Fader from 'components/Fader';
import { convertPrice, convertUnit, convertSize, sanitize } from 'helpers';

import placeholder from 'no-image.jpg';
import style from './style.css';
export class Tile extends React.Component {
  render() {
    return (
      <a href={`/project/${this.props.data.id}/${this.props.data.name.split(" ").join("-").split('/').join('-').toLowerCase()}`} style={{'padding':'10px'}}>
        <div style={{'position':'relative', 'border':'1px solid #eee'}}>
          <div style={{width:'auto', height:'250px','overflow':'hidden', background:`url(${this.props.data.area_resources[0] ? this.props.data.area_resources[0].url : placeholder}) 50% 50%`, backgroundSize:'cover'}} ></div>
          <div className={style.projectContainer}>
            <h4 className="space-0" dangerouslySetInnerHTML={{__html: sanitize(this.props.data.name)}}></h4>
            <p className="space-0">{this.props.data.city.name.replace(/\b\w/g, l => l.toUpperCase())}
              <span className="green pull-right" style={{'height':'50px','width':'50px'}}><img src={this.props.agency.logo} width="100%" height="auto" alt={this.props.agency.name ? this.props.agency.name : 'Agency Logo'}/></span>
            </p>
           </div>
        </div>
      </a>
    );
  }
}
export default class RelatedCarousel extends React.Component {
  render() {

    if (!this.props.agency) {
      return null;
    }
    return (
      <div className="clearfix text-center">
        <Fader width={333} maxWidth={1050} items={this.props.agency.areas.map((val, index) => <Tile data={val} agency ={this.props.agency}/>)}/>
      </div>
    );
  }
}
