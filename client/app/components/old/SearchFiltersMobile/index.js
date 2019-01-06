import React from 'react';
import ReactDOM from 'react-dom';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Counter from 'components/Counter';
import Range from 'components/Range';
import Histogram from 'components/Histogram';
import Autosearch from 'components/Autosearch'
import Select from 'react-select'; 
import Cookies from 'js-cookie'
import axios from 'axios';
import config from 'config';

import E404 from 'components/404';

import { setSearchQuery, search, searchProperty, setSearchFooter } from 'actions/property';
import { convertPrice, convertUnit } from 'helpers';

import { getCities, getAreas, removeAreas, setSearchAreas } from 'actions/city';
import { changeFilterModal } from 'actions/header';
import { signUp, logIn, oauthLogin, checkEmail, forgotPassword, unitChange, currencyChange, setCurrencyRates } from 'actions/user'


import style from './style.css';
import 'react-select/dist/react-select.css';
import {DropdownButton, MenuItem} from "react-bootstrap";

const CustomPopover = (props) => {
  return (
    <div className={`${style.popover} ${props.right ? style.turnRight : ''} ${props.popoverCustomClass}`} style={props.popoverStyle}>
      <div className="col-sm-12" style={{backgroundColor: '#fff', border: '1px solid #ddd'}}>
        <div className={style.popoverContainer} style={props.containerStyle}>
          {props.content}
        </div>
      </div>
    </div>
  )
}

class SearchFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      bed: this.props.query.bed,
      bath: this.props.query.bath,
      currentType: "all",
      subtypes: [],
      histogramData: {data:[], ranges: []},
      units: [
        {__html: 'Marla', value: 'marla', selected: ''},
        {__html: 'Kanal', value: 'kanal', selected: ''},
        {__html: 'SqFt', value: 'sqft', selected: ''},
        {__html: 'SqYd', value: 'sqyd', selected: ''},
        {__html: 'M&#178;', value: 'sqm', selected: ''},
      ],
      sizeValid: true
    }

    this.purpose = {
      sale: 'Buy',
      rent: 'Rent',
    }
    this.subtypes = this.props.query.subtype ? (typeof(this.props.query.subtype) != 'string' ? this.props.query.subtype : [this.props.query.subtype]) : [];
    this.props.dispatch(setSearchQuery({amenities:[]}))
    this.props.dispatch(getCities())
    .then(() => {
      if(this.props.query.city_id) {
        this.props.dispatch(getAreas({city_id: this.props.query.city_id}))
      }
      var tempCities = this.props.city.list.filter((city) =>  {
        return (city.id == this.props.query.city_id) ? true : false      
      } )
      this.props.dispatch(setSearchQuery({city_id: this.props.query.city_id, city_name: !this.props.query.city ? ((tempCities.length ? tempCities[0].name : [])) : this.props.query.city  }))
        })
    this.props.dispatch( getAreas({city_id: this.props.query.city_id}) )
    .then(() => {
      // this.props.dispatch(removeAreas());
      var selectedAreas = this.props.query.area_id && typeof(this.props.query.area_id) != 'string' && this.props.query.area_id.length ? 
        this.props.city.areas && this.props.city.areas.filter((area) => {
          if (this.props.query.area_id.indexOf(area.id.toString()) != -1 || this.props.query.area_id.indexOf(area.id) != -1) {
            return {label: area.name, value: area.id}
          }
        })
        : (
          this.props.query.area_id ? this.props.city.areas.filter((area) => {      
            if(area.id.toString() == this.props.query.area_id.toString()) {
              return {label: area.name, value: area.id}
            } 
          })
          : []
        );
        var areas = selectedAreas.length ? selectedAreas.map((area) => {return {label:area.name, value:area.id }}) : [];       
        this.setState({
          selectedAreas: areas.length ? areas.map((area) => { return {label: area.label, value: area.value} } ) : null
        })
        this.props.dispatch(setSearchQuery({
          area_names: areas.length ? areas.map((area) => area.label) : [],
          area_id: areas.length ? areas.map((area) => area.value) : [],
         }))
         this.props.dispatch(setSearchAreas());
         var checkSizeValid = true;
         if(parseFloat(this.props.query.size_max) && parseFloat(this.props.query.size_max) && parseFloat(this.props.query.size_max) > parseFloat(this.props.query.size_max)){  
          checkSizeValid = false;
        }
         if(checkSizeValid){
          //  this.props.dispatch(searchProperty())
          }
        
    });
  }

  componentDidMount() {
    // if(this.cancelToken) {
    //   console.log('cancelled');
    //   console.log(this.cancelToken);
    //   this.cancelToken.cancel('cancelled')
    // }
    // this.cancelToken = axios.CancelToken.source()
    // var source = this.cancelToken.source()
    if(this.props.mobileType && this.props.mobileType == false) {
      this.props.dispatch( getAreas({city_id: this.props.query.city_id}) )
      if (this.props.query.type == 'all') {
        this.props.dispatch(setSearchQuery({type: ''}))
      } 
      var searchQuery = window.location.toString().split('/')[3].split('?')[1].replace('type=all&','');
      if((this.props.query.size_min||this.props.query.size_min) && !this.props.query.unit){
        var selectedUnit = this.state.units.filter(unit=>unit.selected==='selected');
        if(selectedUnit.length){
          this.props.dispatch(push(`/search?${searchQuery}&unit=${selectedUnit[0].value}`));
          this.props.dispatch(setSearchQuery({unit:selectedUnit[0].value}));
        }; 
      }
      // var search = window.location.toString().split('/')[3].split('?')[1].replace('type=all&','');
      // if(window.innerWidth >= 768){
      //     axios.get(`${config.apiPath}/api/property/price-histogram?${search}`,{cancelToken: this.cancelToken.token})
      //       .then((response) => {
      //         this.setState({histogramData: response.data})
      //       })
      // }
      if(this.props.query.area_id) {
        var area_ids = typeof(this.props.query.area_id) == 'string' ? [this.props.query.area_id] : this.props.query.area_id;
        
        area_ids[area_ids.length - 1] ? axios.get(`${config.apiPath}/api/area/${area_ids[area_ids.length - 1]}`).then((response) => { this.props.dispatch(setSearchFooter({areaFooterDetails: response.data})) }) : null
      }
      if(this.props.query.city_id) {
        this.props.query.city_id ? axios.get(`${config.apiPath}/api/city/${this.props.query.city_id}`).then((response) => { this.props.dispatch(setSearchFooter({cityFooterDetails: response.data})) }) : null
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // this.cancelToken = axios.CancelToken.source()
    // if( (this.props.listings && (nextProps.listings.max != this.props.listings.max)) || (nextProps.query.type != this.props.query.type) || (nextProps.query.subtype != this.props.query.subtype) || (nextProps.query.area_id != this.props.query.area_id) || (nextProps.query.city_id != this.props.query.city_id) ) {
    //   var search = window.location.toString().split('/')[3].split('?')[1].replace('type=all&','')
    //     if(window.innerWidth >= 768){
    //       axios.get(`${config.apiPath}/api/property/price-histogram?${search}`,{cancelToken: this.cancelToken.token})
    //         .then((response) => {
    //           this.setState({histogramData: response.data})
    //         })
    //     }
    // }
  }

  onChange(event) {
    var filter = {};
    filter[event.target.name] = event.target.value;
    this.setState({
     [event.target.name] : event.target.value
    })
    this.search(filter);
  }

  getAreas(city) {
    this.setState({selectedAreas: null})
    if (!city || !city.value) {
      var queryParams = this.props.query;
      delete queryParams.dataTo;
      delete queryParams.dataFrom;
      delete queryParams.page;
      delete queryParams.offset;
      delete queryParams.price_min;
      delete queryParams.price_max;
      this.search({...queryParams, city_id: undefined, area_id: undefined, area_names: undefined, city_name: undefined})
      this.props.dispatch(setSearchFooter({cityFooterDetails: response.data}));
    }
      var queryParams = this.props.query;
      delete queryParams.dataTo;
      delete queryParams.dataFrom;
      delete queryParams.page;
      delete queryParams.offset;
      delete queryParams.price_min;
      delete queryParams.price_max;
    (city && city.value) && this.props.dispatch(getAreas({city_id: (city && city.value) ? city.value : ''}))
    this.search({city_id: (city && city.value) ? city.value : '', city_name: (city && city.label) ? city.label : '',area_id: undefined, area_names:undefined})
    city && city.value ? axios.get(`${config.apiPath}/api/city/${city.value}`).then((response) => { this.props.dispatch(setSearchFooter({cityFooterDetails: response.data})) }) : this.props.dispatch(setSearchFooter({cityFooterDetails: {}}))
  }  

  setAreas(areas) {
    this.props.dispatch(setSearchQuery({price_min:undefined,price_max:undefined}));
    this.setState({selectedAreas: areas})
    var area_ids = areas.map(area => area.value);
    var area_names = areas.map(area => area.label);
    this.search({area_id: area_ids, area_names})
    areas && area_ids.length ? axios.get(`${config.apiPath}/api/area/${area_ids[area_ids.length - 1]}`).then((response) => { this.props.dispatch(setSearchFooter({areaFooterDetails: response.data})) }) : this.props.dispatch(setSearchFooter({areaFooterDetails: {}}));
  }

  search(filter) {
    var checkSizeValid = true;
    // console.log('hello',(filter.size_min||filter.size_min));
    if((filter.size_min||filter.size_max) && !filter.unit && !this.props.query.unit){
      var selectedUnit = this.state.units.filter(unit=>unit.selected==='selected');
      if(selectedUnit.length){filter.unit = selectedUnit[0].value};
    }
    this.setState({sizeValid:true});
    if(parseFloat(filter.size_min) && parseFloat(this.props.query.size_max) && parseFloat(filter.size_min) > parseFloat(this.props.query.size_max)){  
      // filter.size_min='';
      checkSizeValid = false;
    }
    if(parseFloat(filter.size_max) && parseFloat(this.props.query.size_min) && parseFloat(filter.size_max) < parseFloat(this.props.query.size_min)){
      // filter.size_max='';
      checkSizeValid = false;
    }
    if(parseFloat(this.props.query.size_min) && parseFloat(this.props.query.size_max) && parseFloat(this.props.query.size_max) < parseFloat(this.props.query.size_min)){
      // filter.size_max='';
      checkSizeValid = false;
    }
    // this.props.query.city_id ? this.props.dispatch( getAreas({city_id: this.props.query.city_id}) ).then(() => {this.props.dispatch(removeAreas())}) : null
    if(checkSizeValid){
    this.props.dispatch(setSearchQuery({...filter,page:undefined,offset:undefined}));
      this.startSearch();
    } else {
    this.setState({sizeValid: false});    
    }
    if(filter.unit){
      this.props.dispatch(unitChange(filter.unit));
      Cookies.set('unit', filter.unit, {domain: config.domain});
    }
  }
  startSearch() {
    if(this.props.mobileType && this.props.mobileType==false) {
      this.props.dispatch(setSearchAreas())
      this.props.dispatch(search())
      this.props.dispatch(searchProperty())
    }
  }
  
  startSearchMobile() {
    document.body.click();
    document.body.style.overflow = 'unset'
    this.props.dispatch(setSearchAreas())
    this.props.dispatch(search())
    this.props.dispatch(searchProperty())
    this.props.dispatch(changeFilterModal(false))
  }
  setSubtype(subtype) {
    // if(this.subtypes.indexOf(subtype) == -1) {
    //   this.subtypes.push(subtype)
    // } else {
    //   this.subtypes = this.subtypes.filter(e => e !== subtype);
    // }
    // this.props.dispatch(setSearchQuery({subtype: this.subtypes}));
    // this.startSearch();
    const residential = ['house', 'apartment', 'upper portion', 'lower portion', 'farm house', 'room', 'penthouse', 'hotel suites', 'basement', 'annexe'];
    const plot =  ['residential plot', 'commercial plot', 'agricultural land', 'industrial land', 'plot file','farmhouse plot'];
    const commercial = ['office', 'shop', 'warehouse', 'factory', 'building', 'other'];
		let typeQuery = {};
    if(this.subtypes.indexOf(subtype) == -1) {
      this.subtypes.push(subtype)
    } else {
      this.subtypes = this.subtypes.filter(e => e !== subtype);
    }
    var type = residential.indexOf(this.subtypes) != -1 ? 'residential'
		: ( plot.indexOf(this.subtypes) != -1 ? 'plot'
			: (commercial.indexOf(this.subtypes) != -1 ? 'commercial' : (this.props.query.type == 'all' ? 'all' : 'residential'  ) ) )

		//  console.log(type);
		if (!this.props.query.type && this.subtypes && type) {
			typeQuery.type = type
    }
    this.props.dispatch(setSearchQuery({subtype: this.subtypes, ...typeQuery}));
    this.startSearch();
  }
  // handleTypeChange(activeType) {
  //   if(this.props.query.type == activeType) {
  //     this.search({type: '', subtype: []})
  //   } else {
  //     this.search({type: activeType, price_min:null, price_min:null, subtype: []})
  //   }
  // }

  typeChecks(activeType) {
    const residential = ['house', 'apartment', 'upper portion', 'lower portion', 'farm house', 'room', 'penthouse', 'hotel suites','basement','annexe'];
    const plot = this.props.query.purpose == 'rent' ? ['residential plot', 'commercial plot', 'agricultural land', 'industrial land'] :  ['residential plot', 'commercial plot', 'agricultural land', 'industrial land', 'plot file', 'farmhouse plot'];
    const commercial = ['office', 'shop', 'warehouse', 'factory', 'building', 'other'];
    const checkArrays = {residential, plot, commercial};
    return <div className={`row no-margin`} style={{padding: '10px 0', }}>
        {checkArrays[activeType == 'all' ? 'residential' : (activeType || 'residential')].map((type, index) => (
          <label className={`${style.subOption} col-sm-4 col-xs-6 no-padding-xs`} key={index}>
            <input type="checkbox" checked={(this.props.query.subtype && typeof(this.props.query.subtype) == 'string') ? ( this.props.query.subtype == type ? true : false ) : ( (this.props.query.subtype && this.props.query.subtype.indexOf(type) != -1) ? true: false )} name="houseChecks" special={`${type.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setSubtype(type)} />
           <span>{type.replace(/\b\w/g, l => l.toUpperCase())}</span>
          </label>
        ))}
      </div>
  }
  typeTabChange(type) {
    if (this.state.currentType === type) {
        this.setState({currentType: ''});
        this.subtypes = [];
        // this.props.mobileType && this.props.mobileType == false ? this.search({type:'', subtype:[]}) : null;
        this.search({type:'', subtype:[]})
    } else {
        this.setState({currentType: type});
        this.subtypes = [];
        this.search({type:type, subtype:[]})
    }
  }
  setAmenities(amenity) {
    var amenities = typeof(this.props.query.amenities) == 'string' ? [this.props.query.amenities] : ( this.props.query.amenities ? this.props.query.amenities  : []);
    if(amenities.indexOf(amenity) == -1) {
      amenities.push(amenity)
    } else {
      amenities = amenities.filter(e => e !== amenity);
    }
    this.props.dispatch(setSearchQuery({amenities: [...amenities]}));
    // this.startSearch();
  }
  handleInput(param){
    let value;
    if(param.lastIndexOf(".") === -1){
      value = parseFloat(param || 0);
    } else {
      value = param;
    }
    if(!isNaN(value)){
      if(parseFloat(value) < 0 || param.indexOf('-') !== -1){
        value = 0;
      }
      // if(param.indexOf('.')!== -1){
      //   var index = param.indexOf('.');
      //   value = param.slice(0, index) + param.slice(index + 1);
      // }
      if (param.length > 20) {
        value = param.slice(0, 20);
      }
    }
    return param && !isNaN(value) ? value.toString() : '';
  }
  changeCurrency(currency) {
    Cookies.set('currency', `${currency}`, {domain: config.domain});
    this.props.dispatch(currencyChange(currency));
  }
  changeUnit(unit) {
    Cookies.set('unit', `${unit}`, {domain: config.domain});
    this.props.dispatch(unitChange(unit));
    window.location.reload()
  }
  render() {
    var units = this.state.units;
    const purposeOverlay = (
      <React.Fragment>
        <p className={`large ${style.popoverOption}`} style={{cursor: "pointer", }}
           onClick={() => { this.search({purpose: 'sale'}); this.refs.purposeOverlayTrigger.hide() }}>Buy</p>
        <p className={`large no-margin ${style.popoverOption}`} style={{cursor: "pointer", }}
           onClick={() => { this.search({purpose: 'rent'}); this.refs.purposeOverlayTrigger.hide(); }}>Rent</p>
      </React.Fragment>
    );
    
    const typeOverlay = (
      <div className={`clearfix`} style={{width: `${ window.innerWidth < 768 ? "100%" : "550px" }`, }}>
        <div className={style.sidenote}>* Select only One Type and As Many Sub-Types</div>
        <div style={{width: '100%',height: `${ window.innerWidth < 768 ? "48px" : "30px" }`, borderRadius: '4px',margin: '15px 0px 10px',border: '1px solid #dbdbdb', overflow: 'hidden', background: 'white'}}>
          <span ref="residential" className={`${this.props.query.type == "residential" ? style.turnGreen : null}`} onClick={()=>{this.typeTabChange('residential')}} 
          style={{display: 'block', textAlign: 'center', width: '33.3333%', borderRight: '1px solid #dbdbdb', float: 'left', lineHeight: `${ window.innerWidth < 768 ? "47px" : "28px" }`, cursor: 'pointer'}}>Residential</span>
          <span ref="plot" className={`${this.props.query.type == "plot" ? style.turnGreen : null}`} onClick={()=>{this.typeTabChange('plot')}} 
          style={{display: 'block', textAlign: 'center', width: '33.3333%', borderRight: '1px solid #dbdbdb', float: 'left', lineHeight: `${ window.innerWidth < 768 ? "47px" : "28px" }`, cursor: 'pointer'}}>Plot</span>
          <span ref="commercial" className={`${this.props.query.type == "commercial" ? style.turnGreen : null}`} onClick={()=>{this.typeTabChange('commercial')}}
          style={{display: 'block', width: '33.3333%', textAlign: 'center', lineHeight: `${ window.innerWidth < 768 ? "47px" : "28px" }`, float: 'left', cursor: 'pointer'}}>Commercial</span>
        </div>
        {this.typeChecks(this.props.query.type)}
      </div>
    );
    const priceOverlay = (
      <React.Fragment>
        <div className={`${style.currentCurrency}`}>
          currency: 
          <i>{this.props.currency}</i>
        </div>
        {/*<Histogram data={this.state.histogramData} />*/}
        <Range
          initial={[parseInt(this.props.query.price_min), parseInt(this.props.query.price_max)]}
          max={this.props.max || 20000000}
          onChange={values => this.search({price_min: values[0], price_max: values[1]})}/>
      </React.Fragment>
    );
    const mobilePriceOverlay = (
      window.innerWidth <= 767 ? (
        <React.Fragment>
          <div className={`${style.currentCurrency}`}>
            currency: 
            <i>{this.props.currency}</i>
          </div>
          {/*<Histogram data={this.state.histogramData} />*/}
          <Range
            initial={[parseInt(this.props.query.price_min), parseInt(this.props.query.price_max)]}
            max={this.props.max || 20000000}
            onChange={values => this.search({price_min: values[0], price_max: values[1]})}/>
        </React.Fragment>
      ) : null
    );
    const sizeOverlay = (
      <div className={`clearfix ${style.sizeFilter}`}>
        <p>Select a unit for Size filter</p>
        <div className="col-sm-6 col-xs-6 no-padding">
          <input type="text" name="size_min" className="input-text block addon-right" placeholder="Min." defaultValue={this.props.query.size_min} onChange={(e)=>{e.target.value = this.handleInput(e.target.value);}} onBlur={event => this.search({size_min: event.target.value})}/>
        </div>
        <div className="col-sm-6 col-xs-6 no-padding">
          <input type="text" name="size_max" className="input-text block addon-left" placeholder="Max." defaultValue={this.props.query.size_max} onChange={(e)=>{e.target.value = this.handleInput(e.target.value);}} onBlur={event => this.search({size_max: event.target.value})}/>
        </div>
       {!this.state.sizeValid ? <span className='red'>Min size must be less than max size.</span> : ''}
        <div className={`no-padding col-sm-12 col-xs-12 ${style.unitSelect}`}>
          <div className="select">
            <select name="unit" className="input-text block" defaultValue={this.props.query.unit} onChange={event => this.search({unit: event.target.value})}>
              <option value="" disabled>Unit</option>
              {units.map((unit, index) => <option key={index} selected={unit.selected} value={unit.value} dangerouslySetInnerHTML={unit}/>)}
            </select>
          </div>
        </div>
      </div>
    );
    var propertyFilters1, propertyFilters2; 
    this.props.query.type == "residential" ? (
      propertyFilters1 = ['central_heating', 'central_cooling', 'dirty_kitchen', 'lawn', 'swimming_pool'],
      propertyFilters2 = ['wifi', 'balcony', 'laundry_room', 'servant_quarter', 'furnished']
    ) : ( this.props.query.type == "plot" ? (
        propertyFilters1 = ['possesion', 'corner', 'park_facing'],
        propertyFilters2 = ['boundary_wall']
      ) : ( this.props.query.type == "commercial" ? (
          propertyFilters1 = ['central_heating', 'central_cooling', 'elevator/lift', 'public_parking'],
          propertyFilters2 = ['underground_parking', 'internet', 'cctv_camera', 'backup_generator']
        ) : (
          propertyFilters1 = ['central_heating', 'central_cooling', 'dirty_kitchen', 'lawn', 'swimming_pool'],
          propertyFilters2 = ['wifi', 'balcony', 'laundry_room', 'servant_quarter', 'furnished']
        )
      )
    );
    var mobilePropertyFilters; 
    this.props.query.type == "residential" ? (
      mobilePropertyFilters = ['central_heating', 'central_cooling', 'dirty_kitchen', 'lawn', 'swimming_pool', 'wifi', 'balcony', 'laundry_room', 'servant_quarter', 'furnished']
    ) : ( this.props.query.type == "plot" ? (
        mobilePropertyFilters = ['possesion', 'corner', 'park_facing', 'boundary_wall']
      ) : ( this.props.query.type == "commercial" ? (
          mobilePropertyFilters = ['central_heating', 'central_cooling', 'elevator/lift', 'public_parking', 'underground_parking', 'internet', 'cctv_camera', 'backup_generator']
        ) : (
          mobilePropertyFilters = ['central_heating', 'central_cooling', 'dirty_kitchen', 'lawn', 'swimming_pool', 'wifi', 'balcony', 'laundry_room', 'servant_quarter', 'furnished']
        )
      )
    );
    const moreOverlay = (
      <div className={style.moreFilters}>
      <div className={`${style.filterRows}`} style={{padding: '10px 0', }}>
        <div className={`col-sm-6 hidden-xs`} style={{}}>
          <span style={{display: 'table', width: '100%', fontSize: '12px'}}>Property Features</span>
          <div className={`col-sm-6 col-xs-12 ${style.columnFilters}`} style={{}}>
            <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`} style={{}}>
              {propertyFilters1.map((amenity, index) => (<label className={`col-sm-12 col-xs-6 no-padding`} key={index}>
                <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
              </label>))}
            </div>
          </div>
          <div className={`col-sm-6 ${style.columnFilters}`} style={{}}>
            <div className={`col-sm-12 ${style.rowFilter}`} style={{}}>
            {propertyFilters2.map((amenity, index) => (<label className={`col-sm-12 no-padding`} key={index}>
                <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
              </label>))}
            </div>
          </div>
        </div>
        <div className={`col-xs-12 visible-xs`} style={{}}>
          <span style={{display: 'table', width: '100%', fontSize: '12px'}}>Property Features</span>
          <div className={`col-sm-6 col-xs-12 ${style.columnFilters}`} style={{}}>
            <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`} style={{}}>
            {mobilePropertyFilters.map((amenity, index) => (<label className={`col-xs-6 no-padding`} key={index}>
                <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
              </label>))}
            </div>
          </div>
        </div>
        <div className={`clearfix ${style.separateFilters}`} />
        {/* <div className={`col-sm-6 col-xs-12`}>
          <span style={{display: 'table',width: '100%', fontSize: '12px'}}>
          Facing
          </span>
          <div className={`col-sm-12 col-xs-12 ${style.columnFilters}`} style={{}}>
            <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`}>
              <div ref="facing">
                {['North', 'North-West', 'North-East', 'South', 'South-West', 'South-East', 'East', 'West'].map((amenity, index) => (<label className={`col-sm-6 col-xs-6 no-padding`} key={index}>
                  <input type="checkbox" checked={this.props.query.amenity && this.props.query.amenity.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                  <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                </label>))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className={`row no-margin ${style.filterRows}`}>
        <div className={`col-sm-12 col-xs-12`}>
          <div className={`col-sm-6 col-xs-12 ${style.columnFilters}`} style={{}}>
            <p>Utilities</p>
              <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`} style={{}}>
                {['electricity', 'gas', 'maintenance', 'water'].map((amenity, index) => (<label className={`col-sm-6 col-xs-6 no-padding`} key={index}>      
                  <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                  <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                </label>))}
              </div>
              {this.props.query.type == "residential" ? 
              <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`}> 
                <span className={style.filterTitle} onClick={()=>{this.showHide('furnishing'); this.checkIfOpen('furnishing')}}>Furnishing<i className="fa fa-angle-down pull-right" style={{paddingTop: '3px', paddingRight: '3px',}}></i></span>
                <div ref="furnishing" className={`${style.clickFilter}`}>
                  {['Furnished', 'Non-Furnished'].map((amenity, index) => (<label className={`col-sm-4 no-padding`} key={index}>
                  <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                  <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </label>))}
                </div>
              </div> : null}
              <div className={`col-sm-12 col-xs-12 ${style.rowFilter}`} style={{margin: "15px 0"}}>
                {[].map((amenity, index) => (
                <label className={`col-sm-4 no-padding`} key={index}>
                  <input type="checkbox" checked={this.props.query.amenities && this.props.query.amenities.indexOf(amenity) != -1} name={amenity} special={`${amenity.replace(/\b\w/g, l => l.toUpperCase())}`} onChange={() => this.setAmenities(amenity)} />
                  <span>{amenity.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                </label>))}
              </div>
            </div>
            { (this.props.query.type === 'residential' || !this.props.query.type) && this.props.stickyState && window.innerWidth > 768 ? (
                <div className={`col-sm-6 col-xs-12 ${style.columnFilters}`} id="stickyCounters" style={{marginTop: '5px', }}>
                  <div className={`${style.smallmargin}`} style={{width: 'calc(100% - 15px)', marginLeft: '15px', display: 'inline-block', float: 'left', }}>
                    <Counter label="Bedroom" sideStyle value={this.state.bed} onChange={event=> {
                        this.onChange({
                          target: {
                            name: 'bed',
                            value: event==0 ? '' : event,
                          }
                        })
                      }}/>
                  </div>
                  <div className={`${style.smallmargin}`} style={{width: 'calc(100% - 15px)', marginLeft: '15px', display: 'inline-block', float: 'left', }}>
                    <Counter label="Bathroom" sideStyle value={this.state.bath} onChange={event=> {
                        this.onChange({
                          target: {
                            name: 'bath',
                            value: event==0 ? '' : event,
                          }
                        })
                      }}/>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    );
    if (!this.props.mobileType) {
      return (
      <div ref="filterContainer" className={`${style.container}`}>
        <div className="container-fluid">
          <div className={`col-sm-12 hidden-xs ${style.filters}`}>
            <div className={`col-sm-12 no-padding ${style.displayFlex}`}>
              <div className={`${style.filtersTop}`}>
                <div className={style.graanaLogo} id={`graanaLogo`}>
                  <a href="/">
                    <svg xmlns={`${require('logo.svg')}#logo`} id="logo" x="0px" y="0px" viewBox="0 0 801.4 222.8">
                      <g>
                        <path d="M0,99.6c0.5-26.4,6.6-49.4,19.3-70.7c2.1-3.6,6.8-10.1,6.8-10.1s7.2-3.6,11-5.2C90.2-9.6,139.5-3.3,184,33.9     c19.4,16.2,33,36.5,37,62.1c5.2,32.6-16.1,70.1-45.5,84.9c-0.9,0.4-0.9,0.4-1.4,1.2c-22.7,39.3-80.7,56.9-124.8,20     C17,175,1,140,0,99.6z M108.7,83.1c3.4-1.5,5.6-2.5,7.8-3.5c2-0.9,2.5-2,0.4-3.6c-5.2-4-8.2-9.5-10.4-15.6     c-1.7-4.9-4.9-8.7-9.2-11.5c-10.9-7-22.2-6.9-33.9-2c-1.6,0.7-4.6,1.6-4.6,1.6s-0.4,3.9-0.1,6.1c1.1,10.6-1.3,20.7-5.9,30     c-10.9,22.4-14.2,45.6-9.2,70c2.4,11.6,6,22.7,15.2,30.8c18,15.6,38.6,21.8,62.2,16c9.8-2.4,18.4-7,26.7-14     c-1.6-0.4-2.4-0.6-3.1-0.8c-36.5-7.6-61.4-45.4-51.5-85c0.8-3,2.5-6.7,2.5-6.7s3.3,0.3,6.3,0.9c34.8,7,58.8,26.9,70.7,60.6     c1.8,5,2.2,5.2,6.2,1.9c23.9-19.3,31.1-56.3,15.5-83C163.5,22.4,100.2,6.2,48.3,30c-2.9,1.3-9.4,4-9.4,4s-0.6,1.5-1.6,3.4     c-14.6,22.2-19.7,46.7-17.6,72.9c0.7,8.4,2.1,16.7,5.4,24.8c0.4-0.6,0.8-0.8,0.8-1c0.7-19.5,6.7-37.5,14.9-55.1     c5.1-10.8,7-22.6,4.4-34.6C44.9,43,44.3,40,44.3,40s2.3-0.5,3.5-1.2c9.9-5.5,20.4-8.5,31.7-7.2c14.7,1.7,27.8,7,34.5,21.3     c4.3,9.2,8.5,17.9,17.4,23.7c1.8,1.5,1.8,1.5,1.8,1.5s-0.8,1.1-1.7,1.5C124.6,82.6,117.6,84.8,108.7,83.1z M104.4,119.7     c-0.2,9.2,1.9,17.9,6.5,25.8c9.8,16.6,23.3,27.2,43.7,26.1c3-0.1,6.1-1.2,6.1-1.2s0.4-3.5-0.4-6.6c-6.6-24.8-22.1-41.7-45.8-51.1     c-5.5-2.2-9.1-2-9.1-2S104.4,114.8,104.4,119.7z" />
                        <path d="M101.4,57.8c-0.2,3.3-2.1,5.3-5.3,5.4c-3.2,0.1-5.5-1.8-5.6-5.1c-0.1-3.5,1.8-5.7,5.5-5.7C99.4,52.4,101,54.6,101.4,57.8z" />
                        <g>
                          <path d="M400.8,105.8h0.3c4.8-7.3,11.9-11.4,20.7-11.4c3.4,0,6.8,0.8,9.8,2l-2.9,22.1c-2.9-2-6.3-3.1-9.8-3.1      c-16.5,0-18.2,14.6-18.2,27.5v37.5h-23.8V97.2h23.8v8.6C400.7,105.8,400.8,105.8,400.8,105.8z"></path>
                          <path d="M518,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8H518V180.5z M497,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2s7.5,23.4,19.7,23.4      C489.4,162.2,497,150,497,138.8z"></path>
                          <path d="M613.9,180.5h-23.4v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L613.9,180.5L613.9,180.5z M592.9,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4S592.9,150,592.9,138.8z"></path>
                          <path d="M654.8,104.8h0.3c4.9-7.5,13.2-10.3,21.7-10.3c22.4,0,28.8,15.8,28.8,35.1v50.9h-23.8v-44.1c0-10,0.5-22.9-12.9-22.9      c-14.1,0-14.3,15.8-14.3,25.8v41.2H631V97.2h23.8V104.8z"></path>
                          <path d="M801.4,180.5H778v-7.6h-0.3c-5.1,6.6-13.9,10.3-22.6,10.3c-24.4,0-38.3-22.2-38.3-44.8c0-22.1,14.1-43.9,38-43.9      c8.7,0,17.5,3.7,23.2,10.5v-7.8h23.4L801.4,180.5L801.4,180.5z M780.3,138.8c0-11.2-7.6-23.2-19.9-23.2c-12.2,0-19.7,12-19.7,23.2      s7.5,23.4,19.7,23.4C772.7,162.2,780.3,150,780.3,138.8z"></path>
                          <path d="M302,110.3h62.7c0.4,1.4,0.7,3.2,0.9,5.2c0.2,2,0.4,4,0.4,6.1c0,8.2-1.2,15.9-3.7,23.2s-6.4,13.7-11.8,19.5      c-5.7,6.1-12.6,10.8-20.5,14.1c-8,3.3-17.1,5-27.3,5c-9.3,0-18-1.7-26.2-5s-15.4-8-21.4-13.9c-6.1-5.9-10.9-13-14.5-21.2      s-5.4-17-5.4-26.7s1.8-18.5,5.4-26.7c3.6-8.1,8.4-15.2,14.5-21.2c6.1-5.9,13.2-10.6,21.4-13.9c8.2-3.3,17-5,26.2-5      c10.4,0,19.6,1.8,27.8,5.4c8.1,3.6,15.1,8.5,21,14.8l-16.6,16.2c-4.2-4.4-8.8-7.8-13.9-10.1c-5.1-2.3-11.2-3.5-18.4-3.5      c-5.8,0-11.4,1-16.6,3.1s-9.8,5-13.7,8.8c-3.9,3.8-7.1,8.4-9.4,13.8s-3.5,11.5-3.5,18.1c0,6.7,1.2,12.7,3.5,18.1s5.5,10,9.5,13.8      s8.6,6.8,13.8,8.8c5.2,2.1,10.8,3.1,16.8,3.1c6.8,0,12.5-1,17.2-2.9c4.7-2,8.7-4.5,12-7.6c2.4-2.1,4.4-4.8,6.2-8.1      c1.7-3.3,3.1-6.9,4-11H302V110.3z"></path>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
              <div style={{width: 'auto', float: 'left', }}>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  animation={false}
                  container={() => ReactDOM.findDOMNode(this.refs.purpose)}
                  overlay={<CustomPopover content={purposeOverlay}/>}
                  ref="purposeOverlayTrigger"
                >
                  <div ref="purpose" className={style.afilter} style={{margin: 0, }}>
                    <button  className={`btn ${this.props.query.purpose ? 'red' : 'btn-default hollow'}`} style={{display: 'inline-flex', alignItems: 'center'}}>
                      {this.props.query.purpose ? `Purpose: ${this.purpose[this.props.query.purpose]}` : 'Purpose'}
                      <i className="fa fa-angle-down pull-right" style={{paddingLeft: '6px', fontSize: '18px', }}></i>
                    </button>
                  </div>
                </OverlayTrigger>
              </div>
              <div style={{width: 'auto', float: 'left', display: 'inline-flex', }}>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  animation={false}
                  container={() => ReactDOM.findDOMNode(this.refs.type)}
                  overlay={<CustomPopover content={typeOverlay} popoverStyle={{minWidth: 'max-content'}}/>}
                >
                  <div ref="type" className={style.afilter}>
                    <button className={`btn ${(this.props.query.type || (this.props.query.subtype && this.props.query.subtype.length)) ? 'green' : 'btn-default hollow'}  text-capitalize`}>
                      {/* {(!this.props.query.subtype && !this.props.query.type && !this.props.query.subtype.length) ? 'Type: All Types' : ( (this.props.query.subtype && typeof(this.props.query.subtype) != 'string') ? (this.props.query.subtype.length ==1 ? `Type: ${this.props.query.subtype[0]}` : (`Type: (${this.props.query.subtype.length}) selected`)) : ( (this.props.query.subtype && typeof(this.props.query.subtype) == 'string') ? `Type: ${this.props.query.subtype}` : (this.props.query.type ? `Type: All ${this.props.query.type}` : `Types: All Types`) ))} */}
                      { (!this.props.query.type && !this.props.query.subtype) ? 'Type: All Types'
                        : ((this.props.query.type && !this.props.query.subtype) ? `Type: All ${this.props.query.type === 'all' ? '' : this.props.query.type + 's'}`
                          : ( (this.props.query.subtype && (typeof(this.props.query.subtype) != 'string')) ? ( this.props.query.subtype.length == 0 ? `Type: All ${this.props.query.type ? this.props.query.type + 's' : 'Types'}` : (this.props.query.subtype.length == 1 ? `Type: ${this.props.query.subtype[0]}` : `Type: (${this.props.query.subtype.length}) Selected` ) )
                            : (this.props.query.subtype ? `Type: ${this.props.query.subtype}` : `Type: All Types`) ) ) }
                    </button>
                  </div>
                </OverlayTrigger>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  animation={false}
                  container={() => ReactDOM.findDOMNode(this.refs.price)}
                  overlay={<CustomPopover content={priceOverlay} containerStyle={{padding: '45px 45px 55px',}}/>}
                >
                  <div ref="price" className={style.afilter}>
                    <button className={`btn ${this.props.query.price_min && this.props.query.price_max ? 'green' : 'btn-default hollow'}`}>
                      {this.renderPriceFilterString()}
                    </button>
                  </div>
                </OverlayTrigger>
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  animation={false}
                  container={() => ReactDOM.findDOMNode(this.refs.size)}
                  overlay={<CustomPopover content={sizeOverlay} popoverStyle={{minWidth: ''}} containerStyle={{paddingLeft: ''}}/>}
                >
                  <div ref="size" className={`${style.afilter}`}>
                    <button className={`btn ${this.props.query.unit && this.props.query.size_min || this.props.query.size_max ? 'green' : 'btn-default hollow'}`}>
                      { this.props.query.size_min && this.props.query.size_max ? `Size: ${this.props.query.size_min} - ${this.props.query.size_max} ${this.props.query.unit || 'marla'}` : 'Size' }
                    </button>
                  </div>
                </OverlayTrigger>
              </div>
              </div>
              <div id="selectSearch" className={`${style.selectSearch} row`}>
                <Select
                  name="form-field-name"
                  value={this.props.query.city_id ? {value: this.props.query.city_id, label: this.props.query.city_name} : null}
                  className={`multiSelect ${style.selectCity} ${style.selectStyle}`}
                  onChange={city => this.getAreas(city)}
                  placeholder={'Select City'}
                  autosize={false}
                  options={this.props.city.list.length ? this.props.city.list.map((city) => { return {value: city.id, label: city.name}}) : []}
                  isLoading={this.props.city.list.length ? false : true}
                />
                <span className={style.inputSeparator} />
                <Select
                  name="form-field-name"
                  noResultsText={this.props.query.city_id ? 'No Areas found' : 'Select City first'}
                  // value={this.props.query.area_id && typeof(this.props.query.area_id) != 'string' ? (this.props.query.area_id.length && typeof(this.props.query.area_id) != 'string') && this.props.query.area_id.map((area,index) => {return {label: this.props.query.area_names ? this.props.query.area_names[index] : null, value: area ? area.id : null} }) : (this.props.query.area_id ? {label: this.props.query.area_names ? (typeof(this.props.query.area_names) != 'string' ? this.props.query.area_names[0]  : this.props.query.area_names ) : '', value: this.props.query.area_id } : null) }
                  //value={(this.props.query.area_id && typeof(this.props.query.area_id) != 'string' && this.props.query.area_id[0]) ? this.props.query.area_id.map((area, index) => {return { label:this.props.query.area_names[index], value:area.id }} ) : null}
                  value={this.state.selectedAreas}
                  className={`multiSelect ${style.selectArea} ${style.selectStyle} areaSelect`}
                  onChange={(areas) => this.setAreas(areas)}
                  placeholder={'Select Areas'}
                  removeSelected={false}
                  options={this.props.query.city_id && this.props.city.areas.length ? this.props.city.areas.map((area) => { return {value: area.id, label: area.name}}) : []}
                  multi={true}
                />
              </div>
              <OverlayTrigger
                rootClose
                trigger="click"
                animation={false}
                container={() => ReactDOM.findDOMNode(this.refs.moreFilters)}
                overlay={<CustomPopover right={true} content={moreOverlay} popoverStyle={{minWidth: ''}} containerStyle={{paddingLeft: ''}}/>}
              >
                <div ref="moreFilters" className={`${style.afilter}`} style={{display: "inline-block", position: "unset", float: 'none', }}>
                  <button className={`btn btn-default hollow hidden-xs ${style.afilter}`}>More Filters</button>
                </div>
              </OverlayTrigger>
            </div>
            { this.props.query.type === 'residential' || !this.props.query.type?
            <div className={`col-sm-12 no-padding`} id="filterRow" style={{paddingTop: '10px', }}>
              <div className={`${style.smallmargin}`} style={{width: '280px', display: 'inline-block', }}>
                <Counter label="Bedroom" sideStyle value={this.state.bed} onChange={event=> {
                    this.onChange({
                      target: {
                        name: 'bed',
                        value: event==0 ? '' : event,
                      }
                    })
                  }}/>
              </div>
              <div className={`${style.smallmargin}`} style={{width: '280px', display: 'inline-block', }}>
              <Counter label="Bathroom" sideStyle value={this.state.bath} onChange={event=> {
                    this.onChange({
                      target: {
                        name: 'bath',
                        value: event==0 ? '' : event,
                      }
                    })
                  }}/>
              </div>
            </div>: ''}
          </div>
          <div className={`visible-xs col-xs-12`}>
            <div style={{ paddingTop: 20 }}>
              <div className='row'>
                <div className='col-xs-6'>
                  <div className={`footerDropdown col-xs-12 no-padding-right`}>
                    <DropdownButton style={{width:'100%', marginRight:'10px', padding: '7px 10px', textTransform: "capitalize", }}  onSelect={(unit) => {this.changeUnit(unit)}} title={`Unit: ${this.props.user.unit}`} id="dropdown-size-medium">
                      {
                        ['sqft', 'sqyd','sqm','marla','kanal'].map((unit, index) =>
                          <MenuItem key={index} className='text-capitalize' eventKey={unit}>{unit}</MenuItem>
                        )
                      }
                    </DropdownButton>
                  </div>
                </div>
                <div className='col-xs-6'>
                  <div className='footerDropdown col-xs-12 no-padding-left'>
                    <DropdownButton style={{width:'100%', marginRight:'10px', padding: '7px 10px', textTransform: "capitalize", }}  onSelect={(currency) => {this.changeCurrency(currency)}} title={`Currency: ${this.props.currency}`} id="dropdown-size-medium">
                      {
                        ['PKR','AED','AUD','CAD','CNY','EUR','GBP','JPY','SAR','USD'].map((currency, index) =>
                          <MenuItem key={index} eventKey={currency}>{currency}</MenuItem>
                        )
                      }
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </div>
            <div style={{padding: '20px 0 20px'}}>
              <div className="text-center" style={{ marginBottom: '20px' }}>
                {/*<OverlayTrigger*/}
                  {/*rootClose*/}
                  {/*trigger="click"*/}
                  {/*animation={false}*/}
                  {/*container={() => ReactDOM.findDOMNode(this.refs.purposeMobile)}*/}
                  {/*overlay={<CustomPopover content={purposeOverlay}/>}*/}
                {/*>*/}
                  {/*<div ref="purposeMobile" className={style.afilter} style={{margin: 0}}>*/}
                    {/*<button  className={`btn ${this.props.query.purpose ? 'red' : 'btn-default hollow'}`}>*/}
                      {/*{this.props.query.purpose ? `Purpose: ${this.purpose[this.props.query.purpose]}` : 'Purpose'}*/}
                      {/*<i className="fa fa-angle-down pull-right" style={{paddingLeft: '6px', fontSize: '18px', }}></i>*/}
                    {/*</button>*/}
                  {/*</div>*/}
                {/*</OverlayTrigger>*/}
                <div className={`${style.spacexs} col-xs-12 no-padding`}>
                  <div style={{width: '100%',height: '50px', borderRadius: '4px',margin: '10px 0px 10px',border: '1px solid #dbdbdb',}}>
							        <span ref="residential" className={`${this.props.query.purpose === "sale" ? style.turnRed : null}`} onClick={()=>{this.search({purpose: 'sale'})}} style={{display: 'block', textAlign: 'center', width: '50%', borderRight: '1px solid #dbdbdb', float: 'left', lineHeight: '48px',}}>
                        <strong>Sale</strong>
                      </span>
                    <span ref="plot" className={`${this.props.query.purpose === "rent" ? style.turnRed : null}`} onClick={()=>{this.search({purpose: 'rent'})}} style={{display: 'block', textAlign: 'center', width: '50%', float: 'left', lineHeight: '48px',}}>
                        <strong>Rent</strong>
                      </span>
                  </div>
                </div>
              </div>
              <div id="selectSearch" className={`${style.selectSearch} row`}>
                <Select
                  name="form-field-name"
                  value={this.props.query.city_id ? {value: this.props.query.city_id, label: this.props.query.city_name} : null}
                  className={`multiSelect ${style.selectCity} ${style.selectStyle}`}
                  onChange={city => this.getAreas(city)}
                  placeholder={'Select City'}
                  autosize={false}
                  options={this.props.city.list.length ? this.props.city.list.map((city) => { return {value: city.id, label: city.name}}) : []}
                  isLoading={this.props.city.list.length ? false : true}
                />
                <Select
                  name="form-field-name"
                  noResultsText={this.props.query.city_id ? 'No Areas found' : 'Select City first'}
                  // value={this.props.query.area_id && typeof(this.props.query.area_id) != 'string' ? (this.props.query.area_id.length && typeof(this.props.query.area_id) != 'string') && this.props.query.area_id.map((area,index) => {return {label: this.props.query.area_names ? this.props.query.area_names[index] : null, value: area ? area.id : null} }) : (this.props.query.area_id ? {label: this.props.query.area_names ? (typeof(this.props.query.area_names) != 'string' ? this.props.query.area_names[0]  : this.props.query.area_names ) : '', value: this.props.query.area_id } : null) }
                  //value={(this.props.query.area_id && typeof(this.props.query.area_id) != 'string' && this.props.query.area_id[0]) ? this.props.query.area_id.map((area, index) => {return { label:this.props.query.area_names[index], value:area.id }} ) : null}
                  value={this.state.selectedAreas}
                  className={`multiSelect ${style.selectArea} ${style.selectStyle} areaSelect`}
                  onChange={(areas) => this.setAreas(areas)}
                  placeholder={'Select Areas'}
                  removeSelected={false}
                  options={this.props.query.city_id && this.props.city.areas.length ? this.props.city.areas.map((area) => { return {value: area.id, label: area.name}}) : []}
                  multi={true}
                />
              </div>
            </div>
            <div style={{width: '90%', margin: 'auto', marginBottom: '65px', }}>{mobilePriceOverlay}</div>
            {typeOverlay}
            {sizeOverlay}
            {moreOverlay}
            {/*moreOverlay*/}
            { this.props.query.type === 'residential' || !this.props.query.type?
            <div className={`col-sm-12 no-padding`} id="filterRow">
              <div className={`${style.smallmargin}`} style={{width: '100%', marginBottom: '6px', display: 'inline-block', }}>
                <Counter label="Bedroom" sideStyle value={this.state.bed} onChange={event=> {
                    this.onChange({
                      target: {
                        name: 'bed',
                        value: event==0 ? '' : event,
                      }
                    })
                  }}/>
              </div>
              <div className={`${style.smallmargin}`} style={{width: '100%', marginBottom: '20px', display: 'inline-block', }}>
              <Counter label="Bathroom" sideStyle value={this.state.bath} onChange={event=> {
                    this.onChange({
                      target: {
                        name: 'bath',
                        value: event==0 ? '' : event,
                      }
                    })
                  }}/>
              </div>
            </div> : null}
              
              <div style={{
                  display: "block",
                  float: "left",
                  width: "100%",
                  marginBottom: "40px",
              }}>
                <button style={{
                    margin: "auto",
                    display: "block",
                    border: "1px solid #bbb",
                    background: "#fff",
                    padding: "10px 20px",
                    borderRadius: "4px",
                }}
                onClick={ ()=>{
                  document.body.click();
                  document.body.style.overflow = 'unset';
                  this.props.dispatch(changeFilterModal(false))
                }}>Cancel</button>
              </div>
              
            <div onClick={() => {this.startSearchMobile()}} className={style.acceptDiv}>Apply Filters</div>
          </div>
        </div>
      </div>
      )
    }
    if (this.props.mobileType) {
      return (
        <div id="selectSearch" className={`${style.selectSearch} row`}>
          <Select
            name="form-field-name"
            value={this.props.query.city_id ? {value: this.props.query.city_id, label: this.props.query.city_name} : null}
            className={`multiSelect ${style.selectCity} ${style.selectStyle}`}
            onChange={city => this.getAreas(city)}
            placeholder={'Select City'}
            autosize={false}
            options={this.props.city.list.length ? this.props.city.list.map((city) => { return {value: city.id, label: city.name}}) : []}
            isLoading={this.props.city.list.length ? false : true}
          />
          <Select
            name="form-field-name"
            noResultsText={this.props.query.city_id ? 'No Areas found' : 'Select City first'}
            // value={this.props.query.area_id && typeof(this.props.query.area_id) != 'string' ? (this.props.query.area_id.length && typeof(this.props.query.area_id) != 'string') && this.props.query.area_id.map((area,index) => {return {label: this.props.query.area_names ? this.props.query.area_names[index] : null, value: area ? area.id : null} }) : (this.props.query.area_id ? {label: this.props.query.area_names ? (typeof(this.props.query.area_names) != 'string' ? this.props.query.area_names[0]  : this.props.query.area_names ) : '', value: this.props.query.area_id } : null) }
            //value={(this.props.query.area_id && typeof(this.props.query.area_id) != 'string' && this.props.query.area_id[0]) ? this.props.query.area_id.map((area, index) => {return { label:this.props.query.area_names[index], value:area.id }} ) : null}
            value={this.state.selectedAreas}
            className={`multiSelect ${style.selectArea} ${style.selectStyle} areaSelect`}
            onChange={(areas) => this.setAreas(areas)}
            placeholder={'Select Areas'}
            removeSelected={false}
            options={this.props.query.city_id && this.props.city.areas.length ? this.props.city.areas.map((area) => { return {value: area.id, label: area.name}}) : []}
            multi={true}
          />
        </div>
      )
    }
    if(this.state.error) {
      return <E404 />
    }
    return null;
  }
  renderPriceFilterString() {
    if(!this.props.query.price_min || !this.props.query.price_max) {
      // return `Price: ${this.props.currency} ${convertPrice(this.props.query.price_min, this.props.currency, this.props.currencyRates)}+`;
      return 'Price'
    }
    else if(this.props.query.price_min && this.props.query.price_max) {
      return `Price: ${this.props.currency} ${convertPrice(this.props.query.price_min, this.props.currency, this.props.currencyRates)} - ${convertPrice(this.props.query.price_max, this.props.currency, this.props.currencyRates)}`;
    }
    else {
      return 'Price';
    }
  }
}

export default connect(store => {
  return {
    query: store.property.query,
    max: store.property.listings.max,
    city: store.city,
    user: store.user,
    currency: store.user.currency,
    currencyRates: store.user.currencyRates,
  }
})(SearchFilters)
