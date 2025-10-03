/**
 * useEvents Hook
 * Custom hook for event operations
 */

import { useState, useEffect } from 'react';
import {
  getEvents,
  searchEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  isUserRegistered,
  getUserRegistrations,
} from '@/services/eventService';

export const useEvents = (filters = {}, autoFetch = true) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchEvents = async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getEvents(filters, 20, reset ? null : lastDoc);
      setEvents(reset ? result.events : [...events, ...result.events]);
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchForEvents = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchEvents(searchTerm);
      setEvents(result);
      setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(false);
    }
  };

  const refresh = () => {
    fetchEvents(true);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchEvents(true);
    }
  }, [JSON.stringify(filters)]);

  return {
    events,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    searchForEvents,
  };
};

export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  return { event, loading, error, refresh: fetchEvent };
};

export const useEventRegistration = (eventId, userId) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkRegistration = async () => {
    if (!eventId || !userId) {
      setLoading(false);
      return;
    }

    try {
      const registered = await isUserRegistered(eventId, userId);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Failed to check registration:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRegistration();
  }, [eventId, userId]);

  const register = async (userEmail, userName) => {
    try {
      await registerForEvent(eventId, userId, userEmail, userName);
      setIsRegistered(true);
    } catch (error) {
      throw error;
    }
  };

  const unregister = async () => {
    try {
      await unregisterFromEvent(eventId, userId);
      setIsRegistered(false);
    } catch (error) {
      throw error;
    }
  };

  return {
    isRegistered,
    loading,
    register,
    unregister,
    refresh: checkRegistration,
  };
};

export const useUserRegistrations = (userId) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegistrations = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getUserRegistrations(userId);
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [userId]);

  return {
    registrations,
    loading,
    error,
    refresh: fetchRegistrations,
  };
};
