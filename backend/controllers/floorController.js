const Room = require("../models/roomModel");
const Floor = require("../models/floorModel");
const FloorVersion = require("../models/commitSchema");
const userModel = require("../models/userModel");
const floorModel = require("../models/floorModel");
const commitSchema = require("../models/commitSchema");
const roomModel = require("../models/roomModel");
const { processFloorData } = require("../utils/floorUtils");

const addFloor = async (req, res) => {
    const { id, floorNumber, modifiedBy } = req.body;
  
    try {
      // Validate user
      const user = await userModel.findById(modifiedBy);
      if (!user) {
        return res.status(400).send("Invalid user ID");
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
        id: id, // Generate a commit ID
        modifiedBy: modifiedBy,
        timestamp: Date.now(),
      });
  
      initialCommit.save();
      res.status(201).json(newFloor);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const addRooms = async (req, res) => {
    const { floorId } = req.params;
    const {
      roomNumber,
      roomName,
      seats,
      projector,
      whiteboard,
      speakerSystem,
      modifiedBy,
    } = req.body;
  
    try {
      // Validate user
      const user = await userModel.findById(modifiedBy);
      if (!user) {
        return res.status(400).send("Invalid user ID");
      }
  
      // Find the floor
      const floor = await floorModel
        .findOne({ id: floorId })
        .sort({ lastModified: -1 });
      if (!floor) {
        return res.status(404).send("Floor not found");
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
        modifiedBy,
      });
  
      // Save the new room
      const savedRoom = await newRoom.save();
  
      console.log(floor.rooms);
      // Add the new room to the existing rooms array
      if (floor.rooms == null) {
        floor.rooms = [];
      }
      floor.rooms.push(savedRoom._id); // Add the new room ID to the rooms array
      console.log(floor.rooms);
  
      // Update the lastModified and modifiedBy fields for the floor
      floor.lastModified = new Date();
      floor.modifiedBy = modifiedBy;
  
      // Create new floor
      const newFloor = new floorModel({
        id: floor.id,
        floorNumber: floor.floorNumber,
        rooms: floor.rooms,
        modifiedBy: floor.modifiedBy,
      });
  
      await newFloor.save();
      // Create and save a new commit for version control
      const newCommit = new commitSchema({
        id: floor.id, // Use the existing floor's ID for commit tracking
        modifiedBy: modifiedBy,
        timestamp: Date.now(),
      });
      await newCommit.save();
  
      res.status(200).json(floor);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const modifyRoom = async (req, res) => {
    const { floorId, roomId } = req.params;
    const {
      roomNumber,
      roomName,
      seats,
      projector,
      whiteboard,
      speakerSystem,
      modifiedBy,
    } = req.body;
  
    try {
      // Validate user
      const user = await userModel.findById(modifiedBy);
      if (!user) {
        return res.status(400).send("Invalid user ID");
      }
  
      // Find the floor
      const floor = await floorModel.findOne({ id: floorId }).sort({ lastModified: -1 });
      if (!floor) {
        return res.status(404).send("Floor not found");
      }
  
      // Check if the room exists in the floor
      if (!floor.rooms.includes(roomId)) {
        return res.status(404).send("Room not found in this floor");
      }
  
      // Find the room
      const room = await roomModel.findById(roomId);
      if (!room) {
        return res.status(404).send("Room not found");
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
  
      // Create and save a new commit for version control
      const newCommit = new commitSchema({
        id: floor.id, // Use the floor's ID for commit tracking
        modifiedBy: modifiedBy,
        timestamp: Date.now(),
      });
      await newCommit.save();
  
      // Respond with the updated room
      res.status(200).json(updatedRoom);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const getFloorCommits = async (req, res) => {
    const { floorId } = req.params;
  
    try {
      // Find all commits related to the floor ID
      const commitHistory = await commitSchema
        .find({ id: floorId })
        .sort({ timestamp: -1 });
  
      if (!commitHistory || commitHistory.length === 0) {
        return res.status(404).send("No history found for this floor");
      }
  
      // Retrieve the corresponding floor versions for each commit
      const floorHistory = await Promise.all(
        commitHistory.map(async (commit) => {
          // Get the floor details at each commit point
          const floor = await floorModel
            .find({ id: commit.id })
            .populate("rooms modifiedBy");
          return {
            commitId: commit._id,
            modifiedBy: commit.modifiedBy,
            timestamp: commit.timestamp,
            floorDetails: floor, // Include the entire floor details at that point in time
          };
        })
      );
  
      // Send the floor history
      res.status(200).json(floorHistory);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const getQueryFloors = async (req, res) => {
    try {
      const { projector, whiteboard, speakerSystem, minSeats } = req.query;
      
      // Fetch all floors
      const floors = await floorModel.find().populate('rooms modifiedBy');
      
      if (!floors || floors.length === 0) {
        return res.status(404).send('No floors found');
      }
  
      // Process the floor data to get the latest versions
      const processedFloors = processFloorData(floors);
  
      // Apply room filtering after processing the floors
      const filteredFloors = processedFloors
        .filter(floor => Array.isArray(floor.rooms) && floor.rooms.length > 0) // Filter out floors with no rooms
        .map(floor => {
          floor.rooms = floor.rooms.filter(room => {
            let match = true;
            
            if (projector !== undefined) match = match && room.projector === (projector === 'true');
            if (whiteboard !== undefined) match = match && room.whiteboard === (whiteboard === 'true');
            if (speakerSystem !== undefined) match = match && room.speakerSystem === (speakerSystem === 'true');
            if (minSeats) {
              match = match && room.seats >= Number(minSeats);
            }
            return match;
          });
          return floor;
        });
  
      // Send the filtered floors with the latest versions
      res.status(200).json(filteredFloors);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }

const getRoomsFloorID = async (req, res) => {
    try {
      const { floorId } = req.params;
  
      // Fetch all floors with the same floorId and sort by lastModified in descending order
      const floors = await floorModel
        .find({ id: floorId })
        .populate("rooms")
        .sort({ lastModified: -1 });
  
      if (!floors || floors.length === 0) {
        return res.status(404).send("Floor not found");
      }
  
      // Find the latest floor version by comparing lastModified
      const latestFloor = floors.reduce((latest, current) => {
        return new Date(current.lastModified) > new Date(latest.lastModified)
          ? current
          : latest;
      });
  
      // Return all rooms for the latest floor version
      res.status(200).json(latestFloor.rooms);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const getFloorsOnly = async (req, res) => {
    try {
      // Fetch all floors and populate rooms and modifiedBy
      const floors = await floorModel.find().populate("rooms modifiedBy");
  
      if (!floors || floors.length === 0) {
        return res.status(404).send("No floors found");
      }
  
      // Process the floor data to get the latest versions
      const processedFloors = processFloorData(floors);
  
      // Send the floors with the latest versions
      res.status(200).json(processedFloors);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

const rollbackFloor = async (req, res) => {
    try {
      const { floorId } = req.params;
    
      // Find the floor by floorId
      const floor = await floorModel.findById(floorId);
      console.log(floor);
      if (!floor) {
        return res.status(404).send('Floor not found');
      }
      // Create a clone of the floor object
    const clonedFloor = new floorModel({
        id: floor.id, // Generate a new unique ID for the cloned floor
        floorNumber: floor.floorNumber,
        rooms: floor.rooms, // You may choose to clone rooms if you want to create new room documents
        lastModified: Date.now(), // Set to the current date
        modifiedBy: req.body.modifiedBy, // Set the user who cloned the floor
        latest: false, // Set to false for the new document
        history: floor.history // You may want to include the history of the original floor
      });
  
      // Save the cloned floor document
      await clonedFloor.save();
      const newCommit = new commitSchema({
        id: clonedFloor.id, // Use the floor's ID for commit tracking
        modifiedBy: req.body.modifiedBy,
        timestamp: Date.now(),
      });
      await newCommit.save();
    
      res.status(200).json({ message: 'Floor rolled back successfully', floor });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }

module.exports = {
    addFloor,
    addRooms,
    modifyRoom,
    getFloorCommits,
    getQueryFloors,
    getRoomsFloorID,
    getFloorsOnly,
    rollbackFloor,
    };
