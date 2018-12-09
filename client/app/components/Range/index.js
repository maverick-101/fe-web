import React from 'react'
import Rheostat from 'rheostat'
import geometric from 'rheostat/lib/algorithms/geometric'
import linear from 'rheostat/lib/algorithms/linear'
import log10 from 'rheostat/lib/algorithms/log10'
import { convertPrice } from 'helpers'
import { connect } from 'react-redux'

import style from './style.css'

class Range extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFirstCall: true,
    }
  }
  shouldComponentUpdate(nextProps) {
    if(this.props.initial[0] == nextProps.initial[0] && this.props.initial[1] == nextProps.initial[1] && this.props.max == nextProps.max) {
      return false;
    }
    return true;
  }
  onChangeValue(status){
    if(!this.state.isFirstCall || status[0] !== 0 || status[1] !== this.props.max || (!isNaN(this.props.initial[0]) && !isNaN(this.props.initial[1])) ){
        this.props.onChange(status);
    }
    this.setState({isFirstCall: false});
  }
  render() {
    var { max, initial, onChange } = this.props;
    
    var props = this.props;
    const Handle = (props) => {
      return (
        <div>
          <button {...props} type="button"/>
          <div className={style.rangeLabel} style={props.style}>
            {convertPrice(props['aria-valuenow'], this.props.currency, this.props.currencyRates)}
          </div>
        </div>
      )
    }
    return (
      <div className={`${style.fixSizeM}`}>
        <Rheostat
          min={0}
          max={max}
          algorithm={geometric}
          handle={Handle}
          values={[initial[0] && !(initial[0] < 0) ? initial[0] : 0, initial[1] && initial[1] <= max ?  initial[1] : max]}
          onChange={status => this.onChangeValue && this.onChangeValue(status.values)}
        />
      </div>
    )
  }
}

export default connect(store => {
  return {
    currency: store.user.currency,
    currencyRates: store.user.currencyRates,
  }
})(Range)
