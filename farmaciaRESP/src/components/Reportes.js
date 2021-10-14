import React from 'react';
import '../styles/BarraDerecha.css';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { fontSize } from '@material-ui/system';
import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import exportFromJSON from 'export-from-json'
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
// var PouchDB = require('pouchdb').default;
// var dbVentas = new PouchDB('http://localhost:5984/ventas');


const ref = React.createRef();

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


// const useStyles = makeStyles(theme => ({
//     root: {
//         flexGrow: 1,
//     },
//     paper: {
//         padding: theme.spacing(2),
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//     },
//     gridList: {
//         flexWrap: 'nowrap',
//         // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
//         transform: 'translateZ(0)',
//     }
// }));


class Venta extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anioFiltro: 0,
            mesFiltro: "",
            diaFiltro: "",
            disAnio: true,
            disMes: true,
            disDia: true,
            filtrado: 0,
            ventas: [],
            montoVenta: 0,
            cantidadVenta: 0,
            tablaMostrar: [],
            tablaFiltrar:[],
            hoy: false,
            uid:""

        };
        this._onChange = this._onChange.bind(this);
        this.handleAnio = this.handleAnio.bind(this);
        this.handleMes = this.handleMes.bind(this);
        this.handleDia = this.handleDia.bind(this);
        this.handleProcesar = this.handleProcesar.bind(this);
        this.getAllVentas = this.getAllVentas.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.todo = this.todo.bind(this);
        this.procedimiento = this.procedimiento.bind(this);
        this.consulta = this.consulta.bind(this);
        this.medicamento = this.medicamento.bind(this);




    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user)=>{
            this.setState({
                uid: user.uid
            },() => {
                this.getAllVentas();

            });

        })


    }

    async getAllVentas() {
        let ventas=db.ref().child(this.state.uid).child("VENTAS")
        ventas.on('value', (snapshot) => {

            if(snapshot.val()==null){
                this.setState({
                    ventas: []
                });
            }else{
            let data = snapshot.val();
            let array = Object.values(data);
            this.setState({
                ventas: array
            });

        }
        })


        // console.log(this.state.ventas)
        console.log("ESTAS VENTAS SIII")
        return 0;
    };


    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };



    handleProcesar = () => {
        if (this.state.filtrado == 0) {
            alert("SELECCIONE TIPO DE REPORTE")

            // PROCESADO PARA EL AÑO

        } else if (this.state.filtrado == 1) {
            if (this.state.anioFiltro == 0) {
                alert("SELECCIONE AÑO PARA PROCESAR INFORMACION")
            } else {
                let totalVenta = 0
                let totalProductos = 0
                let request = this.state.ventas
                let used = []
                let anioFiltro = this.state.anioFiltro
                let tablaMostrar = []

                request.map(function (obj) {
                    let stringF = obj._id


                    if (parseInt(stringF.substring(0, 4)) == anioFiltro && stringF.substring(8, 10) != "un") {
                        used.push(obj)
                    }
                    

                });

                used.map(function (obj) {
                    obj.venta.map(function (venta) {
                        totalVenta = totalVenta + parseFloat(venta.total)

                    })
                });


                used.map(function (obj) {
                    let anio = obj.anio
                    let mes = obj.mes
                    let dia = obj.dia

                    obj.venta.map(function (venta) {
                        totalProductos = totalProductos + venta.prod.length
                        venta.prod.map(function (tabla) {
                            // console.log(tabla)
                            let fila = { anio: anio, mes: mes, dia: dia, nombre: tabla.producto, monto: tabla.precio, tipo: tabla.tipoProducto }
                            tablaMostrar.push(fila)
                        })


                    })
                });


                // console.log(tablaMostrar)

                this.setState({
                    montoVenta: totalVenta,
                    cantidadVenta: totalProductos,
                    tablaMostrar: tablaMostrar,
                    tablaFiltrar: tablaMostrar
                });






            }

            // PROCESADO PARA EL AÑO Y MES
        } else if (this.state.filtrado === 2) {
            if (this.state.anioFiltro == 0 || this.state.mesFiltro == "") {
                alert("SELECCIONE AÑO Y MES PARA PROCESAR INFORMACION")
            } else {
                let totalVenta = 0
                let totalProductos = 0
                let request = this.state.ventas
                let used = []
                let anioFiltro = this.state.anioFiltro
                let mesFiltro = this.state.mesFiltro
                let tablaMostrar = []
                request.map(function (obj) {
                    let stringF = obj._id


                    if ((parseInt(stringF.substring(0, 4)) == anioFiltro) && stringF.substring(5, 7) == mesFiltro && stringF.substring(8, 10) != "un") {
                        used.push(obj)
                    }
                    // console.log(used)


                });
                used.map(function (obj) {
                    obj.venta.map(function (venta) {
                        totalVenta = totalVenta + parseFloat(venta.total)

                    })
                });


                used.map(function (obj) {
                    let anio = obj.anio
                    let mes = obj.mes
                    let dia = obj.dia

                    obj.venta.map(function (venta) {
                        totalProductos = totalProductos + venta.prod.length
                        venta.prod.map(function (tabla) {
                            // console.log(tabla)
                            let fila = { anio: anio, mes: mes, dia: dia, nombre: tabla.producto, monto: tabla.precio, tipo: tabla.tipoProducto }
                            tablaMostrar.push(fila)
                        })


                    })
                });



                // console.log(tablaMostrar)

                this.setState({
                    montoVenta: totalVenta,
                    cantidadVenta: totalProductos,
                    tablaMostrar: tablaMostrar,
                    tablaFiltrar: tablaMostrar
                });


        
            }

            // PROCESADO PARA EL AÑO - MES Y DIA
        } else if (this.state.filtrado == 3) {
            if (this.state.anioFiltro == 0 || this.state.mesFiltro == "" || this.state.diaFiltro == "") {
                alert("SELECCIONE AÑO, MES Y DIA PARA PROCESAR INFORMACION")
            } else {
                let totalVenta = 0
                let totalProductos = 0
                let request = this.state.ventas
                let used = []
                let anioFiltro = this.state.anioFiltro
                let mesFiltro = this.state.mesFiltro
                let diaFiltro = this.state.diaFiltro
                let tablaMostrar = []
                request.map(function (obj) {
                    let stringF = obj._id


                    if ((parseInt(stringF.substring(0, 4)) == anioFiltro) && stringF.substring(5, 7) == mesFiltro && stringF.substring(8, 10) == diaFiltro) {
                        used.push(obj)
                    }
                    // console.log(used)


                });
                used.map(function (obj) {
                    obj.venta.map(function (venta) {
                        totalVenta = totalVenta + parseFloat(venta.total)
                        // return 0
                    })
                    // return 0
                });


                used.map(function (obj) {
                    let anio = obj.anio
                    let mes = obj.mes
                    let dia = obj.dia

                    obj.venta.map(function (venta) {
                        totalProductos = totalProductos + venta.prod.length
                        venta.prod.map(function (tabla) {
                            // console.log(tabla)
                            let fila = { anio: anio, mes: mes, dia: dia, nombre: tabla.producto, monto: tabla.precio,  tipo: tabla.tipoProducto }
                            tablaMostrar.push(fila)
                        })


                    })
                });

                this.setState({
                    montoVenta: totalVenta,
                    cantidadVenta: totalProductos,
                    tablaMostrar: tablaMostrar,
                    tablaFiltrar: tablaMostrar
                });


                // console.log(used)



                // console.log(this.state.anioFiltro)
                // console.log(this.state.mesFiltro)
            }
        }
    };



    todo = () => {
        let original=this.state.tablaFiltrar
        let suma=0
        original.map(function (venta) {
                suma=parseFloat(venta.monto)+suma
            


        })
        // console.log(suma)
        this.setState({
            tablaMostrar: this.state.tablaFiltrar,
            montoVenta: suma,
            cantidadVenta: original.length

        })
        
    }

    procedimiento = () => {
        let filtro = []
        let original=this.state.tablaFiltrar
        let suma=0
        original.map(function (venta) {
            if (venta.tipo==="Procedimiento"){
                filtro.push(venta)
                // console.log(venta)
                suma=parseFloat(venta.monto)+suma
            }


        })
        // console.log(suma)
        this.setState({
            tablaMostrar: filtro,
            montoVenta: suma,
            cantidadVenta: filtro.length

        })

        
    }

    consulta = () => {
        let filtro = []
        let original=this.state.tablaFiltrar
        let suma=0
        original.map(function (venta) {
            if (venta.tipo==="Consulta"){
                filtro.push(venta)
                // console.log(venta)
                suma=parseFloat(venta.monto)+suma
            }


        })
        // console.log(suma)
        this.setState({
            tablaMostrar: filtro,
            montoVenta: suma,
            cantidadVenta: filtro.length

        })
    }

    medicamento = () => {
        let filtro = []
        let original=this.state.tablaFiltrar
        let suma=0
        original.map(function (venta) {
            if (venta.tipo==="Medicamento"){
                filtro.push(venta)
                // console.log(venta)
                suma=parseFloat(venta.monto)+suma
            }


        })
        // console.log(suma)
        this.setState({
            tablaMostrar: filtro,
            montoVenta: suma,
            cantidadVenta: filtro.length

        })
    }




    imprimir = () => {
        const data = this.state.tablaMostrar
        const fileName = 'Reporte'
        const exportType = 'xls'
        exportFromJSON({ data, fileName, exportType })

    };






    // HANDLE DE BOTONES DE FILTRO
    handleAnio = () => {
        this.setState({
            disAnio: false,
            disMes: true,
            disDia: true,
            diaFiltro: "",
            mesFiltro: "",
            filtrado: 1
        });
    };

    handleMes = () => {
        this.setState({
            disAnio: false,
            disMes: false,
            disDia: true,
            diaFiltro: "",
            filtrado: 2
        });
    };

    handleDia = () => {
        this.setState({
            disAnio: false,
            disMes: false,
            disDia: false,
            filtrado: 3
        });
    };


    /////////////////////////////////

    render() {
        let mostrar;
        if (this.state.hoy) {
            mostrar = "OK"


        } else

            mostrar =
                <div>


                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell align="center">Indice</TableCell> */}
                                <TableCell align="center">Fecha</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Tipo</TableCell>
                                <TableCell align="center">Monto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {this.state.tablaMostrar.map((producto, index, key) => {


                                return (
                                    <TableRow key={index}>
                                        {/* <TableCell width="5%"align="center">{index + 1}</TableCell> */}
                                        <TableCell width="25%"align="center">{producto.dia}/{producto.mes}/{producto.anio}</TableCell>
                                        <TableCell width="25%" align="center">{producto.nombre}</TableCell>
                                        <TableCell width="25%" align="center">{producto.tipo}</TableCell>
                                        <TableCell width="25%"align="center">${parseFloat(producto.monto).toFixed(2)}</TableCell>


                                    </TableRow>

                                )
                            })}

                        </TableBody>
                    </Table>
                </div>


        return (

            <Grid container style={{ backgroundColor: '#dddddd' }} >

                <Grid item xs={1} style={{ backgroundColor: '#dddddd' }}  ></Grid>
                <Grid item xs={6}>
                    {/* <Grid textAlign={'center'} xs={2} container style={{ backgroundColor: '#dddddd', height: '100vh' }} > </Grid> */}
                    <Grid style={{ backgroundColor: '#dddddd', height: '100%' }} >

                        <FormControl fullWidth noValidate autoComplete="off">

                            <List >
                            <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">

<Button variant="contained" color="secondary" onClick={(e) => this.todo()}>TODO</Button >
<Button variant="contained" color="primary" onClick={(e) => this.medicamento()}>Medicamento</Button >
<Button variant="contained" color="primary" onClick={(e) => this.procedimiento()}>Procedimiento</Button >
<Button variant="contained" color="primary" onClick={(e) => this.consulta()}>Consulta</Button >

</ButtonGroup>

                                <Paper style={{ overflow: 'auto', height: '70vh', marginTop: "30px" }}>

                                    <div ref={ref}>

                                        {mostrar}


                                    </div>

                                    {/* <div className="App">
                                        <Pdf targetRef={ref} filename="code-example.pdf">
                                            {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
                                        </Pdf>

                                    </div> */}



                                </Paper>

                            </List>

                        </FormControl>




                    </Grid>


                </Grid>
                <Grid item xs={1} style={{ backgroundColor: '#dddddd', height: '100vh' }}></Grid>
                <Grid item xs={4}>


                    <Grid style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column", textAlign: "center", backgroundColor: '#bbbbbb', height: '100%' }}>
                        <Grid style={{ left: "30%", height: '50%', backgroundColor: '#ffffff' }} >


                            <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }} style={{ left: "50%", height: '100%', backgroundColor: '#cccccc' }}>

                                <Typography variant="h4"> TOTAL Vendido</Typography>

                                <Typography variant="h4">{formatter.format(this.state.montoVenta)}</Typography>

                                <Typography variant="h4"> Total Productos</Typography>

                                <Typography variant="h4">{this.state.cantidadVenta}</Typography>

                            </Grid>

                        </Grid>

                        <Grid style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column", textAlign: "center", left: "50%", height: '50%', backgroundColor: '#ffffff' }} >

                            <Typography variant="h4">Configuracion de Reporte</Typography>
                            <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">

                                <Button variant="contained" color="secondary" onClick={(e) => this.handleAnio()}>Anual</Button >
                                <Button variant="contained" color="primary" onClick={(e) => this.handleMes()}>Mensual</Button >
                                <Button variant="contained" color="secondary" onClick={(e) => this.handleDia()}>Diario</Button >
                            </ButtonGroup>

                            <FormControl disabled={this.state.disAnio} variant="filled" >
                                <InputLabel htmlFor="filled-age-native-simple">Año</InputLabel>
                                <Select
                                    native
                                    value={this.state.anioFiltro}
                                    onChange={this._onChange}
                                    inputProps={{
                                        name: 'anioFiltro',
                                        id: 'filled-age-native-simple',
                                    }}
                                >
                                    <option value="" />
                                    <option value={2020}>2020</option>
                                    <option value={2021}>2021</option>
                                    <option value={2022}>2022</option>
                                    <option value={2023}>2023</option>
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                    <option value={2027}>2027</option>
                                    <option value={2028}>2028</option>
                                    <option value={2029}>2028</option>
                                    <option value={2030}>2028</option>
                                    <option value={2031}>2028</option>

                                </Select>
                            </FormControl>

                            <FormControl id="imprimir" disabled={this.state.disMes} variant="filled" >
                                <InputLabel htmlFor="filled-age-native-simple">Mes</InputLabel>
                                <Select
                                    native
                                    value={this.state.mesFiltro}
                                    onChange={this._onChange}
                                    inputProps={{
                                        name: 'mesFiltro',
                                        id: 'filled-age-native-simple',
                                    }}
                                >
                                    <option value="" />
                                    <option value={"01"}>Enero</option>
                                    <option value={"02"}>Febrero</option>
                                    <option value={"03"}>Marzo</option>
                                    <option value={"04"}>Abril</option>
                                    <option value={"05"}>Mayo</option>
                                    <option value={"06"}>Junio</option>
                                    <option value={"07"}>Julio</option>
                                    <option value={"08"}>Agosto</option>
                                    <option value={"09"}>Septiembre</option>
                                    <option value={"10"}>Octubre</option>
                                    <option value={"11"}>Noviembre</option>
                                    <option value={"12"}>Diciembre</option>

                                </Select>
                            </FormControl>


                            <FormControl disabled={this.state.disDia} variant="filled" >
                                <InputLabel htmlFor="filled-age-native-simple">Dia</InputLabel>
                                <Select
                                    native
                                    value={this.state.diaFiltro}
                                    onChange={this._onChange}
                                    inputProps={{
                                        name: 'diaFiltro',
                                        id: 'filled-age-native-simple',
                                    }}
                                >
                                    <option value="" />
                                    <option value={"01"}>01</option>
                                    <option value={"02"}>02</option>
                                    <option value={"03"}>03</option>
                                    <option value={"04"}>04</option>
                                    <option value={"05"}>05</option>
                                    <option value={"06"}>06</option>
                                    <option value={"07"}>07</option>
                                    <option value={"08"}>08</option>
                                    <option value={"09"}>09</option>
                                    <option value={"10"}>10</option>
                                    <option value={"11"}>11</option>
                                    <option value={"12"}>12</option>
                                    <option value={"13"}>13</option>
                                    <option value={"14"}>14</option>
                                    <option value={"15"}>15</option>
                                    <option value={"16"}>16</option>
                                    <option value={"17"}>17</option>
                                    <option value={"18"}>18</option>
                                    <option value={"19"}>19</option>
                                    <option value={"20"}>20</option>
                                    <option value={"21"}>21</option>
                                    <option value={"22"}>22</option>
                                    <option value={"23"}>23</option>
                                    <option value={"24"}>24</option>
                                    <option value={"25"}>25</option>
                                    <option value={"26"}>26</option>
                                    <option value={"27"}>27</option>
                                    <option value={"28"}>28</option>
                                    <option value={"29"}>29</option>
                                    <option value={"30"}>30</option>
                                    <option value={"31"}>31</option>

                                </Select>
                            </FormControl>

                            <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">

                                <Button variant="contained" color="secondary" onClick={(e) => this.handleProcesar()}>Procesar Reporte</Button >
                                <Button variant="contained" color="primary" onClick={(e) => this.imprimir()}>Exportar Excel</Button >

                            </ButtonGroup>




                        </Grid>










                    </Grid>
                </Grid>






            </Grid>
        );
    }
}

export default Venta;