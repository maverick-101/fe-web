import React from 'react';

import style from './style.css';
import listing from 'agency/listing.jpg';
// import placeholder from 'no-image.jpg';
import placeholder from 'images-comingsoon.svg';
import { convertPrice, convertUnit, sanitize } from 'helpers';

export default class SmallTile extends React.Component {
  slug(property){
    let slug = [];
    if(property.city && property.city.name !== null){
      slug.push(property.city.name.trim().split(' ').join('-'));    
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
    return(
      <a href={`/property/${this.slug(this.props.property)}`} className={`${style[this.props.property.listing_type]}`}>

        <div style={{'position':'relative', 'border':'1px solid #eee'}}>
        {/* // TODO need to implement heart  */}
          <div style={{
            width:'auto',
            height:'250px',
            overflow:'hidden',
            backgroundImage:`url(${(this.props.property.property_images[0] && this.props.property.property_images[0].url) || placeholder})`,
            backgroundPosition: this.props.property.property_images[0] && this.props.property.property_images[0].url ? 'center center' : 'center 25%',
            backgroundSize: this.props.property.property_images[0] && this.props.property.property_images[0].url ? 'cover' : '68% auto',
            backgroundColor: '#f5f5f5',
            backgroundRepeat: 'no-repeat',
          }}
          />
          <p className={`text-capitalize text-center no-margin ${style.header}`}>FEATURED LISTING</p>
          <div className={style.projectContainer}>
            <h4 className="space-0" dangerouslySetInnerHTML={{__html: sanitize(this.props.property.title)}}></h4>
            <p className="space-0">{this.props.property.area.name.replace(/\b\w/g, l => l.toUpperCase())}, {this.props.property.city.name.replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p className="gray small">{this.props.property.bed ? this.props.property.bed + ' beds, ' : ''} {this.props.property.bath ? this.props.property.bath + ' baths' : ''}
            <span className="green pull-right">{this.props.currency} {convertPrice(this.props.property.price, this.props.currency, this.props.currencyRates)}</span>
            </p>
          </div>
        </div>
      </a>
    )
  }
}
