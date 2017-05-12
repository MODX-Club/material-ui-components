import React, {Component} from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/src/utils/customPropTypes';

import {FormControl} from 'material-ui/src/Form';
import {InputLabel} from 'material-ui/src/Input';

const defaultProps = {

  name: "",
  label: "",
  value: "",
  error: false,
  inEditMode: true,
}

const styleSheet = createStyleSheet('Chips', (theme) => ({
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
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    lineHeight: 1,
  },
}));

var classes;

export default class TextArea extends Component{

  constructor(props){

    super(props);

    this.state = {
      inEditMode: props.inEditMode,
      value: props.value,
    }
  }

  onChange = (event) => {

    var name = event.target.name || event.target.attributes.name && event.target.attributes.name.nodeValue;
    var value = event.target.value || event.target.innerText;

    this.setState({
      value: value,
    });

    if(this.props.onChange){
      this.props.onChange(event, value);
    }
  }

  // onChange={(event, value) => {this.onTextareaChange(event, value)}}

  componentWillReceiveProps(nextProps){

    if(nextProps.value != this.props.value){
      this.setState({
        value: nextProps.value,
      });
    }
  }

  componentWillMount(){
    classes = this.context.styleManager.render(styleSheet);
  }

  render(){

    return <FormControl
      error={this.props.error}
      className={["textarea", classes.root].join(" ")}
    >
      {this.props.label != ""
        ?
        <InputLabel
          shrink={this.state.value != ""}
          className={classes.inputLabel}
        >
          {this.props.label}
        </InputLabel>
        :
        null}

      {this.props.inEditMode === true
        ?
        <div
          name={this.props.name}
          contentEditable={true}
          value={this.state.value}
          onKeyUp={(event) => {
            this.onChange(event);
          }}
          className={["input", classes.input, this.props.className].join(" ")}
        ></div>
        :
        <div
          name={this.props.name}
          className={["input", classes.input, this.props.className].join(" ")}
          dangerouslySetInnerHTML={{__html: this.props.value}}
        ></div>
      }
    </FormControl>;
  }
}

TextArea.defaultProps = defaultProps;
TextArea.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};