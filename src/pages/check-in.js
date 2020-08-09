import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, List, message, Spin } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

export const CheckIn = () => {
  const client = useApolloClient();
  const { socket } = useContext(SocketContext);
  const [checkIns, setCheckIns] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchLatestCheckIns = async () => {
    console.log(1);
    setLoading(true);
    const fetchedCheckIns = await fetchCheckIns(client, { limit: 10, skip: 0 });
    const newCheckIns = [
      ...fetchedCheckIns.data.filter(
        newCheckIn =>
          !checkIns.some(oldCheckIn => newCheckIn._id === oldCheckIn._id)
      ),
      ...checkIns,
    ];
    if (fetchedCheckIns.total > 0) {
      setTotal(fetchedCheckIns.total);
    }
    setCheckIns(newCheckIns);
    setLoading(false);
  };

  const fetchMoreCheckIns = async () => {
    console.log(2);
    setLoading(true);
    const fetchedCheckIns = await fetchCheckIns(client, {
      limit: 10,
      skip: checkIns.length,
    });
    const newCheckIns = [
      ...checkIns,
      ...fetchedCheckIns.data.filter(
        newCheckIn =>
          !checkIns.some(oldCheckIn => newCheckIn._id === oldCheckIn._id)
      ),
    ];
    if (fetchedCheckIns.total > 0) {
      setTotal(fetchedCheckIns.total);
    }
    setCheckIns(newCheckIns);
    setLoading(false);
  };

  useEffect(() => {
    fetchLatestCheckIns();
  }, []);

  useEffect(() => {
    socket.emit('client-start-view-check-in');

    const receiveScreensHandler = receivedCheckIn => {
      if (
        receivedCheckIn?.lastCheckIn?._id &&
        receivedCheckIn?.lastCheckIn?._id !== checkIns[0]?._id
      ) {
        fetchLatestCheckIns();
      }
      setCheckIn(receivedCheckIn);
      socket.emit('client-receive-check-in');
    };
    const observable = fromEvent(socket, 'server-send-check-in');
    const subscriber = observable.subscribe({
      next(receivedCheckIn) {
        receiveScreensHandler(receivedCheckIn);
      },
    });

    return () => {
      socket.emit('client-stop-view-check-in');
      socket.off('server-send-check-in');
      subscriber.unsubscribe();
    };
  }, [socket.connected, checkIns]);

  const handleInfiniteOnLoad = () => {
    if (checkIns.length >= total) {
      message.info('Loaded all data!');
      setHasMore(false);
      return;
    }
    fetchMoreCheckIns();
  };

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <h1 className="text-3xl mr-4">Check In</h1>
        <div>
          <div className="font-semibold mb-2">
            Last update:{' '}
            {checkIn?.updatedAt && moment(checkIn.updatedAt).format('HH:mm:ss')}
          </div>
          {total}
          <InfiniteScroll
            hasMore={!loading && hasMore}
            loadMore={handleInfiniteOnLoad}
            pageStart={0}
          >
            <List
              dataSource={checkIns}
              itemLayout="vertical"
              loading={loading}
              renderItem={item => (
                <List.Item
                  extra={
                    <img alt="check-in" src={item.image.url} width={256} />
                  }
                  key={item._id}
                >
                  {JSON.stringify(item, null, 2)}
                </List.Item>
              )}
              size="large"
            />
          </InfiniteScroll>
        </div>
      </CommonMainContainer>
    </LayoutDashboard>
  );
};

const fetchCheckIns = async (client, { limit = 10, skip = 0 }) => {
  try {
    const result = await client.query({
      query: gql`
        query CheckIns($query: CheckInsQueryInput!) {
          checkIns(query: $query) {
            data {
              _id
              image {
                url
              }
              user {
                _id
                username
                displayName
              }
              createdAt
            }
            total
          }
        }
      `,
      variables: {
        query: {
          limit,
          skip,
          sort: '-createdAt',
        },
      },
    });

    const fetchedCustomersData = result?.data?.checkIns?.data ?? [];
    const fetchedCustomersTotal = result?.data?.checkIns?.total ?? 0;
    const fetchedCheckIns = {
      data: fetchedCustomersData,
      total: fetchedCustomersTotal,
    };
    return fetchedCheckIns;
  } catch (e) {
    return {
      data: [],
      total: 0,
    };
  }
};
