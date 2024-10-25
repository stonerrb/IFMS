import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, Snackbar, Alert, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiURL = 'https://ifms-elyu.onrender.com';

// Custom theme based on the login/signup page color theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#d3c2f3', // Light purple color from your signup/login theme
    },
    background: {
      default: '#f6f0ff', // Background color
    },
    text: {
      primary: '#333', // Dark text for contrast
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function FloorRooms() {
  const _id = localStorage.getItem('_id');
  const { floorId } = useParams(); // Get floorId from URL params
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [openAdd, setOpenAdd] = useState(false); // State to control the add popup dialog
  const [openEdit, setOpenEdit] = useState(false); // State to control the edit popup dialog
  
  // States for room input
  const [roomId, setRoomId] = useState(''); // To store room ID for editing
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [seats, setSeats] = useState('');
  const [hasProjector, setHasProjector] = useState(false);
  const [hasWhiteboard, setHasWhiteboard] = useState(false);
  const [hasSpeakerSystem, setHasSpeakerSystem] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'success' or 'error'

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${apiURL}/floors/${floorId}/rooms`);
        setRooms(response.data); // Assuming the response data contains the rooms
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, [floorId]);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleClickOpenEdit = (room) => {
    setRoomId(room._id);
    setRoomName(room.roomName);
    setRoomNumber(room.roomNumber);
    setSeats(room.seats);
    setHasProjector(room.projector);
    setHasWhiteboard(room.whiteboard);
    setHasSpeakerSystem(room.speakerSystem);
    setOpenEdit(true);
  };

  console.log(roomId, roomName, roomNumber, seats, hasProjector, hasWhiteboard, hasSpeakerSystem);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    resetRoomInputs();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    resetRoomInputs();
  };

  const resetRoomInputs = () => {
    setRoomId('');
    setRoomName('');
    setRoomNumber('');
    setSeats('');
    setHasProjector(false);
    setHasWhiteboard(false);
    setHasSpeakerSystem(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = async () => {
    try {
      const url = `${apiURL}/floors/${floorId}/rooms`; // API URL to add a new room
      await axios.put(url, {
        roomNumber: roomNumber,
        roomName: roomName,
        seats: seats,
        projector: hasProjector,
        whiteboard: hasWhiteboard,
        speakerSystem: hasSpeakerSystem,
        modifiedBy: _id,
      });

      // Show success message
      setSnackbarMessage('Room added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Refetch the rooms after adding
      const response = await axios.get(`${apiURL}/floors/${floorId}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error adding room', error);

      // Show error message
      setSnackbarMessage('Error adding room');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    handleCloseAdd(); // Close dialog after save
  };

  const handleModify = async () => {
    try {
      const url = `${apiURL}/floors/${floorId}/rooms/${roomId}`; // API URL to update the room
      await axios.patch(url, {
        roomNumber: roomNumber,
        roomName: roomName,
        seats: seats,
        projector: hasProjector,
        whiteboard: hasWhiteboard,
        speakerSystem: hasSpeakerSystem,
        modifiedBy: _id,
      });

      // Show success message
      setSnackbarMessage('Room modified successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Refetch the rooms after modifying
      const response = await axios.get(`${apiURL}/floors/${floorId}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error modifying room', error);

      // Show error message
      setSnackbarMessage('Error modifying room');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    handleCloseEdit(); // Close dialog after save
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          minWidth: '100vw',
          padding: '2rem',
        }}
      >
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          px={2}
        >
          <Typography variant="h4" component="h1" color="textPrimary">
            Room Management for {floorId}
          </Typography>
          <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#d3c2f3', color: '#fff' }}
            onClick={handleClickOpenAdd}
          >
            Add Room
          </Button>

          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: '#d3c2f3', color: '#fff' }}
            onClick={() => navigate(`/admin-dash/floor-history/${floorId}`)}
            >
            Show history
            </Button>
            </Box>
        </Box>

        {/* Room Cards */}
        <Grid container spacing={3}>
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)', // Slight zoom effect on hover
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Enhanced shadow on hover
                    },
                    cursor: 'pointer', // Show hand cursor on hover
                  }}
                  onClick={() => handleClickOpenEdit(room)} // Open edit popup
                >
                  <CardContent>
                    <Typography variant="h5" component="h2" color="textPrimary">
                      Room: {room.roomName}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Room No: {room.roomNumber}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Click for more details
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" align="center">
                No rooms available on this floor. <br /> <small>Click 'Add Room' to create one.</small>
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Popup Dialog to Add New Room */}
        <Dialog
          open={openAdd}
          onClose={handleCloseAdd}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
              minWidth: '400px',
            },
          }}
        >
          <DialogTitle id="form-dialog-title">Add New Room</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Room Name"
              type="text"
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Room Number"
              type="text"
              fullWidth
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Seats"
              type="number"
              fullWidth
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasProjector}
                  onChange={(e) => setHasProjector(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Projector"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasWhiteboard}
                  onChange={(e) => setHasWhiteboard(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Whiteboard"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasSpeakerSystem}
                  onChange={(e) => setHasSpeakerSystem(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Speaker System"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Popup Dialog to Edit Room */}
        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="form-dialog-title-edit"
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
              minWidth: '400px',
            },
          }}
        >
          <DialogTitle id="form-dialog-title-edit">Edit Room</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Room Name"
              type="text"
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Room Number"
              type="text"
              fullWidth
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Seats"
              type="number"
              fullWidth
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasProjector}
                  onChange={(e) => setHasProjector(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Projector"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasWhiteboard}
                  onChange={(e) => setHasWhiteboard(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Whiteboard"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasSpeakerSystem}
                  onChange={(e) => setHasSpeakerSystem(e.target.checked)}
                  color="primary"
                />
              }
              label="Has Speaker System"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              Cancel
            </Button>
            <Button onClick={handleModify} color="primary">
              Modify
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default FloorRooms;
