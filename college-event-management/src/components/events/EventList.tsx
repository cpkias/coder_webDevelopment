import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { EventCard } from './EventCard';
import { Event, EventCategory, EventFilters, SearchParams } from '../../types';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface EventListProps {
  title?: string;
  showFilters?: boolean;
  organizerId?: string;
  showActions?: boolean;
  initialFilters?: EventFilters;
}

export const EventList: React.FC<EventListProps> = ({
  title = 'Events',
  showFilters = true,
  organizerId,
  showActions = false,
  initialFilters = {},
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    isActive: true,
    ...initialFilters,
    ...(organizerId && { organizerId }),
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const { userProfile } = useAuth();

  const categories: EventCategory[] = [
    'academic',
    'cultural',
    'sports',
    'technical',
    'social',
    'workshop',
    'seminar',
    'competition',
    'other',
  ];

  useEffect(() => {
    loadEvents();
  }, [filters, searchQuery, organizerId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');

      const searchParams: SearchParams = {
        query: searchQuery,
        filters,
        sortBy: 'startDate',
        sortOrder: 'asc',
        limit: 50,
      };

      let eventsData: Event[];

      if (organizerId) {
        // Load events for specific organizer
        eventsData = await eventService.getOrganizerEvents(organizerId);
      } else {
        // Load events with search and filters
        const response = await eventService.getEvents(searchParams);
        eventsData = response.data;
      }

      // Apply additional client-side filtering if needed
      let filteredEvents = eventsData;

      // Filter by approval status based on user role
      if (!userProfile || userProfile.role === 'student') {
        // Students only see approved events
        filteredEvents = eventsData.filter(event => event.isApproved);
      }

      setEvents(filteredEvents);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      toast.error(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      isActive: true,
      ...(organizerId && { organizerId }),
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return (
      searchQuery ||
      filters.category ||
      filters.startDate ||
      filters.endDate ||
      filters.venue ||
      (filters.tags && filters.tags.length > 0)
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {showFilters && (
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            variant={showFiltersPanel ? 'contained' : 'outlined'}
          >
            Filters
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search events by title, description, tags, or venue..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: showFiltersPanel ? 2 : 0 }}
          />

          {/* Filters Panel */}
          {showFiltersPanel && (
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category || ''}
                      label="Category"
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Start Date"
                    type="date"
                    value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => 
                      handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="End Date"
                    type="date"
                    value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => 
                      handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Venue"
                    value={filters.venue || ''}
                    onChange={(e) => handleFilterChange('venue', e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Active Filters */}
              {hasActiveFilters() && (
                <Box mt={2} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Active filters:
                  </Typography>
                  {searchQuery && (
                    <Chip
                      label={`Search: "${searchQuery}"`}
                      size="small"
                      onDelete={() => setSearchQuery('')}
                    />
                  )}
                  {filters.category && (
                    <Chip
                      label={`Category: ${filters.category}`}
                      size="small"
                      onDelete={() => handleFilterChange('category', undefined)}
                    />
                  )}
                  {filters.venue && (
                    <Chip
                      label={`Venue: ${filters.venue}`}
                      size="small"
                      onDelete={() => handleFilterChange('venue', undefined)}
                    />
                  )}
                  <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters() 
              ? 'Try adjusting your search criteria or filters.'
              : 'There are no events available at the moment.'
            }
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard
                event={event}
                showActions={showActions}
                onEventUpdated={loadEvents}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};