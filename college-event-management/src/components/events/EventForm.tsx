import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { EventFormData, EventCategory } from '../../types';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup
    .string()
    .required('Event title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: yup
    .string()
    .required('Event description is required')
    .min(10, 'Description must be at least 10 characters'),
  category: yup
    .string()
    .oneOf(['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'seminar', 'competition', 'other'])
    .required('Please select a category'),
  startDate: yup
    .date()
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  venue: yup
    .string()
    .required('Venue is required')
    .min(3, 'Venue must be at least 3 characters'),
  capacity: yup
    .number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000'),
  registrationDeadline: yup
    .date()
    .required('Registration deadline is required')
    .max(yup.ref('startDate'), 'Registration deadline must be before event start'),
  tags: yup.array().of(yup.string()),
  requirements: yup.string(),
  contactEmail: yup.string().email('Please enter a valid email'),
  price: yup.number().min(0, 'Price cannot be negative'),
});

export const EventForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tags: [],
      price: 0,
    },
  });

  const watchedTags = watch('tags') || [];

  const categories: { value: EventCategory; label: string }[] = [
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' },
    { value: 'social', label: 'Social' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (eventId) {
      setIsEditing(true);
      loadEventData();
    }
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setInitialLoading(true);
      const event = await eventService.getEvent(eventId!);
      
      if (!event) {
        toast.error('Event not found');
        navigate('/events');
        return;
      }

      // Check if user can edit this event
      if (event.organizerId !== userProfile?.uid && userProfile?.role !== 'admin') {
        toast.error('You do not have permission to edit this event');
        navigate('/events');
        return;
      }

      // Populate form with event data
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('category', event.category);
      setValue('startDate', event.startDate.toDate());
      setValue('endDate', event.endDate.toDate());
      setValue('venue', event.venue);
      setValue('capacity', event.capacity);
      setValue('registrationDeadline', event.registrationDeadline.toDate());
      setValue('tags', event.tags);
      setValue('requirements', event.requirements || '');
      setValue('contactEmail', event.contactEmail || '');
      setValue('price', event.price || 0);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load event data');
      navigate('/events');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setError('');
      setLoading(true);

      if (isEditing && eventId) {
        await eventService.updateEvent(eventId, data);
        toast.success('Event updated successfully!');
        navigate(`/events/${eventId}`);
      } else {
        const newEventId = await eventService.createEvent(
          data,
          userProfile!.uid,
          userProfile!.displayName
        );
        toast.success('Event created successfully! It will be visible once approved.');
        navigate(`/events/${newEventId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
      toast.error(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="800px" mx="auto" p={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('title')}
                    fullWidth
                    label="Event Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('description')}
                    fullWidth
                    label="Event Description"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Category"
                          disabled={loading}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.value} value={category.value}>
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors.category?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('venue')}
                    fullWidth
                    label="Venue"
                    error={!!errors.venue}
                    helperText={errors.venue?.message}
                    disabled={loading}
                  />
                </Grid>

                {/* Date and Time */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Date and Time
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        label="Start Date & Time"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue: Dayjs | null) => {
                          field.onChange(newValue?.toDate() || null);
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        label="End Date & Time"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue: Dayjs | null) => {
                          field.onChange(newValue?.toDate() || null);
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="registrationDeadline"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        label="Registration Deadline"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue: Dayjs | null) => {
                          field.onChange(newValue?.toDate() || null);
                        }}
                        disabled={loading}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.registrationDeadline,
                            helperText: errors.registrationDeadline?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('capacity', { valueAsNumber: true })}
                    fullWidth
                    label="Capacity"
                    type="number"
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    disabled={loading}
                  />
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags
                    </Typography>
                    <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                      {watchedTags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          size="small"
                        />
                      ))}
                    </Box>
                    <Box display="flex" gap={1}>
                      <TextField
                        size="small"
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        disabled={loading}
                      />
                      <IconButton
                        onClick={handleAddTag}
                        disabled={!tagInput.trim() || loading}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('contactEmail')}
                    fullWidth
                    label="Contact Email (Optional)"
                    type="email"
                    error={!!errors.contactEmail}
                    helperText={errors.contactEmail?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('price', { valueAsNumber: true })}
                    fullWidth
                    label="Price (Optional)"
                    type="number"
                    InputProps={{
                      startAdornment: '$',
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('requirements')}
                    fullWidth
                    label="Requirements (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.requirements}
                    helperText={errors.requirements?.message}
                    disabled={loading}
                  />
                </Grid>

                {/* Actions */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};