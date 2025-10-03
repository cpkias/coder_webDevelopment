import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { CalendarView } from '@/modules/app/components/CalendarView';

export default function EventsCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(firestore, 'events'), where('status', '==', 'published'), orderBy('startAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    return () => unsub();
  }, []);

  const calendarEvents = useMemo(() => events.map((e) => ({ title: e.title, start: new Date(e.startAt), end: new Date(e.endAt) })), [events]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Calendar</h1>
      <CalendarView events={calendarEvents} />
    </div>
  );
}
