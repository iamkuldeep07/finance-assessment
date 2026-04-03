import * as dashService from '../services/dashboardService.js';
import ApiResponse from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js'; 

export const summary = catchAsync(async (req, res) => {
  const data = await dashService.getSummary(req.query);
  ApiResponse.success(res, data);
});

export const categoryTotals = catchAsync(async (req, res) => {
  const data = await dashService.getCategoryTotals(req.query);
  ApiResponse.success(res, data);
});

export const monthlyTrends = catchAsync(async (req, res) => {
  const data = await dashService.getMonthlyTrends(req.query);
  ApiResponse.success(res, data);
});

export const recentActivity = catchAsync(async (req, res) => {
  const data = await dashService.getRecentActivity(req.query);
  ApiResponse.success(res, data);
});