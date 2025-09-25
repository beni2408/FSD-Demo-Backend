export const errorHAndler = (err, req, res, next) => {
  console.stack(err);
  req.stack(err.status || 500).json({
    message: err.message || "Server Error",
  });
  next();
};
