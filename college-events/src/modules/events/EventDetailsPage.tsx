import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '@/services/firebase';
import { EventItem } from './types';
import { useAuth } from '@/modules/auth/AuthContext';
import { registerForEvent, unregisterFromEvent } from './registration';
import { useAuth } from '@/modules/auth/AuthContext';
import { EventActions } from './EventActions';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(firestore, 'events', id), (snap) => {
      if (snap.exists()) setEvent({ id: snap.id, ...(snap.data() as any) });
    });
    return () => unsub();
  }, [id]);

  if (!event) return <div className="p-6">Loading…</div>;

  const canRegister = user && new Date(event.registrationDeadline) > new Date() && event.attendeeCount < event.capacity;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <img src={event.images?.[0]} className="h-64 w-full object-cover rounded" alt="" />
      <h1 className="mt-4 text-3xl font-semibold">{event.title}</h1>
      <p className="mt-2 text-gray-600">{event.description}</p>

      <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
        <span>{new Date(event.startAt).toLocaleString()} - {new Date(event.endAt).toLocaleString()}</span>
        <span>•</span>
        <span>{event.venue}</span>
        <span>•</span>
        <span>{event.attendeeCount}/{event.capacity} going</span>
      </div>

      {user && (
        <div className="mt-6 flex gap-2">
          <button disabled={!canRegister} onClick={() => registerForEvent(event.id)} className="px-4 py-2 bg-brand text-white rounded-md disabled:opacity-50">Register</button>
          <button onClick={() => unregisterFromEvent(event.id)} className="px-4 py-2 border rounded-md">Unregister</button>
          {(user.role === 'organizer' && user.uid === event.organizerId) || user.role === 'admin' ? (
            <EventActions id={event.id} />
          ) : null}
        </div>
      )}
    </div>
  );
}
