import * as authService from '../services/authService.js';
import ApiResponse from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';

const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  ApiResponse.success(res, data, data.message, 200);
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.verifyRegistrationOtp(req.body);
  setTokenCookie(res, refreshToken);
  ApiResponse.success(res, { user, accessToken }, 'Registration complete!', 201);
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setTokenCookie(res, refreshToken);
  ApiResponse.success(res, { user, accessToken }, 'Login successful', 200);
});

export const refresh = catchAsync(async (req, res) => {
  const incomingRefreshToken = req.cookies?.jwt;
  
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAuth(incomingRefreshToken);
  
  setTokenCookie(res, newRefreshToken);
  
  ApiResponse.success(res, { accessToken }, 'Token refreshed successfully', 200);
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  
  if (refreshToken) {
    const jwtPayload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
    await authService.logout(jwtPayload.id, refreshToken);
  }

  res.clearCookie('jwt', { 
    httpOnly: true, 
    sameSite: 'Strict', 
    secure: process.env.NODE_ENV === 'production' 
  });
  
  ApiResponse.success(res, null, 'Logged out successfully', 200);
});