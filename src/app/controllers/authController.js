const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const sendError = require("../../utils/error");

const router = express.Router();

function generateToken(params = {}) {
  // 86400 == 1 day
  return jwt.sign({ id: params.id }, authConfig.secret, {
    expiresIn: 86400
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return sendError("User already exists", res);

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user, token: generateToken({ id: user._id }) });
  } catch (e) {
    return sendError("User register failed", res);
  }
});

router.get("/getUser", async (req, res) => {
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

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) return sendError("Invalid token", res, 401);

    const user = await User.findById(decoded.id);

    res.send({ user, token: generateToken({ id: user._id }) });
  });
});

router.post("/authenticate", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return sendError("You need to send [email] and [password]", res);

  const { email, password } = req.body;

  const defaultError = "Authentication failed";

  const user = await User.findOne({ email }).select("+password");

  if (!user) return sendError(defaultError, res);

  if (!(await bcrypt.compare(password, user.password))) {
    return sendError(defaultError, res);
  }

  user.password = undefined;

  res.send({ user, token: generateToken({ id: user._id }) });
});

module.exports = app => app.use("/auth", router);
