require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Bike = require("./models/Bike");

const app = express();
app.use(cors());
app.use(express.json());

// Admin-only routes check a shared key sent in the x-admin-key header.
function requireAdmin(req, res, next) {
  if (req.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Wrong admin key." });
  }
  next();
}

// Public: list all bikes, newest first
app.get("/api/bikes", async (_req, res) => {
  const bikes = await Bike.find().sort({ createdAt: -1 });
  res.json(bikes);
});

// Admin: check key (used by the login box)
app.get("/api/admin/check", requireAdmin, (_req, res) => res.json({ ok: true }));

// Admin: add a bike
app.post("/api/bikes", requireAdmin, async (req, res) => {
  try {
    const bike = await Bike.create(req.body);
    res.status(201).json(bike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: remove a bike
app.delete("/api/bikes/:id", requireAdmin, async (req, res) => {
  await Bike.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API running on :${PORT}`)))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
