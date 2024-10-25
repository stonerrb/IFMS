import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const apiURL = 'https://ifms-elyu.onrender.com';

const Login = () => {
    const navigate = useNavigate();
  const [data, setData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  console.log(apiURL)

  const handleSubmit = async (e) => {
    console.log(data);
    
    e.preventDefault();
    try {
      const url = `${apiURL}/login`;
      console.log(url);
      
      const { data: res } = await axios.post(url, {
        username: data.username,
        password: data.password,
      });



      localStorage.setItem('token', res.token, 86400000);
      localStorage.setItem('user', res.user.role, 86400000);
      localStorage.setItem('_id', res.user._id, 86400000);
      toast.success('Login Successful');
      
        if (res.user.role === 'sub-admin' || res.user.role === 'admin') {
            navigate('/admin-dash');
        } else if (res.user.role === 'user') {
            navigate('/user-dash');
        }

    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        toast.error('Invalid email or password');
      }
    }
  };

  return (
    <Grid container  sx={{ height: '100vh', width:'100vw' }}>
      {/* Left side - Sign up section */}
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
            New Here?
          </Typography>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 20,
                backgroundColor: 'white',
                color: 'black',
                '&:hover': { backgroundColor: '#dbb7ff40' },
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Box>
      </Grid>

      {/* Right side - Login section */}
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
            Login to Your Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={data.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={data.password}
              onChange={handleChange}
            />

            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

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
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
