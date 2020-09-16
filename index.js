//Load express module with `require` directive
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const config = require("./config.js");

const jwt = require("jsonwebtoken");

const mysql = require("mysql");
const userRoute = require("./Routes/User");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/", userRoute);

const port = 3000;

//Criar a conecção
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test123",
  database: "nodesql",
  multipleStatements: true,
  port: 3306,
});

//###########################################################################     DATABASE      ##################################################################################

//Coneção DB
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("MySQL connected");
});

//Create DB
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodesql";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send("Database created...");
  });
});

//###########################################################################     TABLES      ##################################################################################

//Create Table Users
app.get("/createuserstable", (req, res) => {
  let sql =
    "CREATE TABLE users (user_id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255), username VARCHAR(255) NOT NULL UNIQUE, firstname VARCHAR(255), lastname VARCHAR(255), points INT NOT NULL, token VARCHAR(255))";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send("Users table created...");
  });
});

/* `user_id` int(11) NOT NULL,
`email` varchar(255) NOT NULL,
`password` varchar(255) DEFAULT NULL,
`firstname` varchar(255) NOT NULL,
`points` int(11) NOT NULL,
`lastname` varchar(255) NOT NULL,
`username` varchar(255) NOT NULL */

//Create Table Tokens
app.get("/createtokenstable", (req, res) => {
  console.log("this... ", req);
  let sql =
    "CREATE TABLE tokens (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT UNIQUE, token VARCHAR(255))";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send("Tokens table created...");
  });
});

//###########################################################################     AÇÕES      ##################################################################################

//Criar Conta

/**
 * insert into users (id, firstname, lastname, email, password, budget) values (default, $1, $2, $3, $4, $5) returning id`,
 */

app.post("/createaccount", async (req, resp, next) => {
  let user = req.body;
  console.log("user", user);
  let password = req.body.password;
  const token = jwt.sign({ _id: user.username }, "chavesecreta");
  let encryptedPassword = await bcrypt.hash(password, 10);
  console.log("password", encryptedPassword);
  try {
    db.query(
      "insert into users (user_id, username, email, password, firstname, lastname, points, token) values (default, ?, ?, ?, ?, ?, 50, ? );",
      [
        user.username,
        user.email,
        encryptedPassword,
        user.firstname,
        user.lastname,
        token,
      ]
    );
    resp.json(token);
    db.query("update users set points=points+50 where email = ?", [
      user.email,
    ]);
    console.log("Query criada");
  } catch (err) {
    if (
      err.message ===
      'duplicate key value violates unique constraint "users_email_key"'
    ) {
      resp.status(409);
      resp.json({ message: "email already exists" });
    } else {
      console.log("unknown error: ", err);
      throw err;
    }
  }

  /*     .then((results) => {
        let token = uuid.v4();
        console.log('o que vem de cima', results)
        return db.query(
          'insert into tokens (userid, token) values (?, ?)',
          [results, token]
        ) */

  /** Eliminar a tabela tokens
   * Registo tokens no user
   * fazer com que o bcrypt.hash seja uma constante que está dentro do db.query
   *
   * Happy days
   * */

  /*})
   .then(([user_id, result]) => {
    resp.json({ token: result.token });
    return user_id;
  }) */
});

app.post("/loginaccount", async (req, res) => {
  console.log("Login");
  let user = req.body;
  console.log(user);

  /*   db.query('select user_id, username, email, password as encryptedPassword, token, firstname, lastname from users where email = ?', [user.email], function ( results) {
   */
  try {
    db.query(
      "select user_id, username, email, password as encryptedPassword, token, firstname, lastname, points from users where email = ?",
      [user.email],
      async function (err, results, fields) {
        if (!user) {
          return results.status(404).send("User Not Found.");
        } else {
          if (err) throw err;
          console.log("resultado ", results[0]);

          var passwordIsValid = await bcrypt.compare(
            user.password,
            results[0].encryptedPassword
          );
          if (!passwordIsValid) {
            console.log("pass do body invalid: ", user.password);
          } else {
            //console.log("pass do body: ", user.password);
            console.log("pass escrita: ", results[0].encryptedPassword);
            const token = jwt.sign({ _id: user.username }, "chavesecreta");
            db.query("update users set token = ? where email=?", [
              token,
              user.email,
            ]);
            db.query("update users set points=points+10 where email = ?", [
              user.email,
            ]);
            let loginData = {
              username: results[0].username,
              email: results[0].email,
              firstname: results[0].firstname,
              lastname: results[0].lastname,
              points: results[0].points,
              token: token,
            };
            console.log(loginData)
            return res.json(loginData);
          }
        }
      }
    );
  } catch (error) {
    console.log("handing error during login: ", error);
    if (error.message === "No data returned from the query.") {
      let errMessage = { message: "login failed" };
      resp.status(401);
      resp.json(errMessage);
    } else if (error.message === "password is incorrect") {
      let errMessage = { message: "login failed" };
      resp.status(401);
      resp.json(errMessage);
    } else {
      console.log("something bad happened");
      throw error;
    }
  }
});

app.post("/logout", async (req, res) => {
  // Log user out of the application
  console.log("Logout");
  let user = req.body;
  console.log(user);
  let email = req.body.email;
  try {
    db.query("update users set token = '' where email = ?", [email]);

    console.log("Query efetuada");
    res.json(token);
  } catch (error) {
    res.status(500).send(error);
  }
});


//################################################  Pontos hotspot  ###############################//
app.post("/pontoshotspot", (req, res) => {
  console.log("PONTOS HOTSPOT");
  let users = req.body;
  console.log(users);
  try {

    db.query(
      //'select user_id, points from user where username = ?'
      //'update user set points = points + 10 WHERE username = ?'

      "select user_id, points from user where username = ?",
      [users.username]

    );
    let data = {
      username: results[0].username,
      points: results[0].points,
    };
    console.log(data)
    return res.json(data);

  } catch (error) {
    res.status(500).send(error);
  }

})





app.post("/getpoints", (req, res) => {
  console.log("PONTOS");
  let user = req.body;
  console.log(user);
  let email = req.body.email;
  try {
    db.query("select points from users where email = ?", [email]);

    console.log("Query efetuada");
    res.json(token);
  } catch (error) {
    res.status(500).send(error);
  }

})

//Launch listening server on port 3000
app.listen(port, function () {
  console.log("app listening on port 3000!");
});
