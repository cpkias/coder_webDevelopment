/**
 * EventCalendar Component
 * Calendar view to display events by month
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getEvents } from '@/services/eventService';
import { formatDate, formatTime } from '@/utils/formatters';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { clsx } from 'clsx';
import './calendar-custom.css';

const EventCalendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthEvents();
  }, [date]);

  const fetchMonthEvents = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const result = await getEvents({
        startDate: startOfMonth,
        endDate: endOfMonth,
      }, 100);

      setEvents(result.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (checkDate) => {
    return events.filter((event) => {
      const eventDate = event.dateTime?.toDate();
      if (!eventDate) return false;

      return (
        eventDate.getDate() === checkDate.getDate() &&
        eventDate.getMonth() === checkDate.getMonth() &&
        eventDate.getFullYear() === checkDate.getFullYear()
      );
    });
  };

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    const dayEvents = getEventsForDate(clickedDate);
    setSelectedDateEvents(dayEvents);
  };

  const tileContent = ({ date: tileDate, view }) => {
    if (view !== 'month') return null;

    const dayEvents = getEventsForDate(tileDate);
    if (dayEvents.length === 0) return null;

    return (
      <div className="flex justify-center mt-1">
        <div className="flex gap-1">
          {dayEvents.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-primary-600"
            />
          ))}
        </div>
      </div>
    );
  };

  const tileClassName = ({ date: tileDate, view }) => {
    if (view !== 'month') return '';

    const dayEvents = getEventsForDate(tileDate);
    const isSelected =
      tileDate.getDate() === date.getDate() &&
      tileDate.getMonth() === date.getMonth() &&
      tileDate.getFullYear() === date.getFullYear();

    return clsx(
      dayEvents.length > 0 && 'has-events',
      isSelected && 'selected-date'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" />
            Event Calendar
          </h2>
        </div>

        <Calendar
          onChange={handleDateClick}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="w-full border-none"
          prevLabel={<ChevronLeft className="w-5 h-5" />}
          nextLabel={<ChevronRight className="w-5 h-5" />}
        />

        {loading && (
          <div className="text-center mt-4">
            <p className="text-gray-500">Loading events...</p>
          </div>
        )}
      </div>

      {/* Selected Date Events */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {formatDate(date, 'MMMM dd, yyyy')}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h4>
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium whitespace-nowrap">
                    {event.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{formatTime(event.dateTime)}</span>
                  <span className="text-gray-500">{event.venue}</span>
                </div>

                {event.capacity && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {event.registrationCount || 0}/{event.capacity} registered
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((event.registrationCount || 0) / event.capacity) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No events on this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
