const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

mongoose.connect("mongodb://localhost:27017/studentDB");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Student = mongoose.model("student", studentSchema);

app
  .route("/students")
  .get(function (req, res) {
    Student.find({}, function (err, result) {
      if (err) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body);
    const student = new Student({
      name: req.body.name,
      age: req.body.age,
    });

    student.save(function (err) {
      if (!err) {
        res.send("Successfully added the Student.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Student.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully Deleted all the Students.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/students/:id")
  .get(function (req, res) {
    Student.findById(req.params.id, function (err, student) {
      if (err) {
        res.send(err);
      } else {
        res.send(student);
      }
    });
  })
  .delete(function (req, res) {
    console.log(req.params.id);
    Student.findOneAndDelete({ _id: req.params.id }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted the student.");
      }
    });
  });

app.listen(9000, function (err) {
  if (!err) {
    console.log("Server has started at port 9000...");
  }
});
