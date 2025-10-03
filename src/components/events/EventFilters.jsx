/**
 * EventFilters Component
 * Search and filter events by various criteria
 */

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '@components/common/Button';
import { clsx } from 'clsx';

const EVENT_CATEGORIES = [
  'Academic',
  'Sports',
  'Cultural',
  'Technical',
  'Workshop',
  'Seminar',
  'Competition',
  'Social',
  'Career',
  'Other',
];

const VENUES = [
  'Main Auditorium',
  'Seminar Hall',
  'Sports Complex',
  'Library',
  'Cafeteria',
  'Open Ground',
  'Lab Block',
  'Conference Room',
];

const EventFilters = ({ onFilter, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    venue: '',
    startDate: '',
    endDate: '',
    orderBy: 'dateTime',
    orderDirection: 'asc',
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    if (searchTimeout) clearTimeout(searchTimeout);
    const searchTimeout = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      venue: '',
      startDate: '',
      endDate: '',
      orderBy: 'dateTime',
      orderDirection: 'asc',
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    onFilter(emptyFilters);
    onSearch('');
  };

  const hasActiveFilters =
    filters.category || filters.venue || filters.startDate || filters.endDate || searchTerm;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events by title, description, or tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter className="w-5 h-5" />}
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
              {[filters.category, filters.venue, filters.startDate, filters.endDate, searchTerm]
                .filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} icon={<X className="w-5 h-5" />}>
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <select
                value={filters.venue}
                onChange={(e) => handleFilterChange('venue', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Venues</option>
                {VENUES.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.orderBy}
                onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="dateTime">Event Date</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
                <option value="registrationCount">Popularity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={filters.orderDirection}
                onChange={(e) => handleFilterChange('orderDirection', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
