import React from 'react';
import { Container, Box } from '@mui/material';
import { EventList } from '../components/events/EventList';

export const EventsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <EventList title="All Events" showFilters={true} />
    </Container>
  );
};