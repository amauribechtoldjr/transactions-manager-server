const sendError = require("../../utils/error");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError("No token provided", res, 401);
  }

  const parts = authHeader.split(" ");

  if (!parts.lentgh === 2) {
    return sendError("Token error", res, 401);
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return sendError("Token malformatted", res, 401);
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return sendError("Invalid token", res, 401);

    req.userId = decoded.id;
    return next();
  });
};
