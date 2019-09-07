import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import ProjectScreen from './components/ProjectScreen';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Rubik', // sfgov font
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  breakpoints: {
    values: {
      md: 750, // breakpoint from 3 column to single column (just for reference, not used since there is no 3 column content)
      lg: 1210, // max width of content
    }
  },
  shadows: Array(25).fill('none'), // no shadows
});

function App() {
  return (
    <ThemeProvider theme={theme}><ProjectScreen/></ThemeProvider>
  );
}

export default App;
