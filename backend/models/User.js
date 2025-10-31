const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],


    preferences: {
      cuisines: { type: [String], default: [] },
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 5000 },
      },
      location: { type: String, default: "" },
      hasTableBooking: { type: Boolean, default: false },
      hasOnlineDelivery: { type: Boolean, default: false },
      isDeliveringNow: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.updatePreferences = function (newPrefs) {
  this.preferences = { ...this.preferences, ...newPrefs };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
