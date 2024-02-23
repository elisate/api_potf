const express = require("express");
const mongoose = require("mongoose");

const Product = require("./models/productModel");
const credent = require("./signup/signupModel");
const cors = require("cors");
const bcrypt = require("bcryptjs"); //used for hashing password
const jwt = require("jsonwebtoken"); //used for authantication
const app = express(); //specification of express framework

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

app.use(express.json()); //middleware
app.use(express.urlencoded({ extended: false })); //multi part form middleware
app.use(cors());




// some outhentiction
const JWT_SECRET = "your_secret_key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
// all routes
app.get("/", (req, res) => {
  res.send("hello node api");
});
app.get("/blog", (req, res) => {
  res.send("hello blog");
});

//posting contact
// app.post("/contact", async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(200).json(product);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dushimiyimanaelisa@gmail.com",
    pass: "dushdush",
  },
});

// Contact form route
app.post("/contact", async (req, res) => {
  try {
    // Save the submitted data to MongoDB
    const product = await Product.create(req.body);

    // Email notification configuration
    const mailOptions = {
      from: "dushimiyimanaelisa@gmail.com",
      to: "dushimiyimanaelisa@gmail.com", // Replace with the email where you want to receive notifications
      subject: "New Contact Form Submission",
      text: "A new contact form submission has been received.",
    };

    // Send email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error.message);
      } else {
        console.log("Email sent:", info.response);
      }
    });

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

//session for the sign up

app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new credent({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await credent.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
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
