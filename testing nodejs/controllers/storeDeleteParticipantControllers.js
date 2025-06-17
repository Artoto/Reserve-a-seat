const userParticipant = require("../models/userParticipant.js");

exports.deleteParticipant = async (req, res) => {
  const { participant_id, eventId } = req.body;
  console.log("participant_id", participant_id);
  console.log("eventId", eventId);
  userParticipant
    .findOneAndDelete({
      _id: participant_id,
      up_event_id: eventId,
    })
    .then((user) => {
      if (res) {
        res.status(200).json({
          status: 200,
          message: "Participant deleted successfully",
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Error deleting participant",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Error deleting participant",
      });
    });
};
