import React from 'react';
import { withFormsy } from 'formsy-react';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || ''
    };
  }
  setExternalValue(value) {
    this.setState({value});
    this.props.setValue(value);
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.options.length != nextProps.options.length && !this.props.options.every((val, index) => val == nextProps[index])) {
      this.setState({
        value: ''
      });
      this.props.setValue('');
    }
    if(this.props.value && !this.state.value){
      this.setState({value : this.props.value});
      this.props.setValue(this.props.value);
    }
  }
  onChange(value) {
    this.setState({value});
    this.props.setValue(value);
    this.props.onChange && this.props.onChange(value);
  }
  renderError() {
    if(this.props.showRequired()) {
      return `${this.props.display} is required.`;
    }
  }
  render() {
    const { name, containerClass, className, placeholder, options, danger} = this.props;
    return (
      <div>
        <div className={`select ${containerClass}`}>
          <select
            name={name}
            className={`input-text block ${className} ${this.props.isFormSubmitted() && this.props.showRequired() ? 'error' : ''}`}
            value={this.state.value}
            onChange={(e) => this.onChange(e.target.value)}
          >
            <option value="">{placeholder}</option>
            {options.map(
              (option, index) => danger ?
                <option key={index} value={option.value} dangerouslySetInnerHTML={option}/> :
                <option key={index} value={option.value || option.id || option}>{(option.title || option).replace(/\b\w/g, l => l.toUpperCase())}</option>
            )}
          </select>
        </div>
        <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
      </div>
    );
  }
}

export default withFormsy(Select);
