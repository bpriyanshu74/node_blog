const { validateToken } = require("../services/auth");

function checkCookieForAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (err) {}

    next();
  };
}

module.exports = { checkCookieForAuthentication };
