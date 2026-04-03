import * as recordService from '../services/recordService.js';
import ApiResponse from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js'; 

export const create = catchAsync(async (req, res) => {
  const record = await recordService.create({ ...req.body, createdBy: req.user._id });
  ApiResponse.success(res, record, 'Record created', 201);
});

export const getAll = catchAsync(async (req, res) => {
  const data = await recordService.getAll(req.query);
  ApiResponse.success(res, data);
});

export const update = catchAsync(async (req, res) => {
  const record = await recordService.update(req.params.id, req.body);
  ApiResponse.success(res, record, 'Record updated');
});

export const remove = catchAsync(async (req, res) => {
  await recordService.softDelete(req.params.id);
  ApiResponse.success(res, null, 'Record deleted');
});