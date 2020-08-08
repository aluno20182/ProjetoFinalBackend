//Load express module with `require` directive
const express = require('express');
const app = express();
//const mongoose = require("mongoose");
const mysql = require('mysql');
const userRoute = require('./Routes/User');
var bodyParser = require('body-parser')
const port = 3306;

/* // Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://Ricardo_VP:projetofinal@projetofinal-j6wen.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
 */

//Criar a coneção
const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'test123',
  database : 'nodesql'
});

//Coneção DB
db.connect(() => {
  let sql = 'CREATE DATABASE nodesql'
  if(err){
    throw err;
  }
  console.log('MySQL connected')
});

const app = express();

//Create Table
app.get('/createuserstable', (req, res) => {
  let sql = 'CREATE TABLE users'
  
})

app.use(bodyParser.json())
app.use('/', userRoute);


//Launch listening server on port 3306
app.listen(port, function () {
  console.log('app listening on port 3306!')
})