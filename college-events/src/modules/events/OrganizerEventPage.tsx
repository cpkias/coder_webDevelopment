import { EventForm } from './EventForm';

export default function OrganizerEventPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Create event</h1>
      <EventForm />
    </div>
  );
}
