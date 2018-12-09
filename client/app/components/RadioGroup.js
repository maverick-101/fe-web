import React from 'react';
import { withFormsy } from 'formsy-react';

class RadioGroup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: ''
    };
  }
  onChange(value) {
    this.props.setValue(value)
    this.props.onChange && this.props.onChange(value);
  }
  renderError() {
    if(this.props.showRequired()) {
      return `${this.props.display} is required.`
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.value && !this.state.value){
      this.setState({value : this.props.value})
      this.props.setValue(this.props.value);
      document.getElementById(this.props.value).checked= true;
    }
  }
  render() {
    const { name, options, containerClassName, value } = this.props;
    var error = this.props.isFormSubmitted() && this.props.showRequired() ? 'error' : '';
    return (
      <div className={containerClassName}>
        <div className="clearfix space-1">
          {options.map((option, index) => (
            <div className={`radio-wrapper ${error}`} key={index}>
              <input type="radio" name={name} id={option} onChange={event => this.onChange(option)}/>
              <label htmlFor={option} className="radio-label">{option.replace(/\b\w/g, l => l.toUpperCase())}</label>
            </div>
          ))}
        </div>
        <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
      </div>
    )
  }
}

export default withFormsy(RadioGroup);
