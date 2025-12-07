import 'temporal-polyfill/global'

/**
 * Parses a date string in various formats:
 * - ISO format: "2026-05-06T00:00:00.000Z" or "2026-05-06"
 * - Custom format: "02. 15. 2024."
 * @param {string} dateString - Date string in ISO or custom format
 * @returns {{year: number, month: number, day: number} | null} - Parsed date components or null if invalid
 */
export function parseDateString(dateInput) {
  if (!dateInput) return null;
  
  // Handle Date objects
  let dateString;
  if (dateInput instanceof Date) {
    dateString = dateInput.toISOString();
  } else {
    dateString = String(dateInput);
  }
  
  // Try ISO format first (e.g., "2026-05-06T00:00:00.000Z" or "2026-05-06")
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    };
  }
  
  // Try custom format "MM. DD. YYYY."
  const dateMatch = dateString.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\./);
  if (!dateMatch) return null;
  
  const [, month, day, year] = dateMatch;
  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
  };
}

/**
 * Converts 12-hour format (AM/PM) to 24-hour format
 * @param {number} hour - Hour in 12-hour format (1-12)
 * @param {string} period - 'AM' or 'PM'
 * @returns {number} - Hour in 24-hour format (0-23)
 */
export function convertTo24Hour(hour, period) {
  let hour24 = parseInt(hour);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  return hour24;
}

/**
 * Parses a time string in various formats:
 * - 24-hour format: "02:35:00" or "14:30:00"
 * - 12-hour format: "10:00 AM - 2:00 PM"
 * @param {string} timeString - Time string in 24-hour or 12-hour format
 * @param {string} endTimeString - Optional separate end time string (for 24-hour format)
 * @returns {{startHour: number, startMin: number, endHour: number, endMin: number} | null} - Parsed time components or null if invalid
 */
export function parseTimeString(timeString, endTimeString = null) {
  if (!timeString) return null;
  
  // Try 12-hour format first: "10:00 AM - 2:00 PM"
  const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/);
  if (timeMatch) {
    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;
    return {
      startHour: convertTo24Hour(startHour, startPeriod),
      startMin: parseInt(startMin),
      endHour: convertTo24Hour(endHour, endPeriod),
      endMin: parseInt(endMin),
    };
  }
  
  // Try 24-hour format: "02:35:00" or "14:30"
  const time24Match = timeString.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (time24Match) {
    const [, hour, min] = time24Match;
    const startHour = parseInt(hour);
    const startMin = parseInt(min);
    
    // If endTimeString is provided, parse it too
    if (endTimeString) {
      const endTime24Match = endTimeString.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (endTime24Match) {
        const [, endHour, endMin] = endTime24Match;
        return {
          startHour,
          startMin,
          endHour: parseInt(endHour),
          endMin: parseInt(endMin),
        };
      }
    }
    
    // If no end time, assume 1 hour duration
    let endHour = startHour + 1;
    let endMin = startMin;
    if (endHour >= 24) {
      endHour = 23;
      endMin = 59;
    }
    
    return {
      startHour,
      startMin,
      endHour,
      endMin,
    };
  }
  
  return null;
}

/**
 * Transforms an event from the application format to ScheduleX calendar format
 * Supports both API format (ISO dates, 24-hour time) and custom format
 * @param {Object} event - Event object with id, name, date, time, location, and description properties
 * @returns {Object | null} - Transformed event for ScheduleX with location and description or null if invalid
 */
export function transformEventToCalendarFormat(event) {
  if (!event || !event.id) {
    console.warn('Invalid event object:', event);
    return null;
  }
  
  // Parse date - supports ISO format, Date objects, or custom format
  const dateComponents = parseDateString(event.date);
  if (!dateComponents) {
    console.warn(`Invalid date format for event ${event.id}:`, event.date, typeof event.date);
    return null;
  }
  
  const { year, month, day } = dateComponents;
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // Parse time - supports both 24-hour format (from API) and 12-hour format
  // API format has separate start_time and end_time fields
  let timeComponents;
  if (event.time) {
    // Custom format: "10:00 AM - 2:00 PM"
    timeComponents = parseTimeString(event.time);
  } else if (event.start_time) {
    // API format: separate start_time and end_time in 24-hour format
    timeComponents = parseTimeString(event.start_time, event.end_time);
  } else {
    timeComponents = null;
  }
  let startDateTime, endDateTime;
  
  if (timeComponents) {
    const { startHour, startMin, endHour, endMin } = timeComponents;
    
    // Create Temporal.PlainDateTime objects
    const startPlainDateTime = Temporal.PlainDateTime.from({
      year,
      month,
      day,
      hour: startHour,
      minute: startMin,
    });
    
    const endPlainDateTime = Temporal.PlainDateTime.from({
      year,
      month,
      day,
      hour: endHour,
      minute: endMin,
    });
    
    // Convert to ZonedDateTime (using system timezone)
    // Get system timezone using Intl API (most reliable cross-browser)
    const timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    startDateTime = startPlainDateTime.toZonedDateTime(timeZoneId);
    endDateTime = endPlainDateTime.toZonedDateTime(timeZoneId);
  } else {
    // If no time, use just the date (all-day event)
    startDateTime = Temporal.PlainDate.from(dateString);
    endDateTime = Temporal.PlainDate.from(dateString);
  }
  
  return {
    id: String(event.id),
    title: event.name || 'Untitled Event',
    start: startDateTime,
    end: endDateTime,
    location: event.location || '',
    description: event.description || '',
  };
}

/**
 * Transforms an array of events to ScheduleX calendar format
 * @param {Array} events - Array of event objects
 * @returns {Array} - Array of transformed events for ScheduleX
 */
export function transformEventsToCalendarFormat(events) {
  if (!Array.isArray(events)) {
    console.warn('transformEventsToCalendarFormat: events is not an array:', events);
    return [];
  }
  
  if (events.length === 0) {
    console.log('transformEventsToCalendarFormat: events array is empty');
    return [];
  }
  
  console.log('transformEventsToCalendarFormat: transforming', events.length, 'events');
  const transformed = events
    .map((event, index) => {
      const result = transformEventToCalendarFormat(event);
      if (!result) {
        console.warn(`Event at index ${index} failed to transform:`, event);
      }
      return result;
    })
    .filter(event => event !== null);
  
  console.log('transformEventsToCalendarFormat: successfully transformed', transformed.length, 'events');
  return transformed;
}

