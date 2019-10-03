const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

// console.log(MONGODB_URI);

mongoose.set("useCreateIndex", true);

mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
