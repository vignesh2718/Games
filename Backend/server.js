const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const connectDB = require("./db");
const dotenv = require("dotenv");
const { stat } = require("fs");

dotenv.config();
connectDB();

// port number generating

const port = process.env.PORT || 3000;
app.use(cors());

// creating schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      // default: "Vignesh",
    },
    moves: {
      type: Number,
      required: true,
    },
    match: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);
module.exports = User;

// connecting frontend to backend
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

app.set("view engine", "hbs");

// to display data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   console.log("running good ");
//   next();
// });

app.get("/", (req, res) => {
  // res.send("hello world")
  res.render("index");
});

app.get("/allData", (req, res) => {
  User.find((err, data) => {
    // console.log(data);
    res.send(data);
  });
});

// posting data into database
app.post("/", (req, res) => {
  // console.log("post is called");
  const dataStore = new User({
    name: req.body.name,
    moves: req.body.moves,
    match: req.body.match,
    score: req.body.score,
  });
  dataStore.save((err, data) => {
    if (err) console.log("something error in db");
    else {
      console.log("called post endpoint");
      res.send("going good");
    }
  });
});

app.listen(port, () => {
  console.log(`server is running at the port no ${port}`);
});
