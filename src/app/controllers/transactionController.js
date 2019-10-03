const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Transaction = require("../models/Transaction");
const sendError = require("../../utils/error");

const router = express.Router();

router.use(authMiddleware);

router.post("/register", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);

    res.send({ transaction });
  } catch (e) {
    return sendError("Transaction register failed", res);
  }
});

router.get("/findByUser", async (req, res) => {
  const { userId } = req.query;

  if (!userId) return sendError("You need to pass the userId", res);

  try {
    const transactions = await Transaction.find({ userId: userId });

    res.send({ transactions });
  } catch (e) {
    return sendError("Did not found transaction with this userId", res);
  }
});

module.exports = app => app.use("/transactions", router);
