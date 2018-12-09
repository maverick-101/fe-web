import React from 'react';
import { Link } from 'react-router';
import Fader from 'components/Fader';
import {convertPrice, imgUpload} from 'helpers';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';

import placeholder from 'images-comingsoon.svg';

import style from './style.css';

import ProgressiveBGImage from 'react-progressive-bg-image'

class Project extends React.Component {
  render() {
    var {currencyRates, currency} = this.props;
    // var minArray = (this.props.data && this.props.data.entity) ? ((this.props.data.entity.area_rates && this.props.data.entity.area_rates.length) ? this.props.data.entity.area_rates.map((rate) => rate.min_price) : []) : []
    // var minValue = _.min(minArray);
    
    var minValue = this.props.data.entity.minPrice.length ? this.props.data.entity.minPrice[0].min_price : null;
    return (
      <a id={`${this.props.data.entity && this.props.data.entity.name ? this.props.data.entity.name : ''}`} href={`/project/${this.props.data.entity.id}/${this.props.data.entity.name.split(" ").join("-").split('/').join('-').toLowerCase()}`}>
      <div className={`${style.project} ${style.outerStylesMega}`}>
          <div className={style.imageContainer}>
          { this.props.data.entity.area_resources.length ? 
              <ProgressiveBGImage
                      src={imgUpload(this.props.data.entity.area_resources[0].url, 'h_600')}
                      placeholder={imgUpload(this.props.data.entity.area_resources[0].url, 'h_100')}
                      className={style.image}
                    />
            : <div className={style.image} style={{background: `url(${placeholder})`, backgroundColor: "#f5f5f5", backgroundSize: "68% auto", }} />
          }
            {/* <div className={style.image} style={{backgroundImage: `url(${imgUpload(this.props.data.entity.area_resources[0].url, 'h_500')})`}}></div> */}
          </div>
          <div className={`${style.details} panel panel-default space-0`}>
            <div className={style.title}>
              <h3 className="no-margin ellipses text-capitalize" style={{paddingBottom: 5, }}>{this.props.data.entity.name}</h3>
              <p className="space-0 red text-capitalize">{this.props.data.entity.city.name}</p>
            </div>
            <div className={style.developerInfo}>
              <div className={style.price}>
                <p className="gray space-0">Starting From</p>
                <p className="gray space-0">
                { 
                   minValue ?
                   <span> 
                    <span>{currency}</span>
                    <span className="green elipses" style={{fontSize: 22}}> {convertPrice(minValue, currency, currencyRates)}</span>
                   </span>
                    :
                    <span className="green elipses" style={{fontSize: 18}}>Contact For Price</span>
                 }
                </p>
              </div>
              <div className={style.logo}>
                {this.props.data.entity.marketedBy && !this.props.data.entity.show_developer ?
                  <img src={imgUpload(this.props.data.entity.marketedBy.logo, 'h_100', false)} alt="Agency Logo"/> 
                : <img src={imgUpload(this.props.data.entity.agency.logo, 'h_100', false)} alt="Agency Logo"/> 
                }
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }
}

export default class MegaProjects extends React.Component {
  render() {
    if(!this.props.projects || !this.props.projects.length) {
      return null;
    }
    return (
      <div className="text-center clearfix">
        <h2 className='gothicHeading'>Mega Projects</h2>
        <div className='headingUnderline'/>
        <p className='space-4'>Most popular projects from around Pakistan</p>
        <div className={style.projects}>
          <LazyLoad height={750}>
            <Fader width={340} maxWidth={1410} unSlickTill={1024} items={this.props.projects.map(project => <Project  currencyRates={this.props.currencyRates} currency={this.props.currency} key={project.id} data={project}/>)}/>
          </LazyLoad>
        </div>
      </div>
    );
  }
}
