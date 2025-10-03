import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventCard } from '../EventCard';

const mockEvent = {
  id: '1',
  title: 'Hackathon',
  description: 'Join us for a coding marathon',
  category: 'Tech',
  campus: 'Main',
  venue: 'Auditorium',
  capacity: 100,
  startAt: new Date().toISOString(),
  endAt: new Date().toISOString(),
  organizerId: 'u1',
  images: [],
  attachments: [],
  registrationDeadline: new Date().toISOString(),
  tags: ['coding'],
  status: 'published',
  attendeeCount: 10,
};

test('renders event title and venue', () => {
  render(
    <MemoryRouter>
      <EventCard event={mockEvent as any} />
    </MemoryRouter>
  );

  expect(screen.getByText(/Hackathon/i)).toBeInTheDocument();
  expect(screen.getByText(/Auditorium/i)).toBeInTheDocument();
});
