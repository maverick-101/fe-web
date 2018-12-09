import React from 'react';
//import placeholder from 'no-image.jpg';
import style from './style.css';
import {imgUpload} from 'helpers';

export default function (props) {
  const {
    features,
    requestCreatePackage,
    handleFeatureChange,
    handleFeatureCheckbox,
    price,
    loading
  } = props;

  return (
    <div className={`${style.boxContainer}`}>
      <div className={`col-sm-12 panel panel-default no-padding ${style.getboxshadow}`} style={{borderRadius: '0px'}}>
        <div className='col-sm-12 panel-body no-padding'>
          <div className="col-sm-12 space-1 no-padding">
            <div className={style.imageContainer}>
            </div>
            <p className={`${style.packageLabel} text-capitalize text-center no-margin`}>Price: {price}</p>
          </div>
          <div className='col-sm-12'>
            <div className="col-sm-12 no-padding-left no-padding-right text-center">
              <h4 className={`text-capitalize ${style.limitContent}`} style={{marginBottom: '26px'}}>New Package</h4>
            </div>
            <div className={`col-sm-12 no-padding-left no-padding-right vcenter ${style.displayflow}`}>
              <div className={`row ${style.featuresLabel} text-left`}>
                <div className={`col-xs-12 col-sm-4`}>
                  <h5>Features:</h5>
                </div>
                <div className={`hidden-xs`}>
                  <div className={`col-sm-2 text-center`}>
                    <h5>Price</h5>
                  </div>
                  <div className={`col-sm-2 text-center`}>
                    <h5>Discount</h5>
                  </div>
                  <div className={`col-sm-2 text-center`}>
                    <h5>Qty</h5>
                  </div>
                  <div className={`col-sm-2 text-center`}>
                    <h5>Total</h5>
                  </div>
                </div>
              </div>
              <div className={`${style.featuresContainer}`}>
                {features.map((feature, index) => (
                  <div className={`row`} key={feature.id}>
                    <div className={`col-sm-4`}>
                      <div
                        className={`no-margin ${style.listPadding} ${style.limitContent}`}>
                        <span className="input-text" style={{marginLeft: '2px'}}>
                          <input
                            type="checkbox"
                            className="input-text"
                            name={`${feature.id}`}
                            onChange={handleFeatureCheckbox}
                          />
                        </span>
                        {feature.name}
                      </div>
                    </div>
                    <div className={`col-sm-2`}>
                      <div
                        className={`no-margin ${style.priceCol}`}>
                        <span>{`${feature.price}`}</span>
                        <span className={`text-capitalize`}>
                          {`${feature.price_unit !== 'onetime' ?
                            ' / ' + feature.price_unit :
                            ' Once'}`}
                        </span>
                      </div>
                    </div>
                    <div className={`col-sm-2`}>
                      <div className={`no-margin ${style.priceCol} text-right`}>
                        <span>{`${!!feature.discount ? feature.discount + '%' : ''}`}</span>
                      </div>
                    </div>
                    <div className={`col-sm-2`}>
                      <div className={`no-margin ${style.priceCol}`} style={{padding: 0}}>
                        {feature.feature_enabled && feature.input_type !== "checkbox" ?
                          <span className={style.featureValueContainer}>
                            <input
                              type={feature.input_type} name={feature.id}
                              className={style.featureValueInput}
                              value={feature.input_value}
                              autoFocus
                              onChange={handleFeatureChange}
                            />
                          </span> : null
                        }
                      </div>
                    </div>
                    <div className={`col-sm-2`}>
                      <div className={`text-right ${style.priceCol}`}>
                        {feature.price_unit === 'onetime' && feature.feature_enabled ?
                          Number(feature.price) - Number(feature.price) * (Number(feature.discount) / 100) :
                          (Number(feature.price) * Number(feature.input_value)) === 0 ? '' :
                            Number(feature.price) * Number(feature.input_value) -
                            (Number(feature.price) * Number(feature.input_value) * (Number(feature.discount) / 100))
                        }
                      </div>
                    </div>
                  </div>
                ))}
                <div className={`row`}>
                  <div className={`col-sm-10`}>
                    <div
                      className={`no-margin ${style.listItem} ${style.listPadding} ${style.limitContent}`}>
                      <div className={`pull-right`}>
                        <h5>Total:</h5>
                      </div>
                    </div>
                  </div>
                  <div className={`col-sm-2`}>
                    <div className={`text-right ${style.priceCol}`} style={{height: 'auto'}}>
                      <h5>{price}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`row`}>
                <div className={`col-xs-6`}>
                  <em style={{marginTop: '10px', display: 'inline-block'}}>* All prices are in Pakistani rupees</em>
                </div>
                <div className={`col-xs-6 text-right`}>
                  <button className={`space-3 btn btn-md red ${loading ? 'loading' : ''}`} style={{outline: 'none'}}
                          onClick={requestCreatePackage}>Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
