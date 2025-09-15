import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const signInWithEmailAndPassword = () =>{
    navigate('/')
  }
  
  const signInWithGoogle= () =>{
    navigate('/')
  }

  return (
    <section className="cube_background w-full h-screen flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-11/12 md:w-3/4 lg:w-3/4 h-5/6 flex overflow-hidden p-8">
        <div className="hidden md:flex w-1/2 items-center border-r border-black justify-center">
          <img
            src="computer_icon.png"
            alt="Illustration"
            className="w-72 h-72"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="tracking-widest text-xl  text-gray-800 mb-8 text-center">
            Admin Login
          </h1>

          <form className="w-full flex flex-col gap-4 text-gray-400 text-sm">
            <div className="relative">
              <input
                type="email"
                placeholder="johndoe@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
              />
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600/80 text-sm text-white py-3 rounded-lg hover:bg-indigo-700 transition tracking-widest"
              onClick={signInWithEmailAndPassword}
            >
              LOGIN
            </button>
            <div className="flex items-center gap-4 w-full">
            <span className="flex-1 h-px bg-gray-300"></span>
            <span className="text-sm text-gray-500">OR</span>
            <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            <div className="w-full flex justify-center items-center">

            <GoogleButton onClick={signInWithGoogle} />
            </div>
            
          </form>

          <div className="text-xs text-gray-400 text-center mt-12">
            Terms of use. Privacy policy
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
