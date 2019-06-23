// create two themes
// theme object gets passed into themeContext, which toggles between the two based on localStorage value
const theme = {
  colorOptions: {
    darkest: '#101015',
    dark: '#101015',
    ice: '#F0F3F4',
    steel: '#C8D1D3',
    aqua: '#00E4F4',
    sand: '#FDD9BE',
    peach: '#FFC9A5',
    coral: '#F05E53',
    transCoral: 'rgb(244,123,120, 0.2)',
    transAqua: 'rgb(0,228,244, 0.2)',
    greyDisabled: '#A1AABB',
  },

  fonts: {
    Pragmatica:
      'Pragmatica, San Francisco, SF Pro Text, -apple-system, system-ui, BlinkMacSystemFont, Helvetica Neue, Segoe UI, Arial, sans-serif',
    Hooligan: 'Hooligan-jf, Courier New, Monotype',
    RiftSoft:
      'rift-soft, San Francisco, SF Pro Text, -apple-system, system-ui, BlinkMacSystemFont, Helvetica Neue, Segoe UI, Arial, sans-serif',
  },

  fontSizes: {
    xsmall: '12px',
    smallish: '13px',
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
    xxlarge: '22px',
    h2: '24px',
    h1: '32px',
  },

  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  transition: 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',

  borderRadius: '378px',
  headerHeight: '100px',
  headerScrollHeight: '70px',
  margin: '20px',

  tabHeight: 42,
  tabWidth: 120,

  gradient: `linear-gradient(0.4turn, #64d6ff, #64ffda)`,

  light: {
    colors: {
      background: 'linear-gradient(to bottom, #FDD9BE, #FFC9A5) fixed',
      fontColor: '#101015',
      secondaryFontColor: '#F05E53',
      buttonFontColor: '#FFFDFD',
      buttonFill: '#F05E53',
      buttonHover: 'rgb(244,123,120, 0.1)',
    },
  },

  dark: {
    colors: {
      background: 'linear-gradient(to bottom, #191F29, #101015) fixed',
      fontColor: '#F0F3F4',
      secondaryFontColor: '#00E4F4',
      buttonFontColor: '#101015',
      buttonFill: '#00E4F4',
      buttonHover: 'rgb(0,228,244, 0.1)',
    },
  },
};

export default theme;
