import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import sendMail from "../utils/sendMail.js";  
import { getOtpHtml } from "../utils/html.js"; 

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });




export const register = async ({ name, email, password, role }) => {
  let user = await User.findOne({ email });

  if (user && user.isVerified) {
    throw new ApiError(409, "User with this email already exists.");
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const hashedOtp = await bcrypt.hash(otp, 12);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  if (user) {
    user.name = name;
    user.password = password;
    user.role = role || "viewer";
    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    await User.create({
      name,
      email,
      password,
      role,
      otp: hashedOtp,
      otpExpires,
    });
  }

  const html = getOtpHtml({ email, otp });

  await sendMail({
    email,
    subject: "Verify your account - OTP",
    html,
  });

  console.log("OTP:", otp); // for testing

  return {
    message: "Registration initiated. Please check your email for the OTP.",
  };
};

export const verifyRegistrationOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user)
    throw new ApiError(
      400,
      "User not found. The 10-minute window may have expired.",
    );
  if (user.isVerified)
    throw new ApiError(400, "User is already verified. Please log in.");
  if (user.otpExpires < Date.now())
    throw new ApiError(400, "OTP has expired. Please register again.");

  const isOtpValid = await user.compareOtp(otp);
  if (!isOtpValid) throw new ApiError(400, "Invalid OTP.");

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  if (user.refreshTokens.length > 2) {
  user.refreshTokens.shift();
}

  await user.save();

  return {
    user: { id: user._id, name: user.name, email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
    isVerified: true,
    isActive: true,
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);

    // LIMIT TO 2 DEVICES ONLY
  if (user.refreshTokens.length > 2) {
    user.refreshTokens.shift(); 
  }

  await user.save();

  return {
    user: { id: user._id, name: user.name, email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const refreshAuth = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  // 1. Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // 2. Find user
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // 3. Check if refresh token exists in DB
  if (!user.refreshTokens.includes(incomingRefreshToken)) {
    throw new ApiError(401, "Refresh token not recognized");
  }

  // 4. Generate new tokens
  const newAccessToken = signAccessToken(user._id);
  const newRefreshToken = signRefreshToken(user._id);

  // 5. Replace old refresh token (ROTATION 🔥)
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== incomingRefreshToken
  );

  user.refreshTokens.push(newRefreshToken);

  // 🔥 Maintain max 2 devices
  if (user.refreshTokens.length > 2) {
    user.refreshTokens.shift();
  }

  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (userId, refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findById(userId);

  if (!user) return;

  const initialLength = user.refreshTokens.length;

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );

  if (user.refreshTokens.length !== initialLength) {
    await user.save();
  }
};