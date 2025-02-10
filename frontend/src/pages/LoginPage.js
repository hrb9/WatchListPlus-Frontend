// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { activateScript, checkToken } from '../services/authService';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Idle');
  const [pinId, setPinId] = useState(null);

  const handleAuthenticate = async () => {
    setStatus('Activating script...');
    try {
      const data = await activateScript();
      if (data.auth_url && data.pin_id) {
        setPinId(data.pin_id);
        window.open(data.auth_url, '_blank');
        setStatus('Awaiting token...');
        pollForToken(data.pin_id);
      }
    } catch (error) {
      console.error(error);
      setStatus('Error during activation');
    }
  };

  const pollForToken = async (pin) => {
    let attempt = 0;
    const maxAttempts = 30;
    const intervalId = setInterval(async () => {
      attempt++;
      try {
        const result = await checkToken(pin);
        if (result.auth_token) {
          clearInterval(intervalId);
          dispatch(setAuth({ token: result.auth_token, userId: result.user_id }));
          setStatus('Authenticated! Redirecting...');
          navigate('/main');
        } else if (attempt >= maxAttempts) {
          clearInterval(intervalId);
          setStatus('Token polling timed out');
        }
      } catch (error) {
        console.error(error);
        clearInterval(intervalId);
        setStatus('Error polling token');
      }
    }, 5000);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#121212"
    >
      <Paper sx={{ padding: 4, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          WatchListPlus - Login
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {status.startsWith('Awaiting') || status.startsWith('Activating') ? (
            <CircularProgress size={24} />
          ) : (
            status
          )}
        </Typography>
        <Button variant="contained" onClick={handleAuthenticate}>
          Authenticate with Plex
        </Button>
      </Paper>
    </Box>
  );
}
