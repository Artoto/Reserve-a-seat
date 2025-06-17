const express = require("express");
const router = express.Router();
// Controllers
const storeRegisterControllers = require("../controllers/storeRegisterControllers.js");
const storeEvenetControllers = require("../controllers/storeEventContorller.js");
const storeLoginControllers = require("../controllers/storeLoginControllers.js");
const storeOrderParticipantsControllers = require("../controllers/storeOrderParticipantsControllers.js");
const storeEditControllers = require("../controllers/storeEditControllers.js");
const storeDeleteParticipantControllers = require("../controllers/storeDeleteParticipantControllers.js");
// Middleware deleteParticipant
const requestLogger = require("../middleware/requestLogApiMiddleware.js");
// User Routes
router.post(
  "/user/events/register",
  requestLogger,
  storeRegisterControllers.registerParticipant
);
router.post(
  "/user/events/list",
  requestLogger,
  storeEvenetControllers.eventList
);
router.post("/user/login", requestLogger, storeLoginControllers.joinLogin);
// Admin Routes
router.post("/admin/login", requestLogger, storeLoginControllers.login);
router.post(
  "/admin/events/edit",
  requestLogger,
  storeEditControllers.editUserParticipant
);
router.post(
  "/admin/event/update-participant",
  requestLogger,
  storeOrderParticipantsControllers.orderParticipants
);
router.post(
  "/admin/event/delete-participant",
  requestLogger,
  storeDeleteParticipantControllers.deleteParticipant
);

module.exports = router;
