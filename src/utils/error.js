module.exports = function sendError(message, res, status = 400) {
  return res.status(status).send({ error: message });
};
