import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { useTheme, ThemeProvider } from '@material-ui/core/styles';

import Main from './containers/Main';

function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route path="/*" render={() => <Main />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
