import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import axios from 'axios';
import { FirebaseAuth, db } from '../api/firebase/firebaseConfig';
import { spotifyAuthEndpoint, SpotifyApi } from '../api/spotify/spotifyConfig';
import { getUrlParameter } from '../utils/helpers';
import {
  createSpotifyPlaylist,
  getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState('false');
  const spotifyAuthCode = getUrlParameter('code');
  // state
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  // context
  const {
    playlistQuery,
    setPlaylistQuery,
    setPlaylistResult,
    accessCode,
    setAccessCode,
  } = useContext(SpotifyContext);
  // const { setPlaylistResult } = useContext(SpotifyContext);
  // const {accessCode, setAccessCode} = useContext(SpotifyContext)

  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    const authListener = () => {
      FirebaseAuth.onAuthStateChanged(authUser => {
        if (authUser) {
          db.doc(`users/${authUser.uid}`)
            .get()
            .then(snapshot => {
              const dbUser = snapshot.data();
              // merge auth and db user
              const userData = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };
              // I think setting user to localStorage would work best here:
              localStorage.setItem('user', JSON.stringify(userData));
            });
        }
      });
    };

    axios.post('/auth/token', { spotifyAuthCode }).then(async response => {
      FirebaseAuth.setPersistence('local').then(async () => {
        await FirebaseAuth.signInWithCustomToken(response.data.firebaseToken)
          .then(() => localStorage.setItem('isLoading', 'false'))
          .then(() => setIsAuthenticated(true))
          .then(() => navigate('/create'))
          .catch(error => error);
      });
    });
    authListener();
  }, [spotifyAuthCode]);

  // helpers
  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  const handlePlaylistQuery = e => {
    setPlaylistQuery({ playlistQuery: e.target.value });
  };

  const handleAccessCode = e => {
    setAccessCode({ code: e.target.value });
  };

  return (
    <div>
      {localStorage.getItem('isLoading') === 'true' && (
        <div>Loading, please wait your turn.........</div>
      )}
      <div>
        Thanks for using ShareTunes. Join a playlist with your access code, or
        create your own!
      </div>
      <br />
      {/* Login to Spotify and Create Playlist */}
      <div>
        <div id="login">
          {/** Leaving this link outside of conditional for testing */}
          <a href={spotifyAuthEndpoint}>
            <button
              type="submit"
              onClick={() => {
                localStorage.setItem('isLoading', 'true');
              }}
            >
              CREATE A PLAYLIST
            </button>
          </a>
          <br />
          <br />
          {!isAuthenticated ? (
            <div>
              To create a new playlist, you will need a Spotify Account.
            </div>
          ) : (
            // navigate('/create')
            <div>
              <h3>
                YOU ARE AUTHENTICATED! ^o^
                <br />
                <br />
                TO DO:
                <br />
                Redirect to playlist page when `isAuthenticated` is true :)
              </h3>
            </div>
          )}
        </div>
        <br />
        {/* Join an existing playlist with an access code */}
        <button
          type="submit"
          onClick={() => {
            navigate('/join');
          }}
        >
          JOIN A PLAYLIST
        </button>
      </div>
      <br />
    </div>
  );
}

export default Home;
