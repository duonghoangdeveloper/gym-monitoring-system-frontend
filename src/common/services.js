/* eslint-disable no-bitwise */
import { message } from 'antd';
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

export const validateObjectId = id => id.match(/^[0-9a-fA-F]{24}$/);

export const validateNumber = n =>
  typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n);

export const round = (n, decimal = 0) =>
  Math.round(n * 10 ** decimal) / 10 ** decimal;

export const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const getBase64ImageDimensions = base64 =>
  new Promise(resolve => {
    const image = new window.Image();
    image.onload = function() {
      resolve({ height: image.height, width: image.width });
    };
    image.src = base64;
  });

export const validateFile = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export const calculate2LineTails = (theta0, theta1, rectangle) => {
  if (
    theta0 !== null &&
    theta1 !== null &&
    !Number.isNaN(theta0) &&
    !Number.isNaN(theta1) &&
    typeof rectangle?.width === 'number' &&
    typeof rectangle?.height === 'number'
  ) {
    // Line: y = theta0 + theta1 * x

    // y = 0 => x = - theta0 / theta1
    const topCrossPointX = -theta0 / theta1;
    const topCrossPoint =
      topCrossPointX >= 0 && topCrossPointX <= rectangle.width
        ? {
            x: topCrossPointX,
            y: 0,
          }
        : null;

    // x = 0 => y = theta0
    const leftCrossPointY = theta0;
    const leftCrossPoint =
      leftCrossPointY >= 0 && leftCrossPointY <= rectangle.height
        ? {
            x: 0,
            y: leftCrossPointY,
          }
        : null;

    // y = rectangle.height => x = (rectangle.height - theta0) / theta1
    const bottomCrossPointX = (rectangle.height - theta0) / theta1;
    const bottomCrossPoint =
      bottomCrossPointX >= 0 && bottomCrossPointX <= rectangle.width
        ? {
            x: bottomCrossPointX,
            y: rectangle.height,
          }
        : null;

    // x = rectangle.width => y = theta0 + theta1 * rectangle.width
    const rightCrossPointY = theta0 + theta1 * rectangle.width;
    const rightCrossPoint =
      rightCrossPointY >= 0 && rightCrossPointY <= rectangle.height
        ? {
            x: rectangle.width,
            y: rightCrossPointY,
          }
        : null;

    return [
      topCrossPoint,
      leftCrossPoint,
      bottomCrossPoint,
      rightCrossPoint,
    ].filter(_ => _);
  }

  return [];
};
