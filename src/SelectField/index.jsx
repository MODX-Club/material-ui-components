import React, { Component } from 'react';

import Button from 'material-ui/Button';
// import Menu, { MenuItem } from 'material-ui/Menu';
import List, { ListItem } from 'material-ui/List';

// import {FormControl} from 'material-ui/Form';
import FormControl from '../FormControl';
import Popover from '../Popover';
import {InputLabel} from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import customPropTypes from 'material-ui/utils/customPropTypes';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('SelectField', (theme) => ({
  root: {
  },
  input: {
    textTransform: 'none',
    height: 32,
    width: '100%',
    // position: "relative",
    // marginTop: 10,
    // marginBottom: 10,
    // minHeight: 20,
    // padding: '5px 0',
    // border: 'none',
    // outline: 'none',
    // borderBottom: `1px solid ${theme.palette.text.divider}`,

    // '.error &': {
    //   color: theme.palette.error[500],
    //   borderBottom: `2px solid ${theme.palette.error[500]}`,
    // },
    justifyContent: 'flex-start',
    paddingLeft: 1,
  },
  inputLabel: {
    // fontFamily: theme.typography.fontFamily,
    // color: theme.palette.text.secondary,
    // lineHeight: 1,
  },
  labelEmpty: {
    color: theme.palette.text.secondary,
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  List: {
    maxHeight: '300px',
  },
}));

var classes;

const defaultProps = {
  // placeholder: "Выберите из списка",
  placeholder: "",
}

export default class SelectField extends Component {
  state = {
    anchorEl: undefined,
    open: false,
  };

  button = undefined;

  handleClick = (event) => {
    if(this.props.disabled){
      return;
    }

    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    console.log('handleRequestClose');
    this.setState({ open: false });
  };

  componentWillMount(){

    classes = this.context.styleManager.render(styleSheet);
  }

  onChange(event, item){

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
      this.props.onChange(event, value, item);
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
        options.push(<ListItem
          key={value}
          value={value}
          button
          onTouchTap={(event) => {
            this.onChange(event, item);
          }}
        >{item.title || item}</ListItem>);
      });
    }

    var title;


    var labelClasses = ["input", classes.input, this.props.className];

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
      labelClasses.push(classes.labelEmpty);
    }

    if(this.props.disabled){
      labelClasses.push(classes.disabled);
    }

    // return <FormControl 
    //   error={true}
    //   label="hfg"
    //   value="dfgdfg"
    //   helperText="Some important text"  
    // >
    //   <div>wefewf</div>
    // </FormControl>

    return <FormControl
      // error={!!this.props.error}
      // className={["textarea", classes.root, this.props.error == true ? "error" : ""].join(" ")}
      label={this.props.label || ''}
      value={String(this.props.value || '')}
      helperText={this.props.helperText || ''}
      error={this.props.error || false}
    >
      <div>
        <Button
          onTouchTap={this.handleClick}
          className={labelClasses.join(" ")}
        >{title}</Button>
        <Popover
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          modal
          // positions={{
          //   top: 'inherit',
          // }}
        >
          <List
            className={[classes.List, this.props.listClassName].join(" ")}
          >
            {options}
          </List>
        </Popover>
      </div>
    </FormControl>;



    // return <FormControl
    //   error={!!this.props.error}
    //   className={["textarea", classes.root, this.props.error == true ? "error" : ""].join(" ")}
    // >
    //   {this.props.label != ""
    //     ?
    //     <InputLabel
    //       error={!!this.props.error}
    //       shrink={this.props.value != "" || this.props.placeholder != ""}
    //       className={classes.inputLabel}
    //     >
    //       {this.props.label}
    //     </InputLabel>
    //     :
    //     null}
    //   <Typography
    //     onTouchTap={this.handleClick}
    //     className={labelClasses.join(" ")}
    //   >{title}</Typography>
    //   <Menu
    //     anchorEl={this.state.anchorEl}
    //     open={this.state.open}
    //     onRequestClose={this.handleRequestClose}
    //   >
    //     {options}
    //   </Menu>
    // </FormControl>;

  }
}

SelectField.defaultProps = defaultProps;

SelectField.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
