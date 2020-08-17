import { useApolloClient } from '@apollo/react-hooks';
import { Descriptions, List, message, Space, Tag } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { fromEvent } from 'rxjs';

import { DATE_FORMAT } from '../common/constants';
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
  const IconText = ({ description, text, title }) => (
    <Space>
      {title}
      {text}
      {description}
    </Space>
  );

  const fetchLatestCheckIns = async () => {
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
    socket.emit('client-start-get-check-in');

    const handleCheckInGet = ({ checkIn: _checkIn }) => {
      if (
        _checkIn?.lastCheckIn?._id &&
        _checkIn?.lastCheckIn?._id !== checkIns[0]?._id
      ) {
        fetchLatestCheckIns();
      }
      setCheckIn(_checkIn);
      socket.emit('client-receive-check-in');
    };
    const observable = fromEvent(socket, 'server-send-check-in');
    const subscriber = observable.subscribe({
      next(data) {
        handleCheckInGet(data);
      },
    });

    return () => {
      socket.emit('client-stop-get-check-in');
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
            <Tag
              color="processing"
              style={{
                fontSize: 15,
                marginLeft: 20,
              }}
            >{`Total check-in: ${total}`}</Tag>
          </div>
          ,
          <InfiniteScroll
            hasMore={!loading && hasMore}
            loadMore={handleInfiniteOnLoad}
            pageStart={0}
          >
            <List
              dataSource={checkIns}
              itemLayout="vertical"
              loading={loading}
              renderItem={item => {
                const expiredDateTemp = moment(item.user.expiryDate);
                const toDays = moment(new Date());
                // const diffDuration = expiredDateTemp.diff(toDays);
                const diffDays = Math.round(
                  (expiredDateTemp - toDays) / (24 * 60 * 60 * 1000)
                );
                // console.log(diffDays);
                // console.log(expiredDateTemp);
                if (diffDays >= 1) {
                  return (
                    <List.Item
                      actions={[
                        <IconText
                          text={moment(item.user.expiryDate).format(
                            DATE_FORMAT
                          )}
                          title="Expiration date: "
                        />,
                        <IconText
                          key="list-vertical-message"
                          text={item.user.feedbacks.total}
                          title="Feedback: "
                        />,
                        <IconText
                          key="list-vertical-message"
                          text={diffDays}
                          title="Days left: "
                        />,

                        <Tag color="success">Member</Tag>,
                      ]}
                      extra={
                        <img alt="logo" src={item.image.url} width={256} />
                      }
                      key={item.username}
                    >
                      <List.Item.Meta
                        // avatar={<Avatar src={item.avatar} />}
                        title={`Username: ${item.user.username}`}
                      />
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Name">
                          {item.user.displayName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Role">
                          <a>{item.user.role}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Check in at">
                          {moment(item.createdAt).format(DATE_FORMAT)}
                        </Descriptions.Item>
                        <Descriptions.Item label="This user created account at">
                          {moment(item.user.createdAt).format(DATE_FORMAT)}
                        </Descriptions.Item>
                      </Descriptions>
                    </List.Item>
                  );
                }

                return (
                  <List.Item
                    actions={[
                      <IconText
                        text={moment(item.user.expiryDate).format(DATE_FORMAT)}
                        title="Expiration date: "
                      />,
                      <IconText
                        text={item.user.feedbacks.total}
                        title="Feedback: "
                      />,
                      <IconText
                        key="list-vertical-message"
                        text="0"
                        title="Days left: "
                      />,

                      <Tag color="error">Expired</Tag>,
                    ]}
                    extra={<img alt="logo" src={item.image.url} width={256} />}
                    key={item.username}
                  >
                    <List.Item.Meta
                      // avatar={<Avatar src={item.avatar} />}

                      title={`Username: ${item.user.username}`}
                    />
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Name">
                        {item.user.displayName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Role">
                        <a>{item.user.role}</a>
                      </Descriptions.Item>
                      <Descriptions.Item label="Check in at">
                        {moment(item.createdAt).format(DATE_FORMAT)}
                      </Descriptions.Item>
                      <Descriptions.Item label="This user created account at">
                        {moment(item.user.createdAt).format(DATE_FORMAT)}
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                );
              }}
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
                createdAt
                _id
                role
                username
                displayName
                expiryDate
                feedbacks {
                  total
                }
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
