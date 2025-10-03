import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Sports as SportsIcon,
  Theater as TheaterIcon,
  Computer as TechIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { EventCard } from '../components/events/EventCard';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      const events = await eventService.getUpcomingEvents(6);
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error loading upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Academic', icon: <SchoolIcon />, color: '#1976d2', path: '/events?category=academic' },
    { name: 'Cultural', icon: <TheaterIcon />, color: '#9c27b0', path: '/events?category=cultural' },
    { name: 'Sports', icon: <SportsIcon />, color: '#2e7d32', path: '/events?category=sports' },
    { name: 'Technical', icon: <TechIcon />, color: '#ed6c02', path: '/events?category=technical' },
  ];

  const stats = [
    { label: 'Active Events', value: '50+', icon: <EventIcon /> },
    { label: 'Registered Students', value: '2,500+', icon: <PeopleIcon /> },
    { label: 'Event Categories', value: '8', icon: <SchoolIcon /> },
    { label: 'Monthly Events', value: '25+', icon: <EventIcon /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Discover Amazing College Events
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Connect with your campus community through exciting events, workshops, and activities
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
              onClick={() => navigate('/events')}
            >
              Browse Events
            </Button>
            {!currentUser && (
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => navigate('/signup')}
              >
                Join Now
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    mb: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" component="div" color="primary" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Event Categories
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Explore events across different categories
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(category.path)}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: 4,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: category.color,
                        mb: 2,
                        width: 64,
                        height: 64,
                        mx: 'auto',
                      }}
                    >
                      {category.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Upcoming Events Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" component="h2" gutterBottom>
              Upcoming Events
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Don't miss these exciting upcoming events
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/events"
          >
            View All Events
          </Button>
        </Box>

        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>Loading events...</Typography>
          </Box>
        ) : upcomingEvents.length > 0 ? (
          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No upcoming events at the moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for new events!
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Get Involved?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students discovering and attending amazing events on campus
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!currentUser ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Create Account
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  onClick={() => navigate('/events')}
                >
                  Browse Events
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
                onClick={() => navigate('/events')}
              >
                Explore Events
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};