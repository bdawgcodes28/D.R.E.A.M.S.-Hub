import { ChevronDownIcon }          from '@heroicons/react/16/solid'
import Navbar                       from '../components/layout/Navbar'
import { Footer }                   from '../components/layout/Footer'
import { COLORS_CONSTANTS }         from '../styles/StyleConstants';
import { useState, useEffect } from 'react';


export default function ContactPage() {

    // usestate for form info
    const [policyCheck, setPolicyCheck] = useState(false);
    const [formInfo, setFormInfo]       = useState({
        first_name  :      null,
        last_name   :      null,
        company     :      null,
        email       :      null,
        phone_number:      null,
        message     :      null,
    });

    //--------------------------------------------------------------------------
    // methods to check the forms data before message is sent
    async function checkNames()         { return true; }
    async function checkPhoneNumber()   { return true; }
    async function checkEmail()         { return true; }
    async function checkMessage()       { return true; }

    //--------------------------------------------------------------------------
    const handleCheckboxChange = (e) => {
        setPolicyCheck(e.target.checked);
    };

    const handle_input_change = (e) => {
        // get data from input element
        const {name, value} = e.target;

        setFormInfo( prev => ({
            ...prev,
            [name] : value
        }));
    }

    // make email request to server
    async function handle_submit(e){   
        // prevents a page refresh
        e.preventDefault();

        try {
            // all checks should return true if valid
            const results = await Promise.all([
                checkNames(),
                checkEmail(),
                checkPhoneNumber(),
                checkMessage(),
            ]);
        
            const allValid = results.every(Boolean);
        
            if (!allValid) 
            {
                console.warn("Some input fields are invalid.");
                return;
            }


            // make request to the server

        
            console.log("All validation passed!");
        } 
        catch (error) {
           console.error("Error in one of the input checks:", error);
        }
    
    }



  return (
    <div className="w-screen h-screen flex flex-col overflow-x-hidden">
        {/* naviagtion bar  */}
        <Navbar/>
        {/* scrollable content area */}
        <div className="flex-1 overflow-y-auto">
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Contact Us</h2>
            <p className="mt-2 text-lg/8 text-gray-600">Have a question or want to get involved? We'd love to hear from you. Reach out and let's make a difference together.</p>
        </div>
        <form className="mx-auto mt-16 max-w-xl sm:mt-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
                <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                First name
                </label>
                <div className="mt-2.5">
                <input
                    onChange={handle_input_change}
                    id="first-name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
                </div>
            </div>
            <div>
                <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                Last name
                </label>
                <div className="mt-2.5">
                <input
                onChange={handle_input_change}
                    id="last-name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
                Company (Optional)
                </label>
                <div className="mt-2.5">
                <input
                    onChange={handle_input_change}
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                Email
                </label>
                <div className="mt-2.5">
                <input
                    onChange={handle_input_change}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
                Phone number
                </label>
                <div className="mt-2.5">
                <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                    <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        aria-label="Country"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <option>US</option>
                        <option>CA</option>
                        <option>EU</option>
                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                    </div>
                    <input
                    onChange={handle_input_change}
                    id="phone-number"
                    name="phone_number"
                    type="text"
                    placeholder="123-456-7890"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                </div>
                </div>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                Message
                </label>
                <div className="mt-2.5">
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    defaultValue={''}
                />
                </div>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
                <div className="flex h-6 items-center">
                <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-gray-200 p-px inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2">
                    <span className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5" />
                    <input
                    checked={policyCheck}
                    onChange={handleCheckboxChange}
                    id="agree_to_policies"
                    name="agree_to_policies"
                    type="checkbox"
                    aria-label="Agree to policies"
                    className="absolute inset-0 appearance-none focus:outline-hidden"
                    />
                </div>
                </div>
                <label htmlFor="agree_to_policies" className="text-sm/6 text-gray-600">
                By selecting this, you agree to our{' '}
                <a href="#" className="font-semibold whitespace-nowrap text-indigo-600">
                    privacy policy
                </a>
                .
                </label>
            </div>
            </div>
            <div className="mt-10">
            <button
                onClick={handle_submit}
                style={{backgroundColor: COLORS_CONSTANTS.DREAMS_PINK}}
                type="submit"
                className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Let's talk
            </button>
            </div>
        </form>
        </div>
        {/* footer  */}
        <Footer/>
        </div>
    </div>
  )
}
