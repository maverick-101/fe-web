import React from 'react';
import Chart from 'chart.js';

export default class ListingChart extends React.Component {
  componentDidMount() {
    var ctx = document.getElementById("myChart");

    this.chartData = this.props.data.map(series => {
      var obj = {}
          obj.data = series.data;
          obj.label = series.label;
          obj.lineTension = 0;
          obj.fill = false;
          obj.backgroundColor = '#b2dfdb';
          obj.hoverBackgroundColor = '#26a69a';
          return obj
        }) 
    this.config =  {
      type: this.props.type,
      data: {
        labels: this.props.data[0] ? this.props.data[0].labels : [],
        datasets: this.chartData,
      },
      options: {
        layout: {
          padding: {
            top:5
          }
        },
        legend: {
          display: false
         },
         tooltips: {
           borderColor: '#202020',
           borderWidth: 2,
           backgroundColor: '#fafafa',
           cornerRadius:2,
           yPadding:10,
           bodyFontColor: '#0f0f0f',
           titleFontColor: '#0f0f0f',
           // titleFontStyle: 'normal',
         },
        scales: {
          yAxes: [{
            display:false,
            stacked: true,
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              maxTicksLimit: 3,
            }
          }],
          xAxes: [{
            stacked: true,
            gridLines: {
              display:false
            },
            categoryPercentage: 1.0,
            barPercentage: 0.7,
          }],
        }
      }
    }
    this.myChart = new Chart(ctx, this.config)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.myChart.destroy();
      this.config.type = nextProps.type;
      var ctx = document.getElementById("myChart");
      this.myChart = new Chart(ctx, this.config)
    }
    if (nextProps.updateChartView) {
      var chartData = nextProps.data.map((series, index) => {
        var obj = {}
        obj.data = series.data;
        obj.label = series.label;
        obj.lineTension = 0;
        obj.fill = false;
        obj.backgroundColor = (index == 0) ? '#b2dfdb' : ( (index == 1) ? '#ef5350' : '#ddd' );
        obj.hoverBackgroundColor = (index == 0) ? '#b2dfdb' : ( (index == 1) ? '#ef5350' : '#ddd' );
        return obj
      });
      this.myChart.type = nextProps.type;
      this.myChart.data.datasets = chartData;
      this.myChart.data.labels = nextProps.data[0] ? nextProps.data[0].labels : [];
      this.myChart.update();
      nextProps.chartViewUpdated();
    }
  }
  render() {
    return (
      <canvas id="myChart" width="1350" height="450"></canvas>
    )
  }
}
