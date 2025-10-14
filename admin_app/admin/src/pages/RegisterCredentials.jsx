import React, { useState } from 'react'

export default function RegisterCredentials() {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const USERS_ROUTE_BASE_URL=`${BASE_URL}/api/users`

    // role options
    const ROLES = ["Admin", "Owner", "General"];

    // input credentials saves
    const [credentials, setCredentials] = useState({
        first_name: null,
        last_name:  null,
        email:      null,
        password:   null,
        role:       null
    });

    // makes sure password is a good level in complexity
    function verifyPassword(password){
        return true;
    }

    function verifyFullCredentials(credentials){
        return true;
    }

    // hash password into unrecognizable characters
    async function hashRequest(rawPassword) {
        if (!rawPassword || rawPassword.length == 0){
            console.error("No password given:", rawPassword);
            return null;
        }

        if (!verifyPassword(rawPassword)){
            console.error("Invalid password given...");
            return null;
        }

         try{
             const serverResponse = await fetch(`${USERS_ROUTE_BASE_URL}/user/register/password`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ rawPassword: rawPassword})
               });

            const data = await serverResponse.json();

            if ( data.status != 200 ){
                console.error("[ERROR] Response with status", data.status);
                return null;
            }

            const pw = data.hashPassword;

            return pw;

        }catch(error){
            console.error("Error on server side request:", error);
            return null;
        }
    };

    // update input changes
    const handleInputChange = (e)   => {
        // get elements contents
        const {name, value} = e.target;
        // set values of credentials object
        setCredentials(prev => ({
            ...prev,
            [name] : value
        }));
    };

    // send out request
    const sendRequest       = async (credentials)   => {
        try {
            const serverResponse = await fetch(`${USERS_ROUTE_BASE_URL}/user/register/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_credentials: credentials})
              });

           const data = await serverResponse.json();

           if ( data.status != 200 ){
               console.error("[ERROR] Response with status", data.status);
               return {status: 404};
           }else{
                console.log("Request has been sent!");
                console.log("User:", data.user);
                return {status: 200, user: data.user};
           }
            
        } catch (error) {
            console.error("Error when requesting registration:", error);
            return {status: 404};
        }
    };

    // submit form data
    const handleSubmit      = async (e)   => {
        e.preventDefault(); // prevent refresh
        if (!credentials){
            return;
        }
        // secure password
        const secure_password = await hashRequest(credentials.password);

        console.log("Secure Hash Created:",secure_password);
        if (!secure_password)
            return;

        // reset the password to new hash UUID
        const credentials_copy      = credentials;
        credentials_copy.password   = secure_password;

        if (!verifyFullCredentials(credentials_copy)){
            console.error("Issue with credentials used:", credentials_copy);
            return;
        }

        // add user to database
        const request = await sendRequest(credentials_copy);

        if (request.status != 200){
            console.error("Request error:", request);
            return;
        }

        // show pop up for completed request of registration
        

    };

    // clean form data
    const handleClear       = (e)   => {
        // reset useState members
        setCredentials({
            first_name: null,
            last_name:  null,
            email:      null,
            password:   null,
            role:       null
        });
    };

    // -------------------------------------------------------------------------
  return (
    <>
        {/* outer container to hold registration form */}
        <div className="w-screen h-screen flex flex-col bg-white items-center">
            <div className="w-[50%] max-w-[700px] h-[100%] bg-gray-100">
                <form 
                action="" 
                method="post"
                className='w-[100%] border-0 border-black h-[100%] max-h-[100%] flex flex-col items-center justify-center'
                >
                    {/* first and last name inputs */}
                    <div className=" p-[10px] w-[100%] flex justify-evenly">
                        {/* first name */}
                        <div className="flex flex-col gap-[5px] w-[48%]">

                            <p className='text-black'
                            >First Name</p>

                            <input 
                            name        = "first_name"
                            value       = {credentials.first_name ? credentials.first_name : ""}
                            onChange    = {handleInputChange}
                            className   = ' text-gray-800 focus:outline-0 border-2 border-black placeholder:text-gray-800 p-[10px] w-[100%]' 
                            type        = "text" 
                            placeholder = 'First Name' />

                        </div>
                        {/* last name  */}
                        <div className="flex flex-col gap-[5px] w-[48%]">

                            <p className='text-black'
                            >Last Name</p>

                            <input 
                            name        = "last_name"
                            value       = {credentials.last_name ? credentials.last_name : ""}
                            onChange    = {handleInputChange}
                            className   = ' text-gray-800 focus:outline-0 border-2 border-black placeholder:text-gray-800 p-[10px] w-[100%]' 
                            type        = "text" 
                            placeholder = 'Last Name' />

                        </div>
                    </div>

                    <div className="border-0 border-black w-[95%] p-[0px] gap-[30px] flex flex-col min-h-fit mt-[20px]">
                        {/* email  */}
                        <input 
                        name        = "email"
                        value       = {credentials.email ? credentials.email : ""}
                        onChange    = {handleInputChange}
                        required
                        className   = ' text-gray-800 focus:outline-0 w-[100%] min-h-[50px] border-2 border-black placeholder:text-black p-[10px]'
                        placeholder = 'Email'
                        type="email" />

                        {/* password  */}
                        <input 
                        name        = "password"
                        value       = {credentials.password ? credentials.password : ""}
                        onChange    = {handleInputChange}
                        required
                        className   = ' text-gray-800 focus:outline-0 w-[100%] min-h-[50px] border-2 border-black placeholder:text-black p-[10px]'
                        placeholder = 'Password'
                        type        = "password" />

                        {/* role  */}
                        <select 
                        required
                        className = 'w-[100%] min-h-[50px] border-2 border-black focus:outline-0 text-black p-[10px]'
                        name      = "role" 
                        id        = ""
                        value     = {credentials.role || "None Selected"}
                        onChange  = {handleInputChange}>
                            <option 
                            className='text-black'
                            value="None Selected">None Selected</option>
                            {ROLES.map((role, idx) => {
                                return (
                                    <option
                                    className='text-black' 
                                    key={idx} 
                                    value={role}>{role}</option>
                                );
                            })}
                        </select>

                    </div>
                   
                    
                    {/* submit and clear buttons */}
                    <div className="flex flex-col w-[100%] items-center gap-[10px] mt-[20px]">
                        {/* SEND REQUEST  */}
                        <button
                        onClick = {handleSubmit}
                        className = 'w-[95%] min-h-[50px] p-[10px] border-2 border-black bg-black text-white hover:bg-gray-800'
                        >Send Request</button>

                        {/* CLEAR FORM  */}
                        <button
                        onClick = {handleClear}
                        className = 'w-[95%] min-h-[50px] p-[10px] border-2 border-black text-black'
                        >Clear Form</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </>
  );
}
