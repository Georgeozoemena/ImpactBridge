const response = (_req, res, next) => {
  res.ok = (data = {}, status = 200) => res.status(status).json({ success: true, ...data });
  res.fail = (message, status = 400, extra = {}) =>
    res.status(status).json({ success: false, message, ...extra });
  next();
};

module.exports = response;
