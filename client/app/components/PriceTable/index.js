import React from 'react'
import { convertPrice, convertUnit } from 'helpers'

import style from './style.css'

class Table extends React.Component {
	render() {
		return (
			<table className={`table table-hover ${style.priceTable}`}>
				<thead>
					<tr>
						<th>Property Type</th>
						<th>Min Price</th>
						<th>Avg Price</th>
						<th>Max Price</th>
					</tr>
				</thead>
				<tbody>
					{this.props.prices.map((price, index) => (
						<tr key={index}>
							<td>{price.size} {convertUnit(price.size_unit)}</td>
							<td>Rs. {convertPrice(price.min_price)}</td>
							<td>Rs. {convertPrice(price.average_price)}</td>
							<td>Rs. {convertPrice(price.max_price)}</td>
						</tr>
					))}
				</tbody>
			</table>
		)
  }
}

export default class PriceTable extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			activeTab: Object.keys(this.props.data)[0]
		}
	}
	switchTab(event, key) {
		event.preventDefault()

		this.setState({
			activeTab: key
		})
	}
	render() {
		return (
			<div className="row">
				<div className="col-sm-3 no-padding-right">
					<ul className={`list-unstyled ${style.sidenav}`}>
						{Object.keys(this.props.data).map((key, index) => (
							<li className={this.state.activeTab == key ? style.active : ''} key={index}>
								{key == 'residential' ? <div className={style.sidenav_icon}><img src={require('house.png')} className="img-responsive-vertical" alt="Residential"/></div> : null}
								{key == 'plot' ? <div className={style.sidenav_icon}><img src={require('plot.png')} className="img-responsive-vertical" alt="Plot"/></div> : null}
								{key == 'commercial' ? <div className={style.sidenav_icon}><img src={require('commercial.png')} className="img-responsive-vertical" alt="Commercial"/></div> : null}
								<a href="#" onClick={event => this.switchTab(event, key)}>
									{key.replace(/\b\w/g, l => l.toUpperCase())}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="col-sm-9 no-padding-left">
					<div className="panel panel-default background">
						<div className="panel-body">
							<Table prices={this.props.data[this.state.activeTab] || []}></Table>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
