import React, {Component} from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/src/utils/customPropTypes';

import TextField from 'material-ui/src/TextField';

import Popover from '../Popover';

import _ from 'lodash';

import List, {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from 'material-ui/src/List';

const defaultProps = {
  input_id: _.uniqueId('autocomplete_'),
  popover_id: _.uniqueId('popover_'),
  label: "",
  maxSearchResults: 10,
  searchText:"",
  dataSource:[],
  data:[],
  anchorEl: null,
}

const styleSheet = createStyleSheet('AutoComplete', () => ({
  menu: {},
  content: {
  },
  listItem: {
    paddingTop: 6,
    paddingBottom: 6,
  },
}));

var classes;

export default class AutoComplete extends Component {

  constructor(props) {

    super(props);


    this.state = {
      input_id: props.input_id,
      popover_id: props.popover_id,
      searchText: props.searchText,
      open: false,
      // dataSource: props.dataSource,
    };
  }

  // componentWillReceiveProps(nextProps){
  //
  // }

  componentWillMount() {

    classes = this.context.styleManager.render(styleSheet);
  }

  // onChange(event){
  //   console.log("onChange", event.target.value, this.props.onChange);
  //
  //
  // }

  onChange(event){
    console.log("onChange", event.target.value);

    this.props.onChange(event, this.props.dataSource);

    var value = event.target.value;

    var result = this.props.dataSource;
    //
    // if(
    //   this.props.dataSource
    //   && value != ""
    // ){
    //   for(var i in this.props.dataSource){
    //
    //     var item = this.props.dataSource[i];
    //
    //     if(!item){
    //       continue;
    //     }
    //
    //     if(item.match(value)){
    //       result.push(item);
    //
    //       if(this.props.maxSearchResults > 0 && this.props.maxSearchResults == result.length){
    //
    //         console.log("dataSource", item);
    //         break;
    //       }
    //     }
    //   }
    // }

    // console.log('result', result);

    this.setState({
      searchText: value,
      data: result,
      anchorEl: event.target,
      open: true,
    });
  }

  // onChange(event){
  //   console.log("onChange", event.target.value);
  //
  //   var value = event.target.value;
  //
  //   var result = [];
  //
  //   if(
  //     this.props.dataSource
  //     && value != ""
  //   ){
  //     for(var i in this.props.dataSource){
  //
  //       var item = this.props.dataSource[i];
  //
  //       if(!item){
  //         continue;
  //       }
  //
  //       if(item.match(value)){
  //         result.push(item);
  //
  //         if(this.props.maxSearchResults > 0 && this.props.maxSearchResults == result.length){
  //
  //           console.log("dataSource", item);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //
  //   // console.log('result', result);
  //
  //   this.setState({
  //     searchText: value,
  //     data: result,
  //     anchorEl: event.target,
  //     open: true,
  //   });
  // }


  render(){

    var items = [];

    if(this.state.data && this.state.data.length){

      var index = 0;

      this.state.data.map((item) => {
        var i = index;

        items.push(<ListItem
          key={item}
          className={classes.listItem}
          button
          onTouchTap={() => {


            // console.log('onTouchTap', i, index);

            if(this.props.onNewRequest){
              this.props.onNewRequest(item, i);
            }

            this.setState({
              searchText: "",
              open: false,
            });
          }}
        >
          <ListItemText primary={item} />
        </ListItem>);

        index++;
      });
    }

    return <div
      className={["textfield-wrapper", this.props.className].join(" ")}
    >
      <TextField
        aria-owns={this.state.popover_id}
        aria-haspopup="true"
        label={this.props.label}
        error={this.props.error}
        value={this.state.searchText}
        onChange={(event) => {
          this.onChange(event);
        }}
        style={{
          zIndex: 1000,
        }}
      />

      <Popover
        id={this.state.popover_id}
        anchorEl={this.state.anchorEl}
        open={this.state.open && items && items.length > 0}
        onRequestClose={this.handleRequestClose}
        modal={false}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          {items}
        </List>

      </Popover>
    </div>
  }
}

AutoComplete.defaultProps = defaultProps;

AutoComplete.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};