import  { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, Checkbox, TextField, Divider, FormControlLabel, Tooltip } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const apiURL = 'https://ifms-elyu.onrender.com';

function Userdash() {
  const [minSeats, setMinSeats] = useState('');
  const [projector, setProjector] = useState(false);
  const [whiteboard, setWhiteboard] = useState(false);
  const [speakerSystem, setSpeakerSystem] = useState(false);
  const [floors, setFloors] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async () => {
    try {
      const params = {};
  
      if (minSeats) params.minSeats = minSeats;
      if (projector !== false) params.projector = projector;
      if (whiteboard !== false) params.whiteboard = whiteboard;
      if (speakerSystem !== false) params.speakerSystem = speakerSystem;
  
      console.log('API request params:', params);
  
      const response = await axios.get(`${apiURL}/floors`, { params });
      const floorsWithRooms = response.data.filter(floor => floor.rooms.length > 0);
      setFloors(floorsWithRooms);
      setSearchAttempted(true);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const handleBookRoom = async (floorId, roomId) => {
    console.log('Booking room:', floorId, roomId);
    try {
      const response = await axios.patch(`${apiURL}/floors/${floorId}/rooms/${roomId}/book`);
      // Update the local state to reflect the booking
      setFloors(prevFloors => {
        return prevFloors.map(floor => {
          if (floor.id === floorId) {
            return {
              ...floor,
              rooms: floor.rooms.map(room => {
                if (room._id === roomId) {
                  return { ...room, isBooked: true }; // Update the room to show it is booked
                }
                return room;
              }),
            };
          }
          return floor;
        });
      });
    } catch (error) {
      console.error('Error booking room:', error);
    }
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f6f0ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100vw' }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h4" color="primary" sx={{ marginBottom: '1rem' }}>
          Welcome, User!
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <TextField
            label="Seats"
            variant="outlined"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
            sx={{ marginRight: '1rem' }}
          />
          <FormControlLabel
            control={<Checkbox checked={projector} onChange={(e) => setProjector(e.target.checked)} />}
            label="Projector"
          />
          <FormControlLabel
            control={<Checkbox checked={whiteboard} onChange={(e) => setWhiteboard(e.target.checked)} />}
            label="Whiteboard"
          />
          <FormControlLabel
            control={<Checkbox checked={speakerSystem} onChange={(e) => setSpeakerSystem(e.target.checked)} />}
            label="Speaker System"
          />
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ marginLeft: '1rem' }}>
            Search
          </Button>
        </Box>

        <Divider />
      </Box>

      <Grid container spacing={3} mt={2} justifyContent="center">
        {floors.length === 0 && !searchAttempted && (
          <Typography variant="h6" color="textSecondary">
            Apply filters to get appropriate rooms.
          </Typography>
        )}

        {floors.length === 0 && searchAttempted && (
          <Typography variant="h6" color="error">
            No rooms found with these filters.
          </Typography>
        )}

        {floors.map(floor => (
          floor.rooms.map(room => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Tooltip title={room.isBooked ? 'Already Booked' : ''}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: room.isBooked ? 'lightgreen' : 'white',
                    boxShadow: room.isBooked ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    cursor: room.isBooked ? 'not-allowed' : 'pointer',
                    transition: room.isBooked ? 'none' : 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': room.isBooked ? {} : {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                     pointerEvents: room.isBooked ? 'none' : 'auto', 
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" color="textPrimary">
                      Room {room.roomName} (ID: {room.roomNumber})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Floor: {floor.id} (Floor Number: {floor.floorNumber})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Seats: {room.seats}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Projector: {room.projector ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Whiteboard: {room.whiteboard ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Speaker System: {room.speakerSystem ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Booked: {room.isBooked ? 'Yes' : 'No'}
                    </Typography>
                  </CardContent>

                  {/* Book button (disabled if already booked) */}
                  {room.isBooked ? (
                    <Tooltip title="Already booked" arrow>
                      <Button variant="contained" color="success" disabled>
                        Book
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookRoom(floor.id, room._id)}
                    >
                      Book
                    </Button>
                  )}
                </Card>
              </Tooltip>
            </Grid>
          ))
        ))}
      </Grid>
    </Box>
  );
}

export default Userdash;
