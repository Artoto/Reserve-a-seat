const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  et_name: {
    type: String,
    required: [true, "Event Name is required"],
  },
  et_image: {
    type: String,
    required: [true, "Image URL is required"],
  },
  et_type: {
    type: String,
    required: [true, "Event type is required"],
  },
  et_location: {
    type: String,
    required: [true, "Location is required"],
  },
  et_description: {
    type: String,
    required: false,
  },
  et_start_date: {
    type: Date,
    required: [true, "Start date is required"],
  },
  et_end_date: {
    type: Date,
    required: [true, "End date is required"],
  },
  et_participant: {
    type: Number,
    min: [1, "Participant count must be at least 1"],
    required: [true, "Participant count is required"],
  },
  et_create_at: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
