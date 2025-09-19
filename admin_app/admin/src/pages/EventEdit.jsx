import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Reorder } from "motion/react";

const EventEdit = () => {
  const [id, setId] = useState(null)
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      id: crypto.randomUUID(), // unique id
      file,
      preview: URL.createObjectURL(file),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="border rounded-lg px-3 py-2 focus:ring-2  outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2  outline-none"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2  outline-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={starttime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2  outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">End Time</label>
              <input
                type="time"
                value={endtime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2  outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="border rounded-lg px-3 py-2 focus:ring-2  outline-none h-28 resize-none"
            />
          </div>
        </form>
      </div>

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
          className="fixed bottom-2 right-2 cursor-pointer hover:text-gray-400 transition bg-white rounded-full "
        >
          <FaCirclePlus size={40} />
        </label>

        <Reorder.Group
          className="space-y-4"
          values={media}
          onReorder={setMedia}
        >
          {media.length > 0 ? (
            media.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <div className="bg-gray-100 rounded-2xl w-full h-48 flex items-center justify-center">
                  {item.file.type.startsWith("image/") ? (
                    <img
                      draggable = {false}
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
