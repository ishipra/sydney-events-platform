const cron = require("node-cron");
const scrapeTimeOut = require("../scrapers/timeOutScraper");

const startScraperJob = () => {
  // Runs every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running scheduled scrape...");
    await scrapeTimeOut();
  });

  console.log("Scraper job scheduled (every 6 hours)");
};

module.exports = startScraperJob;