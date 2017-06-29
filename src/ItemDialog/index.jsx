import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import SaveIcon from 'material-ui-icons/Save';
import Helper from 'material-ui-components/src/Helper';
 

export default class ItemDialog extends Component {
  state = {
    open: false,
  };

  // onRequestClose = () => {
  //   this.setState({ open: false });
  // };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const {
      classes, 
      title, 
      item, 
      saveItem, 
      helper,
      open,
      ...other
    } = this.props; 

    return <Dialog
      fullScreen
      open={open}
      onRequestClose={this.props.onRequestClose}
      transition={<Slide direction="down" />}
    >
      <AppBar className={classes.dialogAppBar}>
        <Toolbar>
          <Typography type="title" colorInherit className={classes.flex}>
            {title}
          </Typography>
           

          {item._isDirty 
            ? <IconButton contrast onClick={() => {saveItem(item)}}>
              <SaveIcon 
                color="red"
              />
            </IconButton> 
            : null
          }

          {helper
            ? 
            <Helper
            >
              {helper}
            </Helper> 
            : null
          }

          <IconButton contrast onClick={this.props.onRequestClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid
        item
        xs
        style={{
          overflow: 'auto',
        }}
      >

        {this.props.children}
      </Grid>
    </Dialog>;
  }
}

ItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  saveItem: PropTypes.func.isRequired,
}; 