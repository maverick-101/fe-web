import React from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import axios from 'axios';
import Fader from 'components/Fader';
import { convertPrice, convertUnit, convertSize, imgUpload, sanitize } from 'helpers';

import placeholder from 'no-image.jpg';
import style from './style.css';

export class Tile extends React.Component {
  slug(property){
    let slug = [];
    if(property.city && property.city.name !== null){
      slug.push(property.city.name.trim().split(' ').join('-').split('/').join('-'));    
     }
    if(property.area && property.area.name !== null){
      slug.push(property.area.name.trim().split('/').join('-').split(' ').join('-')); 
    }
    if(property.title !== null){
      var title = property.title.trim().split(" ");
      title.shift();
      title.shift();
      slug.push(`${parseInt(property.size)}-${property.size_unit}-${title.join("-")}`);
    }
      return `${slug.join("-").toLowerCase()}-${property.id}`;
    }
  render() {
    return (
      <a href={`/property/${this.slug(this.props.property)}`} style={{'padding':'10px'}} className={`${style[this.props.property.listing_type]}`}>

        <div style={{position:'relative', border:'1px solid #eee', }}>
          <div className={`${style.heightOfRelProp}`} style={{width:'auto', overflow:'hidden', background:`url(${this.props.property.property_images.filter(image => image.type == 'image').length ? imgUpload(this.props.property.property_images.filter(image => image.type == 'image')[0].url, 'h_250') : placeholder}) 50% 50%`, backgroundSize:'cover'}} ></div>
          <p className={`text-capitalize text-center no-margin ${style.header}`} style={{color: 'white', }}>{this.props.property.listing_type == "premium_plus" ? "Premium Plus" : (this.props.property.listing_type == "premium" ? "Premium" : "")}</p>
          <div className={style.projectContainer}>
            <h4 className="space-0 text-ellipsis" style={{color: 'white', }} dangerouslySetInnerHTML={{__html: sanitize(this.props.property.title)}}></h4>
            <p className="space-0 text-ellipsis" style={{color: 'white', }}>{this.props.property.area.name.replace(/\b\w/g, l => l.toUpperCase())}, {this.props.property.city.name.replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p className="small" style={{color: 'white', }}>{this.props.property.bed} bed, {this.props.property.bath} baths
              <span className="pull-right">{this.props.property.price != 0 && typeof(this.props.property.price) != 'object' ? `${this.props.currency} ${convertPrice(this.props.property.price, this.props.currency, this.props.currencyRates)}` : 'Call Us'}</span>
            </p>
          </div>
        </div>
      </a>
    );
  }
}
export default class RelatedCarousel extends React.Component {
  render() {
    if (!this.props.relatedProperties || !this.props.relatedProperties.length) {
      return null;
    }
    return (
      <div className={`clearfix text-center ${style.properties}`}>
        <Fader width={333} maxWidth={1050} unSlickTill={1024} items={this.props.relatedProperties.map((val, index) => <Tile property={val} currencyRates={this.props.currencyRates} currency={this.props.currency}/>)}/>
      </div>
    );
  }
}
