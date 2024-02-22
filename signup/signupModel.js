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
  },
  {
    timestamps: true,
  }
);
const crede = mongoose.model("crede", signschema);
module.exports = crede;
