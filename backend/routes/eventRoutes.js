const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createEventRules, updateEventRules, registerEventRules, validate } = require("../middlewares/validators/eventValidator.js");
const { eventRegisterLimiter } = require("../middlewares/rateLimiter");

const eventUpload = upload.fields([{ name: "imageBanner", maxCount: 1 }, { name: "contentImages", maxCount: 10 }]);

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.get("/:id/registrations", protect, requireAdmin, eventController.getEventRegistrations);

router.post("/", protect, requireAdmin, eventUpload, createEventRules(), validate, eventController.createEvent);
router.put("/:id", protect, requireAdmin, eventUpload, updateEventRules(), validate, eventController.updateEvent);
router.delete("/:id", protect, requireAdmin, eventController.deleteEvent);

router.post("/:id/register", eventRegisterLimiter, registerEventRules(), validate, eventController.registerForEvent);
router.delete("/registrations/:registrationId", protect, requireAdmin, eventController.deleteRegistration);

module.exports = router;
