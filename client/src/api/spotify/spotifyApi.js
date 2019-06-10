import { SpotifyApi } from './spotifyConfig';

function createPlaylist(userId, playlistName) {
  SpotifyApi.createPlaylist(userId, playlistName, {
    public: true,
  })
    .then(data => {
      console.log('data>>>', data);
    })
    .catch(error => {
      console.log(error);
    });
}

export default createPlaylist;
