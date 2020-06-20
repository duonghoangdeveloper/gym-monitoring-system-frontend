import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';

import { AppApolloWrapper } from './components/app-apollo-wrapper';
import { AppReduxWrapper } from './components/app-redux-wrapper';
import { routes } from './router/routes';

function App() {
  return (
    <HashRouter>
      <AppApolloWrapper>
        <AppReduxWrapper>
          <Switch>{routes}</Switch>
        </AppReduxWrapper>
      </AppApolloWrapper>
    </HashRouter>
  );
}

export default App;
