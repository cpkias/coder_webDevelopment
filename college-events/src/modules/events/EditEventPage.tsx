import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '@/services/firebase';
import { EventForm } from './EventForm';

export default function EditEventPage() {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(firestore, 'events', id)).then((snap) => setData(snap.data()));
  }, [id]);

  if (!id) return null;
  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Edit event</h1>
      <EventForm eventId={id} initialValues={data} />
    </div>
  );
}
