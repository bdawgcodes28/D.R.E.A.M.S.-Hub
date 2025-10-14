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

const FilterDropdown = ({
  anchorRef,
  filters,
  setFilters,
  onClose,
  onApply,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="absolute z-50 mt-2 right-0 w-80 bg-white rounded-lg shadow-md border p-4 text-black">
      <h2 className="text-md font-semibold mb-2">Filter</h2>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Program Name"
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
          onClick={() => {
            const cleared = {
              name: "",
              location: "",
              start_date: null,
              end_date: null,
              start_time: null,
              end_time: null,
            };
            const clearedSort = "asc";
            setFilters(cleared);
            setSortOrder(clearedSort);
            onApply(cleared, clearedSort);
          }}
          className="px-3 py-1 rounded border border-gray-300 text-gray-700 text-sm bg-white hover:bg-gray-50"
        >
          Clear
        </button>

        <button
          onClick={onClose}
          className="px-3 py-1 rounded border border-gray-400 text-gray-600 text-sm"
        >
          Close
        </button>
        <button
          onClick={() => onApply()}
          className="px-3 py-1 rounded bg-gray-700 text-white text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
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

  function popProgram(idx) {
    setPrograms((prev) => prev.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    const loadPrograms = async () => {
      const data = await EVENT_MIDDLEWARE.fetchEvents(user);
      setPrograms(data);
      setAllPrograms(data);
    };
    loadPrograms();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        const dropdown = document.querySelector(".filter-dropdown");
        if (dropdown && !dropdown.contains(e.target)) {
          setShowFilterDropdown(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddProgramClick = (e) => {
    e.preventDefault();
    navigate("/programs/create", {
      state: { editMode: false, programObj: null },
    });
  };

  const handleEditProgramClick = (program) => {
    navigate("/programs/create", {
      state: { editMode: true, programObj: program },
    });
  };

  const handleDeleteProgram = async (program, idx) => {
    try {
      const response = await EVENT_MIDDLEWARE.deleteEvent(program, user);
      if (response && response.status === 200) {
        popProgram(idx);
      } else {
        console.log("Unable to complete request:", response);
      }
    } catch (error) {
      console.error("Couldnt fulfill request:", error);
    }
  };

  const toTimestamp = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const t = timeStr || "00:00";
    return new Date(`${dateStr}T${t}`).getTime();
  };

  const handleApplyFilters = (overrideFilters = null, overrideSort = null) => {
    const useFilters = overrideFilters || filters;
    const useSort = overrideSort || sortOrder;

    let filtered = allPrograms.slice();

    if (useFilters.name) {
      filtered = filtered.filter((e) =>
        (e.name || "").toLowerCase().includes(useFilters.name.toLowerCase())
      );
    }
    if (useFilters.location) {
      filtered = filtered.filter((e) =>
        (e.location || "")
          .toLowerCase()
          .includes(useFilters.location.toLowerCase())
      );
    }

    const startTs = toTimestamp(useFilters.start_date, useFilters.start_time);
    const endTs = toTimestamp(useFilters.end_date, useFilters.end_time);

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

    filtered.sort((a, b) => {
      const aTs =
        toTimestamp(
          a.date || a.event_date || a.start_date,
          a.time || a.start_time
        ) || 0;
      const bTs =
        toTimestamp(
          b.date || b.event_date || b.start_date,
          b.time || b.start_time
        ) || 0;
      return useSort === "asc" ? aTs - bTs : bTs - aTs;
    });

    setPrograms(filtered);
    setShowFilterDropdown(false);
  };

  return (
    <div className="px-8 gap-2 flex flex-col py-8  h-full">
      <div className="w-full flex items-center text-gray-800">
        <h1 className="text-4xl font-semibold grow"> Programs</h1>
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
            placeholder="Search programs..."
            className="w-full outline-0 text-xs"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              setPrograms(
                allPrograms.filter((ev) =>
                  ev.name.toLowerCase().includes(query)
                )
              );
            }}
          />
        </div>

        <Tooltip position="bottom" element={<h1>Add Program</h1>}>
          <h1
            onClick={handleAddProgramClick}
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

      {/* Programs list */}
      <div className="w-full h-[100%] border rounded-xl border-gray-500 overflow-hidden">
        <div className="text-sm grid font-semibold grid-cols-4 px-4 py-2 shadow-md text-gray-100 bg-gray-600">
          <h1>Name</h1>
          <h1>Date</h1>
          <h1>Location</h1>
        </div>
        <Reorder.Group
          values={programs || []}
          onReorder={setPrograms}
          className="w-full h-full flex flex-col overflow-y-scroll  "
        >
          {programs.length > 0 ? (
            programs.map((program, idx) => (
              <Reorder.Item
                key={program.id}
                value={program}
                className="group grid grid-cols-4 border-b items-center px-4 p-2 shadow-md hover:shadow-lg  text-gray-500 bg-white"
              >
                <p className="text-xs w-fit truncate">{program.name}</p>
                <p className="text-xs text-gray-600">{program.date}</p>
                <p className="text-xs text-gray-500">{program.location}</p>
                <div className="flex">
                  <h1 className="grow flex"></h1>
                  <div className="rounded-full flex text-lg items-center justify-center gap-4 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Tooltip
                      position="bottom"
                      element={
                        <h1 className="flex gap-2 justify-center items-center">
                          View <LuExternalLink />{" "}
                        </h1>
                      }
                    >
                      <button>
                        {" "}
                        <FaEye />
                      </button>{" "}
                    </Tooltip>
                    <Tooltip
                      position="bottom"
                      element={
                        <h1 className="flex gap-2 justify-center items-center">
                          Edit{" "}
                        </h1>
                      }
                    >
                      <button onClick={() => handleEditProgramClick(program)}>
                        {" "}
                        <CiEdit />
                      </button>{" "}
                    </Tooltip>
                    <Tooltip
                      position="bottom"
                      element={
                        <h1 className="flex gap-2 justify-center items-center">
                          Remove <LuExternalLink />{" "}
                        </h1>
                      }
                    >
                      <button
                        onClick={() => handleDeleteProgram(program, idx)}
                        className="hover:text-red-600 hover:rotate-12 transition"
                      >
                        <FaRegTrashCan />
                      </button>{" "}
                    </Tooltip>
                  </div>
                </div>
              </Reorder.Item>
            ))
          ) : (
            <div className="text-gray-600 w-full h-full items-center justify-center flex text-sm">
              <Link
                to={"create"}
                className="p-2 px-4 shadow hover:shadow-gray-500 transition shadow-gray-300 border-gray-600  rounded-lg flex"
              >
                {" "}
                + Add Program
              </Link>{" "}
            </div>
          )}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Programs;
