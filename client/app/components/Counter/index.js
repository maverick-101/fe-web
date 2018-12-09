import React from 'react';

import style from './style.css'

export default class Counter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: props.value || 0,
    }
  }
  valueChanged() {
    this.props.onChange && this.props.onChange(this.state.counter);
  }
  increment() {
    if(this.state.counter != 30) {
      this.setState({counter: ++this.state.counter});
      this.valueChanged();
    }
  }
  decrement() {
    if(this.state.counter || (this.props.includeZero && !this.state.counter)) {
      this.setState({counter: --this.state.counter});
      this.valueChanged();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value != this.props.value) {
      this.setState({counter: nextProps.value});
    }
  }

  render() {
    if(this.props.sideStyle) {
      return (
        <div className={`btn-group ${style.newCounter} ${this.props.containerClass}`}>
          <button type="button" className={`btn btn-default ${style.newCounter_minus}`} style={{margin:0, borderRight: 0,}} onClick={() => this.decrement()}></button>
          <div className={`btn ${style.newCounter_label}`} style={{margin:0}}>
            {this.state.counter || (this.props.includeZero && !this.state.counter) ? `${this.state.counter}` : `${this.props.infoText || 'Add'}`} {this.props.label}{this.state.counter == 1 ? '' : 's'}
          </div>
          <button type="button" className={`btn btn-default ${style.newCounter_plus}`} style={{margin:0, borderLeft: 0,}} onClick={() => this.increment()}></button>
        </div>
      )
    }
    return (
      <div className={`btn-group ${style.counter} ${this.props.containerClass}`}>
        <div className={`btn ${style.counterLabel}`}>
          <div className={`${style.labelBorder}`}>
            {this.state.counter || (this.props.includeZero && !this.state.counter) ? `${this.state.counter}` : `${this.props.infoText || 'Add'}`} {this.props.label}{this.state.counter == 1 ? '' : 's'}
          </div>
        </div>
        <button type="button" className={`btn fa fa-minus gray ${style.decrement}`} onClick={() => this.decrement()}>
          <div className={style.borderRight}></div>
        </button>
        <button type="button" className="btn fa fa-plus gray" onClick={() => this.increment()}></button>
      </div>
    )
  }
}
