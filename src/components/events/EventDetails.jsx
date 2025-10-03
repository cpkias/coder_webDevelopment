/**
 * EventDetails Component
 * Detailed view of an event with registration functionality
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEvent, useEventRegistration } from '@/hooks/useEvents';
import { deleteEvent } from '@/services/eventService';
import {
  formatDate,
  formatTime,
  getCapacityPercentage,
  isUpcoming,
  getRelativeTime,
} from '@/utils/formatters';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { clsx } from 'clsx';

const EventDetails = ({ eventId }) => {
  const navigate = useNavigate();
  const { user, userProfile, isAuthenticated, isOrganizer } = useAuth();
  const { event, loading: eventLoading } = useEvent(eventId);
  const { isRegistered, loading: regLoading, register, unregister } = useEventRegistration(
    eventId,
    user?.uid
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  if (eventLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h3>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  const isEventOrganizer = user?.uid === event.organizerId;
  const canEdit = isEventOrganizer || userProfile?.role === 'admin';
  const isEventUpcoming = isUpcoming(event.dateTime);
  const isFull = event.capacity && event.registrationCount >= event.capacity;
  const capacityPercentage = getCapacityPercentage(event.registrationCount || 0, event.capacity);
  const canRegister = isAuthenticated && isEventUpcoming && !isFull && !isRegistered;

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await register(user.email, userProfile.displayName);
      toast.success('Successfully registered for the event!');
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    setActionLoading(true);
    try {
      await unregister();
      toast.success('Successfully unregistered from the event');
    } catch (error) {
      toast.error(error.message || 'Failed to unregister');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      navigate('/my-events');
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        icon={<ArrowLeft className="w-5 h-5" />}
        className="mb-6"
      >
        Back
      </Button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image Gallery */}
        {event.images && event.images.length > 0 && (
          <div className="relative">
            <img
              src={event.images[selectedImage]}
              alt={event.title}
              className="w-full h-96 object-cover"
            />
            
            {event.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {event.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={clsx(
                      'w-3 h-3 rounded-full transition-all',
                      selectedImage === index ? 'bg-white w-6' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  {event.category}
                </span>
                {!isEventUpcoming && (
                  <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                    Past Event
                  </span>
                )}
                {isFull && (
                  <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    Fully Booked
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span>Organized by {event.organizerName}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleShare}
                icon={<Share2 className="w-5 h-5" />}
              >
                Share
              </Button>
              
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/events/${eventId}/edit`)}
                    icon={<Edit className="w-5 h-5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    loading={actionLoading}
                    icon={<Trash2 className="w-5 h-5" />}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(event.dateTime, 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTime(event.dateTime)}
                  </p>
                  <p className="text-sm text-gray-500">{getRelativeTime(event.dateTime)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="text-lg font-semibold text-gray-900">{event.venue}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {event.capacity && (
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.registrationCount || 0} / {event.capacity} registered
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all',
                          isFull ? 'bg-red-500' : capacityPercentage >= 80 ? 'bg-amber-500' : 'bg-primary-600'
                        )}
                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {event.registrationDeadline && (
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Deadline</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(event.registrationDeadline, 'MMM dd, yyyy - h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Registration Section */}
          {isAuthenticated && (
            <div className="border-t pt-8">
              {isRegistered ? (
                <div className="flex items-center justify-between p-6 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        You're Registered!
                      </h3>
                      <p className="text-green-700">
                        See you at the event. Check your email for confirmation.
                      </p>
                    </div>
                  </div>
                  {isEventUpcoming && (
                    <Button
                      variant="outline"
                      onClick={handleUnregister}
                      loading={actionLoading}
                    >
                      Unregister
                    </Button>
                  )}
                </div>
              ) : canRegister ? (
                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleRegister}
                    loading={actionLoading || regLoading}
                    className="px-12"
                  >
                    Register for This Event
                  </Button>
                </div>
              ) : !isEventUpcoming ? (
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
                  <XCircle className="w-8 h-8 text-gray-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Event Has Ended</h3>
                    <p className="text-gray-700">This event is no longer accepting registrations.</p>
                  </div>
                </div>
              ) : isFull ? (
                <div className="flex items-center justify-center p-6 bg-red-50 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Event Full</h3>
                    <p className="text-red-700">This event has reached maximum capacity.</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {!isAuthenticated && isEventUpcoming && (
            <div className="border-t pt-8 text-center">
              <p className="text-gray-700 mb-4">Please sign in to register for this event</p>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Sign In to Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
