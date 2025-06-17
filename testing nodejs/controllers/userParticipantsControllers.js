const userParticipants = require("../models/userParticipant.js");
const events = require("../models/eventModels.js");

exports.participants = async (req, res) => {
  const { id } = req.params;
  let userParticipantsId = req.session.userParticipantsId;
  let userEventId = req.session.userEventId;
  if (id !== userEventId) {
    return res.render("event_detail");
  }

  const participants = await userParticipants.findOne({
    _id: userParticipantsId,
    up_event_id: userEventId,
  });

  const eventDetail = await events.findById(userEventId);
  const participantsList = await userParticipants
    .find({ up_event_id: userEventId })
    .sort({
      up_no: 1,
    });
  let participants_number_last = participantsList.length;
  // สร้างอาร์เรย์ที่มีตำแหน่งทั้งหมด (ค่าตั้งต้นเป็น null)
  let seatingArrangement = new Array(eventDetail.et_participant).fill(null);
  // เติมข้อมูลจาก participants ลงในตำแหน่งที่ถูกต้อง
  participantsList.forEach((participant) => {
    // ตรวจสอบว่ามี up_no ที่ตรงกับตำแหน่งหรือไม่
    const seatIndex = participant.up_no - 1; // การแปลงจาก 1-index เป็น 0-indexed
    if (seatIndex >= 0 && seatIndex < eventDetail.et_participant) {
      seatingArrangement[seatIndex] = participant;
    }
  });
  res.locals.title = "Event";
  res.render("user_participants", {
    participants: participants,
    participants_number_last: participants_number_last,
    events: eventDetail,
    participantsList: participantsList,
    seatingArrangement: seatingArrangement,
  });
};
