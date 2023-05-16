const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    sex:{
      type: String,
      enum:["male","female"]
    },
    password:{
      type: String,
      minlength: 8,
      select: false
    },
    googleId: String,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  });
  userSchema.statics.findOrCreate = async function (doc) {
    let result = await this.findOne({googleId:doc.googleId});
    if (result) {
        return result;
    } else {
        result = new this(doc);
        return await result.save();
    }
  }
// User
const User = mongoose.model('user', userSchema);

module.exports = User;
