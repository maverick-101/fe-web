import React from 'react';
import { Link } from 'react-router';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import {convertPrice, imgUpload} from 'helpers';
import _ from 'lodash';

import placeholder from 'images-comingsoon.svg';

import ProgressiveBGImage from 'react-progressive-bg-image'

import style from './style.css';

export default class ShowCase extends React.Component {
  renderProjects(projects) {
    var {currencyRates, currency} = this.props;
    return (
      <ul className={`list-unstyled list-inline ${style.imageGroup}`}>
        {projects.map(project => {
          // var minArray = (project.entity) ? ((project.entity.area_rates && project.entity.area_rates.length) ? project.entity.area_rates.map((rate) => rate.min_price) : []) : []
          // var minValue = _.min(minArray);
          var minValue = project.entity.minPrice.length ? project.entity.minPrice[0].min_price : null;
          var displayImage = project.entity.area_resources.filter((item) => {
            if(item.type == 'display_featured') {
              return item;
            }
          })
          if(!displayImage.length) {
            displayImage = project.entity.area_resources
          }
          return (
            <li id={project.entity.name} key={project.id} >
              <a href={`/project/${project.entity.id}/${project.entity.name.split(" ").join("-").split('/').join('-').toLowerCase()}`}>
                <div style={{position: 'relative', height: 170, borderRadius: 3,}}>
                  <div className={style.imageContainer}>
                    { displayImage.length ? 
                        <ProgressiveBGImage
                          src={imgUpload(displayImage[0].url, 'h_400')}
                          placeholder={imgUpload(displayImage[0].url, 'h_50')}
                          className={style.image}
                        />
                      : <div className={style.image} style={{background: `url(${placeholder})`, backgroundColor: "#f5f5f5", backgroundSize: "68% auto", }} />
                    }
                    {/* <div className={style.image} style={{backgroundImage: `url(${imgUpload(project.entity.area_resources[0].url, 'h_250')})`}}></div> */}
                  </div>
                </div>
                {!project.entity.show_developer && project.entity.marketedBy ? 
                <p style={{margin: "7px 0 3px"}} className={`space-0 ${style.whiteSpaceNormal}`}>Authorised Agent <p className={`space-0`} style={{ color:'#ef5350', display: 'inline-block'}}>{project.entity.marketedBy.name}</p></p>
                 : <p className="gray space-0 text-ellipsis red" style={{margin: "7px 0 3px",  fontWeight: 400, }}>{project.entity.agency ? project.entity.agency.name : null}</p>
                 }
                <h4 className={`no-margin ${style.limitContent}`}>{project.entity.name}</h4>
                {
                  minValue ?
                  <p>Starts at
                    <span className="gray space-0 text-ellipsis" style={{color: '#26a59a', fontWeight: 400, }}>
                      <span style={{color: '#ddd',}}>&nbsp; | &nbsp;{currency} </span>
                      {
                        minValue ?
                        convertPrice(minValue, currency, currencyRates) : 'N/A'
                      }
                    </span>
                  </p> : <p className={`gray space-0`}>Click For More Info!</p>
                }
              </a>
            </li>
          )
        })}
      </ul>
    )
  }
  render() {
    if(!this.props.data) {
      return null;
    }
    return (
      <div style={{padding: "10px 0", margin: "0 -15px"}}>
        <div className={`col-sm-12 col-xs-12`}>
          <h3 className="text-center gothicHeading">Featured Projects</h3>
          <div className='headingUnderline'/>
          <p className="text-center space-4">Most popular projects from each city</p>
        </div>
        <Tabs defaultActiveKey={0} id="featured-projects" className={style.featuredProjects}>
          {Object.keys(this.props.data).map(
            (item, index) => (
              <Tab eventKey={index} id={item} title={item} key={index}>
                {this.renderProjects(this.props.data[item])}
              </Tab>
            )
          )}
        </Tabs>
      </div>
    );
  }
}
