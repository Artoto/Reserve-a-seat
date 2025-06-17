const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userParticipantSchema = new Schema({
  up_event_id: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event ID is required"],
  },
  up_full_name: {
    type: String,
    required: [true, "Full name is required"],
  },
  up_phone_number: {
    type: String,
    required: [true, "Phone number is required"],
  },
  up_no: {
    type: Number,
    required: false,
    min: [1, "Participant number must be at least 1"],
  },
  up_status: {
    type: Number,
    enum: [0, 1, 2], // 0: pending, 1: confirmed, 2: cancelled
    default: 0,
  },
  up_created_at: {
    type: Date,
    default: Date.now,
  },
  up_updated_at: {
    type: Date,
    default: Date.now,
  },
});

const UserParticipantSchema = mongoose.model(
  "user_participant",
  userParticipantSchema
);
module.exports = UserParticipantSchema;
