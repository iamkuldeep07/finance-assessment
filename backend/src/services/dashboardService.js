import FinancialRecord from "../models/FinancialRecord.js";


const buildMatchStage = (query = {}) => {
  const match = { isDeleted: false };
  
  if (query.startDate || query.endDate) {
    match.date = {};
    if (query.startDate) match.date.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setUTCHours(23, 59, 59, 999); 
      match.date.$lte = end;
    }
  }
  return { $match: match };
};

export const getSummary = async (query = {}) => {
  const [summary] = await FinancialRecord.aggregate([
    buildMatchStage(query),
    {
      $group: {
        _id: null,
        totalIncome:  { $sum: { $cond: [{ $eq: ['$type', 'income']  }, '$amount', 0] } },
        totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
      },
    },
    { 
      $project: { 
        _id: 0, 
        totalIncome: 1, 
        totalExpense: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpense'] } 
      } 
    },
  ]);
  return summary ?? { totalIncome: 0, totalExpense: 0, netBalance: 0 };
};

export const getCategoryTotals = async (query = {}) => {
  return await FinancialRecord.aggregate([
    buildMatchStage(query),
    { 
      $group: { 
        _id: { type: '$type', category: '$category' }, 
        total: { $sum: '$amount' } 
      } 
    },
    { $sort: { total: -1 } },
  ]);
};

export const getMonthlyTrends = async (query = {}) => {
  return await FinancialRecord.aggregate([
    buildMatchStage(query),
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

export const getRecentActivity = async (query = {}) => {
  const limitNum = Math.max(1, Number(query.limit) || 10);
  const matchStage = buildMatchStage(query).$match;

  return await FinancialRecord.find(matchStage)
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .populate('createdBy', 'name')
    .lean();
};