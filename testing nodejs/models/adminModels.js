const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  am_email: {
    type: String,
    required: [true, "Email is required."], // แก้เป็น required แทน require
  },
  am_password: {
    type: String,
    required: [true, "Password is required."], // แก้เป็น required แทน require
  },
  am_first_name: {
    type: String,
    required: [true, "First name is required."], // แก้เป็น required แทน require
  },
  am_middle_name: {
    type: String,
    required: [true, "Middle name is required."], // แก้เป็น required แทน require
  },
  am_last_name: {
    type: String,
    required: [true, "Last name is required."], // แก้เป็น required แทน require
  },
  am_role: {
    type: String,
    required: [true, "Role is required."], // แก้เป็น required แทน require
  },
  am_create_at: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
