/**
 * EventList Component
 * Display a list of events with loading and empty states
 */

import EventCard from './EventCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Button from '@components/common/Button';
import { Calendar } from 'lucide-react';

const EventList = ({ events, loading, hasMore, onLoadMore }) => {
  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!loading && events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
        <p className="text-gray-600">
          There are no events matching your criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventList;
