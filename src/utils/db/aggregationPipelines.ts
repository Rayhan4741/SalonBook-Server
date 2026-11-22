export const revenueByServicePipeline = [
  { $match: { status: 'paid' } },
  { $group: { _id: '$serviceId', totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $sort: { totalRevenue: -1 } }
];
