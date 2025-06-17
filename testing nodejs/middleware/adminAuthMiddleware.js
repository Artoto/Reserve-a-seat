const Admin = require("../models/adminModels.js");
const RequestLog = require("../models/requestLogModels");

const authMiddleWare = async (req, res, next) => {
  // บันทึกการขอข้อมูลใน RequestLog
  await RequestLog.create({
    requestType: "Web",
    responseStatusCode: res.statusCode,
    requestUrl: req.originalUrl,
    requestMethod: req.method,
    requestBody: req.body,
    responseBody: res.locals.data || {},
    createdAt: new Date(),
  });
  if (req.session.userId) {
    return res.redirect("/admin/");
  }
  next();
};

module.exports = authMiddleWare;
