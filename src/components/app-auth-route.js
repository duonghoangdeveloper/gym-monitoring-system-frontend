import React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { Loading } from './loading';

export const AppAuthRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();

  const loading = false;
  const isSignedIn = false;

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!isSignedIn) {
    history.push({
      pathname: '/login',
    });
    return <Loading fullscreen />;
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};
