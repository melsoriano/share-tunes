import React from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import styled from 'styled-components';
import { media, theme } from '../styles';

const { fonts, fontSizes, colors } = theme;

const PlayerContainer = styled.div`
  margin-bottom: 20px;

  div:nth-child(1) {
    p {
      color: ${props => props.theme.colors.buttonFill};
      font-size: ${fontSizes.large};
      font-family: ${fonts.RiftSoft};
      font-weight: 500;
      letter-spacing: 2px;
    }
  }
  svg {
    width: 25px;
    height: 25px;
  }

  ._ActionsRSWP {
    display: none;
  }
  /* 
  div:nth-child(1) {
    width: 50%;
    margin: auto;
     div:nth-child(1) {
      display: none;
    } 
  } */
  svg:nth-child(1) {
    color: ${props => props.theme.colors.buttonFill};
  }

  img {
    width: 100%;
  }
`;

const PlayerBackground = styled.div`
  /* position: fixed;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  z-index: -1;
  top: 0%;
  width: 30%;
  height: 50%;
  margin: 0 auto;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  ${media.phablet`width: 100%; left: 0%; top: 0%;`}; */
`;

const PlaylistName = styled.h2`
  text-align: center;
  font-size: ${fontSizes.h2};
  text-transform: uppercase;
  font-weight: 600;
  color: ${props => props.theme.colors.buttonFill};
`;

const Player = ({
  user,
  trackUri,
  documentState,
  setCurrentTrack,
  currentTrack,
}) => {
  // documentState.map(track => {
  //   if (track.uri === currentTrack) {
  //     document.querySelector(
  //       `#spotify-web-player`
  //     ).style.backgroundImage = `url(${track.album.images[0].url})`;
  //   }
  // });
  return (
    <PlayerBackground id="spotify-web-player">
      <PlayerContainer>
        <SpotifyWebPlayer
          token={user.accessToken}
          uris={trackUri}
          name="Share Tunes Player"
          autoPlay
          callback={state => {
            setCurrentTrack(state.track.uri);
          }}
          styles={{
            bgColor: 'none',
            // color: 'none',
            // sliderHandleColor: '#F0F3F4',
            // trackArtistColor: 'transparent',
            // trackNameColor: 'transparent',
          }}
        />
      </PlayerContainer>
    </PlayerBackground>
  );
};

export default Player;
