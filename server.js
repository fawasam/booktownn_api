const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
dotenv.config();

//import db
const connectDB = require("./config/db");

//import router
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");

//app
const app = express();

//db connect
connectDB();

//port
const PORT = process.env.PORT || 5000;

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//router middleware
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", productRoute);

//error middleware
// app.use(errorHandler);

//app listening on port
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`.yellow.bold);
});
