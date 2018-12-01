const config = require("./config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// for local database
// mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database + '');

// need to set the password and username in environment variable
// as I am not sharing this code so till then this could work
mongoose
  .connect(
    "mongodb://mayank:Qwerty123@ds115874.mlab.com:15874/sociallogin",
    {
      useNewUrlParser: true
    }
  )
  .then(result => console.log("Database is connected"))
  .catch(err => console.log(err));

var db = mongoose.connection;
module.exports.mongoose = mongoose;
module.exports.db = db;
