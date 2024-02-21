const express = require("express");
const mongoose = require("mongoose");

const Product = require("./models/productModel");
const cors = require("cors");

const app = express(); //specification of express framework
app.use(express.json()); //middleware
app.use(express.urlencoded({ extended: false })); //multi part form middleware
app.use(cors());
//routes
app.get("/", (req, res) => {
  res.send("hello node api");
});
app.get("/blog", (req, res) => {
  res.send("hello blog");
});

//posting product
app.post("/contact", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//get all contact
app.get("/getcontact", async (req, res) => {
  try {
    const product = await Product.find({});
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//get contact by id
app.get("/getcontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await Product.findById(id);
    res.status(200).json(prod);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//upadte by Id
app.put("/putcontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await Product.findByIdAndUpdate(id, req.body);
    if (!prod) {
      return res
        .status(404)
        .json({ message: `can not fonf any product with ID ${id}` });
    }
    const updatedprod = await Product.findById(id);
    res.status(200).json(updatedprod);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// delete contact
app.delete("/deletecontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await Product.findByIdAndDelete(id, req.body);
    if (!prod) {
      return res
        .status(404)
        .json({ message: `can not found any product with ID ${id}` });
    }
    res.status(200).json(prod);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://elisa_db:Elisa6464@cluster0.hex2mmr.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to mangodb");
    app.listen(3000, () => {
      console.log("node api is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
