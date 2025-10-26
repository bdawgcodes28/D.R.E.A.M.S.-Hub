import { motion } from "motion/react"
import Navbar from "../components/Navbar"

const AboutPage = () => {
  return (
    <div className="w-full h-full relative flex flex-col bg-white ">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-between px-12 py-24 bg-cover bg-center" style={{ backgroundImage: 'url(stemkid1.png)' }}>
        {/* Add an overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Left Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:w-1/2 flex flex-col gap-6 z-10"
        >
          <h1 className="text-white text-lg uppercase tracking-wide">About Us</h1>
          <h2 className="text-white font-light text-4xl leading-tight">
            Empowering underrepresented youth to innovate, create, and lead through STEM.
          </h2>
          <p className="text-gray-100 text-lg leading-relaxed">
            We believe that brilliance lives in every community — it just needs the tools to shine.
            At <span className="font-semibold text-pink-400">Dreams Collective</span>, we're on a mission
            to make STEM education accessible, exciting, and equitable for students who are too often
            left out of the conversation. Through mentorship, hands-on learning, and real-world exposure,
            we help young innovators see themselves as the scientists, engineers, and creators of tomorrow.
          </p>
        </motion.div>

        {/* Remove the Right Image Side div since we're using it as background */}
      </div>

      {/* Mission + Approach Section */}
      <div className="w-full bg-neutral-900 text-white py-24 px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:w-1/2"
        >
          <h2 className="text-3xl font-semibold mb-4 text-pink-500">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
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
          <h2 className="text-3xl font-semibold mb-4 text-pink-500">Our Approach</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Through workshops, mentorship programs, and collaborative projects, we spark curiosity
            and creativity while connecting students with industry professionals and higher education
            pathways. Every experience is designed to show that innovation starts with imagination —
            and that every student belongs in STEM.
          </p>
        </motion.div>
      </div>

<div className="w-full bg-white text-black py-16 px-6 md:px-12">
  <h2 className="text-4xl font-bold text-center mb-12">
    Meet the Team
  </h2>

  <div className=" flex-col md:flex-row items-center flex gap-8 overflow-x-auto scrollbar-hide justify-center md:justify-start p-8">

    <div className="flex-shrink-0 w-72 h-80 bg-gradient-to-tr from-pink-500 to-red-400 rounded-tl-[100px] rounded-br-[100px] border-4 border-pink-500 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        src="src/assets/team_photos/blkperson.png"
        alt="Team Member"
        className="w-full h-full object-cover"
      />
    </div>
    

  </div>
</div>

    </div>
  )
}

export default AboutPage
