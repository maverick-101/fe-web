import React from 'react'
import Slider from 'react-slick'

import style from './style.css'

class Prev extends React.Component {
  render() {
    var { currentSlide, slideCount, style, ...props } = this.props
    return (
      <button type="button" {...props}>
        <i className="fa fa-chevron-left fa-lg"></i>
      </button>
    )
  }
}

class Next extends React.Component {
  render() {
    var { currentSlide, slideCount, style, ...props } = this.props
    return (
      <button type="button" {...props}>
        <i className="fa fa-chevron-right fa-lg"></i>
      </button>
    )
  }
}

export default class Fader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      itemsToShow: Number(props.width) ? window.innerWidth < 768 ? 3 : window.innerWidth > props.maxWidth ? parseInt((props.maxWidth - 50)/props.width) : parseInt((window.innerWidth - 50)/props.width) : 1
    }
    if (window.innerWidth < 768) {
      
    }
  }

  renderSlides() {
    var slides = []

    for(var i = 0; i < Math.ceil(this.props.items.length / this.state.itemsToShow); i ++) {
      var iterate = this.props.items.slice(0 + i * this.state.itemsToShow, this.state.itemsToShow * (i + 1))
      slides.push(
        <ul className="list-inline text-center" key={i}>
          {iterate.map((item, index) => <li key={index} style={{width: this.props.width}}>{item}</li>)}
        </ul>
      )
    }
    return slides
  }

  render() {
    var settings = {
      dots: false,
      infinite: true,
      slidesToShow: 1,
      useCSS: 1,
      slidesToScroll: 1,
      nextArrow: <Next />,
      prevArrow: <Prev />,
      initialSlide: 0,
      // fade: true,
      // className: this.props.notHere ? 'slick-slider-fade notHere' : 'slick-slider-fade',
      autoplay: true,
      speed: 800,
      lazyLoad: true,
      centerMode: true,
    }
    if(this.props.unSlickTill && window.innerWidth <= this.props.unSlickTill) {
      return (
        <div className="unslick">
          {this.props.items}
        </div>
      )
    }
    if (this.props.items.length > 1) {
      return (
        <Slider {...settings}>
          {this.renderSlides()}
        </Slider>
      )
    } else {
      return (
        this.renderSlides()
      )
    }
  }
}
