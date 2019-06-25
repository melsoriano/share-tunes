import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { SpotifyContext } from '../context/spotifyContext';
import { checkPlaylistExists } from '../api/firebase/firebaseApi';
import { theme, mixins, Section } from '../styles';

const { fontSizes } = theme;

const JoinContainer = styled(Section)`
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
  const [searchQuery, setSearchQuery] = useState({ code: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  const { setMyAccessCode } = useContext(SpotifyContext);

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handleAccessCode = e => {
    setSearchQuery({ code: e.target.value });
  };

  const handleKeyPress = async e => {
    if (e.key === 'Enter') {
      await setSearchQuery({ code: e.target.value });
      // set it via context for initial render
      await setMyAccessCode(searchQuery.code);
      // set access code to localStorage to persist through refresh
      await localStorage.setItem('accessCode', searchQuery.code);
      await navigate('/tuneroom');
    }
  };

  return (
    <JoinContainer>
      <JoinFieldSet className="join-field">
        <JoinInputField
          type="text"
          value={searchQuery.code}
          onKeyPress={handleKeyPress}
          onChange={handleAccessCode}
          required
        />
        <JoinInputLabel>Enter Access Code</JoinInputLabel>
      </JoinFieldSet>
      <JoinButton
        type="submit"
        onClick={() => {
          checkPlaylistExists(searchQuery.code);
          // set it via context for initial render
          // set access code to localStorage to persist through refresh...it will then reset it to a localStorage.get() in context useEffect()
          // setMyAccessCode(searchQuery.code);
          // localStorage.setItem('accessCode', searchQuery.code);
          // navigate('/tuneroom');
        }}
      >
        ENTER
      </JoinButton>
    </JoinContainer>
  );
};

export default Join;
