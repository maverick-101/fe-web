import React from 'react';
import { Link } from 'react-router';
import Fader from 'components/Fader';
import placeholder from 'no-image.jpg';
import {convertPrice, imgUpload} from 'helpers';
import _ from 'lodash';

import style from './style.css';

export default class Project extends React.Component {
  render() {
    var {currencyRates, currency, data} = this.props;
    var minArray = (data && data.area) ? ((data.area.area_rates && data.area.area_rates.length) ? data.area.area_rates.map((rate) => rate.min_price) : []) : []
    var minValue = _.min(minArray);
    return (
      <Link to={`/project/${data.project_id}/${data.area.name.split(" ").join("-").split('/').join('-').toLowerCase()}`}>
        <div className={style.project}>
          <div className={style.imageContainer}>
            <div className={style.image} style={{backgroundImage: `url(${data.area.area_resources[0] ? imgUpload(data.area.area_resources[0].url, 'h_500') : placeholder})`}}></div>
          </div>
          <div className={`${style.details} panel panel-default space-0 ${this.props.hideDeveloperInfo ? style.hiddenDevInfo : null }`}>
            <div className={style.title}>
              <h3 className="ellipses no-margin">{data.area.name}</h3>
              <p className="space-0 gray">{data.area.city.name}</p>
            </div>
            <div className={style.developerInfo}>
              <div className={style.price}>
                <p className="gray space-0">Starting from</p>
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
                <img src={this.props.agency.logo} alt={this.props.agency.name ? this.props.agency.name : 'Agency Logo'}/>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
