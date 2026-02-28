const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    dateTime: { type: Date },

    venue: {
      name: String,
      address: String,
    },

    city: {
      type: String,
      default: "Sydney",
    },

    description: String,

    category: [String],

    imageUrl: String,

    sourceWebsite: String,

    originalUrl: {
      type: String,
      unique: true, // prevents duplicate events
    },

    lastScrapedAt: Date,

    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new",
    },

    importedAt: Date,
    importedBy: String,
    importNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);