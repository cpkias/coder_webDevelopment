import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'primary.contrastText',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              College Events
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop platform for discovering and managing college events. 
              Connect with your campus community and never miss an exciting event.
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink
                component={Link}
                to="/"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Home
              </MuiLink>
              <MuiLink
                component={Link}
                to="/events"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Browse Events
              </MuiLink>
              <MuiLink
                component={Link}
                to="/about"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                About Us
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contact"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Contact
              </MuiLink>
            </Box>
          </Grid>

          {/* For Students */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              For Students
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink
                component={Link}
                to="/signup"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Create Account
              </MuiLink>
              <MuiLink
                component={Link}
                to="/events?category=academic"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Academic Events
              </MuiLink>
              <MuiLink
                component={Link}
                to="/events?category=cultural"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Cultural Events
              </MuiLink>
              <MuiLink
                component={Link}
                to="/events?category=sports"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Sports Events
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">
                  123 College Street<br />
                  University City, UC 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  info@college-events.edu
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {currentYear} College Event Management. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiLink
              href="/privacy"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              href="/terms"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              href="/help"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Help
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};