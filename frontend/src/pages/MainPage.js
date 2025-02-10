// frontend/src/pages/MainPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { Box, Typography } from '@mui/material';
import { fetchMonthlyRecommendations } from '../services/recService';

export default function MainPage() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchMonthlyRecommendations();
        setRecommendations(data.monthly_recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
    fetchData();
  }, []);

  const handleAddToWatchlist = (item) => {
    console.log("Adding item:", item);
    // Implement your add-to-watchlist logic here
  };

  return (
    <Box>
      <Navbar />
      <Box p={2}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Recommended this Month
        </Typography>
        <Carousel items={recommendations} onAdd={handleAddToWatchlist} />
      </Box>
    </Box>
  );
}
