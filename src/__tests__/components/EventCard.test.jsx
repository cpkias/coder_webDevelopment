/**
 * EventCard Component Tests
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventCard from '@components/events/EventCard';

const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'This is a test event description',
  category: 'Technical',
  dateTime: { toDate: () => new Date('2024-12-25T10:00:00') },
  venue: 'Main Auditorium',
  capacity: 100,
  registrationCount: 50,
  images: ['https://example.com/image.jpg'],
  tags: ['workshop', 'tech', 'coding'],
};

const renderEventCard = (event = mockEvent) => {
  return render(
    <BrowserRouter>
      <EventCard event={event} />
    </BrowserRouter>
  );
};

describe('EventCard', () => {
  it('renders event title and description', () => {
    renderEventCard();
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/This is a test event description/)).toBeInTheDocument();
  });

  it('displays event category', () => {
    renderEventCard();
    
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('shows venue information', () => {
    renderEventCard();
    
    expect(screen.getByText('Main Auditorium')).toBeInTheDocument();
  });

  it('displays capacity information when available', () => {
    renderEventCard();
    
    expect(screen.getByText(/50 \/ 100 registered/)).toBeInTheDocument();
  });

  it('shows fully booked badge when at capacity', () => {
    const fullEvent = {
      ...mockEvent,
      registrationCount: 100,
    };
    
    renderEventCard(fullEvent);
    
    expect(screen.getByText('Fully Booked')).toBeInTheDocument();
  });

  it('displays tags', () => {
    renderEventCard();
    
    expect(screen.getByText('#workshop')).toBeInTheDocument();
    expect(screen.getByText('#tech')).toBeInTheDocument();
    expect(screen.getByText('#coding')).toBeInTheDocument();
  });

  it('limits displayed tags to 3 and shows count for remaining', () => {
    const eventWithManyTags = {
      ...mockEvent,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    
    renderEventCard(eventWithManyTags);
    
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });
});
