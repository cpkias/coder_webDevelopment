import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

const schema = yup.object({
  displayName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['student', 'organizer'] as const)
    .required('Please select your role'),
  studentId: yup
    .string()
    .when('role', {
      is: 'student',
      then: (schema) => schema.required('Student ID is required for students'),
      otherwise: (schema) => schema.notRequired(),
    }),
  department: yup.string().notRequired(),
  year: yup.string().notRequired(),
  phone: yup.string().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      setLoading(true);
      
      const { confirmPassword, ...userData } = data;
      await signup(data.email, data.password, {
        displayName: userData.displayName,
        role: userData.role as UserRole,
        studentId: userData.studentId,
        department: userData.department,
        year: userData.year,
        phone: userData.phone,
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
      sx={{ backgroundColor: 'grey.50' }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Join our college event management platform
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('displayName')}
              fullWidth
              label="Full Name"
              autoComplete="name"
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
              margin="normal"
              disabled={loading}
            />

            <TextField
              {...register('email')}
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
              disabled={loading}
            />

            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                {...register('role')}
                label="Role"
                disabled={loading}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="organizer">Event Organizer</MenuItem>
              </Select>
              <FormHelperText>
                {errors.role?.message || 
                 (selectedRole === 'organizer' && 'Organizer accounts require admin approval')}
              </FormHelperText>
            </FormControl>

            {selectedRole === 'student' && (
              <TextField
                {...register('studentId')}
                fullWidth
                label="Student ID"
                error={!!errors.studentId}
                helperText={errors.studentId?.message}
                margin="normal"
                disabled={loading}
              />
            )}

            <Box display="flex" gap={2}>
              <TextField
                {...register('department')}
                fullWidth
                label="Department (Optional)"
                error={!!errors.department}
                helperText={errors.department?.message}
                margin="normal"
                disabled={loading}
              />

              {selectedRole === 'student' && (
                <TextField
                  {...register('year')}
                  fullWidth
                  label="Year (Optional)"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  margin="normal"
                  disabled={loading}
                />
              )}
            </Box>

            <TextField
              {...register('phone')}
              fullWidth
              label="Phone Number (Optional)"
              type="tel"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              margin="normal"
              disabled={loading}
            />

            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register('confirmPassword')}
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              size="large"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              disabled={loading}
              size="large"
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};