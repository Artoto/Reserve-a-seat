const mongoose = require("mongoose");
const events = require("../models/eventModels.js");
const userParticipants = require("../models/userParticipant.js");

exports.eventListPage = async (req, res) => {
  res.locals.title = "Event";
  res.render("event_list");
};

exports.eventDetailPage = async (req, res) => {
  const { id } = req.params;
  let userParticipantsId = req.session.userParticipantsId;
  let userEventId = req.session.userEventId;
  const objectId = new mongoose.Types.ObjectId(id);
  const eventDetail = await events.findById(id);
  const participants = await userParticipants.find({ up_event_id: id }).sort({
    up_no: 1,
  });
  let eventOther = await events.aggregate([
    {
      $match: {
        _id: { $ne: objectId },
      },
    },
    {
      $lookup: {
        from: "user_participants",
        localField: "_id",
        foreignField: "up_event_id",
        as: "user_participants",
      },
    },
    {
      $addFields: {
        use_participants: { $size: "$user_participants" },
      },
    },
    {
      $project: {
        user_participants: 0,
      },
    },
    {
      $sort: { et_create_at: -1 },
    },
    {
      $limit: 3,
    },
  ]);
  let seatingArrangement = [];
  if (participants.length > 0) {
    // สร้างอาร์เรย์ที่มีตำแหน่งทั้งหมด (ค่าตั้งต้นเป็น null)
    seatingArrangement = new Array(eventDetail.et_participant).fill(null);
    // เติมข้อมูลจาก participants ลงในตำแหน่งที่ถูกต้อง
    participants.forEach((participant) => {
      // ตรวจสอบว่ามี up_no ที่ตรงกับตำแหน่งหรือไม่
      const seatIndex = participant.up_no - 1; // การแปลงจาก 1-index เป็น 0-indexed
      if (seatIndex >= 0 && seatIndex < eventDetail.et_participant) {
        seatingArrangement[seatIndex] = participant;
      }
    });
  }
  let participants_number_last =
    seatingArrangement.length > 0
      ? seatingArrangement
          .map((item, key) => {
            if (item === null) {
              return key + 1;
            }
          })
          .filter((item) => item && item)[0]
      : 0;

  res.locals.title = "Event";
  res.render("event_detail", {
    error: req.flash("validationErrors"),
    id: id,
    userEventId: userEventId,
    userParticipantsId: userParticipantsId,
    events: eventDetail,
    participants: participants,
    other: eventOther,
    participants_number_last: participants_number_last,
  });
};
