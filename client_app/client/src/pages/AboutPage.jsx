import React, { useEffect, useState } from 'react'; // Import useState
import Navbar                         from "../components/layout/Navbar";
// Fix import path to be consistent and standard for framer-motion
import { motion }                     from "framer-motion"; // Assuming you meant framer-motion/react
import { Footer }                     from '../components/layout/Footer';
import * as BOARD_MEMBER_MIDDLEWARE   from "../middlewares/board_web_profiles_middleware"
import DEFAULT_DREAMS_IMG             from "../assets/default-dreams-img.png"

// --- Team Data (No Changes) ---
const t_teamMembers = [
  {
    id: "1",
    first_name: "Rocklyn",
    last_name: "Clarke",
    role: "Co-Founder & Program Director",
    image: "src/assets/team_photos/blkperson.png",
    website_quote: "Passionate about empowering youth through technology.",
    website_bio: "Rocklyn oversees BYTE’s curriculum and leads workshops in game design and AI. His background in computer science and community leadership drives BYTE’s mission to make STEM accessible to all.",
  },
  {
    id: "2",
    first_name: "Jordan",
    last_name: "Smith",
    role: "Lead Instructor",
    image: "src/assets/team_photos/blkperson.png",
    website_quote: "Inspires creativity through coding and robotics.",
    website_bio: "Jordan brings hands-on experience in robotics and education, helping students see technology as a tool for creativity and innovation.",
  },
  {
    id: "3",
    first_name: "Aaliyah",
    last_name: "Johnson",
    role: "Outreach Coordinator",
    image: "src/assets/team_photos/blkperson.png",
    website_quote: "Connects communities with transformative STEM programs.",
    website_bio: "Aaliyah leads BYTE’s outreach efforts, ensuring schools and community centers have access to programs that ignite curiosity in the next generation of innovators.",
  },
];
// -----------------------------

const MeetTheTeam = () => {
  // 1. STATE: Track which member's ID is currently open. Null means none are open.
  const [ openMemberId , setOpenMemberId ]         = useState(null);
  const [ boardMembers , setBoardMembers ]         = useState(null);

  const members_to_map = () => {
    if (boardMembers && boardMembers.length > 0){
        return boardMembers;
    }
    return t_teamMembers;
  }

  // load in the board members data
  useEffect(()=>
  {
    // fetches the profiles from the server
    async function loadBoardProfiles()
    {
      try 
      {
        const response = await BOARD_MEMBER_MIDDLEWARE.loadBoardMemberProfiles();

        setBoardMembers(response);
      } catch (error) 
      {
        console.error("Error loading board profiles:", error);
        setBoardMembers([]);
      }
    }

    loadBoardProfiles();
    
  }, []);

  // 2. HANDLER: Function to toggle the description
  const toggleDescription = (id) => {
    // If the clicked ID is already open, close it (set to null), otherwise open the new one.
    setOpenMemberId(openMemberId === id ? null : id);
  };

  return (
    <section 
      aria-labelledby="team-heading" 
      className="flex flex-wrap items-stretch justify-center gap-12 p-8"
    >
      {members_to_map().map((member, index) => {
        // Use id if available, otherwise use index as unique identifier
        const memberId = member.id || `member-${index}`;
        // Determine if the current member's full description should be visible
        const isOpen = memberId === openMemberId;

        return (
          <motion.div
            key={memberId}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            // 4. CLICK HANDLER: Add onClick to the entire div to toggle the description
            onClick={() => toggleDescription(memberId)} 
            // 5. VISUALS: Add cursor-pointer and hover effects to signal clickability
            className={`flex flex-col md:flex-row items-center md:items-stretch  duration-300 overflow-hidden max-w-sm md:max-w-4xl w-full cursor-pointer rounded-tl-[58px] rounded-br-[58px] shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all
              ${isOpen ? '' : ''} 
            `}
          >
            
            {/* Image Wrapper */}
            <div className="shrink-0 w-full md:w-72 h-80 bg-linear-to-tr from-pink-500 to-red-400 rounded-tl-[60px] rounded-br-[60px] overflow-hidden p-1">
              <img
                src={member.image? member.image : DEFAULT_DREAMS_IMG}
                alt={`Photo of ${member.first_name}, ${member.role}`}
                className="w-full h-full object-cover rounded-tl-[58px] rounded-br-[58px]"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col justify-center text-left p-6 w-full md:min-w-64 md:max-w-md">
              <h3 className="font-bold text-2xl mb-1 text-gray-800">{member.first_name} {member.last_name}</h3>
              <p className="text-pink-600 text-sm font-semibold mb-2 uppercase tracking-wider">
                {member.role}
              </p>
              
              {/* Added a divider for better visual separation */}
              <div className="h-0.5 w-12 bg-pink-500 mb-3"></div>

              {/* Short Description - Always visible */}
              <p className="text-gray-700 text-base italic mb-3">"{member.website_quote}"</p>
              
              {/* Full Description - Conditionally rendered with Framer Motion for a smooth animation */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden" // Important to hide overflow when height is 0
              >
                {/* 3. CONDITIONAL RENDERING: Only show the full text if isOpen is true */}
                <p className="text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-200">
                  <span className="font-semibold text-pink-700">Full Bio:</span> {member.website_bio}
                </p>
              </motion.div>

              {/* Read More/Less indicator */}
              <p className="text-pink-500 text-xs font-medium mt-3">
                {isOpen ? 'Click to close' : 'Click to read full bio...'}
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};



const AboutPage = () => {
  return (
    // Use same container structure as HomePage for consistent navbar sizing
    <div className="w-screen h-screen flex flex-col overflow-x-hidden">
      {/* Navbar component with consistent sizing */}
      <Navbar />
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">

      {/* Hero Section */}
      <section 
        className="relative flex flex-col items-center justify-start px-6 md:px-12 py-24 bg-cover bg-center" 
        style={{ backgroundImage: 'url(stemkid1.png)' }}
        aria-label="Hero section with image of students in a STEM class" // Added ARIA label
      >
        {/* Add an overlay to ensure text readability */}
        <div className="absolute inset-0"></div> {/* Slightly darker overlay */}
        
        {/* Left Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:w-3/4 lg:w-2/3 flex flex-col gap-6 z-10 text-center md:text-left" // Centered text on mobile
        >
          <hgroup> {/* Use hgroup to group related headings */}
            <p className="text-pink-400 text-base uppercase tracking-[0.25em] font-medium" style={{fontWeight:"bold"}}>About Us</p>
            {/* Changed <h2> to a more dominant <h1> for the main page title */}
            <h1 className="text-black font-light text-4xl sm:text-5xl lg:text-6xl leading-snug mt-2" style={{fontWeight:"bold"}}>
              Empowering Future <br/> Innovators
            </h1>
          </hgroup>
          <p className="text-black text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
            We believe that every community is filled with talent and imagination, ready to thrive when given the chance.
            At <span className="font-bold text-pink-400">Dreams Collective</span>, we are dedicated to making STEM education welcoming, inspiring, and truly accessible for students who deserve to be seen and supported.
            Through mentorship, hands-on learning, and real opportunities to explore the world around them, we help young people confidently step into their roles as the scientists, engineers, and creators of the future.
          </p>


        </motion.div>
      </section>

      {/* Mission + Approach Section */}
      <section className="w-full bg-neutral-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold mb-4 text-pink-500">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-pink-500 pl-4">
              Our goal is to open doors in STEM by creating spaces where young people from underrepresented 
              communities can discover technology, robotics, game design, and so much more, all while 
              growing their confidence, leadership, and sense of belonging.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold mb-4 text-pink-500">Our Approach</h2>
            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-pink-500 pl-4">
              Through workshops, mentorship programs, and collaborative projects, we inspire 
              curiosity and creativity while connecting students with industry professionals 
              and pathways to higher education. Every experience is crafted to show that innovation 
              begins with imagination, and that every student has a place in STEM.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="w-full bg-gray-50 text-black py-16 px-6 md:px-12">
        <h2 id="team-heading" className="text-4xl font-bold text-center mb-12 text-gray-800">
          Meet the Team
        </h2>
        <MeetTheTeam/>
      </section>

        {/* footer  */}
        <Footer/>

      </div>
    </div>
  )
}

export default AboutPage