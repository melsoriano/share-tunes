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
    let urlAccessCode = window.location.pathname.split('/').pop();
    setMyAccessCode(localStorage.getItem('accessCode'));
    async function fetchData() {
      const playlistRef = db.doc(`playlists/${myAccessCode}`);
      playlistRef
        .get()
        .then(async doc => {
          if (!doc.exists) {
            return {};
          }
          await setDocumentOwnerId({ data: doc.data().ownerId });
          await setDocumentPlaylistId({ data: doc.data().playlistId });
          await setDocumentUri({ uri: doc.data().uri });
          await setDocumentPlaylistName({ data: doc.data().playlistName });
          await playlistRef.collection('tracks').onSnapshot(
            {
              // Listen for document metadata changes
              includeMetadataChanges: true,
            },
            async snapDoc => {
              const playlistArr = [];
              snapDoc.docs.forEach(item => {
                playlistArr.push(item.data());
              });
              await setDocumentState(playlistArr);
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
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
