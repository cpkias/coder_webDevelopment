import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const EventDetailsPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  const { eventId } = useParams<{ eventId: string }>();
  const { currentUser, userProfile, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId && currentUser) {
      checkRegistrationStatus();
    }
  }, [eventId, currentUser]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const eventData = await eventService.getEvent(eventId!);
      if (!eventData) {
        setError('Event not found');
        return;
      }

      setEvent(eventData);
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const registered = await registrationService.isUserRegistered(eventId!, currentUser!.uid);
      setIsRegistered(registered);
    } catch (err) {
      console.error('Error checking registration status:', err);
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      academic: 'primary',
      cultural: 'secondary',
      sports: 'success',
      technical: 'info',
      social: 'warning',
      workshop: 'error',
      seminar: 'default',
      competition: 'primary',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const deadline = event.registrationDeadline.toDate();
    const eventStart = event.startDate.toDate();
    return now < deadline && now < eventStart && event.currentRegistrations < event.capacity;
  };

  const isEventPast = () => {
    if (!event) return false;
    const now = new Date();
    const eventEnd = event.endDate.toDate();
    return now > eventEnd;
  };

  const canEdit = () => {
    return userProfile && (userProfile.uid === event?.organizerId || hasRole('admin'));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Event not found'}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        onClick={() => navigate('/events')}
        sx={{ mb: 3 }}
      >
        ← Back to Events
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Event Images */}
          {event.images.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="400"
                image={event.images[0]}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          )}

          {/* Event Title and Basic Info */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h3" component="h1" gutterBottom>
                {event.title}
              </Typography>
              {canEdit() && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={Link}
                  to={`/events/${event.id}/edit`}
                >
                  Edit Event
                </Button>
              )}
            </Box>

            <Box display="flex" gap={1} mb={3} flexWrap="wrap">
              <Chip
                label={event.category}
                color={getCategoryColor(event.category)}
                variant="filled"
              />
              {!event.isApproved && (
                <Chip
                  label="Pending Approval"
                  color="warning"
                  variant="filled"
                />
              )}
              {isEventPast() && (
                <Chip
                  label="Past Event"
                  color="default"
                  variant="outlined"
                />
              )}
              {isRegistered && (
                <Chip
                  label="Registered"
                  color="success"
                  variant="filled"
                />
              )}
            </Box>

            <Typography variant="h6" paragraph>
              {event.description}
            </Typography>
          </Grid>

          {/* Event Tags */}
          {event.tags.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {event.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Requirements */}
          {event.requirements && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Typography variant="body1" paragraph>
                {event.requirements}
              </Typography>
            </Box>
          )}

          {/* Additional Images */}
          {event.images.length > 1 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <Grid container spacing={2}>
                {event.images.slice(1).map((image, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="150"
                        image={image}
                        alt={`${event.title} - Image ${index + 2}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Event Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(event.startDate)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TimeIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocationIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Venue
                  </Typography>
                  <Typography variant="body1">
                    {event.venue}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PeopleIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Typography variant="body1">
                    {event.currentRegistrations} / {event.capacity} registered
                  </Typography>
                </Box>
              </Box>

              {event.price && event.price > 0 && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <MoneyIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      ${event.price}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registration Deadline
              </Typography>
              <Typography variant="body2" mb={2}>
                {formatDate(event.registrationDeadline)} at {formatTime(event.registrationDeadline)}
              </Typography>

              {/* Registration Button */}
              {!currentUser ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please <Button onClick={() => navigate('/login')}>sign in</Button> to register for this event.
                </Alert>
              ) : !isEventPast() && isRegistrationOpen() ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/events/${event.id}/register`)}
                  disabled={event.currentRegistrations >= event.capacity}
                >
                  {event.currentRegistrations >= event.capacity ? 'Event Full' : 
                   isRegistered ? 'Already Registered' : 'Register Now'}
                </Button>
              ) : (
                <Alert severity="warning">
                  {isEventPast() ? 'This event has ended' : 'Registration is closed'}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Organizer Info Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Organizer
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    {event.organizerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event Organizer
                  </Typography>
                </Box>
              </Box>

              {event.contactEmail && (
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    {event.contactEmail}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};