import React from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import styled from 'styled-components';
import { media, theme, Section, mixins } from '../styles';

const { fonts, fontSizes, colors } = theme;

const PlayerContainer = styled.div`
  ._ContentRSWP {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  ._SliderRSWP {
    margin: 15px 0;
  }

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

  ._PlayerRSWP {
    display: flex;
    flex-flow: column-reverse nowrap;
    background: none;
  }

  ._ControlsRSWP {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  ._ActionsRSWP {
    display: none;
  }

  svg:nth-child(1) {
    color: ${props => props.theme.colors.buttonFill};
  }

  img {
    width: 100%;
  }
`;

const Player = ({ user, trackUri, setCurrentTrack }) => {
  return (
    <PlayerContainer className="spotify-web-player">
      <SpotifyWebPlayer
        token={user.accessToken}
        uris={trackUri}
        name="Share Tunes Player"
        autoPlay
        callback={state => {
          setCurrentTrack(state.track.uri);
        }}
      />
    </PlayerContainer>
  );
};

export default Player;
