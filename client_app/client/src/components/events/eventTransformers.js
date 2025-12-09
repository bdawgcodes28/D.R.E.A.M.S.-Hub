import 'temporal-polyfill/global'

/**
 * Parses a date string in multiple formats:
 * - "MM. DD. YYYY." (e.g., "02. 15. 2024.")
 * - "YYYY-MM-DD" (MySQL date format, e.g., "2024-02-15")
 * - "YYYY-MM-DD HH:MM:SS" (MySQL datetime format)
 * @param {string} dateString - Date string in various formats
 * @returns {{year: number, month: number, day: number} | null} - Parsed date components or null if invalid
 */
export function parseDateString(dateString) {
  if (!dateString) return null;
  
  // Try format "MM. DD. YYYY." first (original format)
  let dateMatch = dateString.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\./);
  if (dateMatch) {
    const [, month, day, year] = dateMatch;
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    };
  }
  
  // Try MySQL date format "YYYY-MM-DD" or "YYYY-MM-DD HH:MM:SS"
  dateMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})(?:\s+\d{2}:\d{2}:\d{2})?/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    };
  }
  
  // Try to parse as a standard Date object as fallback
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1, // JavaScript months are 0-indexed
      day: dateObj.getDate(),
    };
  }
  
  return null;
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
 * Parses a time string in the format "10:00 AM - 2:00 PM" and returns start and end time components
 * @param {string} timeString - Time string in format "HH:MM AM/PM - HH:MM AM/PM"
 * @returns {{startHour: number, startMin: number, endHour: number, endMin: number} | null} - Parsed time components or null if invalid
 */
export function parseTimeString(timeString) {
  if (!timeString) return null;
  
  const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/);
  if (!timeMatch) return null;
  
  const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;
  
  return {
    startHour: convertTo24Hour(startHour, startPeriod),
    startMin: parseInt(startMin),
    endHour: convertTo24Hour(endHour, endPeriod),
    endMin: parseInt(endMin),
  };
}

/**
 * Transforms an event from the application format to ScheduleX calendar format
 * @param {Object} event - Event object with id, name, date, time, location, and description properties
 * @returns {Object | null} - Transformed event for ScheduleX with location and description or null if invalid
 */
export function transformEventToCalendarFormat(event) {
  if (!event || !event.date) {
    console.warn(`Event missing date field:`, event);
    return null;
  }
  
  // Parse date
  const dateComponents = parseDateString(event.date);
  if (!dateComponents) {
    console.warn(`Invalid date format for event ${event.id || 'unknown'}: "${event.date}". Expected format: "MM. DD. YYYY."`);
    return null;
  }
  
  const { year, month, day } = dateComponents;
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // Parse time
  const timeComponents = parseTimeString(event.time);
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
  if (!Array.isArray(events)) return [];
  
  return events
    .map(transformEventToCalendarFormat)
    .filter(event => event !== null);
}

