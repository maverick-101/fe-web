import React from 'react';
import { withFormsy } from 'formsy-react';

class Textarea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue || '',
      firstCalled: true,
    };
  }
  onChange(value) {
    this.props.setValue(value)
    this.setState({value});
    this.props.onChange && this.props.onChange(value);
  }
  renderError() {
    if(this.props.showRequired()) {
      return `${this.props.display} is required.`;
    } else if(!this.props.isValid()) {
      return this.props.getErrorMessage();
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.defaultValue && !this.state.value && this.state.firstCalled){
      this.setState({value : this.props.defaultValue,firstCalled:false});
      this.props.setValue(this.props.defaultValue);
    }
  }
  render() {
    const { name, rows, placeholder, containerClass, className, onBlur, children, style, maxlength } = this.props;
    return (
      <div className={containerClass}>
        <textarea
          style={{...style}}
          maxLength={maxlength}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={this.state.value }
          className={`input-text block ${className} ${this.props.isFormSubmitted() && (this.props.showRequired() || !this.props.isValid()) ? 'error' : ''}`}
          onChange={e => this.onChange(e.target.value)}
          onBlur={e => onBlur && onBlur(e.target.value)}/>
        <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
        {children}
      </div>
    )
  }
}

export default withFormsy(Textarea)
