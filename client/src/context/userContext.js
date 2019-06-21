import React, { useState } from 'react';

// create instance of context
export const UserContext = React.createContext();

// create context provider
export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('default user context');
  const [user, setUser] = useState('default user object');
  return (
    // inject state into the provider, and pass along to children components
    <UserContext.Provider
      value={{
        user,
        setUser,
        userToken,
        setUserToken,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
