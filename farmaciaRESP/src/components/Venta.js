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
// import { AutoSizer} from 'react-virtualized';
import PrintIcon from '@material-ui/icons/Print';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
// import NewWindow from 'react-new-window';
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
            folio: "",
            ventasDiarias: [],
            dia: "",
            mes: "",
            anio: "",
            visualizacion: 1,
            totalTarjeta: 0,
            totalEfectivo: 0,
            totalProducto: 0,
            totalConsultas: 0,
            totalProcedimientos: 0,
            totalMedicamentos: 0,
            sumaTotal: 0,
            showPass: false,
            password: "",
            idBorrar: "",
            revBorrar: "",
            errorPass: false,
            helperPass: "",
            nombrePaciente:"",
            uid:""


        };

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onChange = this._onChange.bind(this);
        this.getAllenventa = this.getAllenventa.bind(this);
        this.getAllVentasDiarias = this.getAllVentasDiarias.bind(this);


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
        this.previousDay = this.previousDay.bind(this);
        this.nextDay = this.nextDay.bind(this);
        this.borrarVenta = this.borrarVenta.bind(this);
        this.handleClosePass = this.handleClosePass.bind(this);
        this.handleAceptarCont = this.handleAceptarCont.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.traerVentas = this.traerVentas.bind(this);


    }

    async componentDidMount() {


        firebase.auth().onAuthStateChanged((user)=>{
            this.setState({
                uid: user.uid
            },() => {
                this.traerVentas()

            });

        })

        // firebase.auth().signOut()


      
    }

    async traerVentas(){

        let dt = new Date();
        let anio = (dt.getFullYear())
        let mesN = (dt.getMonth()) + 1
        let mes;
        if (mesN < 10) {
            mes = "0" + mesN.toString()
        } else {
            mes = mesN
        }
        let diaN = (dt.getDate())
        let dia;
        if (diaN < 10) {
            dia = "0" + diaN.toString()
        } else {
            dia = diaN
        }

        await this.setState({
            dia: dia,
            mes: mes,
            anio: anio
        });





        let inventarioFB=db.ref().child(this.state.uid).child("INVENTARIO")
        inventarioFB.on('value', (snapshot) =>{
            if(snapshot.val()==null){
                // console.log("ES NULO")
                this.setState({
                    inventario: []
                });

            }else{
                const data = snapshot.val();
                // console.log(snapshot.val())
                let array=Object.values(data)
                console.log(array)
                this.setState({
                    inventario: array
                });

            }

          });


        this.getAllVentasDiarias()
        this.getAllenventa()
    }

    async borrarVenta(id, rev) {
        this.setState({
            showPass: true,
            idBorrar: id
        })
        console.log(id)

    }

    async imprimir(id) {
        let ventasDiarias = this.state.ventasDiarias
        let ventaImprimir = []

        await ventasDiarias.map((ventaImp) => {
            let string = ventaImp._id
            if (string === id) {
                // console.log("ES IGUAL")
                ventaImprimir = ventaImp
            } else {
                // console.log("NO ES IGUAL")
            }

        })
        // console.log( jsPDF.getFontList())
        var doc = jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: [297.64, 420.945],
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        });
       
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        // console.log(pageWidth)
        // doc.setFontType('bold');
        doc.setFont('Time New Roman')
        doc.setFontSize(10)
        doc.text('Dra. Elena Martínez Guerra', pageWidth / 2, 12, 'center');
        doc.text('Especialidades Dermatológicas', pageWidth / 2, 16, 'center');
        doc.setLineWidth(0.5);
        doc.line(8, 20, 140, 20);
        let venta = ventaImprimir.venta[0].prod
        let tabla = []
        let x = 30
        let sumaTotal = 0

        await venta.map(function (num) {
            sumaTotal = sumaTotal + parseFloat(num.precio)

            let producto = [num.producto, num.cantidad, num.tipoProducto, "$"+parseFloat(num.precio).toFixed(2)]

            tabla.push(Object.assign({}, producto));
            x = x + 10;
            return tabla

        });
        tabla.push(Object.assign({}, ["","","TOTAL","$"+parseFloat(sumaTotal).toFixed(2)]));

        doc.autoTable({
            head: [['Nombre', 'Cantidad', 'Tipo', 'Precio']],
            startY: 22,
            body: tabla,
            theme:"grid",
            styles: {
                fontSize: 6,
                halign: 'center',
                cellPadding: 1

            },
        })


        console.log(doc.internal.pageSize.getHeight())
        doc.setFontSize(10)
        doc.text('Firma Recibido', pageWidth / 2, 98, 'center');
        doc.line(8, 100, 140, 100);
        doc.autoPrint({variant: 'non-conform'});
        doc.save(id+'.pdf');

    }

    async nextDay() {
        let dia = parseInt(this.state.dia)
        let mes = parseInt(this.state.mes)
        let anio = this.state.anio
        let diaN, mesN
        console.log(dia)
        if (dia === 31) {
            dia = 1
            if (mes === 12) {
                anio = anio + 1
                mes = 1
            } else {
                mes = mes + 1
            }
        } else {
            dia = dia + 1
        }
        // console.log("NEXT DAY")
        // console.log(dia)
        // console.log(mes)
        // console.log(anio)
        if (mes < 10) {
            mesN = "0" + mes.toString()
        } else {
            mesN = mes
        }

        if (dia < 10) {
            diaN = "0" + dia.toString()
        } else {
            diaN = dia
        }
        console.log("MODIFICADO")
        console.log(diaN)
        console.log(mesN)
        console.log(anio)
        await this.setState({
            dia: diaN,
            mes: mesN,
            anio: anio
        });
        this.getAllVentasDiarias()

    }

    async previousDay() {
        let dia = parseInt(this.state.dia)
        let mes = parseInt(this.state.mes)
        let anio = this.state.anio
        let diaN, mesN
        console.log(dia)
        if (dia === 1) {
            dia = 31
            if (mes === 1) {
                anio = anio - 1
                mes = 12
            } else {
                mes = mes - 1
            }
        } else {
            dia = dia - 1
        }
        if (mes < 10) {
            mesN = "0" + mes.toString()
        } else {
            mesN = mes
        }

        if (dia < 10) {
            diaN = "0" + dia.toString()
        } else {
            diaN = dia
        }
        console.log("MODIFICADO")
        console.log(diaN)
        console.log(mesN)
        console.log(anio)
        await this.setState({
            dia: diaN,
            mes: mesN,
            anio: anio
        });
        this.getAllVentasDiarias()

    }

    async getAllVentasDiarias() {
        let notes = {}
        let ventasD=db.ref().child(this.state.uid).child("VENTAS")
        await ventasD.on('value',(snapshot)=>{

            if(snapshot.val()==null){
                console.log("NO HAY")
                // this.setState({
                //     totalTarjeta: sumaTarjeta,
                //     totalEfectivo: sumaEfectivo,
                //     totalProducto: totalProductos,
                //     totalConsultas: totalConsulta,
                //     totalProcedimientos: totalProcedimientos,
                //     totalMedicamentos: totalMedicamentos,
                //     sumaTotal: sumaTotal,
                //     ventasDiarias:[]
                // });
            }else{
            
            let mes = this.state.mes
            let dia = this.state.dia
            let anio = this.state.anio
            let formatoId = anio.toString() + "-" + mes + "-" + dia;
            // console.log(formatoId)
            // let allNotes = await dbVentas.allDocs({ include_docs: true });
            let ventasDiarias = []
         
            var array =[]
            let data=snapshot.val()
            array=Object.values(data)
            console.log(array)
            console.log(array)
            array.map((ventaDiaria) => {
                let string = ventaDiaria._id.substring(0, 10);
                if (string === formatoId) {
                    console.log("ES IGUAL");
                    ventasDiarias.push(ventaDiaria);
                    console.log(ventasDiarias)
                }
                else {
                    console.log("NO ES IGUAL");
                }
            })
            let sumaTotal = 0
            let sumaTarjeta = 0
            let sumaEfectivo = 0
            let totalProductos = 0
            let totalConsulta = 0
            let totalProcedimientos = 0
            let totalMedicamentos = 0
    
            ventasDiarias.map((venta) => {
                sumaTotal = sumaTotal + parseFloat(venta.venta[0].total)
                sumaEfectivo = sumaEfectivo + parseFloat(venta.venta[0].tipoPago.efectivo)
                sumaTarjeta = sumaTarjeta + parseFloat(venta.venta[0].tipoPago.tarjeta.monto)
                venta.venta[0].prod.map((producto) => {
    
                    if (producto.tipoProducto === "Procedimiento") {
                        totalProcedimientos = totalProcedimientos + 1
                    }
                    if (producto.tipoProducto === "Consulta") {
                        totalConsulta = totalConsulta + 1
                    }
                    if (producto.tipoProducto === "Medicamento") {
                        totalMedicamentos = totalMedicamentos + 1
                    }
                })
                totalProductos = totalConsulta + totalProcedimientos + totalMedicamentos
    
            })
    
    
            this.setState({
                totalTarjeta: sumaTarjeta,
                totalEfectivo: sumaEfectivo,
                totalProducto: totalProductos,
                totalConsultas: totalConsulta,
                totalProcedimientos: totalProcedimientos,
                totalMedicamentos: totalMedicamentos,
                sumaTotal: sumaTotal,
                ventasDiarias: ventasDiarias
            });
    
    
            console.log(this.state.totalTarjeta)
        }
        })
      

        return notes;
    };

    async getAllenventa() {

        let enVenta=db.ref().child(this.state.uid).child("enVenta")
        enVenta.on('value', (snapshot) =>{
            if(snapshot.val()==null){
                this.setState({
                    suma: 0,
                    enventa: [],
                    disabled: false,
                    autofocus: true
                });


            }
            else{
                let data = snapshot.val();
                let array=Object.values(data)
                let suma = 0
    
        
                array.map((sale) => {
                    suma = suma + parseFloat(sale.precio)
                })
                console.log("ESTE ")
                this.setState({
                    suma: suma.toFixed(2),
                    enventa: array.reverse(),
                    disabled: false,
                    autofocus: true
                });



            }

          });

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

        // let mes=this.state.mes
        // let dia=this.state.dia
        // let anio=this.state.anio


        let dt = new Date();
        let anio = (dt.getFullYear())
        let mesN = (dt.getMonth()) + 1
        console.log(mesN)

        let mes;
        if (mesN < 10) {
            mes = "0" + mesN.toString()
        } else {
            mes = mesN
        }
        let diaN = (dt.getDate())
        let dia;
        if (diaN < 10) {
            dia = "0" + diaN.toString()
        } else {
            dia = diaN
        }
        let enventa = this.state.enventa;
        let formatoId = anio.toString() + "-" + mes + "-" + dia;
        let folio = dt.getHours()+"h"+dt.getMinutes()+"m"+dt.getSeconds()+"s"
        // let folio=dia+"-"+mes+"-"+anio+"-"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)




        let prod = [{ total: sumaF, folio: formatoId + "-" + folio, tipoPago: { efectivo: sumaF, tarjeta: { monto: 0, folio: "AAA" } }, prod: enventa }]
        let ventaUnica = { _id: formatoId + "-" + folio, anio: anio, mes: mes, dia: dia, total: 0, venta: prod }
        // dbVentas.put(ventaUnica, function callback(err, result) {
        //     if (!err) {
        //         console.log('Successfully added new date with sale!');
        //     }

        // });

        // AGREGA VENTA A FIREBASE 
        db.ref().child(this.state.uid).child("VENTAS").child(ventaUnica._id).set(ventaUnica)
        // ELIMINA REGISTRO DE ENVENTA 
        db.ref().child(this.state.uid).child("enVenta").remove()


        // dbenventa.destroy().then(function (response) {
        //     console.log("BORRADA")
        // }).catch(function (err) {
        //     console.log(err);
        // });

        // this.componentDidMount();
        // window.location.reload();
    };


    handleTarjeta = event => {
        this.setState({
            showMetodoPago: false,
            inputSell: "",
            showFolio: true
        });
    };


    async handleAceptarCont() {

        // console.log(this.state.password)
        if (this.state.password === "12345") {


            db.ref().child(this.state.uid).child("VENTAS").child(this.state.idBorrar).remove()

            this.setState({
                showPass: false,
                password: ""
            });
            this.getAllVentasDiarias()

        } else {
            this.setState({
                errorPass: true,
                helperPass: "CONTRASEÑA EQUIVOCADA"
            });
            // alert("CONTRASÑEA EQUIVOCADA")
            this.getAllVentasDiarias()
        }



    };




    async agregarVenta(productoAgregar) {
        this.setState({
            adding:  false
        });

        if (this.state.adding === false) {
            console.log("Agregando esperar")
        }
        else {
            console.log(this.state.adding)
            let prodAct = productoAgregar;
            prodAct.cantidad = prodAct.cantidad - 1;
            let agregarVenta = {
                _id: new Date().toISOString().split('.').join(''),
                idInv: productoAgregar.id,
                // revInv: productoAgregar._rev,
                producto: productoAgregar.nombre,
                codigo: productoAgregar.id,
                cantidad: 1,
                tipoProducto: productoAgregar.tipoProducto,
                precio: productoAgregar.precio,
                cerrado: false,
                // venta: this.state.folios[0].venta,
                // diacierre: this.state.folios[0].diacierre,
                // anio: this.state.folios[0].anioCierre
            }
            // await dbenventa.put(agregarVenta, function callback(err, result) {
            //     if (!err) {
            //         console.log('Successfully posted a todo!');
            //     }
            // });
            // QUITA LOS PUNTOS DEL ID
            let idN=agregarVenta._id
            
            // console.log(idN)

            await db.ref().child(this.state.uid).child("enVenta").child(idN).set(agregarVenta)
            await db.ref().child(this.state.uid).child("INVENTARIO").child(productoAgregar.id).set(productoAgregar)

            // await dbinventario.put(prodAct);
            this.setState({
                adding:  true
            });
  
        }


    };

    async handleAceptarFolio() {
        this.setState({
            showFolio: false,
            inputSell: ""
        });

        let sumaF = this.state.suma
        let folio = this.state.folio


        let dt = new Date();
        let anio = (dt.getFullYear())
        let mesN = (dt.getMonth()) + 1
        let mes;
        if (mesN < 10) {
            mes = "0" + mesN.toString()
        } else {
            mes = mesN
        }
        let diaN = (dt.getDate())
        let dia;
        if (diaN < 10) {
            dia = "0" + diaN.toString()
        } else {
            dia = diaN
        }
        let enventa = this.state.enventa;
        let formatoId = anio.toString() + "-" + mes + "-" + dia;
        console.log(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8))
        let folioV = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)

        let prod = [{ total: sumaF, folio: folioV, tipoPago: { efectivo: 0, tarjeta: { monto: sumaF, folio: folio } }, prod: enventa }]
        let ventaUnica = { _id: formatoId + "-" + folioV, anio: anio, mes: mes, dia: dia, total: 0, venta: prod }
        // dbVentas.put(ventaUnica, function callback(err, result) {
        //     if (!err) {
        //         console.log('Successfully posted a todo!');
        //     }

        // });

        db.ref().child(this.state.uid).child("VENTAS").child(ventaUnica._id).set(ventaUnica)

        db.ref().child(this.state.uid).child("enVenta").remove()

        // this.componentDidMount();
        // window.location.reload();


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

    handleClosePass = event => {
        this.setState({
            showPass: false,
            inputSell: ""
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
        // console.log(producto)
        // let inventario = this.state.inventario
        // let prod
        // await dbenventa.remove(producto._id, producto._rev, function callback(err, result) {
        //     if (!err) {
        //         console.log('Successfully deleted a todo!');
        //     } else {
        //         console.log("ERR1")
        //     }
        // });
        db.ref().child(this.state.uid).child("enVenta").child(producto._id).remove()
        let sumar1=db.ref().child(this.state.uid).child("INVENTARIO").child(producto.idInv)
        sumar1.once('value',(snapshot)=>{
            let cantidad=snapshot.val().cantidad +1
            db.ref().child(this.state.uid).child("INVENTARIO").child(producto.idInv).update({cantidad:cantidad})
        })
        // console.log(sumar1.val())
        // sumar1.cantidad=sumar1.cantidad+1
        // console.log(db.ref().child("INVENTARIO").child(producto.idInv))

        
        // await inventario.some(function (elemento) {
        //     if (elemento._id == producto.idInv) {
        //         console.log(elemento)
        //         elemento.cantidad = elemento.cantidad + 1;
        //         prod = elemento;
        //         return 0

        //     }
        // });
        // await dbinventario.put(prod, function callback(err, result) {
        //     if (!err) {
        //         console.log('Successfully updated inventario +1!');
        //     } else { console.log("ERR3") }
        // });

        // console.log(sumproduct)     
        // this.componentDidMount();

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
                // console.log(inventario)
                //REVISA SI EXISTE
                if (inventario[i].id === productoKey) {
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
                            <TextField autoFocus={this.state.autofocus} name={"inputSell"} onChange={this._onChange} onKeyPress={this._onKeyPress} id="outlined-basic" disabled={false} variant="outlined" value={this.state.inputSell} style={{ width: "100%", marginTop: "50px" }} />
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
                                                            <TableCell align="right">{producto.producto}<br /></TableCell>
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


                    <Grid style={{ backgroundColor: '#888888', height: '100%' }}>

                        <Grid style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", textAlign: "center", left: "50%", height: '20%', backgroundColor: '#ffffff' }} >
                            <Typography variant="h3"> TOTAL</Typography>
                            <Typography variant="h3">{formatter.format(this.state.suma)}</Typography>
                            <ButtonGroup fullWidth color="primary" aria-label="full width outlined button group">

                                <Button variant="contained" color="secondary" onClick={(e) => { this.pagar() }}>Pagar</Button >
                            </ButtonGroup>

                        </Grid>
                        <Paper style={{ textAlign: "center", marginBotton: "auto", marginTop: "10px", marginRight: "auto", marginLeft: "auto" }}>


                            <Typography>
                                <SkipPreviousIcon onClick={(e) => this.previousDay()}></SkipPreviousIcon>{this.state.dia}/{this.state.mes}/{this.state.anio}
                                <SkipNextIcon onClick={(e) => this.nextDay()}></SkipNextIcon></Typography>



                        </Paper>
                        <Grid item style={{backgroundColor: '#888888' }} >

                            <Grid container style={{ height: '80%', backgroundColor: '#888888' }} >

                                <Paper style={{ width: "90%", height: "250px", marginRight: "auto", marginLeft: "auto", overflow: 'auto', marginTop: "30px" }}>
                                    <div >
                                        {/* <AutoSizer>  {({ height, width }) => ( */}
                                        <Table padding="none" stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">#</TableCell>
                                                    <TableCell align="center">Folio</TableCell>
                                                    <TableCell align="center">Productos </TableCell>
                                                    <TableCell align="center">Efectivo</TableCell>
                                                    <TableCell align="center">Tarjeta</TableCell>
                                                    <TableCell align="center">Total</TableCell>
                                                    <TableCell align="center">Imp</TableCell>
                                                    <TableCell align="center">Eliminar</TableCell>
                                                    {/* <TableCell align="right">Detalle</TableCell> */}
                                                    {/* <TableCell align="right">Ver</TableCell> */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {this.state.ventasDiarias.map((venta, index, key) => {


                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell align="center">{index + 1}</TableCell>
                                                            <TableCell align="center">{venta.venta[0].folio}</TableCell>
                                                            <TableCell align="center">{venta.venta[0].prod.length}<br /></TableCell>
                                                            <TableCell align="center">${venta.venta[0].tipoPago.efectivo}</TableCell>
                                                            <TableCell align="center">${venta.venta[0].tipoPago.tarjeta.monto}</TableCell>
                                                            <TableCell align="center">${venta.venta[0].total}</TableCell>
                                                            <TableCell align="center"><PrintIcon onClick={(e) => { this.imprimir(venta._id) }} /></TableCell>
                                                            <TableCell align="center"><HighlightOffIcon onClick={(e) => { this.borrarVenta(venta._id) }} /></TableCell>
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

                                <Grid container style={{ backgroundColor: '#888888' }} >





                                    <Paper style={{ marginRight: "auto", marginLeft: "auto", overflow: 'auto', width: "90%", marginTop: "5px" }}>



                                        <p>Efectivo ${this.state.totalEfectivo}   Tarjeta ${this.state.totalTarjeta}</p>
                                        <p>Total Venta del Día ${this.state.sumaTotal} </p>

                                        <p>Medicamentos {this.state.totalMedicamentos}  Consultas {this.state.totalConsultas}  Procedimiento {this.state.totalProcedimientos}</p>

                                        <p>Total de Productos: {this.state.totalProducto}</p>

                                    </Paper>



                                </Grid>



                            </Grid>






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
                    {/* <DialogTitle id="alert-dialog-title">{"Información Venta"}</DialogTitle> */}
                    {/* <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Tipo de Pago?
                        </DialogContentText>
                    </DialogContent> */}
                    <TextField  label="Nombre Paciente" name={"nombrePaciente"} onChange={this._onChange} id="outlined-basic" variant="outlined" value={this.state.nombrePaciente} style={{ width: "80%", margin:"auto", paddingTop:"30px"}} />

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
                            label="Folio de Ticket"
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

                <Dialog
                    open={this.state.showPass}
                    onClose={this.handleClosePass}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Escriba Contraseña para Borrar Venta"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            error={this.state.errorPass}
                            helperText={this.state.helperPass}
                            type="password"
                            // disabled={this.state.edit}
                            label="Contraseña"
                            name={"password"}
                            onChange={this._onChange}
                            variant="outlined"
                            value={this.state.password}
                            style={{ width: "90%", marginTop: "50px" }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAceptarCont} color="primary" autoFocus>
                            Aceptar
                        </Button>
                        <Button onClick={this.handleClosePass} color="primary" autoFocus>
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>



            </Grid>
        );
    }
}

export default Venta;