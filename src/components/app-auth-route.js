import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { CommonPageLoading } from './common-page-loading';

export const AppAuthRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const _id = useSelector(state => state?.user?.me?._id);
  const token = localStorage.getItem(TOKEN_KEY);

  console.log(_id);

  const loading = false;
  const isSignedIn = _id && token;

  if (loading) {
    return <CommonPageLoading fullscreen />;
  }

  if (!isSignedIn) {
    history.push({
      pathname: '/sign-in',
    });
    return <CommonPageLoading fullscreen />;
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};
