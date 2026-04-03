import * as userService from '../services/userService.js';
import ApiResponse from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';

export const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  ApiResponse.success(res, user, 'Profile fetched successfully', 200);
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, user, 'Profile updated successfully', 200);
});

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  const result = await userService.changePassword(req.user._id, oldPassword, newPassword);
  ApiResponse.success(res, null, result.message, 200);
});


export const getAllUsers = catchAsync(async (req, res) => {
  const data = await userService.getAllUsers(req.query);
  ApiResponse.success(res, data, 'Users fetched successfully', 200);
});

export const toggleStatus = catchAsync(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.id, req.body.isActive);
  
  const statusMsg = user.isActive ? 'activated' : 'deactivated';
  ApiResponse.success(res, user, `User ${statusMsg} successfully`, 200);
});

export const updateRole = catchAsync(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  ApiResponse.success(res, user, `User role updated to ${user.role}`, 200);
});