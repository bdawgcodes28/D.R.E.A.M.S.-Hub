import { useContext, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Reorder } from "framer-motion";
import * as EVENT_MIDDLEWARE from "../middleware/events_middleware.js"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/user_context/context_provider.jsx";
import { useLocation } from "react-router-dom";

const EventEdit = () => {

  // get mode of page
  const location = useLocation();
  const { editMode, eventObj } = location.state || { editMode: false, event: null };

  // naviagtion hook
  const navigate = useNavigate();
  // user context
  const {user, setUser} = useContext(UserContext);

  const [event, setEvent] = useState({
    id: null,
    name: "",
    date: "",
    location: "",
    description: "",
    media: [],
    start_time: "",
    end_time: ""
  });

  // handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));

    console.log(event)
  };

  // handle media uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file)
    }));

    setEvent(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
  };

  // utility to format time string for <input type="time">
  function formatTimeForInput(timeString) {
    if (!timeString) return "";
    // split at the decimal if present and take first 3 decimals (milliseconds)
    const [time, fraction] = timeString.split(".");
    if (!fraction) return time; // already HH:mm:ss
    const ms = fraction.slice(0, 3); // take first 3 digits for milliseconds
    return `${time}.${ms}`; // HH:mm:ss.SSS
  }


  // request to add event 
  async function handleAppendEvent(){
      try {
          // attempt to add is event is valid
          console.log("checking event");
          if (EVENT_MIDDLEWARE.isValidEvent(event)){

            console.log("Event is valid");
            const response = await EVENT_MIDDLEWARE.appendEvent(event, user);
            console.log(response);

            if (response && response?.status === 200)
              navigate("/events"); // return to events page

            else
              console.error("Error when adding event"); // swap with rendering a pop up error telling user the issue

          }else{
            //FIXME: have a rendered pop up to let user whats is wrong with event form, what fields are incorrect/missing
            console.log("Event is not valid");
          }
      } catch (error) {
        console.error("Could not fulfill request:", error);
      }
  }

  // request to edit existing event 
  async function handleEditEvent(){}

  return (
    <div className="text-gray-700 flex h-full bg-gray-50 text-sm">
      {/* Main Form */}
      <div className="flex flex-col grow border-r border-gray-300 h-full p-10 overflow-y-scroll">
        <form className="space-y-6 max-w-2xl">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Title</label>
            <input
              type="text"
              name="name"
              value={editMode ? eventObj.name : event.name}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={editMode ? eventObj.date : event.date}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={editMode ? eventObj.location : event.location}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Start Time</label>
              <input
                type="time"
                name="starttime"
                value={editMode ? formatTimeForInput(eventObj.start_time) : event.start_time}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">End Time</label>
              <input
                type="time"
                name="endtime"
                value={editMode ? formatTimeForInput(eventObj.end_time) : event.end_time}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={editMode ? eventObj.description : event.description}
              onChange={handleInputChange}
              placeholder="Write a short description..."
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none h-28 resize-none"
            />
          </div>
        </form>
        <button onClick={handleAppendEvent} className="mt-10 border-2 p-[10px]">Add Event</button>
      </div>

      {/* Media Section */}
      <div className="w-72 p-4 bg-white relative text-gray-500 overflow-y-scroll scrollbar_hide">
        <input
          id="fileUpload"
          type="file"
          accept=".png, .jpg, .mp4"
          className="hidden"
          onChange={handleImageChange}
          multiple
        />
        <label
          htmlFor="fileUpload"
          className="fixed bottom-2 right-2 cursor-pointer hover:text-gray-400 transition bg-white rounded-full"
        >
          <FaCirclePlus size={40} />
        </label>

        <Reorder.Group
          className="space-y-4"
          values={event.media}
          onReorder={(newMedia) =>
            setEvent(prev => ({ ...prev, media: newMedia }))
          }
        >
          {/* FIXME: ADD logic for adding edit event media or empty media section if in create mode */}
          {event.media.length > 0 ? (
            event.media.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="bg-gray-100 rounded-2xl w-full h-48 flex items-center justify-center">
                  {item.file.type.startsWith("image/") ? (
                    <img
                      draggable={false}
                      src={item.preview}
                      alt="preview"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  ) : (
                    <video
                      src={item.preview}
                      muted
                      controls
                      autoPlay
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  )}
                </div>
              </Reorder.Item>
            ))
          ) : (
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
              No Media
            </h1>
          )}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default EventEdit;
