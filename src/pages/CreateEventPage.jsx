import { useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvents';
import EventForm from '@components/events/EventForm';
import LoadingSpinner from '@components/common/LoadingSpinner';

const CreateEventPage = () => {
  const { eventId } = useParams();
  const { event, loading } = useEvent(eventId);
  const isEditing = !!eventId;

  if (isEditing && loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-lg text-gray-600">
          {isEditing ? 'Update event details' : 'Fill in the details to create your event'}
        </p>
      </div>
      <EventForm event={event} />
    </div>
  );
};

export default CreateEventPage;
