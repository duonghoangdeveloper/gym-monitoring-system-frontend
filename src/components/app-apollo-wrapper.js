import { ApolloProvider } from '@apollo/react-hooks';
import { Button, message } from 'antd';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import React, { useEffect, useState } from 'react';

import { CONNECTION_STATUSES, TOKEN_KEY, URI } from '../common/constants';
import { ConnectionStatusContext } from '../common/contexts';
import { connect, getTokenFromLocalStorage } from '../common/services';
import { Loading } from './loading';

const key = 'connection-status';

export const AppApolloWrapper = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    CONNECTION_STATUSES.CONNECTING
  );

  async function reconnect() {
    setConnectionStatus(CONNECTION_STATUSES.RECONNECTING);
    const connected = await connect(client);
    if (connected) {
      message.success({
        content: 'Connect to the server succeed!',
        duration: 1.5,
        key,
      });
      setConnectionStatus(CONNECTION_STATUSES.CONNECTED);
      window.location.reload();
    } else {
      setConnectionStatus(CONNECTION_STATUSES.DISCONNECTED);
    }
  }

  async function initializeApolloClient() {
    // Link - onErrorLink
    const onErrorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        for (const graphQLError of graphQLErrors) {
          const {
            message: msg,
            path,
            extensions: {
              exception: { code },
            },
          } = graphQLError;

          // Handle graphql error
          console.log('[GRAPHQL ERROR]');
          console.log('Message:', msg);
          console.log('Path:', path);

          // Handle wrong/expired token
          if (msg === 'Unauthorized' && code === 401) {
            console.log('Token is wrong or expired! Try to get new token!');
            localStorage.removeItem(TOKEN_KEY);
          }
        }
      }
      if (networkError) {
        // Handle network error
        console.log('[NETWORK ERROR]');
        if (networkError.message === 'Failed to fetch') {
          setConnectionStatus(CONNECTION_STATUSES.DISCONNECTED);
        }
      }
    });

    // Link - requestLink
    const requestLink = new ApolloLink(
      (operation, forward) =>
        new Observable(observer => {
          let handle;
          Promise.resolve(operation)
            .then(oper => {
              const token = getTokenFromLocalStorage();
              oper.setContext({
                headers: {
                  Authorization: token ? `Bearer ${token}` : '',
                },
              });
            })
            .then(() => {
              handle = forward(operation).subscribe({
                complete: observer.complete.bind(observer),
                error: observer.error.bind(observer),
                next: observer.next.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));

          return () => {
            if (handle) handle.unsubscribe();
          };
        })
    );

    // Link - uploadLink
    const uploadLink = createUploadLink({
      credentials: 'same-origin',
      uri: URI,
    });

    const apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        watchQuery: {
          errorPolicy: 'ignore',
          fetchPolicy: 'no-cache',
        },
      },
      link: ApolloLink.from([onErrorLink, requestLink, uploadLink]),
    });

    setClient(apolloClient);
  }

  // componentDidMount
  useEffect(() => {
    initializeApolloClient();
  }, []);

  useEffect(() => {
    if (client) {
      connect(client).then(connected => {
        if (connected) {
          setConnectionStatus(CONNECTION_STATUSES.CONNECTED);
        } else {
          setConnectionStatus(CONNECTION_STATUSES.DISCONNECTED);
        }
      });
    }
  }, [client]);

  // Handle connection to graphql server
  useEffect(() => {
    if (connectionStatus === CONNECTION_STATUSES.CONNECTING) {
      // Do nothing
    } else if (connectionStatus === CONNECTION_STATUSES.RECONNECTING) {
      message.loading({
        content: 'Connecting to the server...',
        duration: 0,
        key,
      });
    } else if (connectionStatus === CONNECTION_STATUSES.CONNECTED) {
      // Do nothing
    } else if (connectionStatus === CONNECTION_STATUSES.DISCONNECTED) {
      message.error({
        content: (
          <span>
            Connect to the server failed!{' '}
            <Button type="link" onClick={reconnect}>
              Try again
            </Button>
          </span>
        ),
        duration: 0,
        key,
      });
    }
  }, [connectionStatus]);

  if (!client) {
    return <Loading fullscreen />;
  }

  return (
    <ApolloProvider client={client}>
      <ConnectionStatusContext.Provider
        value={{
          connectionStatus,
          isConnected: connectionStatus === CONNECTION_STATUSES.CONNECTED,
        }}
      >
        {children}
      </ConnectionStatusContext.Provider>
    </ApolloProvider>
  );
};
