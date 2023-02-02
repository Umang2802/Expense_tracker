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

// --------------------------deployment------------------------------
const path = require("path");
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.listen(process.env.PORT);

app.use("/", homeRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/account", accountRoutes);
