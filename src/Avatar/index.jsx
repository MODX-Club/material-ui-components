import React, { Component, PropTypes } from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/src/utils/customPropTypes';

import Avatar from 'material-ui/src/Avatar';

const defaultProps = {
  username: "Anonimous",
  type: "medium",
}

export default class AvatarExt extends Component {

  render(){
    // console.log('ui Avatar this.props', this.props);

    const styleSheet = createStyleSheet('ImageAvatars', () => ({
      row: {
        display: 'flex',
        justifyContent: 'center',
      },
      avatar: {
        margin: 0,
      },
      small: {
        width: 30,
        height: 30,
      },
      medium: {
        width: 40,
        height: 40,
      },
      big: {
        width: 100,
        height: 100,
      },
    }));

    const classes = this.context.styleManager.render(styleSheet);

    var classNames = [classes.avatar];

    if(this.props.type && classes[this.props.type]){
      classNames.push(classes[this.props.type]);
    }

    return <div className={classes.row}>
      {this.props.avatar && this.props.avatar != ""
        ?
        <Avatar
          alt={this.props.username}
          src={this.props.avatar}
          className={classNames.join(" ")}
        ></Avatar>
        :
        <Avatar
          alt={this.props.username}
          className={classNames.join(" ")}
        >
          {this.props.username && typeof this.props.username == "string" ? this.props.username.substr(0, 1) : ""}
        </Avatar>
      }
    </div>
  }
}

AvatarExt.defaultProps = defaultProps;

AvatarExt.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
