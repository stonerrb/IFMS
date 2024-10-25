import {useState, useEffect} from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, Snackbar, Alert  } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// const floors = [
//   { id: 1, name: 'Floor 1' },
//   { id: 2, name: 'Floor 2' },
//   { id: 3, name: 'Floor 3' },
// ];

function Admindash() {
    const navigate = useNavigate();
    const _id = localStorage.getItem('_id');

    const [open, setOpen] = useState(false); // State to control the popup dialog
  const [id, setId] = useState('');
  const [floorNumber, setFloorNumber] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'success' or 'error'

  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(`${apiURL}/floorsonly`);
        setFloors(response.data); // Assuming the response data contains the floors
      } catch (error) {
        console.error('Error fetching floors:', error);
      }
    };
    fetchFloors();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setId('');
    setFloorNumber('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = async () => {
    try {
      const url = `${apiURL}/floors`; // Replace apiURL with the actual URL
      await axios.post(url, {
        id: id,
        floorNumber: floorNumber,
        modifiedBy: _id, // Assume `_id` is available, replace it with your logic
      });
      
      
      // Show success message
      setSnackbarMessage('Floor added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      const response = await axios.get(`${apiURL}/floorsonly`);
        setFloors(response.data); // Assuming the response data contains

    } catch (error) {
      console.error('Error adding floor', error);

      // Show error message
      setSnackbarMessage('Error adding floor');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    handleClose(); // Close dialog after save
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
            Floor Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#d3c2f3', color: '#fff' }}
            onClick={handleClickOpen}
          >
            Add Floor
          </Button>
        </Box>

        {/* Floor Cards */}
        <Grid container spacing={3}>
          {floors.map((floor) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={floor._id}>
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

                onClick={() => navigate(`/admin-dash/floor-rooms/${floor.id}`)} 
              >
                <CardContent>
                  <Typography variant="h5" component="h2" color="textPrimary">
                    {floor.id}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Floor Number: {floor.floorNumber}
                  </Typography>

                    {/* Add more details here */}   
                    <Typography color="textSecondary" variant="body2">
                        For more details, click here
                    </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Popup Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
              minWidth: '400px',
            },
          }}
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h6" color="textPrimary" align="center">
              Add New Floor
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              label="ID"
              type="text"
              fullWidth
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextField
              margin="dense"
              id="floorNumber"
              label="Floor Number"
              type="text"
              fullWidth
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>


         {/* Snackbar for Feedback */}
         <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default Admindash;
