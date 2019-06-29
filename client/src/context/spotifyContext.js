import React, { useState, useEffect } from 'react';
import { db } from '../api/firebase/firebaseConfig';

export const SpotifyContext = React.createContext();

export const SpotifyProvider = ({ children }) => {
  // ACCESS TOKEN -> set when user joins with an accessCode, or creates a new playlsit, generating an accessCode
  const [myAccessCode, setMyAccessCode] = useState('default');

  // FIRESTORE DATABASE CONTEXT -> needed to render and play songs
  const [documentOwnerId, setDocumentOwnerId] = useState({ data: '' });
  const [documentPlaylistId, setDocumentPlaylistId] = useState({ data: '' });
  const [documentPlaylistName, setDocumentPlaylistName] = useState({
    data: '',
  });
  const [documentState, setDocumentState] = useState([]); // Document state, an array of upcoming tracks
  const [documentUri, setDocumentUri] = useState({ uri: '' }); // playlistUri

  // SPOTIFY ACCESS TOKENS -> needed to stay logged in
  const [spotifyToken, setSpotifyToken] = useState();
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState({
    expiresIn: '',
  });

  useEffect(() => {
    setMyAccessCode(window.location.pathname.split('/').pop());
    if (
      window.location.pathname === '/join' ||
      window.location.pathname === '/add/:code'
    ) {
      setMyAccessCode('default');
    }

    async function fetchData() {
      if (myAccessCode.length === 4 && myAccessCode !== 'default') {
        const playlistRef = db.doc(`playlists/${myAccessCode}`);
        await playlistRef
          .get()
          .then(async doc => {
            if (!doc.exists) {
              return {};
            }
            setDocumentOwnerId({ data: doc.data().ownerId });
            setDocumentPlaylistId({ data: doc.data().playlistId });
            setDocumentUri({ uri: doc.data().uri });
            setDocumentPlaylistName({ data: doc.data().playlistName });

            await playlistRef
              .collection('tracks')
              .orderBy('votes', 'desc')
              .onSnapshot(
                {
                  // Listen for document metadata changes
                  includeMetadataChanges: true,
                },
                snapDoc => {
                  const playlistArr = [];
                  snapDoc.docs.forEach(item => {
                    playlistArr.push(item.data());
                  });
                  setDocumentState(playlistArr);
                }
              );
          })
          .catch(err => {
            console.log(err);
            return err;
          });
      }
    }

    fetchData();
  }, [myAccessCode]);

  return (
    <SpotifyContext.Provider
      value={{
        // Firebase related datatypes:
        documentOwnerId,
        setDocumentOwnerId,
        documentUri,
        setDocumentUri,
        documentPlaylistName,
        setDocumentPlaylistName,
        documentPlaylistId,
        setDocumentPlaylistId,
        documentState,
        setDocumentState,
        // Spotify Tokens:
        spotifyToken,
        setSpotifyToken,
        spotifyRefreshToken,
        setSpotifyRefreshToken,
        // AccessCode:
        setMyAccessCode,
        myAccessCode,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
