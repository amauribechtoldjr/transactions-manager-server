const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/authController")(app);
require("./app/controllers/transactionController")(app);

app.listen(process.env.PORT | 3000);
