import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Filter, Search, Clock, MapPin, Users, X } from 'lucide-react';
import Card from '../components/Card';
import Calendar from '../components/Calendar';
import { useCalendarStore } from '../contexts/calendarContext';
import { CalendarSkeleton } from '../skeleton/CalendarSkeleton';
import { UpcomingEventsSkeleton } from '../skeleton/upcomingEventsSkeleton';


const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

   const { events, loading, error, fetchEvents } = useCalendarStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  
  if (error) return <div className="alert alert-error">{error}</div>;

 const eventTypes = [
    { value: 'all', label: 'All Events', color: 'bg-gray-500' },
    { value: 'service', label: 'Services', color: 'bg-blue-500' },
    { value: 'meeting', label: 'Meetings', color: 'bg-green-500' },
    { value: 'event', label: 'Events', color: 'bg-purple-500' },
    { value: 'birthday', label: 'Birthdays', color: 'bg-pink-500' }
  ];

const today = new Date();
const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const filteredEvents = events.filter(event => {
  const matchesType = filterType === 'all' || event.type === filterType;
  const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesType && matchesSearch;
});

const normalizeDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));
};

  const upcomingEvents = filteredEvents
  .filter(event => normalizeDate(event.date) >= normalizedToday)
  .sort((a, b) => normalizeDate(a.date) - normalizeDate(b.date));

  const getEventTypeInfo = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const formatDate = (dateString, showTimezone = false) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  };
  
  const date = new Date(dateString);
  let formatted = date.toLocaleDateString('WAT', options);
  
  if (showTimezone) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    formatted += ` (${tz})`;
  }
  
  return formatted;
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chapel Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with all chapel events, services, and important dates
          </p>
        </div>
        {/* <button
          onClick={() => setShowEventForm(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button> */}
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
          <div className="lg:col-span-2">
        {loading ? (
          <CalendarSkeleton />
        ) : (
            <Calendar 
              events={filteredEvents.map(event => ({
                ...event,
                date: normalizeDate(event.date).toISOString().split('T')[0] // format as 'YYYY-MM-DD'
              }))} 
              onEventClick={setSelectedEvent}
            />
        )}
          </div>

        {/* Upcoming Events */}
        {loading ? (
          <UpcomingEventsSkeleton />
        ) : (
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Upcoming Events
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No upcoming events found</p>
                </div>
              ) : (
                upcomingEvents.map(event => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                      <span className={`w-3 h-3 rounded-full ${getEventTypeInfo(event.type).color}`} />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Event Details</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedEvent.title}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getEventTypeInfo(selectedEvent.type).color}`}>
                    {getEventTypeInfo(selectedEvent.type).label}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-3" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-3" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-3" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {selectedEvent.attendees && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-3" />
                      <span>{selectedEvent.attendees} expected attendees</span>
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
                
                {selectedEvent.organizer && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Organizer</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedEvent.organizer}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;