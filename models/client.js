const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/good-apollo-iv-vol-1", {
  useNewUrlParser: true
});

module.exports = mongoose;
