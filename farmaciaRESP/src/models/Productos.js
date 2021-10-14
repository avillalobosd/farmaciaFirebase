// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs");
// Creating our Productos model
module.exports = function(sequelize, DataTypes) {
  var Productos = sequelize.define("Productos", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role:{
      type: DataTypes.STRING,
    },
    empresa:{
      type:DataTypes.STRING,
      allowNull:false
    },
    empresaid:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    FirstName:{
      type:DataTypes.STRING
    },
    LastName:{
      type:DataTypes.STRING
    },
    Picture:{
      type:DataTypes.STRING
    },
    base64:{
      type:DataTypes.TEXT('long')
    },
    cursos:{
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    examenes:{
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    usuarios:{
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    terminos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  },
  terminosTexto: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Estos son los términos y condiciones que deben ser aceptados para tomar los cursos o exámenes"
}
  });
  // Creating a custom method for our Productos model. This will check if an unhashed password entered by the Productos can be compared to the hashed password stored in our database
  Productos.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Productos Model lifecycle
  // In this case, before a Productos is created, we will automatically hash their password
  Productos.beforeCreate("beforeCreate", function(Productos) {
    Productos.password = bcrypt.hashSync(Productos.password, bcrypt.genSaltSync(10), null);
  });




  return Productos;
};
