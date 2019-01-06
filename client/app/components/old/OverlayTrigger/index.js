import contains from 'dom-helpers/query/contains'
import React from 'react'
import Overlay from 'react-bootstrap/lib/Overlay'

export default class OverlayTrigger extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
			show: false
		}
	}
	// Copied from 'react-bootstrap/lib/OverlayTrigger'
	//
	// Simple implementation of mouseEnter and mouseLeave.
	// React's built version is broken: https://github.com/facebook/react/issues/4251
	// for cases when the trigger is disabled and mouseOut/Over can cause flicker
	// moving from one child element to another.
	handleMouseOverOut(handler, e) {
		const target = e.currentTarget
    const related = e.relatedTarget || e.nativeEvent.toElement

    if ((!related || related !== target) && !contains(target, related)) {
			handler(e)
    }
	}
	handleShow() {
		if(this.state.show) {
			return
    }
		this.setState({ show: true })
	}
	handleHide() {
		if(!this.state.show) {
			return
    }
		this.setState({ show: false })
	}
	render() {
		const { overlay, children, ...props } = this.props
    return (
			<div
				onMouseOver={e => this.handleMouseOverOut(this.handleShow.bind(this), e)}
				onMouseOut={e => this.handleMouseOverOut(this.handleHide.bind(this), e)}
				onClick={e => this.handleMouseOverOut(this.handleHide.bind(this), e)}
			>
				{children}
				<Overlay
					{...props}
					show={this.state.show}
					onHide={() => this.setState({ show: false })}
					target={this}
				>
					{overlay}
				</Overlay>
			</div>
		)
	}
}
