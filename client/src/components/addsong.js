import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';
import {
  searchTracks,
  addStartingTrack,
  addTrack,
} from '../api/spotify/spotifyApi';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { SpotifyContext } from '../context/spotifyContext';

import { theme, mixins } from '../styles';

const { fontSizes } = theme;

const AddContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const SearchButton = styled.button`
  ${mixins.customButton};
`;

const AddFieldSet = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 5px;
  border: none;
  overflow: visible;
`;

const AddInputField = styled.input`
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

const AddInputLabel = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: ${fontSizes.large};
  color: ${props => props.theme.colors.fontColor};
  transform-origin: 0 -150%;
  transition: transform 300ms ease;
  pointer-events: none;
`;

const AddTrackTitle = styled.h2`
  font-size: ${fontSizes.xlarge};
  font-weight: 500;
  color: ${props => props.theme.colors.buttonFill};
  margin-bottom: 40px;
`;

const SearchResultsContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const UnorderedList = styled.ul`
  text-align: left;
`;

const ListItem = styled.li`
  text-align: left;
`;

const AddButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.buttonFill};
  border-radius: 255px;
  color: ${props => props.theme.colors.buttonFill};
`;

const AddSong = props => {
  const [stateQuery, setStateQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  const { path } = props;

  const {
    setMyAccessCode,
    setDocumentUri,
    documentOwnerId,
    documentPlaylistId,
  } = useContext(SpotifyContext);

  SpotifyApi.setAccessToken(user.accessToken);
  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [documentOwnerId, user]);

  const search = e => {
    setStateQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    // addStartingTrack(result, setMyAccessCode, setDocumentUri, navigate);
    addTrack(documentOwnerId.data, documentPlaylistId.data, result);
    setTrackResults({ data: '' });
    navigate('/tuneroom');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      searchTracks(stateQuery.query, setTrackResults);
    }
  };

  return (
    <AddContainer>
      {path === '/add' && (
        <AddTrackTitle>Add a song to launch your playlist!</AddTrackTitle>
      )}

      {/** SEARCH FOR A SONG */}
      <AddFieldSet>
        <AddInputField
          type="text"
          value={stateQuery.query}
          onKeyPress={handleKeyPress}
          onChange={search}
          required
        />
        <AddInputLabel>Search Tracks</AddInputLabel>
      </AddFieldSet>
      <SearchButton
        id="addSong"
        type="submit"
        onClick={() => {
          searchTracks(stateQuery.query, setTrackResults);
        }}
      >
        SEARCH
      </SearchButton>
      {trackResults.data !== '' &&
        trackResults.map((result, i) => (
          <SearchResultsContainer>
            <UnorderedList key={i}>
              <ListItem>
                <img src={result.album.images[2].url} alt="album-cover" />
                {result.artists[0].name} - {result.name}
                <AddButton type="submit" onClick={() => handleAddTrack(result)}>
                  add
                </AddButton>
              </ListItem>
            </UnorderedList>
          </SearchResultsContainer>
        ))}
    </AddContainer>
  );
};

export default AddSong;
