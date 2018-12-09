import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import _ from 'lodash';
import style from './style.css';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, props) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');
  return props.data
    .map(section => {
      return {
        title: section.title,
        data: section.data.filter(language => {
          // language.name =  language.name;
          // return regex.test(language.name)
          let name = language.name.toLowerCase();
          return name.search(escapedValue.toLowerCase()) === -1 ? false : true
        })
      };
    })
    .filter(section => section.data.length > 0);
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>
      {suggestion.name}
      {suggestion.marketer ?
        <span> - Authorised Agent {suggestion.marketer}</span>
        : null
      }
    </span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.data;
}

export default  class MultiSecAutosearch extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defaultValue) {
      this.setState({value: nextProps.defaultValue})
    }
  }
  componentDidMount() {
    if(this.props.defaultValue) {
      this.setState({value: this.props.defaultValue})
    }
  }
  suggestionSelected = (event, {suggestion, sectionIndex}) => {
    suggestion.section = this.state.suggestions[sectionIndex].title,sectionIndex;
    this.setState({selectedSuggestion: suggestion})
    this.props.onSelect && this.props.onSelect(suggestion);
  };
  onChange = (event, { newValue, method }) => {
    if (this.props.limit && newValue.toString().length > this.props.limit) {
      newValue = newValue.toString().slice(0, this.props.limit);
    }
    this.setState({
      value: newValue
    });
    if(!newValue){
    this.props.onReset && this.props.onReset();
    }
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  onClear = () => {
    this.setState({value:''});
    this.props.onReset && this.props.onReset();
  };

  render() {
    const { value, suggestions } = this.state;
    var { name, placeholder, inputClass, disabled, data, filter, onFocus, onType, onSelect, defaultValue, ...props } = this.props;
    const inputProps = {
      className: [inputClass],
      placeholder,
      value,
      onChange: this.onChange,
      id: this.props.id,
      tabIndex: '-1',
    };
    var theme = {
      container:                'react-autosuggest__container',
      containerOpen:            'react-autosuggest__container--open',
      input:                    'react-autosuggest__input',
      inputOpen:                'react-autosuggest__input--open',
      inputFocused:             'react-autosuggest__input--focused',
      suggestionsContainer:     'react-autosuggest__suggestions-container',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList:          'react-autosuggest__suggestions-list',
      suggestion:               'react-autosuggest__suggestion',
      suggestionFirst:          'react-autosuggest__suggestion--first',
      suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
      sectionContainer:         'react-autosuggest__section-container',
      sectionContainerFirst:    'react-autosuggest__section-container--first',
      sectionTitle:             style['react-autosuggest__section-title']
    };
    return (
      <div className={`${style.div}`}>
      <Autosuggest 
        highlightFirstSuggestion={true}
        theme={theme}
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.suggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps} />
        {this.state.value ? <p onClick={()=>this.onClear()}>x</p> : ''}
        {this.props.showIcon ? 
        <div  className={`hidden-xs ${style.iconDiv} ${style.searchIcon} `}>
          <img className= {style.searchIconClass}src={`${require('search.png')}`} alt="Search Icon"/>
          </div> : null}
      </div>
    );
  }
}

