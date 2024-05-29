const express = require("express");
const mongoose = require("mongoose");

const Product = require("./models/productModel");
const credent = require("./signup/signupModel");
const Blg = require("./models/blogs-poster/blogs");
const cors = require("cors");
const bcrypt = require("bcryptjs"); //used for hashing password
const jwt = require("jsonwebtoken"); //used for authantication
const app = express(); //specification of express framework
const crypto = require("crypto");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const session = require("express-session"); //middle ware for session storing data
const sendEmail = require("./utils/sendemal");



sendEmail("infodtechel@gmail.com");

app.use(express.json()); //middleware
app.use(express.urlencoded({ extended: false })); //multi part form middleware
app.use(cors());
var multer = require("multer"); //multer Middle ware for picture
var fs = require("fs");

//session configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if you're using HTTPS
  })
);

// console.log("------BLOG DEAL------")
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "images_container";
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

var upload = multer({ storage: storage });

var uploaded = upload.fields([
  { name: "picture", maxCount: 1 },
  { name: "image", maxCount: 4 },
  { name: "images", maxCount: 20 },
]);

//-----END OF BLOG
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

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "deaqa3zvd",
  api_key: "228359843523968",
  api_secret: "dGNzJXl_7LjtPyveFl16-3KGIyA",
});

// Modify the /blogposting route
app.post("/blogposting", uploaded, async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.image[0].path);
    // Retrieve data from the request body
    const { date, title, content } = req.body;
    const image = result.secure_url; // Get the secure image URL from Cloudinary

    // Create a new blog post object
    const newBlogPost = await Blg.create({
      date,
      title,
      content,
      image,
    });

    res.status(200).json(newBlogPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//getting plogs

app.get("/getblogs", async (req, res) => {
  try {
    const manyblogs = await Blg.find({});
    res.status(200).json(manyblogs);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// posting the contact
// app.post('/postcontact',async(req,res)=>{
//   try {
//     const product = await Product.create(req.body);
//     res.status(200).json(product);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// })

app.post("/postcontact", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Extract email from the posted contact data
    const { email } = req.body;

    // Send email to the extracted email address

    const htmlContent = `
 
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6">
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 0.4px solid #ddd;
        border-radius: 5px;
      "
    >
      <h2 style="color: #333">Thank You for Contacting Us!</h2>
      <p style="color: #555; font-size: 1.1rem">Dear User,</p>
      <p style="color: #555; font-size: 1.1rem">
        We appreciate you reaching out to us. Your contact details have been
        successfully posted in our system. Our team will review your message and
        get back to you as soon as possible.
      </p>

      <p style="color: #555; font-size: 1.1rem">
        Best regards,<br />
        <span style="color: #28ae60">Dtechel</span> Team
      </p>
      <hr />
      <div>&copy; Elisa-Tech.All rights reserved</div>
    </div>
  </body>
</html>
    `;

    sendEmail(email, "Contact Posted", htmlContent);

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

//session for the fresh sign up
app.post("/signup", async (req, res) => {
  try {
    const { name, lastname, email, phone, password, role } = req.body;

    // Check if the email already exists in the database
    const existingUser = await credent.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new credent({
      name,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    // Send email to the user

    const htmlContent = `
 
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6">
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 0.4px solid #ddd;
        border-radius: 5px;
      "
    >
      <h2 style="color: #333">Welcome to Dtechel!</h2>
      <p style="color: #555; font-size: 1.1rem">Dear User,</p>
      <p style="color: #555; font-size: 1.1rem">
        Thank you for registering with us! Your account has been successfully
        created.
      </p>
      <p style="color: #555; font-size: 1.1rem">
        You can now log in to your account using your registered email and
        password. Here are some useful links to get you started:
      </p>
      <p style="color: #555">
        <a
          href="https://elisa-potf-cv.vercel.app/"
          style="color: #28ae60; font-size: 1.1rem"
          >Log In</a
        >
      </p>
      <p style="color: #555; font-size: 1.1rem">
        If you have any questions or need assistance, feel free to reply to this
        email or contact our support team at
        <a
          href="https://elisa-potf-cv.vercel.app/"
          style="color: #28ae60; font-size: 1.1rem"
          >support@Dtechel.com</a
        >.
      </p>
      <p style="color: #555; font-size: 1.1rem">
        Best regards,<br />
        <span style="color: #28ae60">Dtechel</span> Team
      </p>
      <hr />
      <div>&copy; Elisa-Tech.All rights reserved</div>
    </div>
  </body>
</html>
    `;

    await sendEmail(email, "Welcome to Our Platform", htmlContent);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint for regular users and admins to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await credent.findOne({ email });
    console.log("the   creent logeed in user  emailis", user.email);
    // sendEmail(user.email,"subject","You have logged in Sucessfully")
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Notify the user of invalid credentials
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({
      token,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//end points for user and admin
// Endpoint for regular users to perform actions like viewing their profile or updating their information
app.get("/user/profile", authenticateToken, async (req, res) => {
  try {
    // Extract user ID from token
    const userId = req.user.id;

    // Fetch user details from the database using the user ID
    const user = await credent.findById(userId);

    // Return user details
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const crede = await credent.find({});
    res.status(200).json(crede);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Example endpoint for admin to delete a user
app.delete("/admin/users/:userId", authenticateToken, async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
      throw new Error("Unauthorized access");
    }

    // Extract userId from the request parameters
    const userId = req.params.userId;

    // Find the user by ID and delete them from the database
    await credent.findByIdAndDelete(userId);

    // Return success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(403).json({ message: error.message });
  }
});
//otp generation

const generateOTP = (expiryMinutes = 5) => {
  const otp = crypto.randomInt(100000, 999999);
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
  console.log("-------", otp);
  return {
    code: otp.toString(),
    expiresAt: expiryTime,
  };
};
generateOTP();
// Endpoint for sending OTP to the user's email
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  req.session.email = email; // Store the email in the session

  let otp = generateOTP().code;
  const expiresAt = generateOTP().expiresAt;

  try {
    // Check if the user exists in the database
    const user = await credent.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate OTP
    console.log("Generated OTP:", otp); // Log the generated OTP

    // Update user's OTP field in the database
    user.otp = otp;
    user.verified = false;
    await user.save();

    // Send the OTP to the user's email (implement your email sending logic here)
    const htmlContent = `
 

<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      h2 {
        color: #333;
      }
      p {
        color: #555;
        font-size: 1.1rem;
      }
      .otp {
        padding: 10px 20px;
        background-color: #28ae60;
        color: white;
        font-size: 20px;
        font-weight: bold;
        border-radius: 5px;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        color: #777;
        font-size: 12px;
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Dear User,</p>
      <p>Please use the following OTP to reset your password:</p>
      <p class="otp"> ${otp}</p>
      <p>
        If you did not request a password reset, ignore this email or contact
        support.
      </p>
      <p>
        Best regards,<br />
        <span style="color: #28ae60">Dtechel</span> Team
      </p>
      <hr />
      <div>&copy; Elisa-Tech.All rights reserved</div>
    </div>
  </body>
</html>

    `;
    sendEmail(email, "OTP for Password Reset", htmlContent);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for verifying OTP and updating password
app.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find the user in the database
    const user = await credent.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Check if the OTP has expired
    if (user.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and mark as verified
    user.password = hashedPassword;
    user.verified = true;
    user.otp = null; // Clear the OTP field
    user.expiresAt = null; // Clear the expiration time
    await user.save();

    // Send email to the user
    const htmlContent = `
 
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      h2 {
        color: #333;
      }
      p {
        color: #555;
        font-size: 1.1rem;
      }
      .new-password {
        padding: 10px 20px;
        background-color: #28a745;
        color: white;
        font-size: 20px;
        font-weight: bold;
        border-radius: 5px;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Updated</h2>
      <p>Your password has been successfully updated.</p>
      <p class="new-password">new password is: ${newPassword}</p>
      <p>If you didn't request this, contact us immediately.</p>
      <p>Best regards,<br /><span style="color: #28ae60">Dtechel</span> Team</p>
      <hr />
      <div>&copy; Elisa-Tech.All rights reserved</div>
    </div>
  </body>
</html>


    `;
    await sendEmail(email, "Password Updated Successfully", htmlContent);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//connections to mongle db
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
