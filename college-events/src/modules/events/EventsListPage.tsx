import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { EventItem } from './types';
import { Link } from 'react-router-dom';

export default function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [campus, setCampus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const q = query(
      collection(firestore, 'events'),
      where('status', '==', 'published'),
      orderBy('startAt', 'asc'),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as EventItem[];
      setEvents(list);
    });
    return () => unsub();
  }, []);

  const filtered = events.filter((e) => {
    const matchesText = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || e.category === category;
    const matchesCampus = !campus || e.campus === campus;
    const matchesDate = !date || (new Date(e.startAt).toDateString() === new Date(date).toDateString());
    return matchesText && matchesCategory && matchesCampus && matchesDate;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Events</h1>
      <div className="mt-4 grid sm:grid-cols-5 gap-3">
        <input placeholder="Search by title" className="border rounded-md p-2" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Category" className="border rounded-md p-2" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Campus" className="border rounded-md p-2" value={campus} onChange={(e) => setCampus(e.target.value)} />
        <input type="date" className="border rounded-md p-2" value={date} onChange={(e) => setDate(e.target.value)} />
        <Link to="/calendar" className="border rounded-md p-2 text-center bg-white">Calendar</Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <li key={e.id} className="border rounded-md p-4 bg-white">
            <img src={e.images?.[0]} alt="" className="h-40 w-full object-cover rounded" />
            <h3 className="mt-3 font-medium text-lg">
              <Link to={`/events/${e.id}`} className="text-brand hover:underline">{e.title}</Link>
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{e.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
