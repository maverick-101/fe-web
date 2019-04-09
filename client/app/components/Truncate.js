import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

export default class ReadMore extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      expanded: false,
      truncated: false
    }

    this.handleTruncate = this.handleTruncate.bind(this)
    this.toggleLines = this.toggleLines.bind(this)
  }

  handleTruncate(truncated) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated
      })
    }
  }

  toggleLines(event) {
    event.preventDefault()

    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const {
      children,
      more,
      less,
      lines
    } = this.props

    const {
      expanded,
      truncated
    } = this.state

    return (
      <div style={{fontWeight: 300, }}>
        <Truncate
          lines={!expanded && lines}
          ellipsis={(
            <div><a style={{color: '#ef5350'}} href='#' onClick={this.toggleLines}>{more}</a></div>
          )}
          onTruncate={this.handleTruncate}
        >
          {children}
        </Truncate>
        {!truncated && expanded && (
          <span> <a style={{color: '#ef5350'}} href='#' onClick={this.toggleLines}>{less}</a></span>
        )}
      </div>
    )
  }
}