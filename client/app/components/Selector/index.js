import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Select extends React.Component {
  render() {
    var selectStyle = Object.assign({
      height: 42,
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      display: 'block',
      float: 'left'
    }, this.props.style);

    var labelStyle = {
      lineHeight: '42px',
      top: 0,
      paddingLeft: 6
    };

    var hintStyle = {
      lineHeight: '40px',
      paddingLeft: 6,
      bottom: 0
    };

    var i = 0;
    var items = this.props.options.map(option => {
      return <MenuItem value={i} key={i++} primaryText={option}/>
    });

    var {...props} = this.props;
    delete props.options;
    delete props.style;

    return (
      <SelectField style={selectStyle} labelStyle={labelStyle} underlineStyle={{display: 'none'}} iconStyle={{top: 7}} hintStyle={hintStyle} {...props}>
        {items}
      </SelectField>
    );
  }
}
