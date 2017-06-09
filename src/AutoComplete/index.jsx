import React, {Component} from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui-icons/AddCircle';
import ViewIcon from 'material-ui-icons/RemoveRedEye';

import Popover from '../Popover';

import lodash from 'lodash';

import List, {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from 'material-ui/List';

const defaultProps = {
  // input_id: lodash.uniqueId('autocomplete_'),
  popover_id: lodash.uniqueId('popover_'),
  label: "",
  connector_url: "",
  connector_path: "",
  maxSearchResults: 10,
  searchText:"",
  dataSource:[],
  anchorEl: null,
  local: true,    // If remote, get data from server
  value: '',
  title: '',
  valueField: 'id',
  valueFieldType: 'int',
  displayField: 'name',
}

const styleSheet = createStyleSheet('AutoComplete', (theme) => ({
  menu: {},
  content: {
  },
  listItem: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  disabled: {
    color: theme.palette.text.disabled
  },
}));

var classes;

export default class AutoComplete extends Component {

  constructor(props) {

    super(props);

    this.state = {
      // input_id: props.input_id,
      value: props.value,
      title: props.title,
      popover_id: props.popover_id,
      searchText: props.searchText,
      dataSource: props.dataSource,
      open: false,
      inRequest: false,
    };

    // console.log('AutoComplete', this.state, props);
  }

  loadData = query => {

    if(
      this.state.inRequest === true
      || this.props.local
      || !this.props.connector_url
      || !this.props.connector_path
    ){
      return;
    }

    var body = new FormData();

    var data = {
      format: "json",
      query: query,
    };

    for(var i in data){

      var value = data[i];

      if(value === null || value === undefined){
        continue;
      }

      body.append(i, value);
    };


    var newState = {
      errors: {
      },
      inRequest: false,
    }

    fetch(this.props.connector_url +'?pub_action='+ this.props.connector_path +'getdata',{
      credentials: 'same-origin',
      method: "POST",
      body: body,
    })
      .then(function (response) {

        return response.json()
      })
      .then(function (data) {

        if(data.success){

          var options = [];

          data.object.map((item) => {

            var value = item[this.props.valueField] || '';
            var title = item[this.props.displayField] || '';

            if(this.props.valueFieldType == 'int'){
              value = Number(value);
            }

            var option = item;

            Object.assign(option, {
              value: value,
              title: title,
            });

            options.push(option);
          });

          newState.dataSource = options;

          // console.log('AutoComplite newState', newState);
        }
        else{

          if(data.data && data.data.length){

            data.data.map(function(error){
              if(error.msg != ''){
                errors[error.id] = error.msg;
              }
            }, this);
          }
          console.error('Request failed', error, errors);
        }

        // if(!this.state.errors){
        //   this.state.errors = {};
        // }

        // Object.assign(this.state.errors, errors.login_error);

        this.setState(newState);

      }.bind(this))
      .catch((error) => {
          console.error('Request failed', error);
          this.setState(newState);
        }
      );

    this.setState({
      inRequest: true,
    });
  }


  onChange(event){
    // console.log("onChange", event.target.value);

    // this.props.onChange && this.props.onChange(event);

    var value = event.target.value;

    // var result = this.props.dataSource;

    this.loadData(value);

    this.setState({
      searchText: value,
      // data: result,
      anchorEl: event.target,
      open: true,
    });
  }


  componentWillMount() {

    classes = this.context.styleManager.render(styleSheet);
  }

  componentDidMount(){
    this.loadData();
  }


  componentWillReceiveProps(nextProps){

    var newState = {};

    if(nextProps.dataSource != this.props.dataSource){
      newState.dataSource = nextProps.dataSource;
    }

    if(nextProps.value != this.props.value){
      newState.value = nextProps.value;
    }

    if(nextProps.title != this.props.title){
      newState.title = nextProps.title;
    }

    this.setState(newState);

    return true;
  }

  componentDidUpdate(prevProps, prevState){

    if(!lodash.isEqual(this.state.dataSource || '', prevState.dataSource || '')){
      this.props.onDataChange && this.props.onDataChange(this.state.dataSource);
    }

    if(
      prevState.value != this.state.value
      || prevState.title != this.state.title
    ){
      this.props.onChange && this.props.onChange({
        target: {
          name: this.props.name,
          value: this.state.value,
        },
      }, 
      this.state.value, 
      {
        value: this.state.value,
        title: this.state.title,
      });
    }
  }

  handleEditorOpen = (event) => {
    let {handleEditorOpen} = this.props;
    let {dataSource} = this.state;

    let item = this.state.dataSource.find((item) => {return item[this.props.valueField] == this.state.value});

    // console.log('handleEditorOpen 2', item);

    if(handleEditorOpen){
      handleEditorOpen(item);
    }
  }


  render(){

    let {Editor, EditorProps, handleEditorOpen, disabled} = this.props;
    let {dataSource, value, title} = this.state;

    var items = [];

    if(dataSource && dataSource.length){

      var index = 0;

      dataSource.map((item) => {

        var value = item.value;
        var title = item.title || item.value;

        items.push(<ListItem
          key={index}
          className={classes.listItem}
          button
          onTouchTap={(event) => {

            // console.log('onTouchTap', event);

            if(this.props.onNewRequest){
              // this.props.onNewRequest(item, index);
              this.props.onNewRequest(event, value, item);
            }

            this.setState({
              value: value,
              title: title,
              open: false,
            });
          }}
        >
          <ListItemText primary={title} />
        </ListItem>);

        index++;
      });
    }

    // console.log('dataSource', dataSource, items);

    return <div
      className={["textfield-wrapper", this.props.className].join(" ")}
    >
      {/* this.state.open 
        ? 
          <TextField
            aria-owns={this.state.popover_id}
            aria-haspopup="true"
            label={this.props.label}
            error={this.props.error}
            value={this.state.searchText}
            onChange={(event) => {
              this.onChange(event);
            }}
            // style={{
            //   zIndex: 1000,
            // }}
          />
        : 

        <TextField
          aria-owns={this.state.popover_id}
          aria-haspopup="true"
          label={this.props.label}
          error={this.props.error}
          value={this.state.searchText}
          onChange={(event) => {
            this.onChange(event);
          }}
          // style={{
          //   zIndex: 1000,
          // }}
        />
      */}


      <Grid 
        container
        align="flex-end"
        gutter={0}
      >
        <Grid
          item
          xs
        >

          <TextField
            // inputClassName={[disabled ? classes.disabled : ""].join(" ")}
            disabled={disabled}
            aria-owns={this.state.popover_id}
            aria-haspopup="true"
            label={this.props.label}
            error={this.props.error}
            value={this.state.open ? this.state.searchText : this.state.title}
            onChange={(event) => {
              if(disabled){
                return;
              }

              this.onChange(event);
            }}
            onFocus={(event) => {
              if(disabled){
                return;
              }

              this.setState({
                open: true,
                searchText: this.state.title || this.state.value || '',
              });
            }}
            // style={{
            //   zIndex: 1000,
            // }}
          />
        </Grid>

        {Editor
          ?
            <Grid
              item
            >
              {this.state.value 
                ?
                <IconButton
                  onTouchTap={this.handleEditorOpen}
                >
                  <ViewIcon />
                </IconButton>
                : null
              }


              {!disabled 
                ?
                <IconButton
                  onTouchTap={this.handleEditorOpen}
                >
                  <AddIcon />
                </IconButton>
                : null
              }

             

              <Editor
                {...EditorProps}
                // open={this.state.EditorOpen}
                // onSave={(event) => {console.log('AutoComplete onSave', event)}}
              />
            </Grid> 
          :
          null
        }
      </Grid>

      <Popover
        id={this.state.popover_id}
        anchorEl={this.state.anchorEl}
        open={this.state.open && items && items.length > 0}
        onRequestClose={this.handleRequestClose}
        modal={false}
        positions={{
          top: 'inherit',
        }}
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'left',
        // }}
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