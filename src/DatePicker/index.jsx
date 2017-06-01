import './styles.less';

import React, {Component} from 'react';

import customPropTypes from 'material-ui/utils/customPropTypes';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import {DataTimePicker, Calendar, Clock } from './src';

import TextField from 'material-ui/TextField';

import moment from 'moment';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

window.moment = moment;

const defaultProps = {
  label: "",
  value: new Date(),
  open: false,
  format: "YYYY-MM-DD",
  // format: "YYYY-MM-DD HH:mm",
}


const styleSheet = createStyleSheet('DatePicker', (theme) => ({
  root: {
  },
  DialogPaper: {

    width: 'auto',
  },
}));

var classes;

export default class DatePicker extends Component{

  constructor(props){

    super(props);

    this.state = {
      value: this.prepareValue(props.value),
      open: props.open,
    }
  }

  prepareValue(date){
    return date && moment(date).format('YYYY-MM-DD HH:mm') || "";
  }

  componentVillReceivProps(nextProps, nestState){

    if(nextProps.value != this.props.value){
      this.setState({
        value: this.prepareValue(nextProps.value),
      });
    }

    return true;
  }

  componentWillMount(){

    classes = this.context.styleManager.render(styleSheet);
  }

  render(){

    var date = {
      minutes: "00",
      hours: "15",
    }

    if(this.state.value){

      var d = moment(this.state.value, "YYYY-MM-DD HH:mm");

      date = {
        year: d.format('YYYY'),
        month: d.format('MMMM'),
        day: d.format('DD'),
        hours: d.format('HH'),
        minutes: d.format('mm'),
      };
    }

    return <div>
      <TextField
        {...this.props}
        value={this.state.value && moment(this.state.value).isValid() && moment(this.state.value).format(this.props.format)|| ""}
        onClick={() => {
          if(!this.state.open){
            this.setState({
              open: true,
            });
          }
        }}
      >

      </TextField>

      <Dialog
        open={this.state.open}
        paperClassName={classes.DialogPaper}
      >
        <DataTimePicker
          {...this.props}
          type={true}
          {...date}
          clickOnCancel={() => {
            this.setState({
              open: false,
            })
          }}
          clickOnOK={(datePicker) => {
            /*console.log('clickOnOK', datePicker.stateToDate());
            console.log('stateToDate', datePicker.stateToDate());
            console.log('stateToDate date', datePicker.stateToDate().format("YYYY-MM-DD HH:mm"));*/

            var value = datePicker.stateToDate().format("YYYY-MM-DD HH:mm");

            this.setState({
              open: false,
              value: value,
            }, () => {
              if(this.props.onChange){
                this.props.onChange(value);
              }
            });
          }}
        />
      </Dialog>
    </div>
  }

  // render(){
  //
  //   return <DataTimePicker
  //     {...this.props}
  //   >
  //
  //   </DataTimePicker>
  // }

}

DatePicker.defaultProps = defaultProps;

DatePicker.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
