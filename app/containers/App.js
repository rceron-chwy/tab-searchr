import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as theActions from '../redux/actions';

import style from './styles.css';

class App extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={style.app}>
        TEST APP
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.app.loading,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(theActions, dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App);
