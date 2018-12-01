var database = require("../config/database");
var Schema = database.mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true
    },
    password: {
      type: String
    },
    name: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      required: false,
      trim: true,
      default: false
    },
    token: {
      type: String,
      required: true,
      default: false
    },
    ip: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date
    }
  },
  {
    collection: "users"
  }
);

userSchema.statics.findByToken = function(token) {
  return this.findOne({
    token: token,
    isDeleted: false
  }).lean();
};

userSchema.statics.findExistence = function(email, phone) {
  return this.findOne({
    email: new RegExp(email, "i"),
    isDeleted: false
  }).lean();
};

userSchema.statics.findByMail = function(ep) {
  return this.findOne({
    $or: [
      {
        email: new RegExp(ep, "i")
      },
      {
        phone: new RegExp(ep, "i")
      }
    ],
    isDeleted: false
  }).lean();
};

userSchema.statics.removeToken = function(id) {
  this.updateOne(
    {
      _id: id
    },
    {
      $unset: {
        token: null
      }
    }
  ).exec(function(err, data) {
    if (err) throw err;
  });
};

userSchema.statics.updateToken = function(id, token) {
  this.updateOne(
    {
      _id: id
    },
    {
      $set: {
        token: token
      }
    }
  ).exec(function(err, data) {
    if (err) throw err;
  });
};

userSchema.statics.addPassword = function(id, password) {
  this.updateOne(
    {
      _id: id
    },
    {
      $set: {
        password
      }
    }
  ).exec(function(err, data) {
    if (err) throw err;
  });
};

userSchema.statics.deleteAccount = function(id, password) {
  this.updateOne(
    {
      _id: id
    },
    {
      $set: {
        isDeleted: true
      }
    }
  ).exec(function(err, data) {
    if (err) throw err;
  });
};

module.exports = database.mongoose.model("user", userSchema);
