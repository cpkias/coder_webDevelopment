import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Event } from '../../types';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const EventRegistration: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const { eventId } = useParams<{ eventId: string }>();
  const { currentUser, userProfile } = useAuth();
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

  const handleRegister = async () => {
    if (!currentUser || !userProfile || !event) return;

    try {
      setRegistering(true);
      await registrationService.registerForEvent(
        event.id,
        currentUser.uid,
        userProfile.displayName,
        userProfile.email
      );
      
      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
      
      // Refresh event data to update registration count
      await loadEventData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!currentUser || !event) return;

    try {
      setRegistering(true);
      await registrationService.cancelRegistration(event.id, currentUser.uid);
      
      setIsRegistered(false);
      toast.success('Registration cancelled successfully');
      
      // Refresh event data to update registration count
      await loadEventData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel registration');
    } finally {
      setRegistering(false);
      setCancelDialogOpen(false);
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

  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const deadline = event.registrationDeadline.toDate();
    const eventStart = event.startDate.toDate();
    return now < deadline && now < eventStart && event.currentRegistrations < event.capacity;
  };

  const getRegistrationStatus = () => {
    if (!event) return '';
    
    const now = new Date();
    const deadline = event.registrationDeadline.toDate();
    const eventStart = event.startDate.toDate();
    
    if (now > eventStart) {
      return 'Event has already started';
    }
    
    if (now > deadline) {
      return 'Registration deadline has passed';
    }
    
    if (event.currentRegistrations >= event.capacity) {
      return 'Event is full';
    }
    
    return 'Registration is open';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box p={2}>
        <Alert severity="error">
          {error || 'Event not found'}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" p={2}>
      <Button
        variant="outlined"
        onClick={() => navigate(`/events/${event.id}`)}
        sx={{ mb: 2 }}
      >
        ← Back to Event Details
      </Button>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register for Event
          </Typography>

          {/* Event Summary */}
          <Box mb={3}>
            <Typography variant="h5" gutterBottom>
              {event.title}
            </Typography>
            
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip
                label={event.category}
                color="primary"
                variant="outlined"
              />
              {isRegistered && (
                <Chip
                  label="Registered"
                  color="success"
                  variant="filled"
                />
              )}
            </Box>

            <Box display="flex" flexDirection="column" gap={1} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatDate(event.startDate)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <TimeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {event.venue}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {event.currentRegistrations} / {event.capacity} registered
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registration Status */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Registration Status
            </Typography>
            
            <Alert 
              severity={isRegistrationOpen() ? 'info' : 'warning'}
              sx={{ mb: 2 }}
            >
              {getRegistrationStatus()}
            </Alert>

            {event.registrationDeadline && (
              <Typography variant="body2" color="text.secondary">
                Registration deadline: {formatDate(event.registrationDeadline)} at {formatTime(event.registrationDeadline)}
              </Typography>
            )}
          </Box>

          {/* Requirements */}
          {event.requirements && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Typography variant="body2" paragraph>
                {event.requirements}
              </Typography>
            </Box>
          )}

          {/* Contact Information */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              Organizer: {event.organizerName}
            </Typography>
            {event.contactEmail && (
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {event.contactEmail}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Price */}
          {event.price && event.price > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Price
              </Typography>
              <Typography variant="h5" color="primary">
                ${event.price}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="center">
            {!currentUser ? (
              <Alert severity="info" sx={{ width: '100%' }}>
                Please <Button onClick={() => navigate('/login')}>sign in</Button> to register for this event.
              </Alert>
            ) : isRegistered ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
                disabled={registering}
                size="large"
              >
                {registering ? 'Processing...' : 'Cancel Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setConfirmDialogOpen(true)}
                disabled={!isRegistrationOpen() || registering}
                size="large"
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Registration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to register for "{event.title}"?
          </Typography>
          {event.price && event.price > 0 && (
            <Typography color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
              Event fee: ${event.price}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            variant="contained"
            disabled={registering}
          >
            {registering ? 'Registering...' : 'Confirm Registration'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Registration Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Registration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your registration for "{event.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Registration
          </Button>
          <Button
            onClick={handleCancelRegistration}
            color="error"
            disabled={registering}
          >
            {registering ? 'Cancelling...' : 'Cancel Registration'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};