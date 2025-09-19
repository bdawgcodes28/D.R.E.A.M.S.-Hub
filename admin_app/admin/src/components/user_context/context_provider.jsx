/**
 * @author Elias Lopes
 * @Date   09/18/2025
 * @description 
 *  this file holds the global context for the user,
 *  this allows us to avoid prop drilling in our web app
 */

import { useState, createContext, useContext } from 'react';

// global context component
export const UserContext = createContext();

export function UserProvider({children}){
    // user state variables for user context
    const [user, setUser] = useState(null);

    // represents the provider at top of tree allowing accessing
    // to global variables to children components
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}