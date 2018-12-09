import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getRole } from 'utils/user';
import axios from 'axios';
import config from 'config';
export default function(Component) {
  return connect(store => {
    return {
      user: store.user.user
    }
  })(
    class extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          transition: false
        }
      }
      componentWillMount() {
        axios.get(`${config.apiPath}/api/user/me`)
        .then((user) => {
          if(user.data.email) {
            if(!user.data.email) {
              return window.location = '/';
            }
    
            if(!~this.props.route.authorize.indexOf(getRole(user.data))) {
              return window.location = '/';
            }
            this.setState({
              transition: true
            })
          }
        })
      }
      render() {
        return this.state.transition ? <Component {...this.props}/> : null;
      }
    }
  )
}
