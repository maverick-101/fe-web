import React from 'react';
import Lightbox from 'react-image-lightbox';

import style from './style.css';
import placeholder from 'no-image.jpg';
import Fader from 'components/Fader'

import Slider from 'react-slick';

import {imgUpload, checkForHttps} from 'helpers';



function NextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', fontSize: 32, color: "#999", }}
      onClick={onClick}
    > ❯ </div>
  );
}

function PrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{...style, display: 'block', fontSize: 32, color: "#999", }}
      onClick={onClick}
    > ❮ </div>
  );
}

export default class CoverImage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
    }
    this.slides = []
    this.sizeOfChunk = 5
  }
  openLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: true,
    });
  }
  openLightboxFromThumb(index) {
    this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  componentDidMount() {

    this.slides = [];
    var slideImages = this.props.images.filter(image => image.type == 'image');
    var i,j,chunk = this.sizeOfChunk;
    for ( i = 0, j = (slideImages.length); i < j; i += chunk ) {
      this.slides.push(slideImages.slice(i,i+chunk));
    }

  }

  componentWillMount() {

    if (window.innerWidth < 768) {
      this.sizeOfChunk = 2
    }

  }

  render() {
    var { images = [], cover, overlay } = this.props;

    images = images.filter(image => image.type == 'image').map(image => {return {src: image.url}});

    var settings = {
      speed: 500,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    }

    return (
      <div>
        <div className={`${style.bannerWrapper} text-center`}>
          <div className={style.banner} style={{backgroundImage: `url(${cover ? checkForHttps(cover.url) : (images.length ? imgUpload(images[0].src, 'h_750') : placeholder)})`}}></div>
          {overlay}

          {
            (images.length == 1 || images.length == 0) ?
            null :
            <div style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', width:'100%', position:'absolute', bottom: 0, }}>
              <div className={`container`} style={{padding: "0 20px" }}>
                <div id={'theSlider'} style={{margin: '10px 0', }}>
                  <Slider {...settings}>
                    {
                      this.slides.map(
                        (slide, sIndex) => {
                          return (
                          <div>
                          {
                            slide.map(
                              (image, index) => {
                                return (
                                <div key={index} onClick={() => this.openLightboxFromThumb((index + ((sIndex)*(this.sizeOfChunk)) ))} className={style.slickTile}
                                  style={{background:`url(${imgUpload(image.url, 'h_100')})`, display: 'inline-block'}}>
                                </div>
                                )
                              }
                            )
                          }
                          </div>
                          )
                        }
                      )
                    }
                  </Slider>
                </div>
                <hr className={`no-margin`} style={{borderTop: '2px solid #eee'}} />
              </div>
            </div>
          }

         { /* <div style={{background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .9))', width:'100%', transform: 'translate3d(-50%,0%,0)', left:'50%', position:'absolute', padding:'10px', bottom:'0'}}>
          {
            images.map(image => <div  style={{display: 'inline', width:'100px', height:'70px', margin:'10px', background:`url(${image.url})`}}/>)
          }

          </div>
          */}

          {images.length ? (<div className={style.button}>
            <button className="btn hollow" onClick={() => this.openLightbox()}>View Photos ({`${images.length}`})</button>
          </div>) : null}
          {this.state.lightboxIsOpen && <Lightbox
            mainSrc={checkForHttps(images[this.state.currentImage].src)}
            isOpen={this.state.lightboxIsOpen}
            nextSrc={checkForHttps(images[(this.state.currentImage + 1) % images.length].src)}
            prevSrc={checkForHttps(images[(this.state.currentImage + images.length - 1) % images.length].src)}
            onCloseRequest={() => this.setState({lightboxIsOpen: false})}
            onMoveNextRequest={() => this.setState({currentImage: (this.state.currentImage + 1) % images.length})}
            onMovePrevRequest={() => this.setState({currentImage: (this.state.currentImage + images.length - 1) % images.length})}
          />}


        </div>

      </div>
    )
  }
}
