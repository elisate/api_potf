const express = require("express");
const mongoose = require("mongoose");

const Product = require("./models/productModel");
const credent = require("./signup/signupModel");
const Blg = require("./models/blogs-poster/blogs");
const cors = require("cors");
const bcrypt = require("bcryptjs"); //used for hashing password
const jwt = require("jsonwebtoken"); //used for authentication
const app = express(); //specification of express framework

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

app.use(express.json()); //middleware
app.use(express.urlencoded({ extended: false })); //multi-part form middleware
app.use(cors());
const multer = require("multer"); // Changed var to const
const fs = require("fs");
const path = require("path");

function ensureDir(directory) {
  return new Promise(function (resolve, reject) {
    fs.access(directory, fs.constants.F_OK, function (err) {
      if (err) {
        fs.mkdir(directory, { recursive: true }, function (err) {
          if (err) {
            console.log("errors", err);
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "images_container";
    ensureDir(dir)
      .then(function () {
        cb(null, "images_container");
      })
      .catch(function (err) {
        console.log("errors", err);
        cb(err);
      });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // Removed the conflicting upload declaration

const uploaded = upload.fields([
  { name: "picture", maxCount: 1 },
  { name: "image", maxCount: 4 },
  { name: "images", maxCount: 20 },
]);
