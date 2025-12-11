import React, { useEffect, useState } from 'react'
import { loadEvents } from "../middlewares/events_middleware.js"

export default function EventEndpoints() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await loadEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <h1>EventEndpoints</h1>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  )
}
