import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { Link } from 'react-router-dom';
import EventList from '@components/events/EventList';
import Button from '@components/common/Button';
import { Plus } from 'lucide-react';

const MyEventsPage = () => {
  const { user } = useAuth();
  const { events, loading, hasMore, loadMore } = useEvents({ organizerId: user?.uid });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-lg text-gray-600">
            Manage your created events
          </p>
        </div>
        <Link to="/events/create">
          <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
            Create Event
          </Button>
        </Link>
      </div>

      <EventList
        events={events}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default MyEventsPage;
