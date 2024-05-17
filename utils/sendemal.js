const nodemailer = require("nodemailer");
require("dotenv").config();
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send email
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent, // Use 'html' instead of 'text' for HTML content
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");

    return true; // Return true if email is sent successfully
  } catch (error) {
    console.log("Error sending email: ", error.message);
    return false; // Return false if there's an error sending email
  }
};

module.exports = sendEmail;

