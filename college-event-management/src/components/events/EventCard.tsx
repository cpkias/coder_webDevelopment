import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Event } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import toast from 'react-hot-toast';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEventUpdated?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  showActions = false,
  onEventUpdated,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { userProfile, hasRole } = useAuth();
  const navigate = useNavigate();

  const isOwner = userProfile?.uid === event.organizerId;
  const canEdit = isOwner || hasRole('admin');
  const canDelete = isOwner || hasRole('admin');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    navigate(`/events/${event.id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/events/${event.id}/edit`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await eventService.deleteEvent(event.id);
      toast.success('Event deleted successfully');
      onEventUpdated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleRegister = () => {
    navigate(`/events/${event.id}/register`);
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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
    const colors: Record<string, string> = {
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
    const now = new Date();
    const deadline = event.registrationDeadline.toDate ? 
      event.registrationDeadline.toDate() : 
      new Date(event.registrationDeadline);
    return now < deadline && event.currentRegistrations < event.capacity;
  };

  const isEventPast = () => {
    const now = new Date();
    const eventDate = event.endDate.toDate ? 
      event.endDate.toDate() : 
      new Date(event.endDate);
    return now > eventDate;
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        {event.images.length > 0 && (
          <CardMedia
            component="img"
            height="200"
            image={event.images[0]}
            alt={event.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              {event.title}
            </Typography>
            {showActions && (canEdit || canDelete) && (
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ ml: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>

          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              label={event.category}
              size="small"
              color={getCategoryColor(event.category) as any}
              variant="outlined"
            />
            {!event.isApproved && (
              <Chip
                label="Pending Approval"
                size="small"
                color="warning"
                variant="filled"
              />
            )}
            {isEventPast() && (
              <Chip
                label="Past Event"
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.startDate)} at {formatTime(event.startDate)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.venue}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.currentRegistrations} / {event.capacity} registered
            </Typography>
          </Box>

          {event.tags.length > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              ))}
              {event.tags.length > 3 && (
                <Chip
                  label={`+${event.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              )}
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            onClick={handleView}
            startIcon={<ViewIcon />}
          >
            View Details
          </Button>
          
          {!isEventPast() && isRegistrationOpen() && userProfile && (
            <Button
              size="small"
              variant="contained"
              onClick={handleRegister}
              disabled={event.currentRegistrations >= event.capacity}
            >
              {event.currentRegistrations >= event.capacity ? 'Full' : 'Register'}
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {canEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Event
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Event
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};