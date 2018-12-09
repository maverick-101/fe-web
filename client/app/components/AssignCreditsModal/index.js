import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/lib/Modal'
import Formsy from 'formsy-react'
import Input from 'components/Input'
import config from 'config'
import style from './style.css'
import swal from 'sweetalert2'

export default class AssignCreditsModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showModal: false,
			loading: false,
			error: '',
		}
	}
	assignCredits(credits) {
		if(!this.state.loading && ((credits.basic && parseInt(credits.basic) > 0) ||
          (credits.premium && parseInt(credits.premium) > 0) ||
          (credits.premium_plus && parseInt(credits.premium_plus) > 0))){
			swal({
				title: 'Are you sure?',
				type: 'warning',
				buttons: true,
				dangerMode: true,
			})
				.then((assign) => {
					if(assign){
						this.setState({loading: true})
          return axios.post(`${config.apiPath}/api/agency/${this.props.agency.id}/assign-credit`, {
							user_id: this.props.user.id,
							basic: credits.basic || 0,
							premium: credits.premium || 0,
							premium_plus: credits.premium_plus || 0,
						})
							.then(response => {
								if(response) {
									this.props.onCreditUpdate({
										user_credit: response.data.userCredit,
										agency: response.data.agency,
									})
              if (response.data==='Not Enough Credits') {
										swal('Sorry', response.data, 'info')
              }
									this.setState({loading:false, showModal: false})
								}
							}, error => {
								this.setState({loading:false, error: error.response ? error.response.data : error.message})
							})
					}
				})
    }
	}
	takeBackCredits() {
		const credits = this.refs.creditForm.getModel()
    if(!this.state.loading && ((credits.basic && parseInt(credits.basic) > 0) ||
          (credits.premium && parseInt(credits.premium) > 0) ||
          (credits.premium_plus && parseInt(credits.premium_plus) > 0))){
			swal({
				title: 'Are you sure?',
				type: 'warning',
				buttons: true,
				dangerMode: true,
			})
				.then((assign) => {
					if (assign) {
						this.setState({loading: true})
          return axios.post(`${config.apiPath}/api/agency/${this.props.agency.id}/take-back-credit`, {
							user_id: this.props.user.id,
							basic: credits.basic || 0,
							premium: credits.premium || 0,
							premium_plus: credits.premium_plus || 0,
						})
							.then(response => {
								if(response) {
									this.props.onCreditUpdate({
										user_credit: response.data.userCredit,
										agency: response.data.agency,
									})
              if (response.data==='Not Enough Credits') {
										swal('Sorry', response.data, 'info')
              }
									this.setState({loading:false, showModal: false})
								}
							})

					}
				})
    }
	}
	render() {
		return (
			<div className={style.container}>
				<Modal bsSize='lg' show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
					<Modal.Header closeButton>
						<h4>Assign Credits</h4>
					</Modal.Header>
					<Modal.Body>
						<div className="row">
							<div className="col-sm-6">
								<img src={require('modal-img-01.png')} className="img-responsive space-4" alt="Modal Image"/>
							</div>
							<div className="col-sm-6">
								<div className="panel panel-default">
									<div className="panel-heading">
										<h3 className="panel-title">{this.props.agency.name}'s Total Credits</h3>
									</div>
									<div className="panel-body">
										<div className="row">
											<div className='col-sm-3'>
												<p className="no-margin large">Standard: <span className="red">{this.props.agencyCredit && this.props.agencyCredit.basic}</span></p>
											</div>
											<div className='col-sm-4'>
												<p className="no-margin large">Premium: <span className="green">{this.props.agencyCredit && this.props.agencyCredit.premium}</span></p>
											</div>
											<div className='col-sm-5'>
												<p className="no-margin large">Premium Plus: <span className="green">{this.props.agencyCredit && this.props.agencyCredit.premium_plus}</span></p>
											</div>
										</div>
									</div>
								</div>
								<div className="panel panel-default">
									<div className="panel-heading">
										<h3 className="panel-title">{this.props.user.first_name} {this.props.user.last_name}'s Credits</h3>
									</div>
									<div className="panel-body">
										<div className="row">
											<div className='col-sm-3'>
												<p className="no-margin large">Standard: <span className="red">{this.props.user.user_credit ? this.props.user.user_credit.basic : 0}</span></p>
											</div>
											<div className='col-sm-4'>
												<p className="no-margin large">Premium: <span className="green">{this.props.user.user_credit ? this.props.user.user_credit.premium : 0}</span></p>
											</div>
											<div className='col-sm-5'>
												<p className="no-margin large">Premium Plus: <span className="green">{this.props.user.user_credit ? this.props.user.user_credit.premium_plus : 0}</span></p>
											</div>
										</div>
									</div>
								</div>
								<Formsy ref="creditForm" onSubmit={model => this.assignCredits(model)}>
									<div className='space-2'>
										<div className='col-sm-12 space-2 no-padding'>
											<div className="row">
												<div className="col-sm-4 no-padding-right">
													<label>Standard</label>
													<Input type="number" name="basic" className="input-text block"/>
												</div>
												<div className="col-sm-4 no-padding-right">
													<label>Premium</label>
													<Input type="number" name="premium" className="input-text block"/>
												</div>
												<div className="col-sm-4">
													<label>Premium Plus</label>
													<Input type="number" name="premium_plus" className="input-text block"/>
												</div>
											</div>
										</div>
										<div className='col-sm-12 no-padding'>
											<div className="row">
												<div className='col-sm-12'>
													<button type="submit" style={{'outline':'none'}} className={`btn btn-b red ${this.state.loading ? 'loading' :''}`}>Assign</button>
                                                    <button onClick={() => this.takeBackCredits()} type="button" style={{'outline':'none', marginLeft: '10px'}} className={`btn btn-b red ${this.state.loading ? 'loading' :''}`}>Take back</button>
												</div>
											</div>
										</div>
									</div>
								</Formsy>
								{this.state.error ? <p className="error no-margin">{this.state.error}</p> : null}
								<hr />
								{/*<div className='row'>
                  <div className='col-sm-12'>
                    <p>If you want to take back all credits from {this.props.user.first_name} {this.props.user.last_name}, click the 'Take Back' button.</p>
                  </div>
                  <div className='col-sm-3 no-padding-left'>
                    <button type="button" className="btn btn-block hollow" onClick={() => this.takeBackCredits()}>
                      <i className="fa fa-ban"></i>&nbsp;Take Back
                    </button>
                  </div>
                </div>*/}
							</div>
						</div>
					</Modal.Body>
				</Modal>
				<span className={style.icon} onClick={() => this.setState({showModal: true})}>
					<img src={require('team-hand.png')} className="img-responsive" alt="Team Hand"/>
				</span>
			</div>
		)
	}
}
