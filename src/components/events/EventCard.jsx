/**
 * EventCard Component
 * Display event in card format with key information
 */

import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { formatDate, formatTime, getCapacityPercentage, truncateText } from '@/utils/formatters';
import { clsx } from 'clsx';

const EventCard = ({ event }) => {
  const capacityPercentage = getCapacityPercentage(
    event.registrationCount || 0,
    event.capacity
  );

  const isFullyBooked = event.capacity && event.registrationCount >= event.capacity;
  const isNearCapacity = capacityPercentage >= 80;

  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
        {event.images && event.images.length > 0 ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700">
            {event.category}
          </span>
        </div>

        {/* Capacity Warning */}
        {isFullyBooked && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
              Fully Booked
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {truncateText(event.description, 120)}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primary-600" />
            <span>{formatDate(event.dateTime, 'EEE, MMM dd, yyyy')}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-primary-600" />
            <span>{formatTime(event.dateTime)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
            <span className="truncate">{event.venue}</span>
          </div>

          {event.capacity && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-primary-600" />
              <span>
                {event.registrationCount || 0} / {event.capacity} registered
              </span>
            </div>
          )}
        </div>

        {/* Capacity Bar */}
        {event.capacity && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={clsx(
                  'h-full transition-all duration-300',
                  isFullyBooked ? 'bg-red-500' : isNearCapacity ? 'bg-amber-500' : 'bg-primary-600'
                )}
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
