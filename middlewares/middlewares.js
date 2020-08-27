module.exports = {
  isLoggedMiddleware: (req, res, next) => {
    if (!req.session.currentUser) {
      return res.render("/login");
    }
    next();
  },
};
