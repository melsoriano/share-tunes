import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, navigate } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import axios from 'axios';
import styled from 'styled-components';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { db } from '../api/firebase/firebaseConfig';
import { vote } from '../api/firebase/firebaseApi';

import AddSong from './addsong';

const PlayerContainer = styled.div`
  svg {
    width: 25px;
    height: 25px;
  }
`;

function TuneRoom() {
  const user = JSON.parse(localStorage.getItem('user'));
  const accessCode = localStorage.getItem('accessCode');

  const { documentUri, documentPlaylistName, documentState } = useContext(
    SpotifyContext
  );

  const [trackResults, setTrackResults] = useState({
    data: '',
  });

  const [votedTracks, setVotedTracks] = useState({ results: [] });
  const [voteCount, setVoteCount] = useState();

  useEffect(() => {
    function getRefreshToken() {
      axios
        .post('/auth/refresh_token', user)
        .then(response => {
          const { access_token, refresh_token } = response.data;

          SpotifyApi.setAccessToken(access_token);
          SpotifyApi.setRefreshToken(refresh_token);
        })
        .catch(err => {
          console.log(err);
          return err;
        });
    }
    // getRefreshToken();
    setInterval(() => {
      getRefreshToken();
    }, 1000000);
  }, [user]);

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        const { accessToken } = doc.data();
        SpotifyApi.setAccessToken(accessToken);
        localStorage.setItem(
          'user',
          JSON.stringify({ uid: doc.id, ...doc.data() })
        );
      });
  }, [user.uid]);

  const handleVote = async trackUri => {
    if (!votedTracks.results.includes(trackUri)) {
      vote(trackUri, accessCode);
      setVotedTracks({ results: [...votedTracks.results, trackUri] });

      const filterVotes = documentState.forEach(
        item => item.uri === trackUri && item.votes++
      );
      setVoteCount(filterVotes);
    }
  };

  return (
    <div>
      <h1>voted tracks: </h1>
      <button type="submit" onClick={() => navigate('/')}>
        Return to Home
      </button>
      <div>
        <div>{documentPlaylistName.data}</div>
        <PlayerContainer>
          <SpotifyPlayer token={user.accessToken} uris={`${documentUri.uri}`} />
        </PlayerContainer>
        {/** PLAYLSIT RESULTS */}
        {documentState !== '' ? (
          documentState.map((result, i) => {
            // console.log(result.trackUri.album.images[0].url);
            return (
              <>
                {/* what's currently playing? */}
                {i === 1 && <h2>Up Next:</h2>}
                <ul key={i}>
                  <li>
                    <div>
                      {result.name}
                      {result.votes && voteCount === undefined ? (
                        <div>{result.votes}</div>
                      ) : (
                        <div>{console.log(voteCount)}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      onClick={() => handleVote(result.uri)}
                    >
                      vote
                    </button>

                    {/* Cant parse further down?? */}
                    <img src={result.album.images[2].url} alt="album-cover" />
                  </li>
                </ul>
              </>
            );
          })
        ) : (
          <div>
            <h2>
              <Link to="/join">Join a playlist</Link> to see what's playing
            </h2>
          </div>
        )}
        <AddSong />
        &nbsp;
        {trackResults.data !== '' && (
          <button type="submit" onClick={() => setTrackResults({ data: '' })}>
            Close Search
          </button>
        )}
        <br />
      </div>
    </div>
  );
}

export default TuneRoom;
