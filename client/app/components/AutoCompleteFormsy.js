import React from 'react';
import { withFormsy } from 'formsy-react';
import Autosearch from 'components/Autosearch';

class AutoCompleteFormsy extends React.Component {
  renderError() {
    if(this.props.showRequired()) {
      return `Please select ${this.props.display} from the dropdown.`;
    } else if(!this.props.isValid()) {
      return this.props.getErrorMessage();
    }
  }
  render() {
    var { containerClass, inputClass, display, ...props } = (this.props.shouldReset && this.props.shoudlResetThis) ? {} : this.props;
    if(this.props.shouldReset)
    return null
    else
    return (
      <Autosearch
        {...props}
        onSelect={suggestion => {
          this.props.setValue(suggestion);
          this.props.onSelect && this.props.onSelect(suggestion);
        }}
        renderInputComponent={inputProps => (
          <div className={containerClass}>
            <input {...inputProps} autoComplete='off' className={`${inputClass} ${this.props.isFormSubmitted() && (this.props.showRequired() || !this.props.isValid()) ? 'error' : ''}`}/>
            <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
          </div>
        )}
      />
    )
  }
}

export default withFormsy(AutoCompleteFormsy);
