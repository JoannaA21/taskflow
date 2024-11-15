require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
    });
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("MongoDB connection error:", error));
