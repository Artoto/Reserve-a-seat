const mongoose = require("mongoose");
const events = require("../models/eventModels.js");
const userParticipants = require("../models/userParticipant.js");

function pregFullName(fullname) {
  const arrPrefix = [
    { name: "นาย", variable: "title" },
    { name: "นางสาว", variable: "title" },
    { name: "นาง", variable: "title" },
    { name: "ดร.", variable: "title" },
    { name: "ผศ.", variable: "title" },
    { name: "รศ.", variable: "title" },
    { name: "ศ.", variable: "title" },
    { name: "Mr.", variable: "title" },
    { name: "Mrs.", variable: "title" },
    { name: "Miss", variable: "title" },
    { name: "Ms.", variable: "title" },
    { name: "Dr.", variable: "title" },
    { name: "Prof.", variable: "title" },
    { name: "Sir", variable: "title" },
    { name: "Madam", variable: "title" },
    { name: "Lord", variable: "title" },
    { name: "Lady", variable: "title" },
  ];

  let prefix = "";
  let firstName = "";
  let middleName = "";
  let lastName = "";

  for (const p of arrPrefix) {
    if (fullname.toLowerCase().startsWith(p.name.toLowerCase())) {
      prefix = p.name;
      fullname = fullname.slice(prefix.length).trim();
      break;
    }
  }

  const names = fullname.split(" ").filter(Boolean);

  if (names.length === 1) {
    firstName = names[0];
  } else if (names.length === 2) {
    firstName = names[0];
    lastName = names[1];
  } else if (names.length === 3) {
    firstName = names[0];
    middleName = names[1];
    lastName = names[2];
  } else if (names.length > 3) {
    firstName = names.shift() + " " + names.shift();
    lastName = names.join(" ");
  }

  return {
    prefix,
    firstName,
    middleName,
    lastName,
  };
}

exports.loginPage = (req, res) => {
  res.render("login");
};

exports.logout = (req, res) => {
  req.session.userId = "";
  return res.redirect("/admin/login");
};

exports.indexPage = async (req, res) => {
  res.locals.title = "Event Management";
  res.render("event_management");
};

exports.eventDetailManagement = async (req, res) => {
  const { id } = req.params;
  const eventDetail = await events.findById(id);
  const participants = await userParticipants.find({ up_event_id: id }).sort({
    up_no: 1,
  });
  let participants_number_last = participants.length;
  // สร้างอาร์เรย์ที่มีตำแหน่งทั้งหมด (ค่าตั้งต้นเป็น null)
  let seatingArrangement = new Array(eventDetail.et_participant).fill(null);
  // เติมข้อมูลจาก participants ลงในตำแหน่งที่ถูกต้อง
  participants.forEach((participant) => {
    // ตรวจสอบว่ามี up_no ที่ตรงกับตำแหน่งหรือไม่
    const seatIndex = participant.up_no - 1; // การแปลงจาก 1-index เป็น 0-indexed
    if (seatIndex >= 0 && seatIndex < eventDetail.et_participant) {
      seatingArrangement[seatIndex] = participant;
    }
  });
  res.locals.title = "Event Management";
  res.render("event_detail_management", {
    id: id,
    events: eventDetail,
    participants: participants,
    participants_number_last: participants_number_last,
    seatingArrangement: seatingArrangement,
  });
};

exports.editUserParticipant = async (req, res) => {
  const { id, participant_id } = req.params;
  const participants = await userParticipants.findOne({
    up_event_id: id,
    _id: participant_id,
  });
  let parsedFullName = {};
  if (participants) {
    parsedFullName = pregFullName(participants.up_full_name);
  }
  res.locals.title = "Event Management";
  res.render("edit_user_participants", {
    id: id,
    participant_id: participant_id,
    participants: participants,
    parsedFullName: parsedFullName,
  });
};
