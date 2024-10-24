const express = require('express');
const router = express.Router();

const { addFloor } = require('../controllers/floorController');
const userModel = require('../models/userModel');
const roomModel = require('../models/roomModel');
const floorModel = require('../models/floorModel');
const commitSchema= require('../models/commitSchema');
router.use(express.json());

// API to add a new floor
router.post('/floors', async (req, res) => {
    const { id, floorNumber ,modifiedBy} = req.body;
  
    try {
      
      // Validate user
      const user = await userModel.findById(modifiedBy);
      if (!user) {
        return res.status(400).send('Invalid user ID');
      }
  
      // Create new floor
      const newFloor = new floorModel({
        id,
        floorNumber,
        rooms: null,
        modifiedBy,
      });
  
      await newFloor.save();

      const initialCommit = new commitSchema({
        id: id,  // Generate a commit ID
        modifiedBy:modifiedBy,
        timestamp: Date.now()
      });
      initialCommit.save();
      res.status(201).json(newFloor);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  router.put('/floors/:floorId/rooms', async (req, res) => {
    const { floorId } = req.params;
    const { roomNumber, roomName, seats, projector, whiteboard, speakerSystem, modifiedBy } = req.body;

    try {
        // Validate user
        const user = await userModel.findById(modifiedBy);
        if (!user) {
            return res.status(400).send('Invalid user ID');
        }

        // Find the floor
        const floor = await floorModel.findOne({ id: floorId });
        if (!floor) {
            return res.status(404).send('Floor not found');
        }

        // Create a new room
        const newRoom = new roomModel({
            roomNumber,
            roomName,
            seats,
            projector,
            whiteboard,
            speakerSystem,
            lastModified: new Date(),
            modifiedBy
        });

        // Save the new room
        const savedRoom = await newRoom.save();

        // Add the new room to the existing rooms array
        if (floor.rooms == null) {
            floor.rooms = [];
        }
        floor.rooms.push(savedRoom._id);  // Add the new room ID to the rooms array
        // Update the lastModified and modifiedBy fields for the floor
        floor.lastModified = new Date();
        floor.modifiedBy = modifiedBy;


        // Create and save a new commit for version control
        const newCommit = new commitSchema({
            id: floor._id,  // Use the existing floor's ID for commit tracking
            modifiedBy: modifiedBy,
            timestamp: Date.now()
        });
        await newCommit.save();

        res.status(200).json(floor);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



  router.patch('/floors/:floorId/rooms/:roomId', async (req, res) => {
    const { floorId, roomId } = req.params;
    const { roomNumber, roomName, seats, projector, whiteboard, speakerSystem, modifiedBy } = req.body;
  
    try {
      // Validate user
      const user = await userModel.findById(modifiedBy);
      if (!user) {
        return res.status(400).send('Invalid user ID');
      }
  
      // Find the floor
      const floor = await floorModel.findOne({ id: floorId });
      if (!floor) {
        return res.status(404).send('Floor not found');
      }
  
      // Check if the room exists in the floor
      if (!floor.rooms.includes(roomId)) {
        return res.status(404).send('Room not found in this floor');
      }
  
      // Find the room
      const room = await roomModel.findById(roomId);
      if (!room) {
        return res.status(404).send('Room not found');
      }
  
      // Update only the fields that are provided
      if (roomNumber !== undefined) room.roomNumber = roomNumber;
      if (roomName !== undefined) room.roomName = roomName;
      if (seats !== undefined) room.seats = seats;
      if (projector !== undefined) room.projector = projector;
      if (whiteboard !== undefined) room.whiteboard = whiteboard;
      if (speakerSystem !== undefined) room.speakerSystem = speakerSystem;
  
      // Update lastModified and modifiedBy fields
      room.lastModified = new Date();
      room.modifiedBy = modifiedBy;
  
      // Save the updated room
      const updatedRoom = await room.save();
  
      // Respond with the updated room
      res.status(200).json(updatedRoom);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
// router.post('/rollbackFloor', loginUser);

module.exports = router;