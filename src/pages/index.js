import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import { _404 } from './_404';
import { Cameras } from './cameras';
import { Customers } from './customers';
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

const authRoutes = [
  {
    component: Staffs,
    exact: true,
    key: 'home',
    path: '/',
  },
  {
    component: Staffs,
    exact: true,
    key: 'staffs',
    path: '/staffs',
  },
  {
    component: Profile,
    exact: true,
    key: 'profile',
    path: '/profile',
  },
  {
    component: Staffs,
    exact: true,
    key: 'staffs',
    path: '/staffs',
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
  {
    component: Packages,
    exact: true,
    key: 'packages',
    path: '/packages',
  },
];

export const allRoutes = [...publicRoutes, ...authRoutes];

export const routes = [
  ...publicRoutes.map(({ component, exact, key, path }) => (
    <Route component={component} exact={exact} key={key} path={path} />
  )),
  ...authRoutes.map(({ component, exact, key, path }) => (
    <AppAuthRoute component={component} exact={exact} key={key} path={path} />
  )),
  <Route component={_404} key="404" />,
];
