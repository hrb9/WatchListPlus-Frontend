// frontend/src/components/Carousel.js
import React from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const CarouselContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
}));

const CarouselItem = styled(Card)(({ theme }) => ({
  minWidth: 150,
  marginRight: theme.spacing(2),
  flex: '0 0 auto',
}));

export default function Carousel({ items = [], onAdd }) {
  return (
    <CarouselContainer>
      {items.map((item, index) => (
        <CarouselItem key={index}>
          {item.image_url ? (
            <CardMedia
              component="img"
              image={item.image_url}
              alt={item.title}
              sx={{ height: 200, objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                backgroundColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">No Image</Typography>
            </Box>
          )}
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {item.title}
            </Typography>
            <Button variant="contained" size="small" onClick={() => onAdd(item)}>
              Add to Watchlist
            </Button>
          </CardContent>
        </CarouselItem>
      ))}
    </CarouselContainer>
  );
}
