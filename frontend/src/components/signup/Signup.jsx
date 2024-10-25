import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiURL = 'https://ifms-elyu.onrender.com';

const Signup = () => {
  const [data, setData] = useState({ name: '', role: '', password: '' });
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const url = `${apiURL}/addUser`;
      await axios.post(url, {
        username: data.name,
        role: data.role,
        password: data.password,
      });
      toast.success('Signup Successful');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        toast.error('Invalid email or password');
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', width:'100vw' }}>
      {/* Left side - Sign in section */}
      <Grid
        item
        xs={12}
        sm={6}
        md={5}
        sx={{
          backgroundColor: '#dbb7ff40',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <Typography variant="h3" gutterBottom>
            Welcome Back
          </Typography>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 20,
                backgroundColor: 'white',
                color: 'black',
                '&:hover': { backgroundColor: '#dbb7ff40' },
              }}
            >
              Sign In
            </Button>
          </Link>
        </Box>
      </Grid>

      {/* Right side - Sign up section */}
      <Grid
        item
        xs={12}
        sm={6}
        md={7}
        component={Paper}
        elevation={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Role"
              name="role"
              type="role"
              value={data.role}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={data.password}
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 20,
                backgroundColor: '#dbb7ff40',
                color: 'black',
                '&:hover': { backgroundColor: '#b38bff' },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
