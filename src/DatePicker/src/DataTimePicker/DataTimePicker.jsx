/**
 * Created by i.lovenkov on 20.11.16.
 */

'use strict';

import React, { Component, PropTypes } from 'react';

import Button from 'material-ui/src/Button';
import Paper from 'material-ui/src/Paper';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

import { Calendar, Clock } from '../';


const defaultProps = {
  showCalendar: true,
  showClock: true,
  type: true,
  year: moment().format("YYYY"),
  month: moment().format("MMMM"),
  weekday: moment().format("dddd"),
  day: moment().format("DD"),
  hours: moment().format("HH"),
  minutes: moment().format("mm"),
}

export default class DataTimePicker extends Component {
    static propTypes = {
        clickOnCancel:       PropTypes.func,
        clickOnOK:           PropTypes.func,
        day:                 PropTypes.string,
        handleChangeDay:     PropTypes.func,
        handleChangeHours:   PropTypes.func,
        handleChangeMinutes: PropTypes.func,
        handleChangeMonth:   PropTypes.func,
        handleChangeType:    PropTypes.func,
        hours:               PropTypes.string,
        minutes:             PropTypes.string,
        month:               PropTypes.string,
        show:                PropTypes.bool,
        showCalendar:        PropTypes.bool,
        showClock:           PropTypes.bool,
        type:                PropTypes.bool,
        weekday:             PropTypes.string,
        year:                PropTypes.string,
    };

    // constructor(props) {
    //     super(props);
    //     this.displayName = "DataTimePicker";
    //
    //     this.state = {
    //         day:          moment().format("DD"), // день
    //         hours:        moment().format("HH"), // часы
    //         minutes:      moment().format("mm"), // минуты
    //         month:        moment().format("MMMM"), // месяц
    //         show:         true,
    //         showCalendar: true,
    //         showClock:    false,
    //         type:         true, // активная вкладка: false - часы, true - календарь
    //         weekday:      moment().format("dddd"), // день недели
    //         year:         moment().format("YYYY"), // год
    //     };
    // }

      constructor(props) {
        super(props);

        moment.locale('ru');

        /**
         * Состояние, где будут хранится параметры компонента
         */
        this.state = {
          year: props.year, // год
          month: props.month, // месяц
          weekday: props.weekday, // день недели
          day: props.day, // день
          hours: props.hours, // часы
          minutes: props.minutes, // минуты
          showCalendar: props.showCalendar, // покаывать календарь
          showClock: props.showClock, // показывать часы
          type: props.type, // активная вкладка
        }
      }

    /**
     * Вызов "родного" обработчика или того, что передали
     * @param props
     * @param arg
     * @param lastFunc
     * @private
     */
    _checkFunc = (props, arg, lastFunc) => {
        if (this.props.hasOwnProperty(props) && this.props[props] instanceof Function) {
            this.props[props](this, arg, lastFunc);
        } else {
            lastFunc();
        }
    };

    /**
     * Свойства из props в state
     * @param nextProps
     * @private
     */
    _props2state = (nextProps = this.props) => {
        const { _checkProp } = this,
            { day, hours, minutes, month, show, showCalendar, showClock, type, weekday, year } = nextProps;

        _checkProp('day', day);
        _checkProp('hours', hours);
        _checkProp('minutes', minutes);
        _checkProp('month', month);
        _checkProp('show', show);
        _checkProp('showCalendar', showCalendar);
        _checkProp('showClock', showClock);
        _checkProp('type', type);
        _checkProp('weekday', weekday);
        _checkProp('year', year);
    };

    /**
     * Проверка наличия свойств в props
     * @param name
     * @param props
     * @private
     */
    _checkProp = (name, props) => {
        let result = this.state;

        if (this.props.hasOwnProperty(name) && this.props[name] != undefined) {
            result[name] = props;
            this.setState(result);
        }
    };

    /**
     * Обработчик изменения активной вкладки (календарь/часы)
     * @param type
     */
    handleChangeType = (type) => {
        const f = () => {
            this.setState({
                type: type
            });
        };

        this._checkFunc('handleChangeType', { type: type }, f);
    };

    /**
     * Обработчик изменения месяца
     * @param newMonth
     */
    handleChangeMonth = (newMonth) => {
        const f = () => {
            const { day, month, year } = this.state;

            if (month === "декабрь" && newMonth === "январь") { // для переключения на следующий год
                const newYear = String(parseInt(year, 10) + 1);

                this.setState({
                    month:   newMonth,
                    year:    newYear,
                    weekday: moment(`${newYear}-${newMonth}-${day}`, 'YYYY-MMMM-DD').format('dddd')
                });
            } else if (month === "январь" && newMonth === "декабрь") { // для переключения на предыдущий год
                const newYear = String(parseInt(year, 10) - 1);

                this.setState({
                    month:   newMonth,
                    year:    newYear,
                    weekday: moment(`${newYear}-${newMonth}-${day}`, 'YYYY-MMMM-DD').format('dddd')
                });
            } else {
                this.setState({
                    month:   newMonth,
                    weekday: moment(`${year}-${newMonth}-${day}`, 'YYYY-MMMM-DD').format('dddd')
                });
            }
        };

        this._checkFunc('handleChangeMonth', { newMonth: newMonth }, f);
    };

    /**
     * Обработчик изменения дня
     * @param day
     */
    handleChangeDay = (day) => {
        const f = () => {
            this.setState({
                day:     day,
                weekday: moment(`${day}`, 'DD').format('dddd'),
            // }, this.clickOnOK);
            });
        };

        this._checkFunc('handleChangeDay', { day: day }, f);
    };

    /**
     * Обработчик изменения часов
     * @param hours
     */
    handleChangeHours = (hours) => {
        const f = () => {
            this.setState({
                hours: moment(String(hours), "HH").format("HH")
            });
        };

        this._checkFunc('handleChangeHours', { hours: hours }, f);
    };

    /**
     * Обработчик изменения минут
     * @param minutes
     */
    handleChangeMinutes = (minutes) => {
        const f = () => {
            this.setState({
                minutes: moment(String(minutes), "mm").format("mm")
            });
        };

        this._checkFunc('handleChangeMinutes', { minutes: minutes }, f);
    };

    /**
     * Обработчик нажатия на кнопку Cancel
     */
    clickOnCancel = () => {
        const f = () => {
            this.setState((prevState, props) => {
                return {
                    show: !prevState.show,
                };
            });
        };

        this._checkFunc('clickOnCancel', {}, f);
    };

    /**
     * Обработчик нажатия на кнопку OK
     */
    clickOnOK = () => {
        const f = () => {
            this.setState((prevState, props) => {
                return {
                    show: !prevState.show,
                };
            });
        };

        this._checkFunc('clickOnOK', {}, f);
    };

    stateToDate(){
      let {year, month, day, hours, minutes} = this.state;

      return moment(`${year}-${month}-${day} ${hours}:${minutes}`, 'YYYY-MMMM-DD HH:mm');
    }

    componentDidMount() {
        this._props2state();
    }

    componentWillReceiveProps(nextProps) {
        this._props2state(nextProps);
    }



    render() {

    const { day, hours, minutes, month, showCalendar, showClock, type, weekday, year } = this.state,
      { clickOnCancel, clickOnOK, handleChangeDay, handleChangeHours, handleChangeMinutes, handleChangeMonth, handleChangeType } = this;

    let body, button, picker;

    if (type) {
      if (showCalendar) {
        body = (
          <Calendar
            day={ day }
            handleChangeDay={ handleChangeDay }
            handleChangeMonth={ handleChangeMonth }
            month={ month }
            year={ year }
          />
        );
      }
    } else {
      if (showClock) {
        body = (
          <Clock
            handleChangeHours={ handleChangeHours }
            handleChangeMinutes={ handleChangeMinutes }
            hours={ hours }
            minutes={ minutes }
          />
        );

      }
    }

    button = (
      <div className="modal-btns">
          <Button
            primary
            onTouchTap={ clickOnCancel }
          >
              Отмена
          </Button>

          <Button
            accent
            onTouchTap={ clickOnOK }
          >
              OK
          </Button>
      </div>
    );

    let buttonCalendar,
      buttonClock;

    if (showCalendar && showClock) {
      buttonCalendar = (
        <input
          className="c-datepicker__toggle c-datepicker__toggle--left  c-datepicker--show-calendar"
          type="radio"
          name="date-toggle"
          value="calendar"
          defaultChecked={ type }
          onClick={ () => handleChangeType(true) }
        />
      );

      buttonClock = (
        <input
          className="c-datepicker__toggle c-datepicker__toggle--right c-datepicker--show-time"
          type="radio"
          name="date-toggle"
          value="time"
          defaultChecked={ !type }
          onClick={ () => handleChangeType(false) }
        />
      );
    }

    return (
      <Paper
        className="date-time-picker"
        elevation={4}
      >
          <div className="c-datepicker c-datepicker--open">
            { buttonClock }
            { buttonCalendar }
              <div className="c-datepicker__header">
                  <div className="c-datepicker__header-day">
                      <span className="js-day">{ weekday }</span>
                  </div>
                  <div className="c-datepicker__header-date">
                              <span
                                className="c-datepicker__header-date__month js-date-month">{ month } { year }</span>
                      <span className="c-datepicker__header-date__day js-date-day">{ day }</span>
                      <span className="c-datepicker__header-date__time js-date-time">
                                  <span className="c-datepicker__header-date__hours js-date-hours">{ hours }</span>:
                                  <span
                                    className="c-datepicker__header-date__minutes js-date-minutes">{ minutes }</span>
                              </span>
                  </div>
              </div>

            { body }

            { button }
          </div>
      </Paper>
    );
  }
}

DataTimePicker.defaultProps = defaultProps;