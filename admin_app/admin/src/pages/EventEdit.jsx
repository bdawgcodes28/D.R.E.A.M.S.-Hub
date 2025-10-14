import { useContext, useState } from "react";
import { FaCirclePlus, FaRegTrashCan } from "react-icons/fa6";
import { Reorder } from "framer-motion";
import * as EVENT_MIDDLEWARE from "../middleware/events_middleware.js";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../components/user_context/context_provider.jsx";
import { LuCloudUpload } from "react-icons/lu";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { GrDocumentUpload } from "react-icons/gr";
import * as MEDIA_MIDDLEWARE from "../middleware/media_middleware.js"

//FIXME: do onclick function to trigger media delete 
const EventEdit = () => {

  // get mode of page
  const location = useLocation();
  const { editMode, eventObj } = location.state || { editMode: false, event: null };

  // navigation hook
  const navigate = useNavigate();
  // user context
  const {user, setUser} = useContext(UserContext);

  // initialize event state
  const [event, setEvent] = useState(() => {
    if (editMode && eventObj) {
      loadMedia(); // load media for event
      return {
        id: eventObj.id || null,
        name: eventObj.name || "",
        date: eventObj.date || "",
        location: eventObj.location || "",
        description: eventObj.description || "",
        media: eventObj.media || [],
        start_time: eventObj.start_time || "",
        end_time: eventObj.end_time || "",
      };
    } else {
      return {
        id: null,
        name: "",
        date: "",
        location: "",
        description: "",
        media: [],
        start_time: "",
        end_time: "",
      };
    }
  });

  async function loadMedia(){
    // load events media if in edit mode
    if(editMode && eventObj){
      console.log("Loading media for:", eventObj.name);
      // make call to server to fetch event media content
      const response = await MEDIA_MIDDLEWARE.getMediaBy(user, "Event", eventObj.id);
      if(response){
        console.log("Media fetched:", response);
        // set media content
        const normalized = response.map((m)=>{
          let preview = m.preview;
          if (typeof preview === "string" && preview.startsWith("blob:")) {
            preview = preview.replace(/^blob:/, "");
          }
          const isVideo = typeof preview === "string" && /\.(mp4|mov|webm)(\?|#|$)/i.test(preview);
          return {
            id: m.id || crypto.randomUUID(),
            preview: preview,
            type: isVideo ? "video" : "image"
          };
        });
        setEvent(prev => ({
          ...prev,
          media: normalized
        }));
      }else{
        console.error("Error when loading media content for:", eventObj.name);
      }
    }
  }

  

  // handle input changes
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "starttime") name = "start_time";
    if (name === "endtime") name = "end_time";

    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
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

    console.log(event.media);
  };

  const handleRemoveMedia = async (idx, mediaItem) => {
    // remove from array
    setEvent((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== idx),
    }));

    // send delete request to API
    console.log("Media item:", mediaItem);
    try {
      const response = await MEDIA_MIDDLEWARE.deleteMedia(user, mediaItem.preview);
      
      if (response){
        console.log("Media removed:", response);
      }else{
        console.error("No media removed:", response);
      }

    } catch (error) {
        console.error("Error on API request...");
    }
  }

  // utility to format time string for <input type="time">
  function formatTimeForInput(timeString) {
    if (!timeString) return "";
    const [time, fraction] = timeString.split(".");
    if (!fraction) return time;
    const ms = fraction.slice(0, 3);
    return `${time}.${ms}`;
  }

  // request to add event 
  async function handleAppendEvent(){
      try {
          if (EVENT_MIDDLEWARE.isValidEvent(event)){
            const response = await EVENT_MIDDLEWARE.appendEvent(event, user);
      
            if (response && response?.status === 200)
              navigate("/events");
            else
              console.error("Error when adding event");
          } else {
            console.log("Event is not valid");
          }
      } catch (error) {
        console.error("Could not fulfill request:", error);
      }
  }

  // request to edit existing event 
  async function handleEditEvent(){
      try {
        console.log("Trying to edit:", event);
        if (EVENT_MIDDLEWARE.isValidEvent(event)){
          // First update the event
          const response = await EVENT_MIDDLEWARE.updateEvent(event, user);
          
          if (response && response?.status === 200) {
            // Check if there are new media files that need to be uploaded
            const newMediaFiles = event.media.filter(mediaItem => mediaItem.file);
            
            if (newMediaFiles.length > 0) {
              console.log("Uploading new media files:", newMediaFiles);
              const mediaResponse = await MEDIA_MIDDLEWARE.registerMedia(newMediaFiles, event.id, user);
              console.log("Media upload response:", mediaResponse);
              
              if (mediaResponse.status === 200) {
                console.log("Event and new media updated successfully");
              } else {
                console.error("Event updated but media upload failed:", mediaResponse);
              }
            }
            
            navigate("/events");
          } else {
            console.error("Error when editing event:", response);
          }
        } else {
          console.log("Event is not valid");
        }
    } catch (error) {
      console.error("Could not fulfill request:", error);
    }
  }

  return (
    <div className="text-gray-700 flex h-full bg-gray-50 text-sm">
      <div className="flex flex-col grow border-r border-gray-300 h-full p-10 overflow-y-scroll">
        <form className="space-y-6 max-w-2xl">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Title</label>
            <input
              type="text"
              name="name"
              value={event.name}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formatTimeForInput(event.start_time)}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">End Time</label>
              <input
                type="time"
                name="end_time"
                value={formatTimeForInput(event.end_time)}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleInputChange}
              placeholder="Write a short description..."
              className="border rounded-lg px-3 py-2 focus:ring-2 outline-none h-28 resize-none"
            />
          </div>
          <div className="w-full gap-4 flex">
            <button type="button" onClick={(editMode && eventObj) ? handleEditEvent : handleAppendEvent}  className=" transition gap-4 text-md rounded-lg border hover:bg-blue-500 hover:text-white text-gray-500 bg-gray-300 border-gray-500 flex items-center p-3 w-full justify-center"> {(editMode && eventObj) ? 'Update Event' :' Add Event' } <GrDocumentUpload/> </button>
  
            </div>
        </form>
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
          {event.media.length > 0 ? (
            event.media.map((item, idx) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="bg-gray-100 rounded-2xl w-full h-48 flex items-center justify-center relative">
                  <button
                    onClick={() => handleRemoveMedia(idx, item)}
                    className="absolute hover:text-red-400 hover:rotate-12 -top-4 -right-4 bg-white text-gray-500  rounded-full p-2 text-lg"
                  >
                    <FaRegTrashCan/>
                  </button>
                  {(item.file?.type ? item.file.type.startsWith("image/") : item.type !== "video") ? (
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
