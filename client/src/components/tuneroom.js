import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link, navigate, Redirect } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import axios from 'axios';
import styled from 'styled-components';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { reorderTrack } from '../api/spotify/spotifyApi';
import { db } from '../api/firebase/firebaseConfig';
import { vote } from '../api/firebase/firebaseApi';
import { theme, mixins, media } from '../styles';
import Player from './player';

import AddSong from './addsong';

const { fonts, fontSizes, colors } = theme;

const TuneRoomContainer = styled.div`
  ${mixins.sidePadding};
  display: flex;
  flex-flow: column wrap;
  ${media.phablet`padding: 2px;`};
`;

const PlaylistName = styled.h2`
  text-align: center;
  font-size: ${fontSizes.h2};
  font-family: ${fonts.RiftSoft};
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${props => props.theme.colors.buttonFill};
  margin-top: 50px;
`;

const TracksContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  /* align-items: center; */
  text-align: left;
`;

const TrackImageContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 5px;

  img {
    margin-right: 10px;
    ${media.phablet`width: 50px;height: 50px;`};
  }
`;

const TrackInfoContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  .hide-track {
    display: 'none';
  }
`;

const TrackText = styled.p`
  text-align: left;
  ${media.phablet`font-size:${fontSizes.xsmall};`};
`;

const VoteContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const VoteText = styled.p`
  font-size: ${fontSizes.xsmall};
`;

const VoteButton = styled.button`
  ${mixins.smallButton};
`;

const BackButton = styled.button`
  color: ${props => props.theme.colors.buttonFill};
  text-transform: uppercase;
  border: none;
  font-family: ${fonts.RiftSoft};
  letter-spacing: 3px;
  font-size: ${fontSizes.small};
  font-weight: 500;
  background: none;
  transition: ${theme.transition};
  border-radius: 225px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover,
  &:focus,
  &:active {
    background: ${props => props.theme.colors.buttonFill};
    color: ${props => props.theme.colors.buttonFontColor};
    border-radius: 225px;
  }
  &:after {
    display: none !important;
  }
`;

const UpNextHeader = styled.h2`
  font-family: ${fonts.RiftSoft};
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0;
  padding: 0;
`;

function TuneRoom(props) {
  const user = JSON.parse(localStorage.getItem('user'));
  const accessCode = localStorage.getItem('accessCode');
  const [trackResults, setTrackResults] = useState({ data: '' });
  const [votedTracks, setVotedTracks] = useState({ results: [] });
  const [currentTrack, setCurrentTrack] = useState(null);

  const {
    documentUri,
    documentPlaylistId,
    documentOwnerId,
    documentPlaylistName,
    documentState,
    setDocumentState,
    setMyAccessCode,
  } = useContext(SpotifyContext);

  useEffect(() => {
    setDocumentState(documentState);
  }, [currentTrack, documentState, documentUri, setDocumentState]);

  useEffect(() => {
    async function getRefreshToken() {
      await axios
        .post('/auth/refresh_token', user)
        .then(response => {
          SpotifyApi.setAccessToken(response.data.access_token);
          SpotifyApi.setRefreshToken(response.data.refresh_token);
        })
        .catch(error => error);
    }
    // getRefreshToken();
    setInterval(() => {
      getRefreshToken();
    }, 3000000);
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

    if (documentPlaylistId.data !== '') {
      reorderTrack(documentPlaylistId.data, accessCode, documentOwnerId.data);
      documentState.map((track, i) => {
        if (currentTrack === track.uri) {
          document.querySelector(`.track--${i}`).style.display = 'none';
        }
      });
    }
  }, [
    accessCode,
    currentTrack,
    documentOwnerId,
    documentPlaylistId,
    documentState,
    props,
    user.uid,
  ]);

  const handleVote = trackUri => {
    if (!votedTracks.results.includes(trackUri)) {
      vote(trackUri, accessCode, documentPlaylistId);
      setVotedTracks({ results: [...votedTracks.results, trackUri] });
      reorderTrack(documentPlaylistId.data, accessCode, documentOwnerId.data);
    }
  };

  const trackUri = documentState.map(track => track.uri);

  const back = async () => {
    await setMyAccessCode('default');
    await navigate('/join').then(window.location.reload());
  };

  return (
    <>
      <BackButton type="submit" onClick={() => back()}>
        back
      </BackButton>
      <TuneRoomContainer>
        <PlaylistName>{documentPlaylistName.data}</PlaylistName>
        <Player
          user={user}
          trackUri={trackUri}
          setCurrentTrack={setCurrentTrack}
        />
        <UpNextHeader>Up Next:</UpNextHeader>
        {documentState.length > 0 &&
          documentState.map((result, i) => {
            return (
              <Fragment>
                <TracksContainer key={i}>
                  <TrackInfoContainer className={`track--${i}`}>
                    <TrackImageContainer>
                      <img src={result.album.images[2].url} alt="album-cover" />
                      <TrackText>
                        {result.name}
                        <br />
                        {result.artists[0].name}
                      </TrackText>
                    </TrackImageContainer>

                    <VoteContainer>
                      <VoteButton
                        type="submit"
                        onClick={() => handleVote(result.uri, documentUri)}
                      >
                        vote
                      </VoteButton>
                      <VoteText>{result.votes} Votes</VoteText>
                    </VoteContainer>
                  </TrackInfoContainer>
                </TracksContainer>
              </Fragment>
            );
          })}
        <AddSong />
      </TuneRoomContainer>
    </>
  );
}

export default TuneRoom;
