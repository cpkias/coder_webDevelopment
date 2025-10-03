/**
 * EventForm Component
 * Form for creating and editing events
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { createEvent, updateEvent } from '@/services/eventService';
import { validateEventForm } from '@/utils/validators';
import { timestampToInputValue, inputValueToDate } from '@/utils/formatters';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const EVENT_CATEGORIES = [
  'Academic',
  'Sports',
  'Cultural',
  'Technical',
  'Workshop',
  'Seminar',
  'Competition',
  'Social',
  'Career',
  'Other',
];

const EventForm = ({ event = null, onSuccess }) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const isEditing = !!event;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dateTime: '',
    venue: '',
    capacity: '',
    registrationDeadline: '',
    tags: [],
    ...event,
  });

  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(event?.images || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        dateTime: timestampToInputValue(event.dateTime),
        registrationDeadline: event.registrationDeadline
          ? timestampToInputValue(event.registrationDeadline)
          : '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (5MB max each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter(img => img !== url));
    setRemovedImages([...removedImages, url]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };

    // Validate form
    const validation = validateEventForm(dataToValidate);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dateTime: inputValueToDate(formData.dateTime),
        venue: formData.venue,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registrationDeadline: formData.registrationDeadline
          ? inputValueToDate(formData.registrationDeadline)
          : null,
        tags: formData.tags,
        organizerId: user.uid,
        organizerName: userProfile.displayName,
        images: existingImages,
      };

      if (isEditing) {
        await updateEvent(event.id, eventData, images, removedImages);
        toast.success('Event updated successfully!');
      } else {
        await createEvent(eventData, images);
        toast.success('Event created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/my-events');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <Input
        label="Event Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter event title"
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event..."
          rows={6}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a category</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <Input
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="Event location"
          error={errors.venue}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Date & Time"
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          error={errors.dateTime}
          required
        />

        <Input
          label="Registration Deadline"
          type="datetime-local"
          name="registrationDeadline"
          value={formData.registrationDeadline}
          onChange={handleChange}
          error={errors.registrationDeadline}
          helperText="Optional: Set a deadline for registrations"
        />
      </div>

      <Input
        label="Capacity"
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={handleChange}
        placeholder="Maximum attendees (optional)"
        error={errors.capacity}
        min="1"
      />

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add tags..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Images
        </label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Event ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB each)</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
