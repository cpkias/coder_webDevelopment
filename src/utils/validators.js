/**
 * Form validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password.length >= 6;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate file size (in MB)
 */
export const isValidFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate event form
 */
export const validateEventForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!isRequired(formData.description)) {
    errors.description = 'Description is required';
  }

  if (!isRequired(formData.category)) {
    errors.category = 'Category is required';
  }

  if (!isRequired(formData.dateTime)) {
    errors.dateTime = 'Date and time are required';
  } else {
    const eventDate = new Date(formData.dateTime);
    if (eventDate < new Date()) {
      errors.dateTime = 'Event date must be in the future';
    }
  }

  if (!isRequired(formData.venue)) {
    errors.venue = 'Venue is required';
  }

  if (formData.capacity && formData.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }

  if (formData.registrationDeadline) {
    const deadline = new Date(formData.registrationDeadline);
    const eventDate = new Date(formData.dateTime);
    
    if (deadline < new Date()) {
      errors.registrationDeadline = 'Registration deadline must be in the future';
    }
    
    if (deadline > eventDate) {
      errors.registrationDeadline = 'Registration deadline must be before event date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!isRequired(formData.displayName)) {
    errors.displayName = 'Name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
