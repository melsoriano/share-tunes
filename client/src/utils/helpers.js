// Get cookie by name
function getCookie(name) {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}

// Get the code provided by Spotify in the url query string
function getUrlParameter() {
  const params = new URLSearchParams(window.location.search);
  window.history.replaceState({}, '', `/`);
  const code = params.get('code');
  return code;
}

export { getCookie, getUrlParameter };
