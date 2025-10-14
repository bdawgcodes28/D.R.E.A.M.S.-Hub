import { useState, useContext, useEffect } from "react";
import { UserContext } from "../components/user_context/context_provider.jsx";
import { FiUser, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as SUPABASE_CLIENT from "../supabase/supabase_client.jsx"
import { jwtDecode } from 'jwt-decode'
import './Login.css'

const Login = () => {
  
  // user input variables
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const navigate                = useNavigate()

  // global context for user
  const {user, setUser}   = useContext(UserContext);

  // Google client secret
  const BASE_URL     = import.meta.env.VITE_BASE_URL;
  const GOOGLE_CLIENT_ID  = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // google authentication
  useEffect(() => {
    // Wait for Google script to load
    const initializeGoogleAuth = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID, 
          callback: handleCredentialResponse,
          use_fedcm_for_prompt: false, // Enable FedCM as required by Google
        });

        // Add fallback button rendering
        try {
          google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            {
              theme: "outline",
              size: "large",
              type: "standard",
              text: "signin_with"
            }
          );
        } catch (error) {
          console.log("Could not render Google button:", error);
        }
      } else {
        // If Google script not loaded yet, try again in 100ms
        setTimeout(initializeGoogleAuth, 100);
      }
    };

    initializeGoogleAuth();
  }, [GOOGLE_CLIENT_ID]);

  // takes JWT from google and sends it it NODEJS server to get verified and decoded
  async function handleCredentialResponse(response) {
  
    try {
      const serverResponse = await fetch(`${BASE_URL}/api/google/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      // get custom token from server
      const data = await serverResponse.json();
  
      if (data.status === 200) {
        const user = jwtDecode(data.userToken);
        setUser({ token: user });
        navigate('/'); // go to dashboard
        
      } else {
        console.error("Login failed:", data.message);
      }
  
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // standard sign in with USERNAME AND PASSWORD
  const signInWithEmailAndPassword = async (e) => {
    e.preventDefault();

    // verify fields have been filled
    if (email.trim() === ""){
      // show error pop up
      console.error("Email is empty");
      return;
    }
    if (password.trim() === ""){
      // show error pop up
      console.error("Password is empty");
      return;
    }

    const credentials = {
      email:    email,
      password: password
    };

    try {
      // check if user is inside database and is authorized to login
      const user = await SUPABASE_CLIENT.validUser(credentials);
      if (user){
        console.log("Login successful:");
        setUser(user);
        navigate('/');
      } else {

        console.error("Invalid credentials");
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Show error message to user
    }
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
              <div id="google-signin-button"></div>
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
