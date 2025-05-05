import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --background-color: ${({ theme }) => theme.background};
    --background-secondary: ${({ theme }) => theme.backgroundSecondary};
    --background-tertiary: ${({ theme }) => theme.backgroundTertiary};
    --background-hover: ${({ theme }) => theme.backgroundHover};
    --background-alt: ${({ theme }) => theme.backgroundAlt};
    --text-color: ${({ theme }) => theme.text};
    --text-secondary: ${({ theme }) => theme.textSecondary};
    --text-tertiary: ${({ theme }) => theme.textTertiary};
    --primary-color: ${({ theme }) => theme.primary};
    --primary-hover: ${({ theme }) => theme.primaryHover};
    --border-color: ${({ theme }) => theme.border};
    --input-background: ${({ theme }) => theme.inputBackground};
    --shadow: ${({ theme }) => theme.shadow};
    --shadow-hover: ${({ theme }) => theme.shadowHover};
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollbarTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.scrollbarThumbHover};
  }
`

export default GlobalStyle
