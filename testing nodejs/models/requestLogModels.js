const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestLogSchema = new Schema({
  requestType: {
    type: String,
    required: [true, "Request type is required"],
  },
  requestUrl: {
    type: String,
    required: [true, "Request URL is required"],
  },
  requestMethod: {
    type: String,
    required: [true, "Request method is required"],
  },
  requestBody: {
    type: Object,
    required: false,
  },
  responseStatusCode: {
    type: Number,
    required: [true, "Response status code is required"],
  },
  responseBody: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RequestLog = mongoose.model("request_log", requestLogSchema);
module.exports = RequestLog;
