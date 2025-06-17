const events = require("../models/eventModels.js");

exports.indexPage = async (req, res) => {
  let eventsList = await events.aggregate([
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
  res.locals.title = "Home";
  res.render("index", { eventsList });
};
