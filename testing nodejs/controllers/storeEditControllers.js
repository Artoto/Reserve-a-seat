const RegisterParticipant = require("../models/userParticipant.js");

exports.editUserParticipant = async (req, res) => {
  const {
    eventId,
    participant_id,
    titleName,
    firstName,
    middleName,
    lastName,
    mobilePhone,
    participantNumber,
    status,
  } = req.body;

  // ข้อมูลที่ต้องการอัปเดต
  let data = {
    up_full_name: `${titleName} ${firstName} ${middleName} ${lastName}`,
    up_phone_number: mobilePhone,
    up_no: participantNumber,
    up_status: status,
  };

  RegisterParticipant.findOneAndUpdate(
    { _id: participant_id, up_event_id: eventId },
    {
      up_full_name: data.up_full_name,
      up_phone_number: data.up_phone_number,
      up_no: data.up_no,
      up_status: data.up_status,
      up_updated_at: new Date(), // อัปเดตเวลาเมื่อมีการเปลี่ยนแปลง
    },
    { new: true } // ส่งคืนข้อมูลผู้เข้าร่วมที่อัปเดตแล้ว
  )
    .then((participant) => {
      if (participant) {
        // ส่งข้อมูลที่อัปเดตกลับไป
        res.status(200).json({
          status: 200,
          message: "Edit Participant successfully",
          data: participant, // ส่งคืนข้อมูลผู้เข้าร่วมที่อัปเดต
        });
      } else {
        // ถ้าหากไม่พบผู้เข้าร่วม
        res.status(404).json({
          status: 404,
          message: "Participant not found",
        });
      }
    })
    .catch((err) => {
      console.error("Error updating participant:", err);
      res.status(500).json({
        status: 500,
        message: "Edit Participant fail.",
        error: err.message,
      });
    });
};
