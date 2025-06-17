const express = require("express");
const router = express.Router();
// Controllers
const renderControllers = require("../controllers/indexControllers.js");
const adminControllers = require("../controllers/adminControllers.js");
const eventControllers = require("../controllers/eventControllers.js");
const userParticipantsControllers = require("../controllers/userParticipantsControllers.js");
// Middleware
const requestLogger = require("../middleware/requestLogWebMiddleware.js");
const authMiddleWare = require("../middleware/adminAuthMiddleware.js");
const LogoutMiddleware = require("../middleware/adminLogoutMiddleware.js");
const redirectAuthMiddleware = require("../middleware/redirectAuthMiddleware.js");
const userAuthMiddleware = require("../middleware/userAuthMiddleware.js");
// user Routes
router.get("/", requestLogger, renderControllers.indexPage);
router.get("/event/list", requestLogger, eventControllers.eventListPage);
router.get(
  "/event/detail/:id",
  requestLogger,
  eventControllers.eventDetailPage
);
router.get(
  "/event/user-participants/:id",
  userAuthMiddleware,
  userParticipantsControllers.participants
);
// Admin Routes
router.get("/admin/", redirectAuthMiddleware, adminControllers.indexPage);
router.get(
  "/admin/event/:id",
  redirectAuthMiddleware,
  adminControllers.eventDetailManagement
);
router.get(
  "/admin/event/:id/:participant_id",
  redirectAuthMiddleware,
  adminControllers.editUserParticipant
);
router.get("/admin/login", authMiddleWare, adminControllers.loginPage);
router.get("/admin/logout", LogoutMiddleware, adminControllers.logout);

module.exports = router;
