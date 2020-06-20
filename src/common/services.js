// import { SIGN_OUT } from '../apollo/mutation';
import gql from 'graphql-tag';

import { TOKEN_KEY } from './constants';

export const clearAuthMemory = async () => {
  // Clear user token
  localStorage.removeItem(TOKEN_KEY);
  console.log('Clear auth memory!');
};

export const signOut = async client => {
  console.log('[SIGN OUT]');

  try {
    await client.mutate({
      mutation: gql`
        mutation signOut {
          signOut {
            _id
          }
        }
      `,
    });
  } catch (_) {
    console.log('Sign out server fail!', _);
  }
};

// return success or not, not refetch
export const reauth = async client => {
  try {
    const data = await client.query({
      query: gql`
        query Auth {
          auth {
            _id
          }
        }
      `,
    });

    if (data.data.auth._id) {
      console.log('Reauth successfully!');
    } else {
      console.log('Reauth unsuccessfully!');
    }
    return !!data.data.auth._id;
  } catch (_) {
    console.log('Reauth unsuccessfully!');
    return false;
  }
};

export const getTokenFromLocalStorage = () => localStorage.getItem(TOKEN_KEY);

export const connect = async client => {
  try {
    const data = await client.query({
      query: gql`
        query IsConnected {
          isConnected
        }
      `,
    });

    if (data.data.isConnected) {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
};

// export const getSiderMenuSelectedKey = path =>
//   /^\/dashboard\/admins/.test(path)
//     ? 'admins'
//     : /^\/dashboard\/postTopics/.test(path)
//     ? 'postTopics'
//     : null;
