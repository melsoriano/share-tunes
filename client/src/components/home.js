import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FirebaseAuth, db } from '../api/firebase/firebaseConfig';
import { spotifyAuthEndpoint, SpotifyApi } from '../api/spotify/spotifyConfig';
import { getUrlParameter } from '../utils/helpers';
import { theme, media, mixins } from '../styles';
import { IconMusicNote } from './icons';

const { colors, fonts, fontSizes } = theme;

const grow = keyframes`
  0% {
    transform: scale(1.35, 1.35);
    opacity: .7;
  }
  100% {
    transform: scale(1.9, 1.9);
    opacity: 0;
  }
`;

const CircleAnimation = styled.div`
  position: absolute;
  top: 19%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background-color: ${props => props.theme.colors.buttonFill};
  color: white;
  text-align: center;
  line-height: 100px;
  border-radius: 50%;
  font-size: 1.3rem;
  &:hover {
    cursor: pointer;
  }
  &::after,
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.theme.colors.buttonFill};
    border-radius: 50%;
    z-index: -1;
    animation: ${grow} 1s ease-in-out infinite;
  }
  &::after {
    background: ${props => props.theme.colors.buttonFill};
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      background: rgb(95, 132, 255);
      border-radius: 50%;
      z-index: -1;
      animation: ${grow} 1s ease-in-out infinite;
    }
  }
  &::before {
    background: ${props => props.theme.colors.buttonFill};
    animation-delay: -0.5s;
  }

  svg {
    width: 60px;
    height: 60px;
    color: ${colors.darkest};
  }
`;

const HomeContainer = styled.div`
  margin: auto;
`;

const Share = styled.h1`
  display: inline;
  font-family: ${fonts.Hooligan};
  font-size: 55px;
  font-weight: 500;
  letter-spacing: 2px;
  color: ${props => props.theme.colors.fontColor};
`;

const Tunes = styled.h1`
  display: inline;
  font-family: ${fonts.Hooligan};
  font-size: 55px;
  font-weight: 500;
  letter-spacing: 2px;
  color: ${props => props.theme.colors.secondaryFontColor};
`;

const Subtitle = styled.h2`
  margin: auto;
  font-size: ${fontSizes.large};
  font-weight: 300;
  width: 65%;

  ${media.tablet`width: 100%;`};
`;

const SmallNotice = styled.p`
  font-size: ${fontSizes.xsmall};
`;

const SpotifySignUpLink = styled.a`
  ${mixins.inlineLink}
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const HomepageButton = styled.button`
  ${mixins.customButton}
  cursor: pointer;
`;

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const spotifyAuthCode = getUrlParameter('code');

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    const authListener = () => {
      FirebaseAuth.onAuthStateChanged(authUser => {
        if (authUser) {
          db.doc(`users/${authUser.uid}`)
            .get()
            .then(snapshot => {
              const dbUser = snapshot.data();
              const userData = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };
              localStorage.setItem('user', JSON.stringify(userData));
            });
        }
      });
    };

    function getToken() {
      if (spotifyAuthCode) {
        axios.post('/auth/token', { spotifyAuthCode }).then(async response => {
          FirebaseAuth.setPersistence('local').then(async () => {
            await FirebaseAuth.signInWithCustomToken(
              response.data.firebaseToken
            )
              .then(() => localStorage.setItem('isLoading', 'false'))
              .then(() => setIsAuthenticated(true))
              .then(() => navigate('/create'))
              .catch(error => error);
          });
        });
      }
    }

    authListener();
    getToken();
  }, [spotifyAuthCode]);

  return (
    <HomeContainer>
      <CircleAnimation>
        <IconMusicNote></IconMusicNote>
      </CircleAnimation>
      <Share>Share</Share>
      <Tunes>Tunes</Tunes>
      <Subtitle>
        Have great taste in music? Share and vote for your favorite tunes in a
        real-time collaborative playlist.
      </Subtitle>
      <ButtonContainer className="__BTN__">
        <a href={spotifyAuthEndpoint}>
          <HomepageButton
            type="submit"
            onClick={() => {
              localStorage.setItem('isLoading', 'true');
            }}
          >
            CREATE A PLAYLIST
          </HomepageButton>
        </a>
        <HomepageButton
          type="submit"
          onClick={() => {
            navigate('/join');
          }}
        >
          JOIN A PLAYLIST
        </HomepageButton>
      </ButtonContainer>
      <SmallNotice>
        * A Spotify account is required. Sign up{' '}
        <SpotifySignUpLink href="https://www.spotify.com">
          here
        </SpotifySignUpLink>
        .
      </SmallNotice>
    </HomeContainer>
  );
}

export default Home;
