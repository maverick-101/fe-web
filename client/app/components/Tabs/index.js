import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import style from './style.css';

class Tabs extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeTab: this.props.activeTabIndex === undefined ? this.getActiveTabIndex(this.props.children) : this.props.activeTabIndex
    }
  }
  getActiveTabIndex(children) {
    let activeTabIndex;
    React.Children.forEach(children, child => {
      if(activeTabIndex == null)
        activeTabIndex = child.props.tabIndex;
    });
    return activeTabIndex;
  }
  getChildContext() {
    return {activeTab: this.state.activeTab};
  }
  handleChange(tabKey) {
    this.setState({activeTab: tabKey});
  }
  render() {
    const {activeTabIndex = this.getActiveTabIndex(this.children)} = this.props;
    return (
      <div>
        <ul className={style.nav}>
          {React.Children.map(this.props.children, child => {
            return (<Nav active={this.state.activeTab == child.props.tabIndex} onChange={this.handleChange.bind(this)} {...child.props}/>);
          })}
        </ul>
        <TabContent {...this.props}></TabContent>
      </div>
    );
  }
}

Tabs.childContextTypes = {
  activeTab: React.PropTypes.any
};

class Tab extends React.Component {
  render() {
    return (
      <div key={this.props.tabIndex}>
        {this.props.children}
      </div>
    );
  }
}

class Nav extends React.Component {
  handleClick(event) {
    event.preventDefault();
    this.props.onChange(this.props.tabIndex);
  }
  render() {
    return (
      <li>
        <a href='#' className={`${this.props.active ? style.active : ''}`} onClick={this.handleClick.bind(this)}>{this.props.label}</a>
      </li>
    );
  }
}

class TabContent extends React.Component {
  render() {
    var tab = this.props.children.map(child => {
      if(child.props.tabIndex == this.context.activeTab) {
        return child;
      }
    });
    return (
      <div className={style.content}>
        <ReactCSSTransitionGroup transitionName="pane" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {tab}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

TabContent.contextTypes = {
  activeTab: React.PropTypes.any
};


export {
  Tab,
  Tabs
};
