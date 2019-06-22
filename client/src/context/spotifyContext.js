import React, { useState, useEffect } from 'react';
// import * as firebase from 'firebase';
import { db } from '../api/firebase/firebaseConfig';

// create instance of context
export const SpotifyContext = React.createContext();

// create context provider
export const SpotifyProvider = ({ children }) => {
  const myAccessCode = localStorage.getItem('accessCode') || 'default';
  // fetch playlist from firestore, and set to context
  // this should solve playlist refresh issues
  // requires saving the playlist accessCode in localStorage
  const [documentOwnerId, setDocumentOwnerId] = useState({ data: '' });
  const [documentPlaylistId, setDocumentPlaylistId] = useState({ data: '' });
  const [documentPlaylistName, setDocumentPlaylistName] = useState({
    data: '',
  });
  const [documentState, setDocumentState] = useState([]);
  const [documentUri, setDocumentUri] = useState({ uri: '' });

  const [playlistUri, setPlaylistUri] = useState({
    uri: '',
  });
  // fetch data stored in firestore, based on the accessCode generated for tuneroom
  // this depends on localStorage being set/get correctly
  // clean up and run this effect whenever the accessCode gets changed in localStorage
  useEffect(() => {
    async function fetchData() {
      // placeholder array to push tracks into, see below
      const playlistArr = [];
      await db
        .collection('playlists')
        // .doc('0zdw') // for sanity
        .doc(myAccessCode)
        .get()
        .then(async doc => {
          if (!doc.exists) {
            return {};
          }
          // console.log('DOC: ', doc.data());
          await setDocumentOwnerId({ data: doc.data().ownerId });
          await setDocumentPlaylistId({ data: doc.data().playlistId });
          await setDocumentUri({ uri: doc.data().uri });
          await setDocumentPlaylistName({ data: doc.data().playlistName });
          // await set;
          // await doc.data().tracks.map(data => {
          //   console.log(data);
          // });
          // there is an excess empty string, within the array, remove it and set DocumentState to the new array of tracks:
          const trackListData = doc.data().tracks;
          trackListData.shift();
          trackListData.forEach(data => {
            playlistArr.push(data);
          });
          await setDocumentState(playlistArr);
        })
        .catch(err => {
          console.log(err);
        });
    }
    fetchData();
  }, [myAccessCode]);

  const [spotifyToken, setSpotifyToken] = useState();
  const [searchQuery, setSearchQuery] = useState({ query: '' });
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  // const [playlistId, setPlaylistId] = useState({ data: '' });
  // const [playlistQuery, setPlaylistQuery] = useState({ query: '' });
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState({
    expiresIn: '',
  });
  // these should use the data from firestore as a fallback for refresh
  // const [playlistResult, setPlaylistResult] = useState({ data: '' });
  // const [accessCode, setAccessCode] = useState({ code: '' });

  return (
    // inject state into the provider, and pass along to children components
    <SpotifyContext.Provider
      value={{
        // Firebase related Queries
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
        // Spotify Tokens
        spotifyToken,
        setSpotifyToken,
        searchQuery,
        setSearchQuery,
        trackResults,
        setTrackResults,
        spotifyRefreshToken,
        setSpotifyRefreshToken,
        // playlistUri,
        // setPlaylistUri,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
