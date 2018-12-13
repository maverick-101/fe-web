import React from 'react'
import Chart from 'chart.js'

export default class PriceTrend extends React.Component {
	componentDidMount() {
		let ctx = document.getElementById('myChart_'+this.props.id).getContext('2d');
    let myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: this.props.label || ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					data: this.props.dataset ? this.props.dataset.max : [40, 55, 56, 59, 65, 80, 91, 101, 111, 121, 131, 141],
					label: 'Max Price',
					lineTension: 0,
					fill: false,
          backgroundColor: '#ef5350',
					borderColor: '#ef5350',
					pointBackgroundColor: '#ef5350',
					pointBorderColor: '#fff',
					pointRadius: 8,
					pointHitRadius: 10,
					pointBorderWidth: 5,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: '#ef5350',
				},
				{
					data: this.props.dataset ? this.props.dataset.min : [20, 25, 27, 30, 35, 40, 55, 60, 70, 80, 90, 100],
					label: 'Min Price',
					lineTension: 0,
					fill: false,
					backgroundColor: '#00897b',
					borderColor: '#00897b',
					pointBackgroundColor: '#00897b',
					pointBorderColor: '#fff',
					pointRadius: 8,
					pointHitRadius: 10,
					pointBorderWidth: 5,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: '#00897b',
				}]
			},
			options: {
        maintainAspectRatio: false,
				scales: {
					yAxes: [{
						gridLines: {
							borderDash: [10, 2],
							drawBorder: false,
							drawTicks: false,
						},
						ticks: {
							display: false,
							maxTicksLimit: 3,
						}
					}],
					xAxes: [{
						gridLines: {
							drawBorder: false,
							zeroLineColor: 'rgba(0,0,0,.1)'
						}
					}]
				},
        legend: {
          display: true,
          position: this.props.legendPosition ? this.props.legendPosition : "top",
          labels: {
            boxWidth: 20,
            padding: this.props.legendPadding ? this.props.legendPadding : 30
          }
        },
        title: {
          display: !!this.props.title,
          text: this.props.title,
          position: 'bottom',
          // fontFamily: `'CenturyGothic', 'sans-serif'`,
          fontStyle: 'normal'
        }
			}
		})
	}
	render() {
		return (
      <div className="chart-container" style={{position: 'relative', width: '100%'}}>
				<canvas id={`myChart_${this.props.id}`} height={(this.props.height ? this.props.height : 200) + 'px'} />
			</div>
		)
	}
}
