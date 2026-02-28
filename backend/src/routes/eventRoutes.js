const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const scrapeTimeOut = require("../scrapers/timeOutScraper");
const TicketLead = require("../models/TicketLead");

// Get all events
router.get("/scrape", async (req, res) => {
  await scrapeTimeOut();
  res.json({ message: "Scraping completed" });
});

// Save email before redirect
router.post("/:eventId/lead", async (req, res) => {
  try {
    const { email, consent } = req.body;

    if (!email || consent !== true) {
      return res.status(400).json({ message: "Email and consent required" });
    }

    const lead = await TicketLead.create({
      event: req.params.eventId,
      email,
      consent,
    });

    res.json({ message: "Lead saved successfully", lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:eventId/import", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "imported";
    event.importedAt = new Date();
    event.importedBy = req.body.importedBy || "Admin";
    event.importNotes = req.body.importNotes || "";

    await event.save();

    res.json({ message: "Event imported successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;