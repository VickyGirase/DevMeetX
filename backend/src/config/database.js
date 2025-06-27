const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vickygirase4073:vicky4073@namastenodejs.w75kh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
