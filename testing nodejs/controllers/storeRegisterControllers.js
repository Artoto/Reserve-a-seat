const RegisterParticipant = require("../models/userParticipant.js");

exports.registerParticipant = async (req, res) => {
  const {
    eventId,
    titleName,
    firstName,
    middleName,
    lastName,
    mobilePhone,
    participantNumber,
  } = req.body;

  let data = {
    up_event_id: eventId,
    up_full_name: `${titleName}${firstName} ${middleName} ${lastName}`,
    up_phone_number: mobilePhone,
    up_no: participantNumber,
  };

  const check_participant = await RegisterParticipant.findOne({
    up_event_id: eventId,
    $or: [
      { up_phone_number: mobilePhone }, // ค้นหาตามเบอร์โทรศัพท์
      {
        up_full_name: {
          $regex: `^${titleName}${firstName} ${middleName} ${lastName}$`,
          $options: "i",
        },
      }, // ค้นหาตามชื่อ
    ],
  });

  if (check_participant) {
    return res.status(400).json({
      status: 400,
      message: "Participant already registered with this phone number or name",
    });
  }

  RegisterParticipant.create(data)
    .then((participant) => {
      if (participant) {
        req.session.userParticipantsId = participant._id;
        req.session.userEventId = participant.up_event_id;
        res.status(200).json({
          status: 200,
          message: "Participant registered successfully",
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Participant registered fail",
        });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: "Participant registered fail",
        });
      }
    });
};
