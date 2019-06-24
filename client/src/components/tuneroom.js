import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import axios from 'axios';
import styled from 'styled-components';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { db } from '../api/firebase/firebaseConfig';
import { vote } from '../api/firebase/firebaseApi';
import { theme, mixins } from '../styles';

import AddSong from './addsong';

const { fonts, fontSizes, colors } = theme;

const TuneRoomContainer = styled.div`
  ${mixins.sidePadding};
`;

const PlaylistName = styled.h2`
  text-align: center;
  font-size: ${fontSizes.h2};
  text-transform: uppercase;
  font-weight: 600;
  color: ${props => props.theme.colors.buttonFill};
`;

const PlayerContainer = styled.div`
  svg {
    width: 25px;
    height: 25px;
  }
`;

const TrackInfoContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;

const TrackImageContainer = styled.image`
  padding: 5px;
`;

const TrackTextContainer = styled.div`
  text-align: left;
`;

const TrackText = styled.p`
  text-align: left;
`;

function TuneRoom() {
  const user = JSON.parse(localStorage.getItem('user'));
  const accessCode = localStorage.getItem('accessCode');

  const {
    documentUri,
    documentPlaylistId,
    // setDocumentUri,
    documentPlaylistName,
    documentState,
    setDocumentState,
  } = useContext(SpotifyContext);

  const [localDocumentUri, setLocalDocumentUri] = useState(documentUri);
  // const [localDocumentState, setLocalDocumentState] = useState(documentState);

  useEffect(() => {
    setDocumentState(documentState);
    // setLocalDocumentState(documentState);
    setLocalDocumentUri(documentUri.uri);
  }, [documentState, documentUri.uri, setDocumentState]);

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

  const handleVote = async (trackUri, documentUri) => {
    if (!votedTracks.results.includes(trackUri)) {
      vote(trackUri, accessCode, documentPlaylistId);
      setVotedTracks({ results: [...votedTracks.results, trackUri] });

      const filterVotes = documentState.forEach(
        item => item.uri === trackUri && item.votes++
      );
      setVoteCount(filterVotes);
    }
  };

  return (
    <TuneRoomContainer>
      <PlaylistName>{documentPlaylistName.data}</PlaylistName>
      <PlayerContainer>
        <SpotifyPlayer token={user.accessToken} uris={`${localDocumentUri}`} />
      </PlayerContainer>
      {documentState !== '' ? (
        documentState.map((result, i) => {
          return (
            <Fragment>
              {i === 0 && <h2>Up Next:</h2>}
              <TrackInfoContainer key={i}>
                <TrackImageContainer>
                  <img src={result.album.images[2].url} alt="album-cover" />
                </TrackImageContainer>

                <TrackText>{result.name}</TrackText>
                <TrackText>{result.votes}</TrackText>
                <button
                  type="submit"
                  onClick={() => handleVote(result.uri, documentUri)}
                >
                  vote
                </button>
              </TrackInfoContainer>
            </Fragment>
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
    </TuneRoomContainer>
  );
}

export default TuneRoom;
