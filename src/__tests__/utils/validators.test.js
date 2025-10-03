/**
 * Validators Tests
 */

import {
  isValidEmail,
  isValidPassword,
  isRequired,
  validateEventForm,
  validateRegistrationForm,
} from '@/utils/validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('returns true for passwords with 6+ characters', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('abc123')).toBe(true);
    });

    it('returns false for passwords with less than 6 characters', () => {
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('12345')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired('   text   ')).toBe(true);
    });

    it('returns false for empty strings', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });

    it('returns true for non-null values', () => {
      expect(isRequired(123)).toBe(true);
      expect(isRequired(true)).toBe(true);
    });

    it('returns false for null/undefined', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('validateEventForm', () => {
    const validFormData = {
      title: 'Test Event',
      description: 'Test Description',
      category: 'Technical',
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      venue: 'Main Hall',
      capacity: 100,
      registrationDeadline: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
      tags: ['test'],
    };

    it('validates correct form data', () => {
      const result = validateEventForm(validFormData);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('returns error for missing title', () => {
      const formData = { ...validFormData, title: '' };
      const result = validateEventForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('returns error for past event date', () => {
      const formData = {
        ...validFormData,
        dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };
      const result = validateEventForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.dateTime).toBeDefined();
    });

    it('returns error for registration deadline after event date', () => {
      const formData = {
        ...validFormData,
        dateTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
        registrationDeadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };
      const result = validateEventForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.registrationDeadline).toBeDefined();
    });
  });

  describe('validateRegistrationForm', () => {
    const validFormData = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    it('validates correct registration data', () => {
      const result = validateRegistrationForm(validFormData);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('returns error for invalid email', () => {
      const formData = { ...validFormData, email: 'invalid-email' };
      const result = validateRegistrationForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('returns error for short password', () => {
      const formData = { ...validFormData, password: '12345' };
      const result = validateRegistrationForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    it('returns error for missing display name', () => {
      const formData = { ...validFormData, displayName: '' };
      const result = validateRegistrationForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.displayName).toBeDefined();
    });
  });
});
