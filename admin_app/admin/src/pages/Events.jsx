import { useContext, useEffect, useState, useRef } from "react";
import { BsCalendar2Event } from "react-icons/bs";
import { IoLocation } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaFileDownload } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";
import { Reorder } from "motion/react";
import Tooltip from "../components/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/user_context/context_provider.jsx";
import * as EVENT_MIDDLEWARE from "../middleware/events_middleware.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FilterDropdown = ({
  anchorRef,
  filters,
  setFilters,
  onClose,
  onApply,
  sortOrder,
  setSortOrder,
}) => {
  // position the dropdown below the anchorRef
  return (
    <div className="absolute z-50 mt-2 right-0 w-80 bg-white rounded-lg shadow-md border p-4 text-black">
      <h2 className="text-md font-semibold mb-2">Filter</h2>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Event Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2 rounded text-sm"
        />

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2 rounded text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <input
              type="date"
              value={filters.start_date || ""}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
              className="border p-2 rounded text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">End Date</label>
            <input
              type="date"
              value={filters.end_date || ""}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
              className="border p-2 rounded text-sm w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Start Time</label>
            <input
              type="time"
              value={filters.start_time || ""}
              onChange={(e) =>
                setFilters({ ...filters, start_time: e.target.value })
              }
              className="border p-2 rounded text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">End Time</label>
            <input
              type="time"
              value={filters.end_time || ""}
              onChange={(e) =>
                setFilters({ ...filters, end_time: e.target.value })
              }
              className="border p-2 rounded text-sm w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm">Sort</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1 rounded border border-gray-400 text-gray-600 text-sm"
        >
          Close
        </button>
        <button
          onClick={onApply}
          className="px-3 py-1 rounded bg-gray-700 text-white text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // store original unfiltered list
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    start_date: null,
    end_date: null,
    start_time: null,
    end_time: null,
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const filterButtonRef = useRef(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // helper functions
  function popEvent(idx) {
    setEvents(prev => prev.filter((_, i) => i !== idx));
  }


  useEffect(() => {
    const loadEvents = async () => {
      const data = await EVENT_MIDDLEWARE.fetchEvents(user);
      setEvents(data);
      setAllEvents(data);
    };
    loadEvents();
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        // if clicking outside the filter button and dropdown is open, close it
        const dropdown = document.querySelector(".filter-dropdown");
        if (dropdown && !dropdown.contains(e.target)) {
          setShowFilterDropdown(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddEventClick = (e) => {
    e.preventDefault();
    navigate("/events/create", {
      state: { editMode: false, eventObj: null },
    });
  };

  const handleEditEventClick = (event) => {
    navigate(`/events/edit/${event.id}`, {
      state: { editMode: true, eventObj: event },
    });
  };

  const handleApplyFilters = () => {
    let filtered = allEvents.slice();

    // text filters
    if (filters.name) {
      filtered = filtered.filter((e) =>
        e.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.location) {
      filtered = filtered.filter((e) =>
        e.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // date/time range filter - combine date with times if available
    const toTimestamp = (dateStr, timeStr) => {
      if (!dateStr) return null;
      const t = timeStr || "00:00";
      return new Date(`${dateStr}T${t}`).getTime();
    };

    const startTs = toTimestamp(filters.start_date, filters.start_time);
    const endTs = toTimestamp(filters.end_date, filters.end_time);

    if (startTs || endTs) {
      filtered = filtered.filter((e) => {
        const eventDate = e.date || e.event_date || e.start_date || null;
        const eventTime = e.time || e.start_time || null;
        if (!eventDate) return false;
        const evTs = toTimestamp(eventDate, eventTime) || null;
        if (startTs && endTs) return evTs >= startTs && evTs <= endTs;
        if (startTs) return evTs >= startTs;
        if (endTs) return evTs <= endTs;
        return true;
      });
    }

    // sort by date/time
    filtered.sort((a, b) => {
      const aTs =
        toTimestamp(a.date || a.event_date, a.time || a.start_time) || 0;
      const bTs =
        toTimestamp(b.date || b.event_date, b.time || b.start_time) || 0;
      return sortOrder === "asc" ? aTs - bTs : bTs - aTs;
    });

    setEvents(filtered);
    setShowFilterDropdown(false);
  };

  return (
    
    <div className="px-8 gap-2 flex flex-col py-8">
      <div className="w-full flex items-center text-gray-800">
        <h1 className="text-4xl font-semibold grow"> Events</h1>
        <button className="flex items-center text-white text-sm gap-2 p-2 border border-gray-500 bg-gray-400 rounded-lg">
          <FaFileDownload />
          Download CSV
        </button>
      </div>

      <div className="w-full h-18 border-gray-500 text-gray-700 items-center flex gap-4">
        <div className="flex grow h-8 border rounded-lg p-1 px-2 gap-2 items-center justify-center">
          <CiSearch />
          <input
            type="search"
            placeholder="Search events..."
            className="w-full outline-0 text-xs"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              setEvents(
                allEvents.filter((ev) => ev.name.toLowerCase().includes(query))
              );
            }}
          />
        </div>

        <Tooltip position="bottom" element={<h1>Add Event</h1>}>
          <h1
            onClick={handleAddEventClick}
            className="h-8 w-10 flex items-center justify-center text-center border rounded-lg border-gray-500"
          >
            +
          </h1>
        </Tooltip>

        <div className="relative" ref={filterButtonRef}>
          <button
            onClick={() => setShowFilterDropdown((s) => !s)}
            className="text-xs w-48 h-8 border rounded-lg flex items-center justify-center text-gray-500"
          >
            Filter
          </button>
          {showFilterDropdown && (
            <div className="filter-dropdown">
              <FilterDropdown
                anchorRef={filterButtonRef}
                filters={filters}
                setFilters={setFilters}
                onClose={() => setShowFilterDropdown(false)}
                onApply={handleApplyFilters}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          )}
        </div>
      </div>

      {/* Events list */}
      <div className="w-full h-96 border rounded-xl border-gray-500 overflow-hidden">
        <div className="text-sm grid font-semibold grid-cols-4 px-4 py-2 shadow-md text-gray-100 bg-gray-600">
          <h1>Name</h1>
          <h1>Date</h1>
          <h1>Location</h1>
        </div>

        <Reorder.Group
          values={events || []}
          onReorder={setEvents}
          className="w-full h-full flex flex-col overflow-y-scroll"        >
          {events.length > 0 ? (
            events.map((event, idx) => (
              <Reorder.Item
                key={event.id}
                value={event}
                className="group grid grid-cols-4 border-b items-center px-4 p-2 shadow-md hover:shadow-lg text-gray-500 bg-white"
              >
                <p className="text-xs">{event.name}</p>
                <p className="text-xs text-gray-600">{event.date}</p>
                <p className="text-xs text-gray-500">{event.location}</p>

                <div className="flex">
                  <h1 className="grow flex"></h1>
                  <div className="rounded-full flex text-lg items-center justify-center gap-4 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Tooltip
                      position="bottom"
                      element={
                        <h1 className="flex gap-2 items-center">
                          View <LuExternalLink />
                        </h1>
                      }
                    >
                      <button>
                        <FaEye />
                      </button>
                    </Tooltip>

                    <Tooltip
                      position="bottom"
                      element={
                        <h1
                        className="flex gap-2 items-center">Edit</h1>
                      }
                    >
                      <button onClick={()=> handleEditEventClick(event)} onClick={() => handleEditEventClick(event)}>
                        <CiEdit />
                      </button>
                    </Tooltip>

                    <Tooltip
                      position="bottom"
                      element={
                        <h1 className="flex gap-2 items-center">Remove</h1>
                      }
                    >
                      <button 
                    onClick={()=> handleDeleteEvent(event, idx)} 
                    className="hover:text-red-600 hover:rotate-12 transition">
                        <FaRegTrashCan />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </Reorder.Item>
            ))
          ) : (
            <div className="text-gray-600 w-full h-full flex items-center justify-center text-sm">
              <Link
                to={"create"}
                className="p-2 px-4 shadow transition shadow-gray-300 border-gray-600 rounded-lg flex"
              >
                + Add Event
              </Link>
            </div>
          )}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Events;
