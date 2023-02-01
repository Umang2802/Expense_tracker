const express = require("express");
const connection = require("./config/db.js");
const transactionRoutes = require("./routes/transactionRoutes");
const accountRoutes = require("./routes/accountRoutes");
const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
//Db connection
connection();

app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.listen(process.env.PORT);

app.use("/", homeRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/account", accountRoutes);
