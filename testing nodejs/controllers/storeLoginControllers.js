const Admin = require("../models/adminModels.js");
const userParticipants = require("../models/userParticipant.js");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบ input เพื่อป้องกัน SQL Injection
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // รายการ keyword/สัญลักษณ์ที่มักใช้ใน SQL Injection
    const sqlInjectionPattern =
      /('|--|;|=|or\b|and\b|select\b|insert\b|update\b|delete\b|drop\b|union\b|exec\b|xp_|sp_|where\b|from\b|information_schema|sleep\(|benchmark\(|\*|#)/i;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !emailRegex.test(email) ||
      password.length > 128 ||
      sqlInjectionPattern.test(password) ||
      sqlInjectionPattern.test(email)
    ) {
      return res.status(400).json({
        status: 400,
        message: "invalid username or password.",
      });
    }
    Admin.findOne({ am_email: email }).then((user) => {
      if (user) {
        let cmp = bcrypt
          .compare(password, user.am_password)
          .then((match) => {
            if (match) {
              req.session.userId = user._id;
              req.session.userName = `${user.am_first_name} ${user.am_middle_name} ${user.am_last_name}`;
              req.session.userRole = user.am_role;
              res.status(200).json({
                status: 200,
                message: "Login Successfuly.",
                rediirect: "/admin/",
              });
            } else {
              res.status(500).json({
                status: 500,
                message: "Login Fail.",
                rediirect: "",
              });
            }
          })
          .catch((err) => {
            console.log("err", err);
            res.status(500).json({
              status: 500,
              message: `Error: ${err.message}`,
              rediirect: "",
            });
          });
      } else {
        res.status(500).json({
          status: 500,
          message: "Login Fail.",
          rediirect: "",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Error: ${error.message}`,
      rediirect: "",
    });
  }
};

exports.joinLogin = (req, res) => {
  try {
    const { phone, id } = req.body;
    // รายการ keyword/สัญลักษณ์ที่มักใช้ใน SQL Injection
    const sqlInjectionPattern =
      /('|--|;|=|or\b|and\b|select\b|insert\b|update\b|delete\b|drop\b|union\b|exec\b|xp_|sp_|where\b|from\b|information_schema|sleep\(|benchmark\(|\*|#)/i;

    if (
      typeof phone !== "string" ||
      phone.length > 128 ||
      sqlInjectionPattern.test(phone)
    ) {
      return res.status(400).json({
        status: 400,
        message: "invalid phone.",
      });
    }
    userParticipants
      .findOne({ up_phone_number: phone, up_event_id: id })
      .then((user) => {
        if (user) {
          req.session.userParticipantsId = user._id;
          req.session.userEventId = user.up_event_id;
          res.status(200).json({
            status: 200,
            message: "Login Successfuly.",
            rediirect: `/event/user-participants/${user.up_event_id}`,
          });
        } else {
          res.status(500).json({
            status: 500,
            message: "Login Fail.",
            rediirect: "",
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Error: ${error.message}`,
      rediirect: "",
    });
  }
};
