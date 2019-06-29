import { css } from 'styled-components';
import theme from './theme';
import media from './media';

const { colors, fontSizes, fonts } = theme;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  outline: css`
    outline: 1px solid red;
  `,

  inlineLink: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    position: relative;
    transition: ${theme.transition};
    cursor: pointer;
    color: ${props => props.theme.colors.buttonFill};
    &:hover,
    &:focus,
    &:active {
      color: ${props => props.theme.colors.buttonFill};
      outline: 0;
      &:after {
        width: 100%;
      }
    }
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 2px;
      position: relative;
      bottom: 0.2em;
      background-color: ${props => props.theme.colors.buttonFill};
      transition: ${theme.transition};
    }
  `,

  smallButton: css`
    font-family: ${fonts.RiftSoft};
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    color: ${props => props.theme.colors.buttonFill};
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.buttonFill};
    border-radius: ${theme.borderRadius};
    padding: 4px;
    margin: 10px;
    width: 3rem;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${theme.transition};
    &:hover,
    &:focus,
    &:active {
      background: ${props => props.theme.colors.buttonFill};
      color: ${props => props.theme.colors.buttonFontColor};
    }
    &:after {
      display: none !important;
    }
  `,

  bigButton: css`
    font-family: ${fonts.RiftSoft};
    font-weight: 500;
    letter-spacing: 4px;
    color: ${props => props.theme.colors.buttonFontColor};
    background-color: ${props => props.theme.colors.buttonFill};
    border: 1px solid ${props => props.theme.colors.buttonFill};
    border-radius: ${theme.borderRadius};
    padding: 15px 40px;
    margin: 10px;
    width: 18rem;
    font-size: ${fontSizes.small};
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${theme.transition};
    &:hover,
    &:focus,
    &:active {
      background-color: ${props => props.theme.colors.buttonHover};
      color: ${props => props.theme.colors.buttonFill};
    }
    &:after {
      display: none !important;
    }
  `,

  sidePadding: css`
    padding: 0 150px;
    ${media.desktop`padding: 0 100px;`};
    ${media.tablet`padding: 0 50px;`};
    ${media.phablet`padding: 0 25px;`};
  `,
};

export default mixins;
