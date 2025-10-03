/**
 * Events Page
 * Browse and filter events
 */

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import EventList from '@components/events/EventList';
import EventFilters from '@components/events/EventFilters';

const EventsPage = () => {
  const [filters, setFilters] = useState({});
  const { events, loading, hasMore, loadMore, searchForEvents } = useEvents(filters);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      searchForEvents(searchTerm);
    } else {
      setFilters({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Events</h1>
        <p className="text-lg text-gray-600">
          Discover amazing events happening on campus
        </p>
      </div>

      <EventFilters onFilter={handleFilter} onSearch={handleSearch} />

      <EventList
        events={events}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default EventsPage;
