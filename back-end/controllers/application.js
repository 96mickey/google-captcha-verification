const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userDb = require("./../model/user");
const moment = require('moment');
const request = require('request');

const register = function(req, res) {
  req.checkBody("name", "Enter a name").exists();
  req
    .checkBody("email", "Invalid Email")
    .exists()
    .isEmail();
  req
    .checkBody("password", "Password should be of atleast 8 characters.")
    .exists()
    .isLength({
      min: 8
    });
  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).failure("Errors", {
      errors: errors
    });
  }
  
  let xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
  let ip = xForwardedFor || req.connection.remoteAddress;
      
  if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0];
    }
    
  let startDate = moment(moment().date()._d).set({
          hour: 0,
          minute: 0,
          second: 0
        })
  
  let endDate = moment(moment().date()._d).set({
          hour: 23,
          minute: 59,
          second: 59
        })
  
  let user = new userDb();
  user.email = req.body.email.toString().trim();
  user.ip = ip;
  user.name = req.body.name.toString();
  
  userDb.find({ 
    ip,
    created: {
      $gte: startDate,
      $lt: endDate
    }
    }).exec((err, ipcount) => {
    if(err) throw err;
    else if(ipcount.length < 3) {
      newUserRegister(req, res, user);
    }else {
      if(req.body.captcha === "" && req.body.captcha === null && req.body.captcha === undefined ) {
        res.failure("You need to verify yourself.");
      } else {
        let secretKey = '6LeWOX4UAAAAABH2SBOlrkO10pshTok89Lq1KM0Z';
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;
        request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
          return res.failure("Failed captcha verification");
        }else {
          newUserRegister(req, res, user);
        }
      });
      }
    }
  });

  
};

const login = function(req, res) {
  req
    .checkBody("email", "Invalid Email")
    .exists()
    .isEmail();
  req
    .checkBody("password", "Password should be of atleast 8 characters.")
    .exists()
    .isLength({
      min: 8
    });
  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).failure("Errors", {
      errors: errors
    });
  }

  userDb.findByMail(req.body.email.toString().trim()).exec((err, data) => {
    if (err) throw err;
    else if (!data) res.failure("There is no account with this email.");
    else {
      if (
        data.password &&
        bcrypt.compareSync(req.body.password.toString().trim(), data.password)
      ) {
        let token = jwt.sign(
          {
            email: data.email,
            password: data.password
          },
          "userSecret"
        );
        userDb.updateToken(data["_id"], token);
        delete data["password"];
        data["password"] = true;
        return res.status(200).success(
          {
            token: token,
            info: data
          },
          "User Logged In successfully"
        );
      } else res.failure("Password is incorrect.");
    }
  });
};

const confirmProfile = function(req, res) {
  req.checkHeaders("x-auth-token", "No token was found.").exists();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).failure("Errors", {
      errors: errors
    });
  }

  let token = req.headers["x-auth-token"];
  userDb.findByToken(token).exec((err, data) => {
    if (err) throw err;
    else if (!data) res.failure("No user was found");
    else {
      if (data["password"]) {
        delete data["password"];
        data["password"] = true;
      } else data["password"] = false;
      res.status(200).success(data, "User found");
    }
  });
};

const ipCount = function(req, res) {
  let xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
  let ip = xForwardedFor || req.connection.remoteAddress;
      
  if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
  
  let startDate = moment(moment().date()._d).set({
          hour: 0,
          minute: 0,
          second: 0
        })
  
  let endDate = moment(moment().date()._d).set({
          hour: 23,
          minute: 59,
          second: 59
        })
        
  userDb.find({ 
    ip,
    created: {
      $gte: startDate,
      $lt: endDate
    }
  }).exec((err, data) => {
    if(err) throw err;
    else {
      res.status(200).success(data.length, "This is you ip count.")
    }
  })
}

const logout = function(req, res) {
  req.checkHeaders("x-auth-token", "No token was found.").exists();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).failure("Errors", {
      errors: errors
    });
  }

  let token = req.headers["x-auth-token"];
  userDb.findByToken(token).exec((err, data) => {
    if (err) throw err;
    else if (!data) res.failure("No user was found");
    else {
      userDb.removeToken(data._id);
      res.success(data, "User logged out successfully.");
    }
  });
};


const deleteAccount = function(req, res) {
  req.checkHeaders("x-auth-token", "No token was found.").exists();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).failure("Errors", {
      errors: errors
    });
  }

  let token = req.headers["x-auth-token"];
  userDb.findByToken(token).exec((err, data) => {
    if (err) throw err;
    else if (!data) res.failure("No user was found");
    else {
      userDb.deleteAccount(data._id);
      res.success(data, "Account deleted successfully.");
    }
  });
};

//non route functions
const newUserRegister = (req, res, user) => {
  userDb.findByMail(req.body.email.toString().trim()).exec((err, data) => {
    if (err) throw err;
    else if (data) res.failure("There is already someone with this email.");
    else {
      let xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
      let ip = xForwardedFor || req.connection.remoteAddress;
      
      if (ip.includes('::ffff:')) {
            ip = ip.split(':').reverse()[0]
        }
      
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password.toString(), salt);
      user.password = hash;
      
      let token = jwt.sign(
        {
          email: user.email,
          password: user.password
        },
        "userSecret"
      );
      user.token = token;
      userDb(user).save();
      res.status(200).success(user);
    }
  });
}

module.exports = {
  login,
  register,
  confirmProfile,
  ipCount,
  logout,
};
