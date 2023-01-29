
module.exports = {
  ensureAuth: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
  ensureGuest: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/uploads");
    } else {
      return next();
    }
  },
  ensureToken: function(req, res, next) {
    if (req.body.token === process.env.SECRET_TOKEN) {
      return next();
    } else {
      res.render("error");
    }
  }
};
