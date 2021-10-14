import React from 'react';
import '../styles/NavBar.css';
// import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { fontSize } from '@material-ui/system';
// import { Link } from 'react-router-dom';



const button = {
    fontSize:"30px", 
    height: "80px"
  };

const BottomBar = () => (

    <div className="top botones">

      <Grid item xs={12} md={12}>
        <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">
          <Button style={button} onClick={event =>  window.location.href='#venta'}>Venta</Button >
          <Button style={button} onClick={event =>  window.location.href='#inventario'}>Inventario</Button>
          <Button style={button} onClick={event =>  window.location.href='#reportes'}>Reportes</Button>
          <Button style={button} onClick={event =>  window.location.href='#configuracion'}>Configuracion</Button>
        </ButtonGroup>
      </Grid>

    </div>

);

export default BottomBar;