module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ExpenseFlow API is running',
    timestamp: new Date().toISOString(),
  });
};