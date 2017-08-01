import React, {Component} from 'react';

import PropTypes from 'prop-types';

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
  displayFormattedField: 'formattedName',
  closeOnBlur: true,
}

const propTypes = {
  closeOnBlur: PropTypes.bool,
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

  loadData(query){

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

    this.props.onUpdateInput && this.props.onUpdateInput(event);

    var value = event.target.value;

    // var result = this.props.dataSource;

    this.setState({
      searchText: value,
      // data: result,
      anchorEl: event.target,
      open: true,
    }, () => {
      this.loadData(value);
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

  handleAddItem = (event) => {
    let {handleAddItem} = this.props;

    if(handleAddItem){
      handleAddItem();
    }
  }


  handleEditorOpen = (event) => {
    let {handleEditorOpen} = this.props;
    let {dataSource} = this.state;

    let item = this.state.dataSource.find((item) => {
      // console.log('item', item, this.state.value, item[this.props.valueField]);
      return item[this.props.valueField] == this.state.value;
    });

    // console.log('handleEditorOpen 2', item, this.props.valueField);
    // console.log('handleEditorOpen 3', this.state.dataSource);
    // console.log('handleEditorOpen 4', this, this.state.value);

    if(handleEditorOpen){
      handleEditorOpen(item);
    }
  }

  onNewRequest(event, value, item){
    let {
      onNewRequest,
    } = this.props;

    onNewRequest && onNewRequest(event, value, item);
  };


  render(){

    let {
      Editor, 
      EditorProps, 
      handleEditorOpen, 
      disabled, 
      valueField, 
      displayField,
      displayFormattedField,
      popoverStyle,
      onBlur,
      closeOnBlur,
      popover_id,
      connector_url,
      connector_path,
      maxSearchResults,
      searchText,
      dataSource: propsDataSource,
      anchorEl,
      valueFieldType,
      onNewRequest,
      placeholder,
      textFieldProps,
      onUpdateInput,
      ...other
    } = this.props;

    textFieldProps = textFieldProps || {};

    if(placeholder){
      textFieldProps.inputProps = textFieldProps.inputProps || {};

      Object.assign(textFieldProps.inputProps, {
        placeholder,
      });
    }

    let {
      dataSource, 
      value, 
      title,
    } = this.state;

    var items = [];

    popoverStyle = popoverStyle || {};

    popoverStyle = Object.assign({
      maxHeight: 300,
    }, popoverStyle);

    if(dataSource && dataSource.length){

      dataSource.map((item) => {

        var fieldValue = item[valueField];
        var fieldTitle = item[displayField] || value;

        // console.log('items map', item, value, title);

        if(
          value
          && value == fieldValue
          && !title
        ){
          title = fieldTitle || fieldValue;
          // console.log('items title', fieldTitle, fieldValue);
        }

        items.push(<ListItem
          key={items.length}
          className={classes.listItem}
          button
          onTouchTap={(event) => {
            this.setState({
              value: fieldValue,
              title: fieldTitle,
              open: false,
            }, () => {
              this.onNewRequest(event, value, item);
            });
          }}
        >
          <ListItemText primary={item[displayFormattedField] || fieldTitle} />
        </ListItem>);
      });
    }

    // console.log('dataSource', dataSource, items);

    return <div
      className={["textfield-wrapper", this.props.className].join(" ")}
      {...other}
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
            value={this.state.open ? this.state.searchText : title}
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
                searchText: title || value || '',
              });
            }}
            onBlur={(event) => {
              // console.log('onBlur', this);

              /*
                Делаем небольшую паузу, чтобы и было время уловить клик по элементу,
                и меню закрывалось при клике за пределы поля
              */
              if(closeOnBlur){
                setTimeout(() => {
                  this.setState({
                    open: false,
                  });
                }, 250);
              }

              return onBlur ? onBlur(event) : true;
            }}
            // style={{
            //   zIndex: 1000,
            // }}
            {...textFieldProps}
          />
        </Grid>

        {Editor
          ?
            <Grid
              item
            >
              {this.state.value || this.props.item && this.props.item._isDirty
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
                  onTouchTap={this.handleAddItem}
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
        style={popoverStyle}
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
AutoComplete.propTypes = propTypes;

AutoComplete.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};