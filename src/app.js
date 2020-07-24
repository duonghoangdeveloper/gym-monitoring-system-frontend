import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';

import { routes } from './common/routes';
import { AppApolloWrapper } from './components/app-apollo-wrapper';
import { AppReduxWrapper } from './components/app-redux-wrapper';
import { AppSocketWrapper } from './components/app-socket-wrapper';

function App() {
  return (
    <HashRouter>
      <AppApolloWrapper>
        <AppSocketWrapper>
          <AppReduxWrapper>
            <Switch>{routes}</Switch>
          </AppReduxWrapper>
        </AppSocketWrapper>
      </AppApolloWrapper>
    </HashRouter>
  );
}

export default App;
