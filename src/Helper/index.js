import React, {Component} from 'react';

import Help from 'material-ui-icons/Help';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';

const styleSheet = createStyleSheet('FullScreenDialog', {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

var classes;

const defaultProps = {
  contrastIcons: true,
}

export default class Helper extends Component{

	constructor(props){

		super(props);

		this.state = {
			open: false,
		}
	}


  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  componentWillMount(){

    classes = this.context.styleManager.render(styleSheet);
  }

	componentDidMount(){

	}

  componentDidUpdate(){

    if(this.props.debug){
      console.log("Help componentDidUpdate", this);
    }
  }

	render(){

    let {closeIconProps, iconProps, contrastIcons, ...other} = this.props;

		return <IconButton
      onTouchTap={() => this.setState({
      	open: true,
      })}
      contrast={contrastIcons}
      {...iconProps}
    >
      <Help /> 
      <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={<Slide direction="down" />}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography type="title" colorInherit className={classes.flex}>
                Справка
              </Typography>
              <Button 
                onTouchTap={this.handleRequestClose}
                contrast={contrastIcons || true}
                {...closeIconProps}
              >
                Закрыть
              </Button>
            </Toolbar>
          </AppBar>
          
          {this.props.children}

        </Dialog>
    </IconButton> ;
	}
}

Helper.defaultProps = defaultProps;

Helper.contextTypes = {
  styleManager: customPropTypes.muiRequired,
}
