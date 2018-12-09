import React from 'react'
import Pagination from 'react-bootstrap/lib/Pagination'

import ReactPaginate from 'react-paginate';

export default class Paginate extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			activePage: parseInt(props.activePage) || 1,
			items: 10,
      marginPagesDisplayed: window.innerWidth < 768 ? 1 : 2,
      pageRangeDisplayed: window.innerWidth < 768 ? 0 : 5,
		}
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.total) {
			this.setState({
				items: Number(Math.ceil(nextProps.total/nextProps.resultsPerPage))
			})
		}
		// console.log(Number(Math.ceil(nextProps.total/nextProps.resultsPerPage)));
		
	}
	handleSelect(eventKey) {
		// console.log(eventKey)
		var options = {
			limit: this.props.resultsPerPage,
			offset: (eventKey) * this.props.resultsPerPage,
			page: eventKey + 1
		}
		this.props.onChange && this.props.onChange(options).then(() => this.setState({activePage: eventKey}))
	}
	render() {
		var { total } = this.props
    if(this.props.total && this.props.total > this.props.resultsPerPage) {
			return (
				// <Pagination
				// 	activePage={this.state.activePage}
				// 	items={this.state.items}
				// 	ellipsis
				// 	next=">"
				// 	prev="<"
				// 	onSelect={eventKey => this.handleSelect(eventKey)}
				// />
				<ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       forcePage={ this.props.activePage ? (this.props.activePage - 1) : 0 }
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.items}
                       marginPagesDisplayed={this.state.marginPagesDisplayed}
                       pageRangeDisplayed={this.state.pageRangeDisplayed}
                       onPageChange={eventKey => this.handleSelect(eventKey.selected)}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
			)
		}
		return null
  }
}
