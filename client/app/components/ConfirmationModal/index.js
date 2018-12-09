import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false
    }
  }
  showModal(event) {
    event.preventDefault();
    !this.props.disabled && this.setState({show: true});
  }
  hideModal() {
    this.setState({show: false})
  }
  onAccept() {
    this.props.onAccept();
    this.setState({show: false})
  }
  render () {
    return (
      <span>
        <Modal show={this.state.show} onHide={() => this.hideModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <p className="no-margin">Are you sure you want to perform this action?</p>
              <p className="small">(Changes will be Permanent)</p>
              <button className="btn red" onClick={() => this.onAccept()}>Yes</button>
              &nbsp;&nbsp;
              <button className="btn hollow" onClick={() => this.hideModal()}>Cancel</button>
            </div>
          </Modal.Body>
        </Modal>
        <a href="#" onClick={e => this.showModal(e)}>
          {this.props.children}
        </a>
      </span>
    )
  }
}
