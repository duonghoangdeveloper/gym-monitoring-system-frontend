import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import { _403 } from './_403';
import { _404 } from './_404';
import { Cameras } from './cameras';
import { Customers } from './customers';
import { Feedbacks } from './feedbacks';
import { Home } from './home';
import { Packages } from './packages';
import { Profile } from './profile';
import { SignIn } from './sign-in';
import { Staffs } from './staffs';

// Everyone can access
const publicRoutes = [
  {
    component: SignIn,
    exact: true,
    key: 'sign-in',
    path: '/sign-in',
  },
];

// Manager, owner, admin can access
const managerOwnerAdminRoutes = [
  {
    component: Customers,
    exact: true,
    key: 'home',
    path: '/',
  },
  {
    component: Staffs,
    exact: true,
    key: 'trainers',
    path: '/trainers',
  },
  {
    component: Staffs,
    exact: true,
    key: 'managers',
    path: '/managers',
  },
  {
    component: Profile,
    exact: true,
    key: 'profile',
    path: '/profile',
  },
  {
    component: Customers,
    exact: true,
    key: 'customers',
    path: '/customers',
  },
  {
    component: Cameras,
    exact: true,
    key: 'cameras',
    path: '/cameras',
  },
];

export const ownerAdminRoutes = [
  {
    component: Feedbacks,
    exact: true,
    key: 'feedbacks',
    path: '/feedbacks',
  },
  {
    component: Packages,
    exact: true,
    key: 'packages',
    path: '/packages',
  },
  {
    component: Staffs,
    exact: true,
    key: 'owners',
    path: '/owners',
  },
  {
    component: Staffs,
    exact: true,
    key: 'admins',
    path: '/admins',
  },
];

export const adminRoutes = [
  {
    component: Staffs,
    exact: true,
    key: 'admins',
    path: '/admins',
  },
];

export const allRoutes = [
  ...publicRoutes,
  ...managerOwnerAdminRoutes,
  ...ownerAdminRoutes,
  ...adminRoutes,
];

export const routes = [
  ...publicRoutes.map(({ component, exact, key, path }) => (
    <Route component={component} exact={exact} key={key} path={path} />
  )),
  ...managerOwnerAdminRoutes.map(({ component, exact, key, path }) => (
    <AppAuthRoute
      authRoles={['MANAGER', 'GYM_OWNER', 'SYSTEM_ADMIN']}
      component={component}
      exact={exact}
      key={key}
      path={path}
    />
  )),
  ...ownerAdminRoutes.map(({ component, exact, key, path }) => (
    <AppAuthRoute
      authRoles={['GYM_OWNER', 'SYSTEM_ADMIN']}
      component={component}
      exact={exact}
      key={key}
      path={path}
    />
  )),
  ...adminRoutes.map(({ component, exact, key, path }) => (
    <AppAuthRoute
      authRoles={['SYSTEM_ADMIN']}
      component={component}
      exact={exact}
      key={key}
      path={path}
    />
  )),
  <Route component={_403} key="403" path="/unauthorized" />,
  <Route component={_404} key="404" />,
];
