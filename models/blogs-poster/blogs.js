const mongoose = require("mongoose");
const blogschema = mongoose.Schema({
  image: {
    type: String,
    // required: true,
  },

  date: {
    type: String,
    required:false ,
  },
  title: {
    type: String,
    required: false,
  },

  content: {
    type: String,
    required: false,
  },
});
const blogpost= mongoose.model("blogpost",blogschema);
module.exports=blogpost;
