import React, { useState, useEffect } from 'react';
import { db } from '../api/firebase/firebaseConfig';

export const SpotifyContext = React.createContext();

export const SpotifyProvider = ({ children }) => {
  // ACCESS TOKEN -> set when user joins with an accessCode, or creates a new playlsit, generating an accessCode
  const myAccessCode = localStorage.getItem('accessCode') || 'default';

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

  // create a useEffect to fetch playlist from firestore, and set to context, depends on localStorage value, which is set in /join
  // see cleanup, should run this effect whenever the accessCode gets changed in localStorage
  useEffect(() => {
    async function fetchData() {
      // placeholder array to push tracks into, see below
      const playlistArr = [];
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
          // there is an excess empty string within the array, remove it and set DocumentState to the new array of tracks:
          // const trackListData = doc.data().tracks;
          // trackListData.shift();
          // trackListData.forEach(data => {
          //   playlistArr.push(data);
          // });
          // await setDocumentState(playlistArr);

          await playlistRef
            .collection('tracks')
            .get()
            .then(item => {
              item.docs.map(track => {
                playlistArr.push(track.data());
              });
            });
          await setDocumentState(playlistArr);
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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
