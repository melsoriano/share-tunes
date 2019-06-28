import React, { useState, useEffect, useContext } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';
import { createSpotifyPlaylist } from '../api/spotify/spotifyApi';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { theme, mixins, Section } from '../styles';

import { SpotifyContext } from '../context/spotifyContext';

const { fontSizes } = theme;

const CreateContainer = styled(Section)`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const CreateButton = styled.button`
  ${mixins.customButton};
`;

const CreateFieldSet = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 5px;
  border: none;
  overflow: visible;
`;

const CreateInputField = styled.input`
  background: transparent;
  color: ${props => props.theme.colors.fontColor};
  box-sizing: border-box;
  width: 280px;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid ${props => props.theme.colors.fontColor};
  font-size: ${fontSizes.xlarge};
  font-weight: 600;
  outline: none;
  cursor: text;
  transition: all 300ms ease;
  &:focus {
    border-bottom: 1px solid ${props => props.theme.colors.buttonFill};
    box-shadow: 0 1px 0 0 ${props => props.theme.colors.buttonFill};
  }
  &:focus ~ label,
  &:valid ~ label {
    color: ${props => props.theme.colors.buttonFill};
    transform: translateY(-14px) scale(0.8);
  }
`;

const CreateInputLabel = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: ${fontSizes.large};
  color: ${props => props.theme.colors.fontColor};
  transform-origin: 0 -150%;
  transition: transform 300ms ease;
  pointer-events: none;
`;

const Create = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  const {
    myAccessCode,
    setMyAccessCode,
    setDocumentPlaylistId,
    setDocumentOwnerId,
    setDocumentPlaylistName,
    setDocumentUri,
  } = useContext(SpotifyContext);

  useEffect(() => {
    localStorage.setItem('isLoading', false);
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      createSpotifyPlaylist(
        user.uid,
        playlist.playlistName,
        setMyAccessCode,
        setDocumentPlaylistId,
        setDocumentOwnerId,
        setDocumentPlaylistName,
        setDocumentUri,
        navigate
      );
    }
  };

  return (
    <CreateContainer>
      <CreateFieldSet>
        <CreateInputField
          type="text"
          value={playlist.playlistName}
          onChange={handlePlaylistName}
          onKeyPress={handleKeyPress}
          required
        />
        <CreateInputLabel>Enter Playlist Name</CreateInputLabel>
      </CreateFieldSet>
      <CreateButton
        type="submit"
        onClick={() =>
          createSpotifyPlaylist(
            user.uid,
            playlist.playlistName,
            setMyAccessCode,
            setDocumentPlaylistId,
            setDocumentOwnerId,
            setDocumentPlaylistName,
            setDocumentUri,
            navigate
          )
        }
      >
        CREATE PLAYLIST
      </CreateButton>
    </CreateContainer>
  );
};

export default Create;
