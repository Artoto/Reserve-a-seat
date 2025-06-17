const Events = require("../models/eventModels.js");

exports.eventList = async (req, res) => {
  const { page = 1, limit = 10, search } = req.body;
  const skip = (page - 1) * limit;

  try {
    // แปลง limit เป็นตัวเลข
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new Error("Invalid limit value");
    }

    // สร้าง query สำหรับค้นหา
    let matchQuery = {};

    if (search) {
      // ใช้ $regex เพื่อค้นหาข้อความที่ตรงกับคำค้นหาจากฐานข้อมูล et_name
      matchQuery.et_name = { $regex: search, $options: "i" }; // 'i' คือการค้นหาไม่สนใจตัวพิมพ์ใหญ่หรือตัวพิมพ์เล็ก
    }

    // ใช้ aggregation เพื่อค้นหาข้อมูล
    const events = await Events.aggregate([
      { $match: matchQuery },
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
        $limit: parsedLimit,
      },
      {
        $skip: skip,
      },
    ]);

    // ส่งข้อมูลกลับไปยังผู้ใช้
    res.status(200).json({
      status: 200,
      message: "success",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
