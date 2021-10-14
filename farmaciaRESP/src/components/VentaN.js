import React from 'react';
import '../styles/BarraDerecha.css';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { fontSize } from '@material-ui/system';
import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
var PouchDB = require('pouchdb').default;
var dbenventa = new PouchDB('http://localhost:5984/enventa');
var dbinventario = new PouchDB('http://localhost:5984/inventario');
var dbVentas = new PouchDB('http://localhost:5984/ventas');

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


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


class Venta extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            brand: "Ford",
            model: "Mustang",
            color: "red",
            year: 1964,
            enventa: [],
            inputSell: "",
            inventario: [],
            productoAgregar: "",
            show: false,
            folios: "",
            disabled: false,
            autofocus: true,
            adding: true,
            suma: 0,
            showMetodoPago: false,
            showFolio: false,
            name: "",
            folio: ""

        };

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onChange = this._onChange.bind(this);
        this.getAllenventa = this.getAllenventa.bind(this);
        this.getAllinventario = this.getAllinventario.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleNuevo = this.handleNuevo.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.agregarVenta = this.agregarVenta.bind(this);
        this.pagar = this.pagar.bind(this);
        this.handleCloseMetodoPago = this.handleCloseMetodoPago.bind(this);
        this.handleEfectivo = this.handleEfectivo.bind(this);
        this.handleTarjeta = this.handleTarjeta.bind(this);
        this.handleAceptarFolio = this.handleAceptarFolio.bind(this);
        this.handleCloseFolio = this.handleCloseFolio.bind(this);

    }

    componentDidMount() {


        this.getAllenventa().then(data => {

            let array = Object.values(data);

            this.setState({
                enventa: array.reverse(),
                disabled: false,
                autofocus: true
            });
            // console.log(this.state.enventa);

        })

        this.getAllinventario().then(data => {
            let array = Object.values(data);
            this.setState({
                inventario: array
            });
            // console.log(this.state.inventario);

        })



    }

    async getAllenventa() {
        let allNotes = await dbenventa.allDocs({ include_docs: true });
        let notes = {}
        let suma = 0

        allNotes.rows.forEach(n => notes[n.id] = n.doc);
        let array = Object.values(notes);

        array.map((sale) => {
            suma = suma + parseFloat(sale.precio)
        })
        this.setState({
            suma: suma.toFixed(2)
        });

        return notes;
    };


    async getAllinventario() {
        let allNotes = await dbinventario.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);

        return notes;
    };


    async pagar() {
        this.setState({
            showMetodoPago: true
        });

    };

    async handleEfectivo() {
        this.setState({
            showMetodoPago: false,
            inputSell: ""
        });

        let sumaF = this.state.suma

        let allNotes = await dbVentas.allDocs({ include_docs: true });

        let dt = new Date();
        let anio = (dt.getFullYear())
        let mesN = (dt.getMonth()) + 1
        let mes;
        if (mesN < 10) {
            mes = "0" + mesN.toString()
        }
        let diaN = (dt.getDate())
        let dia;
        if (diaN < 10) {
            dia = "0" + diaN.toString()
        }
        let enventa = this.state.enventa;
        let formatoId = anio.toString() + "-" + mes + "-" + dia;



        dbVentas.get(formatoId, function callback(err, doc) {

            if (!err) {
                console.log("NO ERR")
                console.log(doc)
                let prod = { total: sumaF, tipoPago: { efectivo: sumaF, tarjeta: { monto: 0, folio: "AAA" } }, prod: enventa }
                doc.venta.push(prod)
                console.log(doc)
                dbVentas.put(doc, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully added a sell!');
                    }

                });




            } else {
                console.log("ERROR")
                // let suma=this.state.suma;
                let prod = [{ total: sumaF, tipoPago: { efectivo: sumaF, tarjeta: { monto: 0, folio: "AAA" } }, prod: enventa }]
                let ventaUnica = { _id: formatoId, anio: anio, mes: mes, dia: dia, total: 0, venta: prod }
                dbVentas.put(ventaUnica, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully posted a todo!');
                    }

                });
                console.log("ERROR")
            }
        });
        dbenventa.destroy().then(function (response) {
            console.log("BORRADA")
        }).catch(function (err) {
            console.log(err);
        });

        this.componentDidMount();
        window.location.reload();
    };


    handleTarjeta = event => {
        this.setState({
            showMetodoPago: false,
            inputSell: "",
            showFolio: true
        });
    };




    async agregarVenta(productoAgregar) {

        if (this.state.adding == false) {
            console.log("Agregando esperar")
        }
        else {
            console.log(this.state.adding)
            let prodAct = productoAgregar;
            prodAct.cantidad = prodAct.cantidad - 1;
            let agregarVenta = {
                _id: new Date().toISOString(),
                idInv: productoAgregar._id,
                revInv: productoAgregar._rev,
                producto: productoAgregar.nombre,
                codigo: productoAgregar.id,
                cantidad: 1,
                precio: productoAgregar.precio,
                cerrado: false
               
            }
            await dbenventa.put(agregarVenta, function callback(err, result) {
                if (!err) {
                    console.log('Successfully posted a todo!');
                }

            });


            await dbinventario.put(prodAct);


            await this.getAllenventa().then(data => {
                let array = Object.values(data);
                this.setState({
                    enventa: array.reverse()
                });

            })
            await this.getAllinventario().then(data => {
                let array = Object.values(data);
                this.setState({
                    inventario: array
                });

            })
        }


    };

    async handleAceptarFolio (){
        this.setState({
            showFolio: false,
            inputSell: ""
        });

        let sumaF = this.state.suma
        let folio= this.state.folio

        let allNotes = await dbVentas.allDocs({ include_docs: true });

        let dt = new Date();
        let anio = (dt.getFullYear())
        let mesN = (dt.getMonth()) + 1
        let mes;
        if (mesN < 10) {
            mes = "0" + mesN.toString()
        }
        let diaN = (dt.getDate())
        let dia;
        if (diaN < 10) {
            dia = "0" + diaN.toString()
        }
        let enventa = this.state.enventa;
        let formatoId = anio.toString() + "-" + mes + "-" + dia;



        dbVentas.get(formatoId, function callback(err, doc) {

            if (!err) {
                console.log("NO ERR")
                console.log(doc)
                let prod = { total: sumaF, tipoPago: { efectivo: 0, tarjeta: { monto: sumaF, folio: folio} }, prod: enventa }
                doc.venta.push(prod)
                console.log(doc)
                dbVentas.put(doc, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully added a sell!');
                    }

                });




            } else {
                console.log("ERROR")
                // let suma=this.state.suma;
                let prod = [{ total: sumaF, tipoPago: { efectivo: 0, tarjeta: { monto: sumaF, folio: folio } }, prod: enventa }]
                let ventaUnica = { _id: formatoId, anio: anio, mes: mes, dia: dia, total: 0, venta: prod }
                dbVentas.put(ventaUnica, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully posted a todo!');
                    }

                });
                console.log("ERROR 2")
            }
        });
        dbenventa.destroy().then(function (response) {
            console.log("BORRADA")
        }).catch(function (err) {
            console.log(err);
        });

        this.componentDidMount();
        window.location.reload();

        
    }


    handleClose = event => {
        this.setState({
            show: false,
            inputSell: ""
        });
    };

    handleCloseFolio = event => {
        this.setState({
            showFolio: false,
            inputSell: "",
            folio: ""
        });
        console.log(this.state.folio)
    };



    handleCloseMetodoPago = event => {
        this.setState({
            showMetodoPago: false
        });
    };

    handleNuevo = event => {
        this.setState({
            show: false,
            inputSell: ""
        });
        console.log("AGREGAR A INVENTARIO")
    };

    handleShow() {
        this.setState({
            show: true
        });
    };

    async handleDel(a, producto) {
        let inventario = this.state.inventario
        let prod
        await dbenventa.remove(producto._id, producto._rev, function callback(err, result) {
            if (!err) {
                console.log('Successfully deleted a todo!');
            } else {
                console.log("ERR1")
            }
        });
        await inventario.some(function (elemento) {
            if (elemento._id == producto.idInv) {
                console.log(elemento)
                elemento.cantidad = elemento.cantidad + 1;
                prod = elemento;
                return

            }
        });
        await dbinventario.put(prod, function callback(err, result) {
            if (!err) {
                console.log('Successfully updated inventario +1!');
            } else { console.log("ERR3") }
        });

        // console.log(sumproduct)     
        this.componentDidMount();
        // window.location.reload();
    };


    _onKeyPress(event) {


        if (event.charCode === 13) { // enter key pressed
            // this.setState({
            //     disabled: true
            // });
            let inventario = this.state.inventario;
            let productoKey = this.state.inputSell;
            let existe = false;
            let productoAgregar = "";

            for (let i = 0; i < inventario.length; i++) {
                //REVISA SI EXISTE
                if (inventario[i]._id == productoKey) {
                    productoAgregar = inventario[i];
                    existe = true;
                    // console.log(productoAgregar)
                }
            }
            if (existe) {
                //REVISA HAY EN INVENTARIO
                // console.log(productoAgregar);
                if (productoAgregar.cantidad <= 0) {
                    this.handleShow();
                    console.log("NO TIENE PRODUCTO EN INVENTARIO")

                }
                //SI EXSISTE Y HAY EN INVENTARIO
                else {
                    this.agregarVenta(productoAgregar);
                }

            } else {
                console.log("NO EXISTE");
            }
            this.setState({
                inputSell: ""
            });

            this.componentDidMount()
        }
   
    }

    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
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
                            <TextField autoFocus={this.state.autofocus} name={"inputSell"} onChange={this._onChange} onKeyPress={this._onKeyPress} id="outlined-basic" disabled={this.state.disabled} variant="outlined" value={this.state.inputSell} style={{ width: "100%", marginTop: "50px" }} />
                            <List>

                                <Paper style={{ overflow: 'auto', height: '55vh', marginTop: "30px" }}>

                                    <div >

                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="right">#</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                    <TableCell align="right">Producto</TableCell>
                                                    <TableCell align="right">Precio</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                    <TableCell align="right">Cancelar</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {this.state.enventa.map((producto, index, key) => {


                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell align="right">{index + 1}</TableCell>
                                                            <TableCell align="right">{producto.cantidad}</TableCell>
                                                            <TableCell align="right">{producto.producto}<br />#{producto.codigo}</TableCell>
                                                            <TableCell align="right">${producto.precio}</TableCell>
                                                            <TableCell align="right">${producto.precio * producto.cantidad}</TableCell>
                                                            <TableCell align="right"><button onClick={(e) => { this.handleDel(e, producto) }}>Eiminar</button></TableCell>

                                                        </TableRow>

                                                    )
                                                })}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </Paper>

                            </List>

                        </FormControl>

                    </Grid>


                </Grid>
                <Grid item xs={1} style={{ backgroundColor: '#dddddd', height: '100vh' }}></Grid>
                <Grid item xs={4}>


                    <Grid style={{ backgroundColor: '#bbbbbb', height: '100%' }}>

                        <Grid style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", textAlign: "center", left: "50%", height: '50%', backgroundColor: '#ffffff' }} >
                            <Typography variant="h3"> TOTAL</Typography>
                            <Typography variant="h3">{formatter.format(this.state.suma)}</Typography>
                            <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">

                                <Button variant="contained" color="secondary" onClick={(e) => { this.pagar() }}>Pagar</Button >
                            </ButtonGroup>

                        </Grid>

                        <Grid container style={{ height: '50%', backgroundColor: '#888888' }} >


                        </Grid>




                    </Grid>
                </Grid>

                <Dialog
                    open={this.state.show}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"No hay disponible en inventario"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Desea agregar 1 producto de este artículo al inventario?
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

                <Dialog
                    open={this.state.showMetodoPago}
                    onClose={this.handleCloseMetodoPago}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Seleccione el Tipo de Pago"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Tipo de Pago?
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleEfectivo} color="primary">
                            Efectivo
                        </Button>
                        <Button onClick={this.handleTarjeta} color="primary" autoFocus>
                            Tarjeta
                        </Button>
                        <Button onClick={this.handleCloseMetodoPago} color="primary" autoFocus> 
                            Cancelar 
                        </Button>
                    </DialogActions>
                </Dialog>


                <Dialog
                    open={this.state.showFolio}
                    onClose={this.handleCloseFolio}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Escriba Folio de Boucher de Venta"}</DialogTitle>
                    <DialogContent>
                    <TextField
                        error={this.state.errorProducto}
                        helperText={this.state.helperProducto}
                        disabled={this.state.edit}
                        label="Nombre Producto"
                        name={"folio"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.folio}
                        style={{ width: "90%", marginTop: "50px" }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAceptarFolio} color="primary" autoFocus>
                            Aceptar
                        </Button>
                        <Button onClick={this.handleCloseFolio} color="primary" autoFocus> 
                            Cancelar 
                        </Button>
                    </DialogActions>
                </Dialog>



            </Grid>
        );
    }
}

export default Venta;