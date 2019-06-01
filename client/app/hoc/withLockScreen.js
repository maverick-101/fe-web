import React from 'react';
import axios from 'axios';
import Formsy from 'formsy-react';
import Input from 'components/Input';
import config from 'config';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const style = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5',
  },
  panelStyle: {
    width: 400,
  },
  logoWrapper: {
    width: '70%',
    margin: '0 auto',
  },
  svg: {
    width: '100%',
    fill: '#ef5350',
  },
}

export default Component => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        show: true
      }
    }
    lockScreen() {
      this.setState({show: false})
    }
    submit(model) {
      axios.post(`${config.apiPath}/auth/unlock`, model)
        .then(response => {
          if(response && response.status == 200) {
            this.setState({show: true})
          }
        })
    }
    render() {
      if(this.state.show) {
        return <Component {...this.props} lockScreen={this.lockScreen.bind(this)}/>
      }
      return (
        <div className="container-fluid text-center" style={style.container}>
          <div className="panel panel-default" style={style.panelStyle}>
            <div className="panel-body">
              <div style={style.logoWrapper}>
                <svg style={style.svg}>
                </svg>
              </div>
              <p>Please enter the password to continue</p>
              <Formsy onValidSubmit={this.submit.bind(this)}>
                <Input name="password" type="password" placeholder="Password" className="space-2" required/>
                <button className="btn red btn-b">Submit</button>
              </Formsy>
              <hr />
\            </div>
          </div>
        </div>
      )
    }
  }
}
