import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};


export const updateProfile = async (userId, updateData) => {
  const allowedUpdates = { name: updateData.name };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).lean();

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};


export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new ApiError(400, 'Incorrect current password');

 
  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

export const getAllUsers = async ({ page = 1, limit = 10, role }) => {
  const filter = {};
  if (role) filter.role = role;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter)
  ]);

  return {
    users,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1
  };
};

export const toggleUserStatus = async (targetUserId, isActive) => {
  const user = await User.findByIdAndUpdate(
    targetUserId,
    { isActive },
    { new: true }
  ).lean();

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateUserRole = async (targetUserId, newRole) => {
  if (!['viewer', 'analyst', 'admin'].includes(newRole)) {
    throw new ApiError(400, 'Invalid role assignment');
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    { role: newRole },
    { new: true, runValidators: true }
  ).lean();

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};