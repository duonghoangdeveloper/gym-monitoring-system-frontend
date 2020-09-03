import { useApolloClient } from '@apollo/react-hooks';
import Description from 'ant-design-pro/lib/DescriptionList/Description';
import { Descriptions, List, message, Radio, Space, Tag } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { fromEvent } from 'rxjs';

import { DATE_FORMAT, DATE_TIME_FORMAT } from '../common/constants';
import { SocketContext } from '../common/contexts';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

const IconText = ({ description, text, title }) => (
  <Space>
    {title}
    {text}
    {description}
  </Space>
);

const SORT_BY_ITEMS = [
  {
    label: 'Recent check-in',
    query: {
      sort: '-createdAt',
    },
    value: 'createdAt',
  },
  {
    label: 'Membership expiry date',
    query: {
      sort: 'expiryDate',
    },
    value: 'expiryDate',
  },
];

export const CheckIn = () => {
  const client = useApolloClient();
  const { socket } = useContext(SocketContext);
  const [checkIns, setCheckIns] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState(SORT_BY_ITEMS[0].value);

  const fetchLatestCheckIns = async (sortBy, init = false) => {
    setLoading(true);
    const fetchedCheckIns = await fetchCheckIns(client, {
      limit: 10,
      skip: 0,
      ...SORT_BY_ITEMS.find(({ value }) => value === sortBy)?.query,
    });
    const newCheckIns = init
      ? fetchedCheckIns.data
      : [
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

  const fetchMoreCheckIns = async sortBy => {
    setLoading(true);
    const fetchedCheckIns = await fetchCheckIns(client, {
      limit: 10,
      skip: checkIns.length,
      ...SORT_BY_ITEMS.find(({ value }) => value === sortBy)?.query,
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
    fetchLatestCheckIns(sortBy, true);
  }, [sortBy]);

  useEffect(() => {
    socket.emit('client-start-get-check-in');

    const handleCheckInGet = ({ checkIn: _checkIn }) => {
      if (
        _checkIn?.lastCheckIn?.timestamp !== checkIn?.lastCheckIn?.timestamp
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
  }, [socket.connected, checkIns, checkIn?.lastCheckIn?.timestamp]);

  const handleInfiniteOnLoad = () => {
    if (checkIns.length >= total) {
      message.info('Loaded all data!');
      setHasMore(false);
      return;
    }
    fetchMoreCheckIns(sortBy);
  };

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <h1 className="text-3xl mr-4">Check In</h1>
        <div>
          <div className="flex justify-between mb-4">
            <div className="font-semibold">
              Last update:{' '}
              {checkIn?.updatedAt &&
                moment(checkIn.updatedAt).format('HH:mm:ss')}
            </div>
            <div>
              <span className="mr-3">Sort by:</span>
              <Radio.Group
                onChange={e => {
                  setSortBy(e.target.value);
                }}
                value={sortBy}
              >
                {SORT_BY_ITEMS.map(({ label, value }) => (
                  <Radio.Button key={value} value={value}>
                    {label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>

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
                const expiredDateTemp = moment(item.expiryDate);
                const userCreatedAt = moment(item.user.createdAt);
                const toDays = moment(new Date());
                const diffDays = Math.ceil(
                  (expiredDateTemp - toDays) / (24 * 60 * 60 * 1000)
                );
                const diffCreatedDays = Math.ceil(
                  (toDays - userCreatedAt) / (24 * 60 * 60 * 1000)
                );
                return (
                  <List.Item
                    extra={<img alt="logo" src={item.image.url} width={256} />}
                    key={item.username}
                  >
                    <List.Item.Meta
                      // avatar={<Avatar src={item.avatar} />}
                      title={`Username: ${item.user.username}`}
                    />
                    <div>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Name">
                          {item.user.displayName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Check in at">
                          {moment(item.createdAt).format(DATE_TIME_FORMAT)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Membership expiry date">
                          <div>
                            <span className="mr-3">
                              {moment(item.expiryDate).format(DATE_FORMAT)}
                            </span>
                            {diffDays < 30 &&
                              (diffCreatedDays < 3 ? (
                                <Tag color="blue">New member</Tag>
                              ) : (
                                <Tag color={getColor(diffDays)}>
                                  {diffDays > 0
                                    ? `${diffDays} days left`
                                    : 'Expired'}
                                </Tag>
                              ))}
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
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

const fetchCheckIns = async (client, { limit = 10, skip = 0, sort }) => {
  try {
    console.log(sort);
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
                feedbacks {
                  total
                }
              }
              expiryDate
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
          sort,
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

const getColor = diffDays => {
  if (diffDays > 7) {
    return 'success';
  }
  if (diffDays > 3) {
    return 'gold';
  }
  if (diffDays > 0) {
    return 'orange';
  }
  return 'error';
};
