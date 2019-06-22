import React, { useState, useEffect } from 'react';
// import * as firebase from 'firebase';
import { db } from '../api/firebase/firebaseConfig';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

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
          console.log('DOC: ', doc.data());
          await setDocumentOwnerId({ data: doc.data().ownerId });
          await setDocumentPlaylistId({ data: doc.data().playlistId });
          await setDocumentUri({ uri: doc.data().uri });
          await setDocumentPlaylistName({ data: doc.data().playlistName });
          await doc.data().tracks.map(data => {
            console.log(data);
          });
          // sets track uri's if needed:
          doc.data().tracks.forEach(data => {
            playlistArr.push(data);
          });
        })
        .catch(err => {
          console.log(err);
        });
      setDocumentState(playlistArr);
    }
    fetchData();
  }, [documentPlaylistId, myAccessCode]);

  // useEffect(() => {
  //   // updates in realtime from firestore
  //   db.collection('playlists')
  //     .doc(myAccessCode)
  //     .onSnapshot(doc => {
  //       doc.data().tracks.map(data => {
  //         SpotifyApi.getPlaylistTracks(documentPlaylistId).then(tracks => {
  //           console.log(tracks);
  //           // tracks.body.items.map(spotifyApi => {
  //           // TODO:
  //           // increment vote count for specific track
  //           // if (data.trackUri === spotifyApi.track.uri) {
  //           //   db.doc(`playlists/${accessCode}`).set({
  //           //   }, { merge: true });
  //           // }
  //           // });
  //         });
  //       });
  //     });
  // }, [documentPlaylistId, myAccessCode]);

  // useEffect(() => {
  //   SpotifyApi.getPlaylistTracks(documentPlaylistId)
  //     .then(data => {
  //       console.log(data.body.items);
  //       // await setPlaylistUri(uri);
  //       // await setPlaylistResult(data.body.items);
  //       // await navigate('/tuneroom');
  //     })
  //     .catch(error => {
  //       return error;
  //     });
  // });

  const [spotifyToken, setSpotifyToken] = useState();
  const [searchQuery, setSearchQuery] = useState({ query: '' });
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  const [playlistId, setPlaylistId] = useState({ data: '' });
  const [playlistQuery, setPlaylistQuery] = useState({ query: '' });
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState({
    expiresIn: '',
  });
  // these should use the data from firestore as a fallback for refresh
  const [playlistResult, setPlaylistResult] = useState({ data: '' });
  // const [accessCode, setAccessCode] = useState({ code: '' });

  return (
    // inject state into the provider, and pass along to children components
    <SpotifyContext.Provider
      value={{
        documentOwnerId,
        documentState,
        documentUri,
        documentPlaylistName,
        documentPlaylistId,
        setDocumentState,
        playlistQuery,
        setPlaylistQuery,
        playlistResult,
        playlistId,
        setPlaylistId,
        setPlaylistResult,
        spotifyToken,
        setSpotifyToken,
        searchQuery,
        setSearchQuery,
        trackResults,
        setTrackResults,
        // accessCode,
        // setAccessCode,
        spotifyRefreshToken,
        setSpotifyRefreshToken,
        playlistUri,
        setPlaylistUri,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
