const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

router.post("/:id/register", eventController.registerForEvent);
// Route khusus untuk menghapus pendaftar
router.delete("/registrations/:registrationId", eventController.deleteRegistration);

module.exports = router;
