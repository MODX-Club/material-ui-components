import React, { Component } from 'react';

import Prototype from '../Snackbar/';

export default class Informer extends Prototype {

  // componentDidMount() {
  //
  //   Prototype.prototype.componentDidMount.call(this);
  // }

  componentWillReceiveProps(nextProps){

    Prototype.prototype.componentWillReceiveProps.call(this, nextProps);

    var newState = {};

    if(this.state.open != true){
      if(
        nextProps.message != this.state.message
        && nextProps.message != ""
      ){
        newState.open = true;
      }
      else{
        newState.message = "";
      }
    }

    this.setState(newState);

    return true;
  }

  componentDidUpdate(prevProps, prevState) {

    Prototype.prototype.componentDidUpdate.call(this, prevProps, prevState);

    if (prevState.open !== this.state.open) {
      if (this.state.open !== true) {

        this.setState({
          message: "",
        });

        if(this.props.documentActions){
          this.props.documentActions.InformerMessageShowed();
        }

      } else {;

      }
    }
  }
}


