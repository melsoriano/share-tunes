import React, { useState } from 'react';

// create instance of context
export const FirebaseContext = React.createContext();

// create context provider
export const FirebaseProvider = ({ children }) => {
  const [firebaseToken, setFirebaseToken] = useState(
    'default firebase context'
  );
  return (
    // inject state into the provider, and pass along to children components
    <FirebaseContext.Provider value={{ firebaseToken, setFirebaseToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};
