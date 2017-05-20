import React, { Component } from 'react';
import Button from 'material-ui/src/Button';
import Menu, { MenuItem } from 'material-ui/src/Menu';

import {FormControl} from 'material-ui/src/Form';
import {InputLabel} from 'material-ui/src/Input';
import Typography from 'material-ui/src/Typography';

import customPropTypes from 'material-ui/src/utils/customPropTypes';
import { withStyles, createStyleSheet } from 'material-ui/src/styles';

const styleSheet = createStyleSheet('SelectField', (theme) => ({
  root: {
  },
  input: {
    position: "relative",
    marginTop: 10,
    marginBottom: 10,
    minHeight: 20,
    padding: '6px 0',
    border: 'none',
    outline: 'none',
    borderBottom: `1px solid ${theme.palette.text.divider}`,

    '.error &': {
      color: theme.palette.error[500],
      borderBottom: `2px solid ${theme.palette.error[500]}`,
    },
  },
  inputLabel: {
    // fontFamily: theme.typography.fontFamily,
    // color: theme.palette.text.secondary,
    // lineHeight: 1,
  },
}));

var classes;

const defaultProps = {
  placeholder: "Выберите из списка",
}

export default class SelectField extends Component {
  state = {
    anchorEl: undefined,
    open: false,
  };

  button = undefined;

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  componentWillMount(){

    classes = this.context.styleManager.render(styleSheet);
  }

  onChange(event){

    var target = event.target;

    var value = "";

    if(target.value){
      value = target.value;
    }
    else{
      value = target.attributes && target.attributes.value && target.attributes.value.value ? target.attributes.value.value : "";
      target.value = value;
    }

    target.name = this.props.name;

    if(this.props.onChange){
      this.props.onChange(event, value);
    }

    this.setState({
      open: false,
    });
  }

  render() {

    var options = [];

    if(this.props.options && this.props.options.length){
      this.props.options.map((item) => {
        var value = typeof item.value != "undefined" ? item.value : item.title || item;
        options.push(<MenuItem
          key={value}
          value={value}
          onTouchTap={(event) => {
            this.onChange(event);
          }}
        >{item.title || item}</MenuItem>);
      });
    }

    var title;

    if(this.props.value && this.props.value != ""){

      if(this.props.options && this.props.options.length){
        for(var i in this.props.options){
          var item = this.props.options[i] || {};

          if(item.value && item.value == this.props.value){
            title = item.title;
          }
        }
      }

      if(!title){
        title = this.props.value;
      }
    }
    else{
      title = this.props.placeholder;
    }

    return <FormControl
      error={!!this.props.error}
      className={["textarea", classes.root, this.props.error == true ? "error" : ""].join(" ")}
    >
      {this.props.label != ""
        ?
        <InputLabel
          error={!!this.props.error}
          shrink={this.props.value != "" || this.props.placeholder != ""}
          className={classes.inputLabel}
        >
          {this.props.label}
        </InputLabel>
        :
        null}
      <Typography
        onTouchTap={this.handleClick}
        className={["input", classes.input, this.props.className].join(" ")}
      >{title}</Typography>
      <Menu
        anchorEl={this.state.anchorEl}
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        {options}
      </Menu>
    </FormControl>;

  }
}

SelectField.defaultProps = defaultProps;

SelectField.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};