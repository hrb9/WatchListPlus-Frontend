// frontend/src/pages/SettingsPage.js

import React, { useState, useEffect } from 'react';
import { Box, Paper, Tabs, Tab, Typography, TextField, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Navbar from '../components/Navbar';
// Example: using Redux instead of AuthContext
import { useSelector } from 'react-redux';

/* 
  For the purpose of this example, we assume that your Redux store's auth slice 
  has fields: userId and isAdmin.
  If needed, you can remove the useSelector hook and replace with your own fetch logic.
*/

function RequestsTab({ isAdmin, userId }) {
  const [requests, setRequests] = useState([]);

  // Placeholder function to fetch requests from your UsersAndRequests service.
  const fetchRequests = async () => {
    // Replace with your actual service call, e.g., getRequests(userId)
    try {
      // For demonstration, we use a dummy list:
      const dummy = [
        { id: 1, username: 'user1', imdb_id: 'tt1234567', approved: false },
        { id: 2, username: 'user2', imdb_id: 'tt2345678', approved: true }
      ];
      setRequests(dummy);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (reqId) => {
    try {
      // Replace with your approveRequest service call
      alert(`Request ${reqId} approved`);
      fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Requests</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>IMDb ID</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.username}</TableCell>
                <TableCell>{req.imdb_id}</TableCell>
                <TableCell>{req.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {!req.approved && isAdmin && (
                    <Button variant="contained" onClick={() => handleApprove(req.id)}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ServerSettingsTab({ isAdmin }) {
  const [apiKeys, setApiKeys] = useState({ gemini: '', tmdb: '' });
  const [newServer, setNewServer] = useState({ type: '', address: '', apiKey: '' });
  const [servers, setServers] = useState([]);

  // Placeholder function to fetch servers from the Provider service.
  const fetchServers = async () => {
    try {
      // Replace with your actual API call
      const dummy = [
        { id: 1, server_type: 'radarr', server_address: 'http://192.168.1.10', default_quality_profile: 'HD', is_default: true },
        { id: 2, server_type: 'sonarr', server_address: 'http://192.168.1.11', default_quality_profile: 'SD', is_default: false }
      ];
      setServers(dummy);
    } catch (err) {
      console.error('Error fetching servers:', err);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleAddServer = async () => {
    try {
      // Call your addServer service and then refresh list
      alert(`Server added: ${newServer.address}`);
      fetchServers();
    } catch (err) {
      console.error('Error adding server:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Server Settings</Typography>
      <Box mb={2}>
        <Typography variant="subtitle1">API Keys</Typography>
        <TextField 
          label="Gemini API Key" 
          value={apiKeys.gemini} 
          onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })} 
          fullWidth 
          sx={{ marginBottom: 1 }} 
          disabled={!isAdmin}
        />
        <TextField 
          label="TMDB API Key" 
          value={apiKeys.tmdb} 
          onChange={(e) => setApiKeys({ ...apiKeys, tmdb: e.target.value })} 
          fullWidth 
          disabled={!isAdmin}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Add New Server</Typography>
        <TextField 
          label="Server Type (radarr/sonarr)" 
          value={newServer.type} 
          onChange={(e) => setNewServer({ ...newServer, type: e.target.value })} 
          fullWidth 
          sx={{ marginBottom: 1 }}
          disabled={!isAdmin}
        />
        <TextField 
          label="Server Address" 
          value={newServer.address} 
          onChange={(e) => setNewServer({ ...newServer, address: e.target.value })} 
          fullWidth 
          sx={{ marginBottom: 1 }}
          disabled={!isAdmin}
        />
        <TextField 
          label="Server API Key" 
          value={newServer.apiKey} 
          onChange={(e) => setNewServer({ ...newServer, apiKey: e.target.value })} 
          fullWidth 
          sx={{ marginBottom: 1 }}
          disabled={!isAdmin}
        />
        {isAdmin && (
          <Button variant="contained" onClick={handleAddServer}>
            Add Server
          </Button>
        )}
      </Box>
      <Box>
        <Typography variant="subtitle1">Existing Servers</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Default Profile</TableCell>
                <TableCell>Is Default</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map((srv) => (
                <TableRow key={srv.id}>
                  <TableCell>{srv.id}</TableCell>
                  <TableCell>{srv.server_type}</TableCell>
                  <TableCell>{srv.server_address}</TableCell>
                  <TableCell>{srv.default_quality_profile}</TableCell>
                  <TableCell>{srv.is_default ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

function RecommendationsTab({ isAdmin }) {
  const [monthlyConfig, setMonthlyConfig] = useState({ movies: 3, series: 2 });
  const [discoveryConfig, setDiscoveryConfig] = useState({ movies: 5, series: 3 });
  const [userTaste, setUserTaste] = useState("Your taste is being calculated...");

  // Placeholder functions for fetching or updating recommendation settings
  const fetchRecommendationSettings = async () => {
    // Simulate fetching settings
    setMonthlyConfig({ movies: 3, series: 2 });
    setDiscoveryConfig({ movies: 5, series: 3 });
    setUserTaste("Calculated taste based on your history.");
  };

  useEffect(() => {
    fetchRecommendationSettings();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Recommendation Settings</Typography>
      <Box mb={2}>
        <Typography variant="subtitle1">Monthly Recommendations</Typography>
        <TextField
          label="Number of Movies"
          type="number"
          value={monthlyConfig.movies}
          onChange={(e) => setMonthlyConfig({ ...monthlyConfig, movies: e.target.value })}
          sx={{ marginRight: 2 }}
          disabled={!isAdmin}
        />
        <TextField
          label="Number of Series"
          type="number"
          value={monthlyConfig.series}
          onChange={(e) => setMonthlyConfig({ ...monthlyConfig, series: e.target.value })}
          disabled={!isAdmin}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Discovery Recommendations</Typography>
        <TextField
          label="Number of Movies"
          type="number"
          value={discoveryConfig.movies}
          onChange={(e) => setDiscoveryConfig({ ...discoveryConfig, movies: e.target.value })}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Number of Series"
          type="number"
          value={discoveryConfig.series}
          onChange={(e) => setDiscoveryConfig({ ...discoveryConfig, series: e.target.value })}
        />
      </Box>
      <Box>
        <Typography variant="subtitle1">User Taste (Read-only)</Typography>
        <TextField
          fullWidth
          value={userTaste}
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    </Box>
  );
}

function UsersTab({ isAdmin }) {
  const [users, setUsers] = useState([]);

  // Placeholder function to fetch users from your UsersAndRequests service
  const fetchUsers = async () => {
    try {
      const dummyUsers = [
        { username: 'user1', isAdmin: false, autoApprove: true },
        { username: 'user2', isAdmin: true, autoApprove: true },
        { username: 'user3', isAdmin: false, autoApprove: false }
      ];
      setUsers(dummyUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = (username) => {
    // Implement your logic to toggle admin status
    alert(`Toggling admin status for ${username}`);
  };

  const handleToggleAutoApprove = (username) => {
    // Implement your logic to toggle auto-approval
    alert(`Toggling auto-approval for ${username}`);
  };

  const handleDeleteUser = (username) => {
    // Implement your logic to delete a user
    alert(`Deleting user ${username}`);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Auto Approve</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.autoApprove ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {isAdmin && (
                    <>
                      <Button onClick={() => handleToggleAdmin(user.username)}>Toggle Admin</Button>
                      <Button onClick={() => handleToggleAutoApprove(user.username)}>Toggle AutoApprove</Button>
                      <Button color="error" onClick={() => handleDeleteUser(user.username)}>Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function SettingsPage() {
  // For demonstration, we use local state. In a real app, use Redux or API calls.
  const [selectedTab, setSelectedTab] = useState(0);
  // Example: retrieve user info from Redux store (instead of AuthContext)
  const { userId, isAdmin } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ display: 'flex', marginTop: 2 }}>
        {/* Sidebar navigation using Material UI Tabs */}
        <Paper sx={{ width: 250, marginRight: 2 }}>
          <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Settings Navigation"
          >
            <Tab label="Requests" />
            <Tab label="Server Settings" />
            <Tab label="Recommendations" />
            <Tab label="Users" />
          </Tabs>
        </Paper>
        {/* Main content area */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
          {selectedTab === 0 && <RequestsTab isAdmin={isAdmin} userId={userId} />}
          {selectedTab === 1 && <ServerSettingsTab isAdmin={isAdmin} />}
          {selectedTab === 2 && <RecommendationsTab isAdmin={isAdmin} />}
          {selectedTab === 3 && <UsersTab isAdmin={isAdmin} />}
        </Box>
      </Box>
    </Box>
  );
}
