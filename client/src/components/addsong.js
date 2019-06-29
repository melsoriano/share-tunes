import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';
import { searchTracks, addTrack } from '../api/spotify/spotifyApi';
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
  ${mixins.bigButton};
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
  ${mixins.smallButton};
`;

const AddSong = props => {
  const [stateQuery, setStateQuery] = useState({ query: '' });
  const user = JSON.parse(localStorage.getItem('user'));
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  const { path, code } = props;

  const {
    setMyAccessCode,
    setDocumentUri,
    documentOwnerId,
    documentPlaylistId,
    setDocumentState,
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
  const [initialTracks, setInitialTracks] = useState([]);
  const accessCodeId = window.location.pathname.split('/').pop();

  const handleAddTrack = async result => {
    // need to pass this all the way to addTrackDb method in firebaseApi

    await addTrack(
      documentOwnerId.data,
      documentPlaylistId.data,
      accessCodeId,
      result
    );
    setInitialTracks([result, ...initialTracks]);

    if (accessCodeId === code && initialTracks.length >= 1) {
      await setDocumentState([result, ...initialTracks]);
      await navigate(`/tuneroom/${accessCodeId}`, { state: result });
    }
    setStateQuery({ query: '' });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      searchTracks(stateQuery.query, setTrackResults);
    }
  };

  return (
    <AddContainer>
      {path === `/add/${accessCodeId}` && (
        <AddTrackTitle>Go ahead and add a couple (2) songs!</AddTrackTitle>
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
