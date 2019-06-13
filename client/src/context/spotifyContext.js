import React, { useState } from 'react';

// create instance of context
export const SpotifyContext = React.createContext();

// create context provider
export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState();
  const [searchQuery, setSearchQuery] = useState({ query: '' });
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  return (
    // inject state into the provider, and pass along to children components
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        setSpotifyToken,
        searchQuery,
        setSearchQuery,
        trackResults,
        setTrackResults,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
