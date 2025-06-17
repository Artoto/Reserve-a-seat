const RequestLog = require("../models/requestLogModels");

const requestLogger = async (req, res, next) => {
  try {
    await RequestLog.create({
      requestType: "Web",
      responseStatusCode: res.statusCode,
      requestUrl: req.originalUrl,
      requestMethod: req.method,
      requestBody: req.body,
      responseBody: res.locals.data || {},
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Request logging failed:", err);
  }
  next();
};

module.exports = requestLogger;
