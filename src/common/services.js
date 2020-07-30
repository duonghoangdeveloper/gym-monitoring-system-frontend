/* eslint-disable no-bitwise */
// import { SIGN_OUT } from '../apollo/mutation';
import gql from 'graphql-tag';

import { AUTH_ROLES, TOKEN_KEY } from './constants';

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

export const arrayBufferToBase64 = buffer => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const encode = input => {
  const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let chr1;
  let chr2;
  let chr3;
  let enc1;
  let enc2;
  let enc3;
  let enc4;
  let i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (Number.isNaN(chr2)) {
      enc3 = 64;
      enc4 = 64;
    } else if (Number.isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
};

export const generateRolesToView = myRole => {
  const indexRole = AUTH_ROLES.indexOf(myRole);
  return AUTH_ROLES.filter(r => AUTH_ROLES.indexOf(r) <= indexRole);
};

export const hasError = obj =>
  Object.keys(obj).some(key => Array.isArray(obj[key]) && obj[key].length > 0);

export const base64toBlob = dataURI => {
  // Convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // Separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // Write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export const base64ToFile = (dataurl, name = 'avatar') => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n >= 0) {
    u8arr[n] = bstr.charCodeAt(n);
    n -= 1;
  }

  return new File([u8arr], name, { type: mime });
};

export const fileToBase64 = async file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
