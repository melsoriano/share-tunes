import SpotifyWebApi from 'spotify-web-api-node';

const spotifyConfig = {
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
  scopes: [
    'playlist-modify-public',
    'playlist-read-collaborative',
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-birthdate',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
  ],
};

const SpotifyApi = new SpotifyWebApi(spotifyConfig);

const spotifyAuthEndpoint = `https://accounts.spotify.com/authorize?client_id=${
  spotifyConfig.clientId
}&redirect_uri=${spotifyConfig.redirectUri}&scope=${spotifyConfig.scopes.join(
  '%20'
)}&response_type=code&show_dialog=true`;

export { spotifyConfig, SpotifyApi, spotifyAuthEndpoint };
