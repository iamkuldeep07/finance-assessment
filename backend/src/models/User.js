import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["viewer", "analyst", "admin"],
      default: "viewer",
    },
    
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    passwordChangedAt: Date,
    isActive: { type: Boolean, default: true },
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);


userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});


userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};


userSchema.methods.compareOtp = function (candidate) {
  return bcrypt.compare(candidate, this.otp);
};

export default mongoose.model("User", userSchema);