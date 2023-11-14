const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    loginAttemptsCnt : {
        type: Number,
        default: 0
    },
    email : {
        type: String,
        required: true,
        index:{unique:true}
    },
    role : {
        type: String,
        enum: ['administrator','user'],
        default: 'user'
    },
    companies_manager : {
        type: Array,
        default: [] //{company_id:"", company_name:"", regDate:"", delete_yn:""}
    },
    companies_operator : {
        type: Array,
        default: [] //{company_id:"", company_name:"", regDate:"", delete_yn:""}
    },
    accountLock : {
        type: String,
        default: "n"
    },
    delete_yn : {
        type: String,
        default: "n"
    },
    regDate : {
        type: Date,
        default: new Date()
    },
    regUser : {
        type: String,
        required: true
    },
    updDate : {
        type: Date,
        default: new Date()
    },
    updUser : {
        type: String,
        required: true
    }

})

UserSchema.pre("save", function(next){

    var user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
          });
        });
      } else {
        next();
      }

})

UserSchema.pre("updateOne", function(next){

    var user = this;
    if (user._update.password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user._update.password, salt, function (err, hash) {
                if (err) return next(err);
                user._update.password = hash;
                next();
            });
        });
      } else {
        next();
      }
})

// UserSchema.methods.comparePassword =  function (plainPassword, cb) {
//     bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

UserSchema.methods.comparePassword = async function (plainPassword) {
    let res = await bcrypt.compare(plainPassword, this.password);
    return res;
};

const Users=mongoose.model('user',UserSchema)
module.exports=Users