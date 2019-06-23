import React, { useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';
import { getPlaylistTracks } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { theme, mixins, media } from '../styles';

const { colors, fontSizes, fonts } = theme;

const JoinContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const JoinButton = styled.button`
  ${mixins.customButton};
`;

const JoinFieldSet = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 5px;
  border: none;
  overflow: visible;
`;

const JoinInputField = styled.input`
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

const JoinInputLabel = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: ${fontSizes.large};
  color: ${props => props.theme.colors.fontColor};
  transform-origin: 0 -150%;
  transition: transform 300ms ease;
  pointer-events: none;
`;

const Join = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    setPlaylistResult,
    accessCode,
    setAccessCode,
    setPlaylistId,
    setPlaylistUri,
  } = useContext(SpotifyContext);

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handleAccessCode = e => {
    setAccessCode({ code: e.target.value });
  };

  // TODO: add these EVERYWHERE...classname?
  window.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      getPlaylistTracks(
        accessCode.code,
        setPlaylistResult,
        setPlaylistId,
        navigate
      );
      setAccessCode(accessCode.code);
    }
  });

  return (
    <JoinContainer>
      <JoinFieldSet className="join-field">
        <JoinInputField
          type="text"
          value={accessCode.code}
          onChange={handleAccessCode}
          required
        />
        <JoinInputLabel>Enter Access Code</JoinInputLabel>
      </JoinFieldSet>
      <JoinButton
        type="submit"
        onClick={() => {
          setAccessCode(accessCode.code);
          getPlaylistTracks(
            accessCode.code,
            setPlaylistUri,
            setPlaylistResult,
            setPlaylistId,
            navigate
          );
        }}
      >
        ENTER
      </JoinButton>
    </JoinContainer>
  );
};

export default Join;
