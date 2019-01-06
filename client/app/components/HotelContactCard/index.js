import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

import { DateRangePicker, isInclusivelyAfterDay, isInclusivelyBeforerDay } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import style from './style.css'


class HotelContactCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// startDate: moment().add(-7,'days'),
      // endDate: moment(),
      focusedInput: {},
		}
		this.data = {
  } 
}

changeDates(startDate, endDate) {
	if (this.state.startDate !== startDate || this.state.endDate !== endDate) {
		this.setState({startDate, endDate}, () => {
			// this.updateCharts()
		});
	}
}

	render() {
    return (
		<div className={style.contactCard}>
			<div className='clearfix'>				
				<h1 className='pull-left'>Rs. 3000+</h1> 
				<p style={{padding: '15px 0px 0px 0px'}} className='pull-left'>/ per Night</p>
			</div>
			<div>
				<div className='col'>
					<p style={{ marginBottom: '6px'}}>
						<p style={{display:'inline-block', color: '#00b3b3'}} >3.5</p> &nbsp;
						<i style={{color: '#00b3b3'}} className="fa fa-star"></i>
						<i style={{color: '#00b3b3'}} className="fa fa-star"></i>
						<i style={{color: '#00b3b3'}} className="fa fa-star"></i>
						<i className="fa fa-star"></i>
						<i className="fa fa-star"></i>
					</p>
				</div>
			</div>
				<hr/>
				<div className='space-2'>
					<DateRangePicker
						startDate={this.state.startDate} // momentPropTypes.momentObj or null,
						endDate={this.state.endDate} // momentPropTypes.momentObj or null,
						withPortal= {true}
						onDatesChange={({ startDate, endDate }) => {
							this.changeDates(startDate, endDate);
						}}
						startDatePlaceholderText = 'Check in'
						endDatePlaceholderText = 'Check Out'
						showDefaultInputIcon= {true}
						// PropTypes.func.isRequired,
						focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
						onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
						numberOfMonths={2}
						// isOutsideRange={day => isInclusivelyBeforerDay(day, moment().add(1, 'days'))}
					/>
				</div>
				<div style={{position: 'relative'}} className='space-4'>
					<select name="month" className={`form-control ${style.guestSelect}`}>
						<option value="">Guests</option>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
							(number, index) => <option key={index} value={number}>{number}</option>
						)}
					</select>
					<i style={{color: '#00b3b3', position: 'absolute', top: 10, right: 10}} className="fa fa-chevron-down"></i>
				</div>
				<button className='btn btn-block btn-orange'>REQUEST TO BOOK</button>
    </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(HotelContactCard)