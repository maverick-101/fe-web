import React from 'react';
import { withFormsy } from 'formsy-react';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue || '',
      firstCalled: true,
    };
  }
  componentDidMount() {
    this.props.setValue(this.props.defaultValue)
  }
  onChange(value) {
    this.props.setValue(value)
    this.setState({value});
    this.props.onChange && this.props.onChange(value);
  }
  handleInput(value){
    if(this.props.name === 'phone') {
      if(!value ||value ===''|| value < 0 || value.indexOf('-') !== -1){
        value = ''
      }
      if(value.toString().indexOf('.')!== -1){
        var index = value.toString().indexOf('.');
        value = value.toString().slice(0, index) + value.toString().slice(index + 1);
      }
      if (value.toString().length > 20) {
        value = value.toString().slice(0, 20);
      }
      return value;
    } else {
      return value;
    }
  }
  renderError() {
    if(this.props.showRequired()) {
      return `${this.props.display} is required.`;
    } else if(!this.props.isValid()) {
      return this.props.getErrorMessage();
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.resetfield){
      this.setState({value: ''});
      this.props.resetEmailField();
    }
    if(nextProps.resetCheck){
      this.setState({value: ''});
      this.props.resetCheckField();
    }
    if(this.props.defaultValue && !this.state.value && this.state.firstCalled){
      this.setState({value : this.props.defaultValue,firstCalled:false});
      this.props.setValue(this.props.defaultValue);
    }
    if((this.props.defaultValue !== nextProps.defaultValue) && nextProps.updatable) {
      this.setState({value: nextProps.defaultValue});
      this.props.setValue(nextProps.defaultValue);
    }
  }
  render() {
    const { name, style, type, placeholder, containerClass, className, onBlur, defaultValue, children, validations } = this.props;
    return (
      <div style={style} className={containerClass}>
        <input
          pattern={!validations && type==='text'?"[A-Za-z\s ]{1,}":null}
          // min={name === 'phone' ? "999999" : null}
          tabIndex={this.props.tabIndex}
          type={type}
          name={name}
          placeholder={placeholder}
          className={`input-text block ${className} ${this.props.isFormSubmitted() && (this.props.showRequired() || !this.props.isValid()) ? 'error' : ''}`}
          onChange={e => {e.target.value = this.handleInput(e.target.value);this.onChange(e.target.value);}}
          onBlur={e => onBlur && onBlur(e.target.value)}
          value= {this.state.value}
          onKeyDown={e => {e.target.value = e.target.value === '' ? '' : e.target.value; }}
          required={this.props.required ? true : false}
          validations={validations}
          disabled={!!this.props.disabled}
          />
        <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
        {children}
      </div>
    )
  }
}

export default withFormsy(Input);
