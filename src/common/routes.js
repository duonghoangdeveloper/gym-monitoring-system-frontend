import React from 'react';
import { Route } from 'react-router-dom';

import { AppAuthRoute } from '../components/app-auth-route';
import { _403 } from '../pages/_403';
import { _404 } from '../pages/_404';
import { Attendance } from '../pages/attendance';
import { Cameras } from '../pages/cameras';
import { CamerasDetection } from '../pages/cameras-detection';
import { CheckIn } from '../pages/check-in';
import { Customers } from '../pages/customers';
import { Dashboard } from '../pages/dashboard';
import { Feedbacks } from '../pages/feedbacks';
import { Home } from '../pages/home';
import { LineLabelling } from '../pages/line-labelling';
import { PaymentPlans } from '../pages/payment-plans';
import { Payments } from '../pages/payments';
import { Profile } from '../pages/profile';
import { SignIn } from '../pages/sign-in';
import { Staffs } from '../pages/staffs';
import { Webcam } from '../pages/webcam';

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
    component: Dashboard,
    exact: true,
    key: 'dashboard',
    path: '/dashboard',
  },
  {
    component: Dashboard,
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
    component: Attendance,
    exact: true,
    key: 'attendance',
    path: '/attendance',
  },
  {
    component: CamerasDetection,
    exact: true,
    key: 'cameras-detection',
    path: '/cameras-detection',
  },
  {
    component: Cameras,
    exact: true,
    key: 'cameras',
    path: '/cameras',
  },
  {
    component: Webcam,
    exact: true,
    key: 'webcam',
    path: '/webcam',
  },
  {
    component: Payments,
    exact: true,
    key: 'payments',
    path: '/payments',
  },
  {
    component: CheckIn,
    exact: true,
    key: 'check-in',
    path: '/check-in',
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
    component: PaymentPlans,
    exact: true,
    key: 'payment-plans',
    path: '/payment-plans',
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
  {
    component: LineLabelling,
    exact: true,
    key: 'line-labelling',
    path: '/line-labelling',
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
  <Route component={_403} key="403" path="/forbidden" />,
  <Route component={_404} key="404" />,
];
