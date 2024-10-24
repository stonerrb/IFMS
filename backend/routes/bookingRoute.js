const express = require("express");
const router = express.Router();

const { addFloor } = require("../controllers/floorController");
const userModel = require("../models/userModel");
const roomModel = require("../models/roomModel");
const floorModel = require("../models/floorModel");
const commitSchema = require("../models/commitSchema");
router.use(express.json());

route.get("/floors", async (req, res) => {
  try {

    const { seats, projector, whiteboard, speakerSystem } = req.query;

    const floors = await floorModel.find();
    res.status(200).json(floors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});