//Load express module with `require` directive
const express = require('express');
const app = express();

const mysql = require('mysql');
const userRoute = require('./Routes/User');
var bodyParser = require('body-parser')

const port = 3000;


//Criar a conecção
const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'test123',
  database : 'nodesql'
});


//###########################################################################     DATABASE      ################################################################################## 

//Coneção DB
db.connect((err) => {
  if(err){
    console.log(err);
  }
  console.log('MySQL connected')
});


//Create DB
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodesql';
  db.query(sql, (err, result) => {
    if(err){
      console.log( err);
    } 
    console.log(result);
    res.send('Database created...')
  });
});

//###########################################################################     TABLES      ################################################################################## 

//Create Table Users
app.get('/createuserstable', (req, res) => {
  let sql = 'CREATE TABLE users (user_id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255), user_name VARCHAR(255) NOT NULL UNIQUE, points INT NOT NULL)';
  db.query(sql, (err, result) => {
    if(err){
      console.log( err);
    };
    console.log(result);
    res.send('Users table created...')
  })
})

//Create Table Tokens
app.get('/createtokenstable', (req, res) => {
  let sql = 'CREATE TABLE tokens (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT UNIQUE, token VARCHAR(255))';
  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
    };
    console.log(result);
    res.send('Tokens table created...')
  })
})



app.use(bodyParser.json())
app.use('/', userRoute);


//Launch listening server on port 3000
app.listen(port, function () {
  console.log('app listening on port 3000!')
})