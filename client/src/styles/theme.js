// create two themes
// theme object gets passed into themeContext, which toggles between the two based on localStorage value
const theme = {
  light: {
    colors: {
      background: '#f5f5f5',
      fontColor: '#393939',
    },

    fonts: {
      addFonts: 'here',
    },

    fontSizes: {
      addFontSizes: 'here',
    },

    animations: {
      addAnimations: 'here',
    },
  },
  dark: {
    colors: {
      background: '#393939',
      fontColor: '#CFCFCF',
    },

    fonts: {
      addFonts: 'here',
    },

    fontSizes: {
      addFontSizes: 'here',
    },

    animations: {
      addAnimations: 'here',
    },
  },
};

export default theme;
