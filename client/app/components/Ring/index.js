import React from 'react';

import style from './style.css';

export default class Ring extends React.Component {
  render() {
    return (
      <div className={style.ringWrapper} style={{transform: 'scale(0.85)'}}>
        <div className={style.ring}>
          <div className={style.pie}>
            <div className={style.arc}></div>
            <div className={style.leg}>
              <div className={style.legContent}>
                <img src={require('gid/ma.png')} style={{maxHeight: 50}}/>
                <span>Managing Authority</span>
              </div>
            </div>
            <div className={style.feature}>
              <h4 className="white">Managing <br />Authority</h4>
              <img src={require('gid/1.png')}/>
            </div>
          </div>
          <div className={style.pie}></div>
          <div className={style.pie}>
            <div className={style.arc}></div>
            <div className={style.leg}>
              <div className={style.legContent}>
                <img src={require('gid/a1.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a2.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a3.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a4.png')} style={{maxHeight: 50, marginRight: 10}}/>
              </div>
            </div>
            <div className={style.feature}>
              <img src={require('gid/2.png')}/>
              <h4 className="white">Amenities</h4>
            </div>
          </div>
          <div className={style.pie}></div>
          <div className={style.pie}>
            <div className={style.arc}></div>
            <div className={style.leg}>
              <div className={style.legContent}>
                <img src={require('gid/a1.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a2.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a3.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a4.png')} style={{maxHeight: 50, marginRight: 10}}/>
              </div>
            </div>
            <div className={style.feature}>
              <h4 className="white">Utilities</h4>
              <img src={require('gid/3.png')}/>
            </div>
          </div>
          <div className={style.pie}></div>
          <div className={style.pie}>
            <div className={style.arc}></div>
            <div className={style.leg}>
              <div className={style.legContent}>
                <img src={require('gid/a1.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a2.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a3.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a4.png')} style={{maxHeight: 50, marginRight: 10}}/>
              </div>
            </div>
            <div className={style.feature}>
              <h4 className="white">Distance</h4>
              <img src={require('gid/4.png')}/>
            </div>
          </div>
          <div className={style.pie}></div>
          <div className={style.pie}>
            <div className={style.arc}></div>
            <div className={style.leg}>
              <div className={style.legContent}>
                <img src={require('gid/a1.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a2.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a3.png')} style={{maxHeight: 50, marginRight: 10}}/>
                <img src={require('gid/a4.png')} style={{maxHeight: 50, marginRight: 10}}/>
              </div>
            </div>
            <div className={style.feature}>
              <img src={require('gid/5.png')}/>
              <h4 className="white">Facilities</h4>
            </div>
          </div>
          <div className={style.ringHeader}>
            <div className="pull-right" style={{marginRight: 15}}>
              <h1 className="no-margin red">Bahria Town Phase 7</h1>
              <p className="red text-right large">Overview</p>
            </div>
          </div>
          <div className={`row text-center ${style.innerCircle}`}>
            <div className={style.gidLogo}>
              <img src={require('gid/gid.png')} className="img-responsive"/>
            </div>
            <div className={`col-sm-6 col-xs-6 no-padding ${style.right} ${style.bottom}`}>
              <div className="vcenter-absolute">
                <h4 className="no-margin red">19%</h4>
                <p className="space-0">Increase in prices</p>
              </div>
            </div>
            <div className={`col-sm-6 col-xs-6 no-padding ${style.bottom}`}>
              <div className="vcenter-absolute">
                <h4 className="no-margin red">48K</h4>
                <p className="space-0">Residents</p>
              </div>
            </div>
            <div className={`col-sm-6 col-xs-6 no-padding ${style.right}`}>
              <div className="vcenter-absolute">
                <h4 className="no-margin red">2500 Kanal</h4>
                <p className="space-0">Total Area</p>
              </div>
            </div>
            <div className="col-sm-6 col-xs-6 no-padding">
              <div className="vcenter-absolute">
                <h4 className="no-margin red">0.9M - 10M</h4>
                <p className="space-0">Price Range</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
