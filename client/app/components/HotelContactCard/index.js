import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import RoomTile from './RoomTile'
import Modal from 'react-bootstrap/lib/Modal'

import StarRatings from 'react-star-ratings';

import swal from 'sweetalert2';

import { DateRangePicker, isInclusivelyAfterDay, isInclusivelyBeforerDay } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import style from './style.css'
// import swal from 'sweetalert2';


class HotelContactCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// startDate: moment().add(-7,'days'),
      // endDate: moment(),
			focusedInput: {},
			showConfirmationModal: false,
		}
		this.data = {
  } 
}

onContact() {
	if(this.state.daysToStay) {
		this.setState({
			showConfirmationModal: true,
		})
	} else {
		swal({
			title: 'Please Select Dates and Guests',
			html: 'Please select the appropriate dates and guests before proceeding',
			type: 'info',
		})
	}
}

changeDates(startDate, endDate) {
	if (this.state.startDate !== startDate || this.state.endDate !== endDate) {
		this.setState({startDate, endDate}, () => {
			// this.updateCharts()
			console.log('difference is', moment(this.state.startDate).diff(this.state.endDate, 'days'))
			this.state.startDate ? this.props.updateBookingData('start_date', this.state.startDate.format()) : null
			this.state.endDate ? this.props.updateBookingData('end_date', this.state.endDate.format()) : null
			this.setState({
				daysToStay: moment(this.state.startDate).diff(this.state.endDate, 'days'), 
			}, () => 	this.props.updateBookingData('nights_stay', this.state.daysToStay))
		});
	}
}

hideModal() {
	this.setState({
		showConfirmationModal: false,
	})
}

	render() {
    return (
		<div className={style.contactCard}>
		<Modal size='lg' dialogClassName={style.modalWidth} show={this.state.showConfirmationModal} onHide={() => this.hideModal()}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Your Booking</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='clearfix'>
					<h1 className='col-sm-12'>Available Rooms</h1>
				{this.props.rooms.map((room, index) => {
					return <div  onClick={() => {this.props.updateBookingData('room_id', room.ID); this.setState({selectedId: room.ID})}} className='col-sm-6'>
						<RoomTile room={room} selectedId={this.state.selectedId} image={room.gallery[0].url}></RoomTile>
					</div>
				})}
				<div className='col-sm-12'>
					<h1 className=''>Contact Information</h1>
					<form>
					<div className='col-sm-6 space-4 no-padding-left'>
						<input onChange={e => {this.props.updateBookingData('user_name', e.target.value)}} className='form-input' type="text" placeholder='Name'/>
					</div>
					<div className='col-sm-6 space-4 no-padding-left'>
						<input onChange={e => {this.props.updateBookingData('user_email', e.target.value)}} className='form-input' type="email" placeholder='Email Address'/>
					</div>
					<div className='col-sm-6 space-4 no-padding-left'>
						<input onChange={e => {this.props.updateBookingData('user_phone', e.target.value)}} className='form-input' type="number" placeholder='Phone (e.g 923331231231, 03331231231)'/>
					</div>
					<div className='col-sm-6 space-4 no-padding-left'>
						<button type='submit' onClick={(event)=> {event.preventDefault(); this.props.submitBooking(event)}} style={{padding: '10px'}} className='btn btn-block btn-orange'>Book Now</button>
					</div>
					</form>
				</div>
				</div>
			</Modal.Body>
		</Modal>
			<div className='clearfix'>				
				<h1 className='pull-left no-margin'>Rs. {this.props.price}+</h1> 
				<p style={{padding: '15px 0px 0px 0px'}} className='pull-left'>/ per Night</p>
			</div>
			<div>
				<StarRatings
					rating={this.props.starRating}
					starRatedColor="#e3530d"
					numberOfStars={5}
					starDimension="20px"
					starSpacing="0px"
					svgIconViewBox={'0 0 20 20'}
					gradientPathName={window.location.pathname}
					svgIconPath="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
					name='rating'
				/>
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
					<select name="month" onChange={(e) => {this.props.updateBookingData('persons', e.target.value)}} className={`form-control ${style.guestSelect}`}>
						<option value="">Guests</option>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
							(number, index) => <option key={index} value={number}>{number}</option>
						)}
					</select>
					<i style={{color: '#00b3b3', position: 'absolute', top: 10, right: 10}} className="fa fa-chevron-down"></i>
				</div>
				<button onClick={()=> {this.onContact()}} className='btn btn-block btn-orange'>REQUEST TO BOOK</button>
    </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(HotelContactCard)