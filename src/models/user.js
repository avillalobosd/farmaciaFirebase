// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
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
    defaultValue: "Estos son los térmios y codiciones que deben ser aceptados para tomar los cursos o exámenes"
}
  });




  return User;
};
