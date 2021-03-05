// @flow
import React, { Component, Fragment } from 'react';
import { Prompt } from 'react-router';
// import db from '../../models';
import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import List from '@material-ui/core/List';
// import Paper from '@material-ui/core/Paper';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';
// import InboxIcon from '@material-ui/icons/Inbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';
// import Typography from '@material-ui/core/Typography';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import { Button, Hidden } from '@material-ui/core';


import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';


// NOTISTACK
// import { withSnackbar } from 'notistack';

// ICON IMPORTS
// import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
// import ClearAll from '@material-ui/icons/ClearAll';
// import Add from '@material-ui/icons/Add';
// import Remove from '@material-ui/icons/Remove';
// import Search from '@material-ui/icons/Search';
// import ArrowBack from '@material-ui/icons/Restore';


// UTIL IMPORTS
import {
    consultarUsuario
  } from '../routes/api-routes';
//import { getTaxesForItem } from '../../utils/taxes';





// const electron = require('electron');
// const ipcRenderer = require('electron').ipcRenderer;


class Venta extends React.Component {




  render() {
    const { classes, opciones } = this.props;
    const { venta, asiento, qtyDefault } = this.state;
    return (
      <Fragment>
ok
      </Fragment>
    );
  }
}

Venta.propTypes = {
  classes: PropTypes.object.isRequired,
  ventaId: PropTypes.string.isRequired
};



export default Venta;
