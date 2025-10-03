import EventCalendar from '@components/events/EventCalendar';

const CalendarPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Calendar</h1>
        <p className="text-lg text-gray-600">
          View all events in calendar format
        </p>
      </div>
      <EventCalendar />
    </div>
  );
};

export default CalendarPage;
