export const URI =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? 'http://localhost:7777/graphql'
    : 'https://gym-monitoring-system.herokuapp.com/graphql';

export const TOKEN_KEY = 'gym-monitoring-system-token';

export const CONNECTION_STATUSES = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  RECONNECTING: 'RECONNECTING',
};

export const AUTH_ROLES = [
  'CUSTOMER',
  'TRAINER',
  'MANAGER',
  'GYM_OWNER',
  'SYSTEM_ADMIN',
];

export const ALL_ROLES = [
  'GUEST',
  'CUSTOMER',
  'TRAINER',
  'MANAGER',
  'GYM_OWNER',
  'SYSTEM_ADMIN',
];

export const DATE_FORMAT = 'DD/MM/YYYY';
