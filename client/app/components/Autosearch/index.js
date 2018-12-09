import React from 'react';
import Autosuggest from 'react-autosuggest';

export default class Autosearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      suggestions: [],
      value: props.value || '',
      selectedSuggestion: '',
      defaultSuggestions: [],
      firstCalled: true,
      clicked: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.filter) {
      this.setState({suggestions: nextProps.data})
    }
    if(this.props.value && !this.state.value && this.state.firstCalled){
      this.setState({value : this.props.value.name,firstCalled:false})
    }
  }
  splitValue(value, index, sign) {
    return value.substring(0, index) + sign + value.substring(index);
  }
  checkAlias(value){
    var str = value
    var checkForNumber = /[0-9]/.exec(str.split("-")[0].substring(0));
    
    str= str.split("-");
    if(checkForNumber){
      str= str.join(' ')
    } else {
      str= str.join('')
    }
    var match = /[0-9]/.exec(str.substring(0));
    if(match){
      var noTocheck = str.substring(match.index).split('-').join('').split('/').join('').split(' ').join('');
      if(isNaN(noTocheck)){
      return value;
      }
      str = this.splitValue(str,match.index,'-');
      var sector = /[0-9]/.exec(str.substring(match.index + str.split(' ')[0].length));
      if(sector){
        str = this.splitValue(str,match.index + str.split(' ')[0].length + sector.index,'/');
      }
      str = str.split(' ').join('');
    }
    return str;
  }
  filterSuggestions({value}) {    
    if(this.props.filter) { 
      let alias = this.checkAlias(value);
      var suggestions = this.props.data ? this.props.data.filter(suggestion => suggestion.name.toLowerCase().startsWith(value.trim().toLowerCase()) || suggestion.name.toLowerCase().startsWith(alias.trim().toLowerCase())) : [];
      this.setState({suggestions})
    }
  }
  suggestionSelected(suggestion) {
    this.setState({selectedSuggestion: suggestion})
    this.props.onSelect && this.props.onSelect(suggestion);
  }
  onChange(value, method) {
    (value == '') ? this.setState({defaultSuggestions: this.props.data ? this.props.data.filter(item => item.default_show==true) : [] }) : this.setState({defaultSuggestions: []})
    this.setState({value})
    this.props.onType && method == 'type' && this.props.onType(value);
    this.state.selectedSuggestion.id && this.suggestionSelected('')
  }
  clearSuggestions() {
    this.setState({
      suggestions: [],
    })
  }
  defaultSuggestions() {
    this.setState({defaultSuggestions: this.props.data ? this.props.data.filter(item => item.default_show==true) : [] })
  }
  closeOnClick() {
    this.setState({ clicked: !this.state.clicked });
  }
  
  render() {
    var { name, placeholder, inputClass, disabled, data, filter, onFocus, onType, onSelect, closeOnClick,  ...props } = this.props;
    const { clicked } = this.state;
    return (
      <Autosuggest
        suggestions={this.state.suggestions.length > 0 ? this.state.suggestions : this.state.defaultSuggestions}
        onSuggestionsFetchRequested={q => this.filterSuggestions(q)}
        onSuggestionsClearRequested={() => this.clearSuggestions()}
        getSuggestionValue={suggestion => suggestion.name.replace(/\b\w/g, l => l.toUpperCase())}
        renderSuggestion={suggestion => suggestion.name.replace(/\b\w/g, l => l.toUpperCase())}
        inputProps={{
          name,
          placeholder,
          disabled,
          className: inputClass,
          value: this.state.value || '',
          onChange: (event, {newValue, method}) => {
            this.onChange(newValue, method);
            closeOnClick ? this.setState({ clicked: false }) : '';
          },
          onFocus: () => {
            this.props.onFocus && this.props.onFocus(this.state.value);
            this.defaultSuggestions();
            closeOnClick ? this.setState({ clicked: true }) : '';
          },
          onClick: () => {closeOnClick ? this.closeOnClick() : ''},
          onBlur: () => {closeOnClick ? this.setState({ clicked: false }) : ''},
          // onBlur: (event, {highlightedSuggestion}) => !this.state.selectedSuggestion && this.suggestionSelected(highlightedSuggestion || '')
        }}
        onSuggestionSelected={(event, {suggestion}) => this.suggestionSelected(suggestion)}
        shouldRenderSuggestions={(value) =>  closeOnClick ? !clicked : (this.state.selectedSuggestion && this.state.suggestions.length == 1 && this.state.selectedSuggestion.name == value.toLowerCase() && this.state.suggestions[0].name == value.toLowerCase()) ? false : true}
        {...props}
      />
    )
  }
}
