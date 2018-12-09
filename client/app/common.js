import 'common/loader.less';
import 'rheostat/css/slider.css'
import 'rheostat/css/slider-horizontal.css'
import 'slick-carousel/slick/slick.css'
require('es6-promise/auto');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import { axios } from 'axios';
axios.defaults.withCredentials = true;

import Modal from 'react-bootstrap/lib/Modal';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import Pagination from 'react-bootstrap/lib/Pagination';

import Rheostat from 'rheostat'
import geometric from 'rheostat/lib/algorithms/geometric'

import { Formsy, Decorator } from 'formsy-react';

import Slider from 'react-slick';
