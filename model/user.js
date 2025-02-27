const mongoose = require("mongoose");
const validator = require("validator");
const { ROLES, TABLES } = require("../constants");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is Required"],
      unique: true,
      lowercase: true,
    },

    designation: String,

    email: {
      type: String,
      // required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Not a valid Email"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      select: false,
      minlength: [6, "Password should be atleast 6 characters long"],
      trim: true,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (cp) {
          return cp === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: { type: String, enum: ["admin", "accountant"] },

    verified: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    image: String,
    imageKey: {
      type: String,
      select: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
    disabledReason: String,
    disabledMsg: String,
    disabledOn: Date,

    verificationOtp: Number,
    verificationOtpExpires: String,
    passwordResetOtp: Number,
    passwordResetOtpExpires: String,
    passwordResetToken: String,
  },
  { timestamps: true }
);

userSchema.statics.registerUser = async function (payload) {
  const createdUser = await this.create(payload);
  if (createdUser) return createdUser;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createVerificationOTP = function () {
  const verificationOTP = Math.floor(Math.random() * Math.pow(10, 6));
  this.verificationOtp = verificationOTP;
  this.verificationOtpExpires = Date.now() + 60 * 60 * 1000;

  return verificationOTP;
};

userSchema.methods.isCorrectPassword = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

userSchema.methods.createResetPasswordOTP = function () {
  const resetOTP = Math.floor(Math.random() * Math.pow(10, 6));

  this.passwordResetOtp = resetOTP;
  this.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000;

  return resetOTP;
};

// METHODS FOR CHECKING PASSWORD CHANGE AFTER token ISSUED
userSchema.methods.PasswordChangedAfter = function (jwtIssuedTime) {
  if (this.passwordChangedAt) {
    const _passwordChangedAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtIssuedTime < _passwordChangedAt;
  }
  return false;
};

module.exports = mongoose.model(TABLES.USER, userSchema);
