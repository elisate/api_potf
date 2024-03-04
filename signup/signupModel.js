const mongoose = require("mongoose");
const signschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please entercontact name"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // role can be either 'user' or 'admin'
      default: "user", // default role is 'user'
    },
  },
  {
    timestamps: true,
  }
);
const crede = mongoose.model("crede", signschema);
module.exports = crede;
