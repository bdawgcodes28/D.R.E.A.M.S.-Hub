import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Reorder } from "framer-motion";
import * as EVENT_MIDDLEWARE from "../middleware/events_middleware.js"
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuCloudUpload } from "react-icons/lu";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { GrDocumentUpload } from "react-icons/gr";

const EventEdit = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    id: null,
    name: "",
    date: "",
    location: "",
    description: "",
    media: [],
    starttime: "",
    endtime: ""
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

  // request to add event 
  async function handleAppendEvent(){
      try {
          // attempt to add is event is valid
          console.log("checking event");
          if (EVENT_MIDDLEWARE.isValidEvent(event)){

            console.log("Event is valid");
            const response = await EVENT_MIDDLEWARE.appendEvent(event);

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
                name="starttime"
                value={event.starttime}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">End Time</label>
              <input
                type="time"
                name="endtime"
                value={event.endtime}
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
            <button className=" transition gap-4 text-md rounded-lg border hover:bg-gray-500 hover:text-white text-gray-500 border-gray-500 flex items-center p-3 w-full justify-center"> Schedule <RiCalendarScheduleFill/> </button>
            <button className=" transition gap-4 text-md rounded-lg border hover:bg-blue-500 hover:text-white text-blue-500 border-blue-500 flex items-center p-3 w-full justify-center"> Upload <GrDocumentUpload/> </button>
  
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
          {event.media.length > 0 ? (
            event.media.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="bg-gray-100 rounded-2xl w-full h-48 flex items-center justify-center relative">
                  <button onClick={(e) =>{setMedia((prev) => prev.filter((_, i) => i !== idx));}} className="absolute hover:text-red-400 hover:rotate-12 -top-4 -right-4 bg-white text-gray-500  rounded-full p-2 text-lg"> <FaRegTrashCan/> </button>
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
