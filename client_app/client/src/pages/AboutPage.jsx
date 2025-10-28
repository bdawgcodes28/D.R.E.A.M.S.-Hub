import React, { useState } from 'react'; // Import useState
import Navbar from "../components/Navbar";
// Fix import path to be consistent and standard for framer-motion
import { motion } from "framer-motion"; // Assuming you meant framer-motion/react

// --- Team Data (No Changes) ---
const teamMembers = [
  {
    id: 1,
    name: "Rocklyn Clarke",
    position: "Co-Founder & Program Director",
    image: "src/assets/team_photos/blkperson.png",
    short: "Passionate about empowering youth through technology.",
    full: "Rocklyn oversees BYTE’s curriculum and leads workshops in game design and AI. His background in computer science and community leadership drives BYTE’s mission to make STEM accessible to all.",
  },
  {
    id: 2,
    name: "Jordan Smith",
    position: "Lead Instructor",
    image: "src/assets/team_photos/blkperson.png",
    short: "Inspires creativity through coding and robotics.",
    full: "Jordan brings hands-on experience in robotics and education, helping students see technology as a tool for creativity and innovation.",
  },
  {
    id: 3,
    name: "Aaliyah Johnson",
    position: "Outreach Coordinator",
    image: "src/assets/team_photos/blkperson.png",
    short: "Connects communities with transformative STEM programs.",
    full: "Aaliyah leads BYTE’s outreach efforts, ensuring schools and community centers have access to programs that ignite curiosity in the next generation of innovators.",
  },
];
// -----------------------------

const MeetTheTeam = () => {
  // 1. STATE: Track which member's ID is currently open. Null means none are open.
  const [openMemberId, setOpenMemberId] = useState(null);

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
      {teamMembers.map((member) => {
        // Determine if the current member's full description should be visible
        const isOpen = member.id === openMemberId;

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            // 4. CLICK HANDLER: Add onClick to the entire div to toggle the description
            onClick={() => toggleDescription(member.id)} 
            // 5. VISUALS: Add cursor-pointer and hover effects to signal clickability
            className={`flex flex-col md:flex-row items-center md:items-stretch  duration-300 overflow-hidden max-w-sm md:max-w-4xl w-full cursor-pointer rounded-tl-[58px] rounded-br-[58px] shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all
              ${isOpen ? '' : ''} 
            `}
          >
            
            {/* Image Wrapper */}
            <div className="shrink-0 w-full md:w-72 h-80 bg-linear-to-tr from-pink-500 to-red-400 rounded-tl-[60px] rounded-br-[60px] overflow-hidden p-1">
              <img
                src={member.image}
                alt={`Photo of ${member.name}, ${member.position}`}
                className="w-full h-full object-cover rounded-tl-[58px] rounded-br-[58px]"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col justify-center text-left p-6 w-full md:min-w-64 md:max-w-md">
              <h3 className="font-bold text-2xl mb-1 text-gray-800">{member.name}</h3>
              <p className="text-pink-600 text-sm font-semibold mb-2 uppercase tracking-wider">
                {member.position}
              </p>
              
              {/* Added a divider for better visual separation */}
              <div className="h-0.5 w-12 bg-pink-500 mb-3"></div>

              {/* Short Description - Always visible */}
              <p className="text-gray-700 text-base italic mb-3">"{member.short}"</p>
              
              {/* Full Description - Conditionally rendered with Framer Motion for a smooth animation */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden" // Important to hide overflow when height is 0
              >
                {/* 3. CONDITIONAL RENDERING: Only show the full text if isOpen is true */}
                <p className="text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-200">
                  <span className="font-semibold text-pink-700">Full Bio:</span> {member.full}
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
    // Use semantic <main> tag
    <main className="w-full relative flex flex-col bg-white" role="main">
      {/* Assuming Navbar has proper ARIA/semantic tags */}
      <Navbar />

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
            <p className="text-pink-400 text-base uppercase tracking-[0.25em] font-medium">About Us</p>
            {/* Changed <h2> to a more dominant <h1> for the main page title */}
            <h1 className="text-black font-light text-4xl sm:text-5xl lg:text-6xl leading-snug mt-2">
              Empowering Future <br/> Innovators
            </h1>
          </hgroup>
          <p className="text-black text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
            We believe that brilliance lives in every community — it just needs the tools to shine.
            At <span className="font-bold text-pink-400">Dreams Collective</span>, we're on a mission
            to make **STEM education accessible, exciting, and equitable** for students who are too often
            left out of the conversation. Through mentorship, hands-on learning, and real-world exposure,
            we help young innovators see themselves as the scientists, engineers, and creators of tomorrow.
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
              We aim to close the opportunity gap in STEM by creating spaces where young people from
              underrepresented backgrounds can explore technology, robotics, game design, and more —
              all while building confidence, leadership, and community.
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
              Through workshops, mentorship programs, and collaborative projects, we spark curiosity
              and creativity while connecting students with industry professionals and higher education
              pathways. Every experience is designed to show that innovation starts with imagination —
              and that **every student belongs in STEM**.
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
    </main>
  )
}

export default AboutPage