
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Card from './Card';
import { Calendar, MapPin } from 'lucide-react';

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
  let backgroundColor = '';
  let borderColor = '';
  
  switch(event.type) {
    case 'service':
      backgroundColor = '#4f46e5'; // indigo-600
      borderColor = '#4338ca'; // indigo-700
      break;
    case 'meeting':
      backgroundColor = '#10b981'; // emerald-500
      borderColor = '#059669'; // emerald-600
      break;
    case 'birthday':
      backgroundColor = '#ec4899'; // pink-500
      borderColor = '#db2777'; // pink-600
      break;
    case 'event':
    default:
      backgroundColor = '#f59e0b'; // amber-500
      borderColor = '#d97706'; // amber-600
  }

  const style = {
    backgroundColor,
    borderColor,
    borderRadius: '4px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block'
  };

  return {
    style
  };
};

const HomeCalendar = ({ events, compact = false }) => {
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(`${event.date}T${event.time ? event.time.split(' ')[0] : '00:00:00'}`),
    end: new Date(`${event.date}T${event.time ? event.time.split(' ')[0] : '23:59:59'}`)
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upcoming Events
        </h2>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      
      {compact ? (
        <div className="space-y-4">
          {formattedEvents
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5) // Show only 5 events in compact view
            .map((event) => (
              <div 
                key={event._id} 
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                style={{ 
                  borderLeft: `4px solid ${eventStyleGetter(event).style.borderColor}`,
                  backgroundColor: `${eventStyleGetter(event).style.backgroundColor}20`
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {moment(event.date).format('MMM D')} • {event.time || 'All Day'}
                    </span>
                    {event.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="h-96">
          <BigCalendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'agenda']}
            defaultView="month"
            popup
          />
        </div>
      )}
    </Card>
  );
};

export default HomeCalendar;