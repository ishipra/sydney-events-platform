const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

const scrapeTimeOut = async () => {
  try {
    const url = "https://www.timeout.com/sydney/things-to-do";

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const scrapedEvents = [];

$("a[href*='/sydney/']").each((i, el) => {
  const title = $(el).text().trim();
  const link = "https://www.timeout.com" + $(el).attr("href");

  if (title && link && title.length > 5) {
    scrapedEvents.push({
      title,
      originalUrl: link,
      sourceWebsite: "TimeOut",
      lastScrapedAt: new Date(),
    });
  }
});

    // === STATUS DETECTION LOGIC ===
    for (const scraped of scrapedEvents) {
      const existing = await Event.findOne({
        originalUrl: scraped.originalUrl,
      });

      if (!existing) {
        // NEW EVENT
        await Event.create({
          ...scraped,
          status: "new",
        });
      } else {
        // Check if title changed
        if (existing.title !== scraped.title) {
          existing.title = scraped.title;
          existing.status = "updated";
          existing.lastScrapedAt = new Date();
          await existing.save();
        } else {
          existing.lastScrapedAt = new Date();
          await existing.save();
        }
      }
    }

    // === INACTIVE DETECTION ===
    const allEvents = await Event.find({ sourceWebsite: "TimeOut" });

    for (const event of allEvents) {
      const stillExists = scrapedEvents.find(
        (e) => e.originalUrl === event.originalUrl
      );

      if (!stillExists) {
        event.status = "inactive";
        await event.save();
      }
    }

    console.log("Scraping completed successfully");
  } catch (error) {
    console.error("Scraping failed:", error.message);
  }
};

module.exports = scrapeTimeOut;