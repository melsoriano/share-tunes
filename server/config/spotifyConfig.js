const SPOTIFY_OAUTH_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-read-recently-played',
  'playlist-modify-public',
  'playlist-read-collaborative',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

const CORS_WHITELIST = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8080/redirect',
  'http://localhost:3000/redirect',
  'http://localhost:8080/token',
  'http://localhost:3000/token',
  'http://localhost:8080/home',
  'http://localhost:3000/home',
];

module.exports = {
  SPOTIFY_OAUTH_SCOPES,
  CORS_WHITELIST,
};
