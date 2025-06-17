const userParticipant = require("../models/userParticipant.js");

exports.orderParticipants = async (req, res) => {
  const { event_id, draggedIndex, targetIndex } = req.body;

  try {
    // ค้นหาผู้เข้าร่วมที่ถูกลากและผู้เข้าร่วมที่เป็นเป้าหมาย
    let draggedParticipant = await userParticipant.findOne({
      up_event_id: event_id,
      up_no: draggedIndex,
    });
    let targetParticipant = await userParticipant.findOne({
      up_event_id: event_id,
      up_no: targetIndex,
    });

    if (draggedParticipant) {
      draggedParticipant.up_no = targetIndex;

      await draggedParticipant.save();
    }
    if (targetParticipant) {
      targetParticipant.up_no = draggedIndex;
      await targetParticipant.save();
    }
    res
      .status(200)
      .json({ status: 200, message: "Participants updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Error updating participants" });
  }
};
