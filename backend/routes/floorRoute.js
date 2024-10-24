const express = require("express");
const router = express.Router();

const { addFloor, addRooms, modifyRoom, getFloorCommits, getRoomsFloorID, getFloorsOnly, getQueryFloors, rollbackFloor } = require("../controllers/floorController");
const userModel = require("../models/userModel");
const roomModel = require("../models/roomModel");
const floorModel = require("../models/floorModel");
const commitSchema = require("../models/commitSchema");
router.use(express.json());

router.post("/floors", addFloor);

router.put("/floors/:floorId/rooms", addRooms);

router.patch("/floors/:floorId/rooms/:roomId", modifyRoom);

router.get("/floors/:floorId/history", getFloorCommits);

router.get('/floors', getQueryFloors);

router.get("/floors/:floorId/rooms", getRoomsFloorID);

router.get("/floorsonly", getFloorsOnly);

router.post('/floors/:floorId/rollback', rollbackFloor);
  


// router.post('/rollbackFloor', loginUser);

module.exports = router;
