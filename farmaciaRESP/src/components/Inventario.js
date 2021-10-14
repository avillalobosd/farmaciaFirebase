import React from 'react';
import '../styles/BarraDerecha.css';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { fontSize } from '@material-ui/system';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import Input from '@material-ui/core/Input';p
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import exportFromJSON from 'export-from-json'
// FIREBASE
import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyAV1RFAEI358lpXv_7d81xb0KdRo4f-TEk",
    authDomain: "tienda-aa5d3.firebaseapp.com",
    databaseURL: "https://tienda-aa5d3.firebaseio.com",
    projectId: "tienda-aa5d3",
    storageBucket: "tienda-aa5d3.appspot.com",
    messagingSenderId: "898170837567",
    appId: "1:898170837567:web:346072753502ad054cf68a",
    measurementId: "G-WX90RTSG4S"
  };
  // Initialize Firebase
if (!firebase.apps.length) {
    try {
     firebase.initializeApp(firebaseConfig)
    } catch (err) {
        console.log(err)
    }
}
// db = firebase.firestore();
// firebase.initializeApp(firebaseConfig);
let db=firebase.database()



// import CloseIcon from '@material-ui/icons/Close';
// var PouchDB = require('pouchdb').default;
// var dbinventario = new PouchDB('http://localhost:5984/inventario');





const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));


class Inventario extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            inventario: [],
            tablaInventario:[],
            inputSell: "",
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: 0,
            cantidadAgregar: 0,
            precioUnidad: "",
            activeSearch: false,
            edit: true,
            show: false,
            seleccionado: "",
            productoEditar: null,
            rev: "",
            editCantidad: true,
            editAgregar: true,
            nuevo: false,
            helperCantidad: "",
            helperDescripcion: "",
            helperPrecio: "",
            helperProducto: "",
            helperTipo: "",
            errorCantidad: false,
            errorDescripcion: false,
            errorPrecio: false,
            errorProducto: false,
            errorTipo: false,
            tipoProducto: "Nada",
            inputNombre:"",
            uid:"0"
        };

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onChangeNombre = this._onChangeNombre.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleModifica = this.handleModifica.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleNuevo = this.handleNuevo.bind(this);
        this.handleGuardarCambios = this.handleGuardarCambios.bind(this);
        this.handleClickTable = this.handleClickTable.bind(this);
        this.buscar = this.buscar.bind(this);
        this.putProducto = this.putProducto.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.traeInventario = this.traeInventario.bind(this);

    }

    componentDidMount() {

        firebase.auth().onAuthStateChanged((user)=>{
            this.setState({
                uid: user.uid
            },() => {
                this.traeInventario()

            });

        })

 
    }

    traeInventario(){
        let inventarioFB=db.ref().child(this.state.uid).child("INVENTARIO")
        console.log("SI")
        inventarioFB.on('value', (snapshot) =>{
            // console.log(snapshot.value)
            if(snapshot.val()==null){
                this.setState({
                    inventario: [],
                    tablaInventario: []
                });
            }else{
                // console.log(snapshot.value)
                const data = snapshot.val();
                let array=Object.values(data)
                this.setState({
                    inventario: array,
                    tablaInventario: array
                });

            }

          });

    }

    _onKeyPress(event) {

        if (event.charCode === 13) {
            this.buscar(this.state.inputSell).then(data => {
                if (data.mensaje == "NO") {
                    this.setState({
                        show: true
                    });
                    console.log("NO EXISTE EL PRODUCTO")
                } else {
                    console.log(data.producto);
                    console.log("SI EXISTE EL PRODUCTO")
                    this.handleModifica(data.producto);
                }

            })

        }
    }

    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });


    };

    _onChangeNombre = event => {
        const { name, value } = event.target;
        let nuevaTabla=[]
        this.setState({
            [name]: value
        }, () => {
            var iNombre= this.state.inputNombre;
            
            this.state.inventario.map(function (producto) {
        
                var str = producto.nombre.toLowerCase(); 
                // console.log(this.state.inventario)
                var n = str.search(iNombre.toLowerCase());
    
                if(n>=0){
                    nuevaTabla.push(producto)
                }
                // console.log(nuevaTabla)
             
                })
    
                this.setState({
                    tablaInventario: nuevaTabla
                }
                )

        });

    };



    handleClose = event => {
        this.setState({
            show: false,
            inputSell: ""
        });
    };

    handleCancel = event => {
        this.setState({
            edit: true,
            activeSearch: false,
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: "",
            precioUnidad: "",
            cantidadAgregar: "",
            inputSell: "",
            editCantidad: true,
            errorProducto: false,
            helperProducto: "",
            errorCantidad: false,
            helperCantidad: "",
            errorPrecio: false,
            helperPrecio: ""
        });
    };

    handleNuevo = event => {
        this.setState({
            edit: false,
            activeSearch: true,
            codigo: this.state.inputSell,
            show: false,
            editCantidad: false,
            nuevo: true
        });

    };

    imprimir = () => {
        const data = this.state.inventario
        const fileName = 'Reporte'
        const exportType = 'xls'
        exportFromJSON({ data, fileName, exportType })

    };

    handleClickTable(event) {
        this.setState({
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: "",
            precioUnidad: "",
            cantidadAgregar: "",
            inputSell: ""
        });

        this.buscar(event.target.id).then(data => {
            if (data.mensaje == "NO") {
                this.setState({
                    show: true
                });
                console.log("NO EXISTE EL PRODUCTO")
            } else {
                console.log(data.producto);
                console.log("SI EXISTE EL PRODUCTO")
                this.handleModifica(data.producto);
            }

        })

    };



    handleModifica(producto) {
        this.setState({
            inputSell: "",
            edit: false,
            editAgregar: false,
            activeSearch: true,
            codigo: producto.id,
            nombreProducto: producto.nombre,
            descripcion: producto.descripcion,
            cantidadDisponible: producto.cantidad,
            precioUnidad: producto.precio,
            rev: producto._rev,
            tipoProducto: producto.tipoProducto
        });
    };

    async handleGuardarCambios() {
        this.setState({
            errorProducto: false,
            helperProducto: "",
            errorCantidad: false,
            helperCantidad: "",
            errorPrecio: false,
            helperPrecio: "",
            inputSell: "",
            inputNombre:""
            // tablaInventario: this.state.inventario

        })
        if (this.state.nombreProducto == "" || (this.state.cantidadDisponible == "" && this.state.cantidadDisponible != 0) || this.state.precioUnidad == "" || this.state.tipoProducto == "Nada") {
            if (this.state.nombreProducto == "") {
                this.setState({
                    errorProducto: true,
                    helperProducto: "Campo Requerido"
                })
            }
            if (this.state.cantidadDisponible == "" && this.state.cantidadDisponible != 0) {
                this.setState({
                    errorCantidad: true,
                    helperCantidad: "Campo Requerido"
                })
            }
            if (this.state.precioUnidad == "") {
                this.setState({
                    errorPrecio: true,
                    helperPrecio: "Campo Requerido"
                })
            }

            if (this.state.tipoProducto == "Nada") {
                this.setState({
                    errorTipo: true,
                    helperTipo: "Campo Requerido"
                })
            }

            console.log("FALTA INFORMACION")
        }
        else if (this.state.nuevo == false) {
            var suma = 0;
            if (this.state.cantidadAgregar == null || this.state.cantidadAgregar == "") {
                suma = 0
            } else {
                suma = this.state.cantidadAgregar
            }

            let doc = {
                id: this.state.codigo,
                nombre: this.state.nombreProducto,
                descripcion: this.state.descripcion,
                cantidad: parseInt(suma) + parseInt(this.state.cantidadDisponible),
                precio: this.state.precioUnidad,
                tipoProducto: this.state.tipoProducto,
            }

            await this.putProducto(doc).then(data => {
                this.setState({
                    edit: true,
                    activeSearch: false,
                    codigo: "",
                    nombreProducto: "",
                    descripcion: "",
                    cantidadDisponible: "",
                    precioUnidad: "",
                    cantidadAgregar: "",
                    nuevo: false,
                    editCantidad: true,
                    editAgregar: true
                });






            })
        } else {

            let doc = {
                id: this.state.inputSell,
                nombre: this.state.nombreProducto,
                descripcion: this.state.descripcion,
                cantidad: this.state.cantidadDisponible,
                precio: this.state.precioUnidad,
                tipoProducto: this.state.tipoProducto
            }

            await this.putProducto(doc).then(data => {
                this.setState({
                    edit: true,
                    activeSearch: false,
                    codigo: "",
                    nombreProducto: "",
                    descripcion: "",
                    cantidadDisponible: "",
                    precioUnidad: "",
                    cantidadAgregar: "",
                    nuevo: false,
                    editCantidad: true,
                    editAgregar: true
                });




            })


        }

        
    };



    async putProducto(doc) {
        await db.ref().child(this.state.uid).child("INVENTARIO").child(doc.id).set(doc)
        return doc;

    };

    async buscar(codigo) {
        let ret = {
            mensaje: "NO",
            producto: {}
        }


        this.state.inventario.map(function (ok) {
            if (ok.id == codigo) {
                let productoEditar = ok;


                ret.mensaje = "SI";
                ret.producto = ok;
            }
        })
        return ret;

    };



    handleShow() {
        this.setState({
            show: true
        });
    };

    render() {
        return (
            <Grid container style={{ backgroundColor: '#dddddd' }} >

                <Grid item xs={1} style={{ backgroundColor: '#dddddd' }}  ></Grid>
                <Grid item xs={6}>
                    {/* <Grid textAlign={'center'} xs={2} container style={{ backgroundColor: '#dddddd', height: '100vh' }} > </Grid> */}
                    <Grid style={{ backgroundColor: '#dddddd', height: '100%' }} >

                        <FormControl fullWidth noValidate autoComplete="off">

                            <TextField
                                disabled={this.state.activeSearch}
                                name={"inputSell"}
                                onChange={this._onChange}
                                onKeyPress={this._onKeyPress}
                                id="outlined-basic" variant="outlined"
                                value={this.state.inputSell}
                                style={{ width: "100%", marginTop: "50px" }}
                                label="Buscar por Codigo (LECTOR DE BARRAS)" 
                                size="small"
                                />
                                

                            <TextField
                                disabled={this.state.activeSearch}
                                name={"inputNombre"}
                                onChange={this._onChangeNombre}
                                // onKeyPress={this._onKeyPress}
                                id="outlined-basic"
                                variant="outlined"
                                value={this.state.inputNombre}
                                style={{ width: "100%", marginTop: "7px" }}
                                label="Buscar por Nombre (TECLADO)"
                                size="small" />

                            <List>

                                <Paper style={{ overflow: 'auto', height: '55vh', marginTop: "5px" }}>

                                    <div >

                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">ID</TableCell>
                                                    <TableCell align="center">Nombre</TableCell>
                                                    {/* <TableCell align="right">Descripcion</TableCell> */}
                                                    <TableCell align="center">Cantidad Disponible</TableCell>
                                                    <TableCell align="center">Tipo</TableCell>
                                                    <TableCell align="center">Precio Unidad</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {this.state.tablaInventario.map((producto, index, key) => {


                                                    return (
                                                        <TableRow hover id={producto.id} onClick={this.handleClickTable} key={index}>
                                                            <TableCell id={producto.id} align="center">{producto.id}</TableCell>
                                                            <TableCell id={producto.id} align="center">{producto.nombre}</TableCell>
                                                            {/* <TableCell align="right">{producto.descripción}</TableCell> */}
                                                            <TableCell id={producto.id} align="center">{producto.cantidad}</TableCell>
                                                            <TableCell id={producto.id} align="center">{producto.tipoProducto}</TableCell>
                                                            <TableCell id={producto.id} align="center">{producto.precio}</TableCell>

                                                        </TableRow>

                                                    )
                                                })}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </Paper>

                            </List>

                        </FormControl>

                        <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">


                            <Button variant="contained" color="primary" onClick={(e) => this.imprimir()}>Exportar Excel</Button >

                        </ButtonGroup>

                    </Grid>


                </Grid>




                <Grid item xs={1} style={{ backgroundColor: '#dddddd', height: '100vh' }}></Grid>
                <Grid item xs={4}>

                    <TextField
                        disabled={true}
                        label="Codigo"
                        name={"codigo"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.codigo}
                        style={{
                            width: "90%",
                            marginTop: "50px"
                        }} />

                    <TextField
                        error={this.state.errorProducto}
                        helperText={this.state.helperProducto}
                        disabled={this.state.edit}
                        label="Nombre Producto"
                        name={"nombreProducto"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.nombreProducto}
                        style={{ width: "40%", marginTop: "50px" }} />

                    <FormControl variant="filled">
                        <Select
                            error={this.state.errorTipo}
                            helperText={this.state.helperTipo}
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="tipoProducto"
                            label="Tipo Producto"
                            value={this.state.tipoProducto}
                            onChange={this._onChange}
                            style={{ width: "100%", marginTop: "50px" }}
                            disabled={this.state.edit}

                        >   <MenuItem disabled value="Nada">
                                <em>Tipo de Producto</em>
                            </MenuItem>
                            <MenuItem value="Medicamento">Medicamento</MenuItem>
                            <MenuItem value="Procedimiento">Procedimiento</MenuItem>
                            <MenuItem value="Consulta">Consulta</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        error={this.state.errorDescripcion}
                        helperText={this.state.helperDescripcion}
                        disabled={this.state.edit}
                        label="Descripción"
                        name={"descripcion"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.descripcion}
                        style={{ width: "90%", marginTop: "50px" }} />

                    <TextField
                        error={this.state.errorCantidad}
                        helperText={this.state.helperCantidad}
                        disabled={this.state.editCantidad}
                        type="number"
                        label="Disponible"
                        name={"cantidadDisponible"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.cantidadDisponible}
                        style={{ width: "40%", marginTop: "50px" }} />

                    <TextField
                        disabled={this.state.editAgregar}
                        type="number" label="Agregar"
                        name={"cantidadAgregar"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.cantidadAgregar}
                        style={{ width: "40%", marginTop: "50px" }} />

                    <TextField
                        error={this.state.errorPrecio}
                        helperText={this.state.helperPrecio}
                        disabled={this.state.edit}
                        type="number"
                        label="Precio Unidad"
                        name={"precioUnidad"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.precioUnidad}
                        style={{ width: "90%", marginTop: "50px" }} />



                    <br></br><br></br><br></br>

                    <Button
                        disabled={this.state.edit} variant="outlined" color="primary" onClick={this.handleGuardarCambios}>Guardar</Button>
                    <Button disabled={this.state.edit} variant="outlined" color="secondary" onClick={this.handleCancel}>Cancelar</Button>
                </Grid>

                <Dialog
                    open={this.state.show}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"No se encuentra Producto en el Inventario"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Desea agregar el producto?
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleNuevo} color="primary">
                            Si
          </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            No
          </Button>
                    </DialogActions>
                </Dialog>




            </Grid>


        );
    }
}

export default Inventario;