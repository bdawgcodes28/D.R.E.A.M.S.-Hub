
import React, { useEffect, useState }   from 'react'
import { loadEvents }                   from '../../middlewares/events_middleware';
import * as MEDIA_MIDDLEWARE            from '../../middlewares/media_middleware';


export default function Upload_media_form() {

    // media type options
    const media_types = [
        "Events",
    ];

    // objects for events (pulls from db)
    const [eventOptions, setEventOptions]       = useState([]);
    
    // user form data
    const [formData, setFormData] = useState({
        eventOption:    null,  
        uploaded_media: null // file object
    });


    // Format date to readable format (MM. DD. YYYY.)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObj = new Date(dateString);
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${month}. ${day}. ${year}.`;
    };

    // handle form input changes
    const handleEventChange = (e) => {
        setFormData(prev => ({
            ...prev,
            eventOption: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            uploaded_media: e.target.files[0] || null
        }));
    };

    // load event options
    useEffect(() => {
        async function getEvents(){
            const data = await loadEvents();
            setEventOptions(data);
        }

        getEvents();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append('media', formData.uploaded_media);
        formDataToSend.append('id', formData.eventOption);
        formDataToSend.append('upload_type', 'event');
        
        // Send to middleware
        const res = await MEDIA_MIDDLEWARE.uploadFileObject(formDataToSend);
        //console.log("Form submitted:", formData);
    };

  return (
    <div className='w-screen h-screen bg-black flex justify-center items-center'>

        <form 
        className='bg-white w-[600px] h-[700px] rounded-3xl p-[40px] flex flex-col gap-8'
        onSubmit={handleSubmit}
        action="" 
        method="post">

            <h1 className='text-5xl font-bold w-full text-center mb-4'>Upload Media</h1>

            {/* selection input to choose what event to add media for  */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="event-select" className='text-lg font-semibold text-gray-700'>
                    Select Event
                </label>
                <select 
                    id="event-select"
                    value={formData.eventOption || ''}
                    onChange={handleEventChange}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg'
                    required
                >
                    <option value="" disabled>Choose an event...</option>
                    {eventOptions.length > 0 ? (
                        eventOptions.map((event) => (
                            <option key={event.id} value={event.id}>
                                {formatDate(event.date)} | {event.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No events available</option>
                    )}
                </select>
            </div>

            {/* file input to upload media image or video  */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="media-upload" className='text-lg font-semibold text-gray-700'>
                    Upload Media
                </label>
                <div className='relative'>
                    <input 
                        type="file"
                        id="media-upload"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer'
                        required
                    />
                </div>
                {formData.uploaded_media && (
                    <p className='text-sm text-gray-600 mt-2'>
                        Selected: {formData.uploaded_media.name} ({(formData.uploaded_media.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                )}
            </div>

            {/* submit button */}
            <button
                type="submit"
                className='w-full mt-auto py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
            >
                Upload Media
            </button>

        </form>

    </div>
  )
}
