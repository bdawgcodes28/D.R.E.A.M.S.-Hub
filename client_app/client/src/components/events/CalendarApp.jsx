import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useState, useEffect, useMemo, useRef } from 'react'
import { transformEventsToCalendarFormat } from './eventTransformers'
 
function CalendarApp({ eventList = [] }) {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const calendarRef = useRef(null)

  // Transform events to ScheduleX calendar format
  const calendarEvents = useMemo(() => {
    if (!eventList || eventList.length === 0) return [];
    const transformed = transformEventsToCalendarFormat(eventList);
    console.log('Original events:', eventList);
    console.log('Transformed events:', transformed);
    return transformed;
  }, [eventList]);

  // Recreate calendar config when events change
  const calendarConfig = useMemo(() => ({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    defaultView: 'month-grid',
    // Events are managed through eventsService, not passed in config
    plugins: [eventsService],
    // Prevent automatic view switching on resize
    minDate: undefined,
    maxDate: undefined,
  }), [eventsService]);

  const calendar = useCalendarApp(calendarConfig)
  calendarRef.current = calendar
 
  // Update events when they change
  useEffect(() => {
    if (eventsService) {
      // Clear existing events
      const existingEvents = eventsService.getAll();
      existingEvents.forEach(event => {
        eventsService.remove(event.id);
      });
      
      // Add new events
      if (calendarEvents.length > 0) {
        console.log('Adding events to calendar:', calendarEvents.length);
        calendarEvents.forEach(event => {
          try {
            eventsService.add(event);
          } catch (error) {
            console.error('Error adding event to calendar:', error, event);
          }
        });
      }
    }
  }, [calendarEvents, eventsService]);

  // Navigate to today's date when calendar loads
  useEffect(() => {
    if (calendar && calendar.calendarState) {
      const today = Temporal.Now.plainDateISO()
      calendar.calendarState.date.value = today
    }
  }, [calendar])

  // Lock view to month-grid and prevent automatic view switching on resize
  useEffect(() => {
    if (calendar && calendar.calendarState) {
      // Ensure view stays as month-grid
      const currentView = calendar.calendarState.view.value;
      if (currentView !== 'month-grid') {
        calendar.calendarState.view.value = 'month-grid';
      }
    }
  }, [calendar])

  // Prevent view changes on window resize
  useEffect(() => {
    const handleResize = () => {
      if (calendarRef.current && calendarRef.current.calendarState) {
        // Lock the view to month-grid on resize
        calendarRef.current.calendarState.view.value = 'month-grid';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp