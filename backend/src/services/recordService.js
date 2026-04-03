import FinancialRecord from '../models/FinancialRecord.js';
import ApiError from '../utils/ApiError.js';

const escapeRegex = (string) => string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export const create = async (data) => {
  return await FinancialRecord.create(data);
};

export const getAll = async ({ type, category, from, to, page = 1, limit = 20 }) => {
  const filter = { isDeleted: false };

  if (type) filter.type = type;

  if (category) {
    const safeCategory = escapeRegex(category);
    filter.category = new RegExp(safeCategory, 'i');
  }

  if (from || to) {
    filter.date = {};
    if (from) {
      filter.date.$gte = new Date(from);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      filter.date.$lte = toDate;
    }
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .sort({ date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('createdBy', 'name email')
      .lean(), 
    FinancialRecord.countDocuments(filter),
  ]);

  return { 
    records, 
    total, 
    page: pageNum, 
    pages: Math.ceil(total / limitNum) || 1 
  };
};

export const update = async (id, data) => {
  delete data.createdBy;
  delete data.isDeleted;

  const record = await FinancialRecord.findOneAndUpdate(
    { _id: id, isDeleted: false }, 
    data, 
    { new: true, runValidators: true }
  ).lean();

  if (!record) {
    throw new ApiError(404, 'Financial record not found');
  }
  
  return record;
};

export const softDelete = async (id) => {
  const record = await FinancialRecord.findByIdAndUpdate(
    id, 
    { isDeleted: true }, 
    { new: true }
  ).lean();

  if (!record) {
    throw new ApiError(404, 'Financial record not found');
  }
  
  return record;
};