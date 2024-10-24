const express = require("express");
const router = express.Router();

const { addFloor } = require("../controllers/floorController");
const userModel = require("../models/userModel");
const roomModel = require("../models/roomModel");
const floorModel = require("../models/floorModel");
const commitSchema = require("../models/commitSchema");
router.use(express.json());

const { bookRoom } = require("../controllers/bookingController");

router.patch('/floors/:floorId/rooms/:roomId/book', bookRoom);
  
module.exports = router;