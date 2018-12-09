import React from 'react';
//import placeholder from 'no-image.jpg';
import style from './style.css';
import {imgUpload} from 'helpers';

export default function (props) {
  const {pckg, requestPackage, type, loading} = props;
  const getboxshadow = type === 'normal' ? style.getboxshadownormal : style.getboxshadowhovered;

  return (
    <div className={`${style.boxContainer}`}>
      <div className={`col-sm-12 panel panel-default no-padding ${getboxshadow} ${type}`} style={{borderRadius: '0px'}}>
        <div className='col-sm-12 panel-body no-padding'>
          <div className="col-sm-12 space-1 no-padding">
            <div className={style.imageContainer}>
            </div>
            <p className={`${style.packageLabel} text-capitalize text-center no-margin`}>Price: {pckg.price}</p>
          </div>
          <div className='col-sm-12'>
            <div className="col-sm-12 no-padding-left no-padding-right text-center">
              <h4 className={`text-capitalize ${style.limitContent}`} style={{marginBottom: '26px'}}>{pckg.name}</h4>
            </div>
            <div className={`col-sm-12 no-padding-left no-padding-right vcenter ${style.displayflow}`}>
              <div className={`${style.featuresLabel} text-left`}><h5>Features:</h5></div>
              <div className={`${style.featuresContainer}`}>
                {pckg.package_features.map((feature, index) => (
                  <div className={`no-margin ${style.listPadding} ${style.limitContent}`} key={feature.id}>
                    {feature.feature.name}
                    <div className={`pull-right`}>
                      <span>{`${feature.feature_value !== 'true' && feature.feature_value !== 'false' ? feature.feature_value : ''}`}</span>
                      <span className={`text-capitalize`}>
                        {`${feature.feature.price_unit !== 'onetime' ? ' ' + feature.feature.price_unit + 's' : ''}`}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                <button className={`space-3 btn btn-sm btn-block red ${loading ? 'loading' : ''}`} style={{outline: 'none'}}
                        onClick={() => requestPackage(pckg.id)}>Place Order
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
