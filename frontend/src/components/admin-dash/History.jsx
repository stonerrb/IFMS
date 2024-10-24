import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

function History() {
  const { floorId } = useParams(); // Get the floorId from the route params
  const [historyData, setHistoryData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Snackbar state

  // Fetch floor history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/floors/${floorId}/history`);
        setHistoryData(response.data[response.data.length - 1].floorDetails);    
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistory();
  }, [floorId]);

  // Format timestamp to a readable format
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Handle rollback action
  const handleRollback = async (floorDetailId) => {
    try {
      await axios.post(`http://localhost:5050/floors/${floorDetailId}/rollback`);
      setSnackbar({ open: true, message: 'Rollback successful!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Rollback failed. Please try again.', severity: 'error' });
      console.error('Error during rollback:', error);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ maxWidth: 700, margin: '20px auto', borderRadius: '8px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>No. of Floors</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render history data in reverse order */}
            {historyData.slice().reverse().map((row, index) => (
              <TableRow
                key={index}  // Use index as fallback key
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#f9f9f9' }}
              >
                <TableCell component="th" scope="row" sx={{ padding: '16px', color: '#424242' }}>
                  {formatTimestamp(row.lastModified)}
                </TableCell>
                <TableCell sx={{ padding: '16px', color: '#424242' }}>
                  {row.rooms ? row.rooms.length : '0'}
                </TableCell>
                <TableCell align="right">
                  {/* Conditionally render Rollback button for indices other than 0 */}
                  {index !== 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRollback(row._id)}
                      sx={{ borderRadius: '20px' }}
                    >
                      Rollback
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default History;
