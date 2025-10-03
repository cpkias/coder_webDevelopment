import { Link } from 'react-router-dom';
import { EventItem } from '@/modules/events/types';

export function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="border rounded-md p-4 bg-white">
      {event.images?.[0] && <img src={event.images[0]} alt="" className="h-40 w-full object-cover rounded" />}
      <h3 className="mt-3 font-medium text-lg">
        <Link to={`/events/${event.id}`} className="text-brand hover:underline">{event.title}</Link>
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
      <div className="mt-2 text-sm text-gray-600">{new Date(event.startAt).toLocaleString()} • {event.venue}</div>
    </div>
  );
}
