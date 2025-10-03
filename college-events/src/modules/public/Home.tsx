import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Discover and Manage College Events</h1>
        <p className="mt-3 text-gray-600">Find events, register instantly, and get notified. Organizers can create and manage events with ease.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/events" className="px-4 py-2 bg-brand text-white rounded-md">Browse Events</Link>
          <Link to="/signup" className="px-4 py-2 bg-white border rounded-md">Get Started</Link>
        </div>
      </div>
    </section>
  );
}
