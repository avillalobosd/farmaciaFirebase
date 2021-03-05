import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import Typography from '@material-ui/core/Typography';


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


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: ""


        };

        // this._onKeyPress = this._onKeyPress.bind(this);
       

    }

    async componentDidMount() {

//     firebase.auth().createUserWithEmailAndPassword("lalovide@gmail.com", "Warewolf15")
//   .then((user) => {
//       console.log(user)
//     // Signed in
//     // ...
//   })
//   .catch((error) => {
//       console.log("NONONO")
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });

  firebase.auth().signInWithEmailAndPassword("lalovide6@gmail.com", "Ware123")
  .then((user) => {
    // Signed in
    // ...
    console.log(user.user.uid)
            this.setState({
            user:user.user.uid
        });

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

    }



        render() {
        return (
        <div>{this.state.user}</div>
        );
    };
}
export default Login;