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
// import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PrintIcon from '@material-ui/icons/Print';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
var PouchDB = require('pouchdb').default;
var dbinventario = new PouchDB('http://localhost:5984/inventario');
var dbVentas = new PouchDB('http://localhost:5984/ventas');
var dbConfig = new PouchDB('http://localhost:5984/config');






class Configuracion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inventario: [],
            ventas: [],
            config: [],
            seleccion: "",
            passAnterior: "",
            passNuevo: "",
            passConfirmar: "",
            helperPass: "",
            errorPass: false,
            helperNuevoPass: "",
            errorNuevoPAss: false,
            helperConfirmar: "",
            errorConfirmar: false,
            procesado: []


        };

        this._onChange = this._onChange.bind(this);
        this.getAllinventario = this.getAllinventario.bind(this);
        this.getAllVentas = this.getAllVentas.bind(this);
        this.getAllConfig = this.getAllConfig.bind(this);
        this.password = this.password.bind(this);
        this.corregirDias = this.corregirDias.bind(this);
        this.cambiarPAssword = this.cambiarPAssword.bind(this);
        this.actualizarTabla = this.actualizarTabla.bind(this);





    }

    async componentDidMount() {


        await this.getAllinventario().then(data => {
            let array = Object.values(data);
            this.setState({
                inventario: array
            });

        })

        await this.getAllVentas().then(data => {
            let array = Object.values(data);
            this.setState({
                ventas: array
            });

        })

        await this.getAllConfig().then(data => {
            let array = Object.values(data);
            this.setState({
                config: array
            });
            if (this.state.config.length === 0) {

                let ventaUnica = { _id: "Password", eliminar: "clinica826" }
                dbConfig.put(ventaUnica, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully added new date with sale!');
                    }

                });
                console.log("ESTA VACIO EL CONFIG")
            }
            else {
                // console.log(this.state.config)
            }

        })


    }





    async getAllVentas() {
        let allNotes = await dbVentas.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);
        // console.log(notes)
        return notes;

    };

    async getAllinventario() {
        let allNotes = await dbinventario.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);
        // console.log(notes)
        return notes;
    };

    async getAllConfig() {
        let allNotes = await dbConfig.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);
        // console.log(notes)
        return notes;
    };

    async password() {
        console.log(this.state.config)
        this.setState({
            seleccion: "password"
        })
    };


    async corregirDias() {


        let tablaProcesado = []
        this.setState({
            seleccion: "corregirDias"
        })
        let request = this.state.ventas
        let used = []

        


        await request.map(function (obj) {
            let stringF = obj._id
            if (stringF.substring(8, 17) === "undefined") {
                used.push(obj)
            }



        });
        await used.map(function (obj) {

            let newId = obj._id.substring(0, 8) + obj.venta[0].prod[0]._id.substring(8, 10) + obj._id.substring(17, 25)

            let newO = {
                _id: newId,
                anio: obj.anio,
                mes: obj.mes,
                dia: obj.venta[0].prod[0]._id.substring(8, 10),
                total: obj.total,
                venta: obj.venta
            }

            dbVentas.put(newO, function callback(err, result) {
                if (!err) {
                    let procesado = {
                        _id: obj._id,
                        anio: obj.anio,
                        mes: obj.mes,
                        dia: "",
                        diaCorregido: obj.venta[0].prod[0]._id.substring(8, 10),
                        idCorregido: newId,
                        status: "CORREGIDO"
                    }

                    tablaProcesado.push(Object.assign({}, procesado));
                } else {
                    let procesado = {
                        _id: obj._id,
                        anio: obj.anio,
                        mes: obj.mes,
                        dia: "",
                        diaCorregido: obj.venta[0].prod[0]._id.substring(8, 10),
                        idCorregido: newId,
                        status: "Anteriormente Corregido"
                    }
                    tablaProcesado.push(Object.assign({}, procesado));
                  
                }

       



            });
            
            return 0
            
        });
        this.actualizarTabla(tablaProcesado);

    

    };

async actualizarTabla (){

    
    // this.setState({
    //     procesado: tabla
    // })
}


    async cambiarPAssword() {
        let config = this.state.config
        let password = ""

        config.map(function (ok) {
            if (ok._id === "Password") {
                password = ok

            }
            return 0
        })
        console.log(password)

        if (this.state.passAnterior != password.eliminar) {
            this.setState({
                helperPass: "Contraseña Incorrecta",
                errorPass: true
            })

        } else if (this.state.passNuevo != this.state.passConfirmar) {

            this.setState({
                helperPass: "",
                errorPass: false,
                helperConfirmar: "No coinciden contraseñas",
                errorConfirmar: true,
                errorNuevoPAss: true

            })



        } else {
            password.eliminar = this.state.passNuevo

            await dbConfig.put(password);
        }







    };


    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    render() {
        let componente = <p>Inicio</p>
        let texto = ""

        if (this.state.seleccion === "") {
            componente = <p>INICIADA LA PAGINA</p>

        } else if (this.state.seleccion === "password") {
            texto = <p style={{ textAlign: "center" }}>  Cambiar Contraseña</p>
            componente = <FormControl fullWidth noValidate autoComplete="off">


                <TextField
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Teclea Contraseña Actual"
                    name={"passAnterior"}
                    onChange={this._onChange}
                    id="outlined-basic" variant="outlined"
                    value={this.state.passAnterior}
                    style={{ width: "90%", marginTop: "10px", marginLeft: "20px" }}
                    label="Password Anterior"
                    size="small"
                    helperText={this.state.helperPass}
                    error={this.state.helperPass}
                    type="password"

                />

                <TextField
                    // className={useStyles.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Introduce Nueva Contraseña"
                    name={"passNuevo"}
                    onChange={this._onChange}
                    // onKeyPress={this._onKeyPress}
                    id="outlined-basic"
                    variant="outlined"
                    value={this.state.passNuevo}
                    style={{ width: "90%", marginTop: "40px", marginLeft: "20px" }}
                    label="Password Nuevo"
                    size="small"
                    helperText={this.state.helperNuevoPass}
                    error={this.state.errorNuevoPAss}
                    type="password"

                />

                <TextField
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Confirma Nueva Contraseña"
                    name={"passConfirmar"}
                    onChange={this._onChange}
                    // onKeyPress={this._onKeyPress}
                    id="outlined-basic"
                    variant="outlined"
                    value={this.state.passConfirmar}
                    style={{ width: "90%", marginTop: "20px", marginLeft: "20px", marginBottom: "20px" }}
                    label="Confirmar Nuevo Password"
                    size="small"
                    helperText={this.state.helperConfirmar}
                    error={this.state.errorConfirmar}
                    type="password"
                />


                <ButtonGroup orientation="vertical" size="large" color="primary" aria-label="large outlined primary button group" fullWidth>
                    <Button style={{ marginTop: '5px' }} variant="contained" color="primary" onClick={(e) => this.cambiarPAssword()}>Cambiar Contraseña</Button >

                </ButtonGroup>
            </FormControl>

        } else if (this.state.seleccion == "corregirDias") {
            componente = <Paper style={{ width: "90%", height: "250px", marginRight: "auto", marginLeft: "auto", overflow: 'auto', marginTop: "30px" }}>
                <div >
                    {/* <AutoSizer>  {({ height, width }) => ( */}
                    <Table padding="none" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">ID ORIGINAL</TableCell>
                                <TableCell align="center">Año </TableCell>
                                <TableCell align="center">Mes</TableCell>
                                <TableCell align="center">Dia</TableCell>
                                <TableCell align="center">ID CORREGIDO</TableCell>
                                <TableCell align="center">ID CORREGIDO</TableCell>
                                <TableCell align="center">Status</TableCell>
                                {/* <TableCell align="right">Detalle</TableCell> */}
                                {/* <TableCell align="right">Ver</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {this.state.procesado.map((procesado, index, key) => {
                                {console.log(procesado)}

                                return (
                                    <TableRow key={index}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{procesado._id}</TableCell>
                                        <TableCell align="center">{procesado.anio}<br /></TableCell>
                                        <TableCell align="center">{procesado.mes}</TableCell>
                                        <TableCell align="center">{procesado.dia}</TableCell>
                                        <TableCell align="center">{procesado.diaCorregido}</TableCell>
                                        <TableCell align="center">{procesado.status}</TableCell>

                                        {/* <TableCell align="right"><button onClick={(e) => {console.log(venta.venta[0].folio) }}>Detalle</button></TableCell> */}

                                    </TableRow>

                                )
                            })}

                        </TableBody>
                    </Table>
                    {/* )} */}
                    {/* </AutoSizer> */}
                </div>


            </Paper>
        }


        return (


            <Grid container style={{ backgroundColor: '#dddddd' }} >


                <Grid item xs={1} style={{ backgroundColor: '#dddddd' }}  ></Grid>
                <Grid item xs={8}>
                    {/* <Grid textAlign={'center'} xs={2} container style={{ backgroundColor: '#dddddd', height: '100vh' }} > </Grid> */}
                    <Grid style={{ backgroundColor: '#dddddd', height: '100%' }} >



                        <Grid style={{ fontStyle: "", backgroundColor: '#ffffff', width: '50%' }} >

                            {texto}

                            {componente}


                        </Grid>


                    </Grid>





                </Grid>
                <Grid item xs={1} style={{ backgroundColor: '#dddddd', height: '100vh' }}></Grid>
                <Grid item xs={2} style={{ backgroundColor: '#FFFFFF' }}>


                    <ButtonGroup orientation="vertical" size="large" color="primary" aria-label="large outlined primary button group" fullWidth>
                        <Button style={{ marginTop: '5px' }} variant="contained" color="primary" onClick={(e) => this.password()}>Contraseña</Button >
                        <Button style={{ marginTop: '5px' }} variant="contained" color="primary" onClick={(e) => this.corregirDias()}>Corregir Dias</Button >

                    </ButtonGroup>


                </Grid>



            </Grid>
        );
    }
}

export default Configuracion;