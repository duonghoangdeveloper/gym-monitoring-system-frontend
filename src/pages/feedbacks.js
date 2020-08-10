import { DeleteOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Input, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';
import { CommonMainContainer } from '../components/common-main-container';
import { CommonTableSearchDropdown } from '../components/common-table-search-dropdown';
import { UsersDeleteFeedbacksButton } from '../components/feedbacks-delete-feedbacks-button';
import { UsersViewFeedbacksButton } from '../components/feedbacks-view-feedbacks-button';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Feedbacks = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState(INITIAL_SEARCH);
  const [searchAll, setSearchAll] = useState('');

  const fetchFeedbacksData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query($query: FeedbacksQueryInput) {
            feedbacks(query: $query) {
              data {
                _id
                content
                createdAt
              }
              total
            }
          }
        `,
        variables: {
          query: { limit: PAGE_SIZE, search, skip, sort },
        },
      });

      const fetchedFeedbacksData = result?.data?.feedbacks?.data ?? [];
      const fetchedFeedbacksTotal = result?.data?.feedbacks?.total ?? 0;

      setFeedbacks(
        fetchedFeedbacksData.map((feedback, index) => ({
          key: feedback._id,
          no: skip + index + 1,
          ...feedback,
          date: moment(feedback.createdAt).format(DATE_FORMAT),
          time: moment(feedback.createdAt).format(TIME_FORMAT),
        }))
      );
      setTotal(fetchedFeedbacksTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacksData();
  }, [skip, sort, search]);

  const generateOnSearch = dataIndex => value => {
    setSearch({
      ...INITIAL_SEARCH,
      [dataIndex]: value,
    });
    setSearchAll('');
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // Pagination
    setSkip((pagination.current - 1) * PAGE_SIZE);

    // Sorter
    const { columnKey, order } = sorter;
    if (order === 'ascend') {
      setSort(columnKey);
    } else if (order === 'descend') {
      setSort(`-${columnKey}`);
    } else {
      setSort('');
    }
  };

  const columns = [
    {
      dataIndex: 'no',
      key: 'no',
      title: 'No',
    },
    // {
    //   dataIndex: 'title',
    //   key: 'title',

    //   sorter: true,
    //   title: 'Title',
    //   ...getColumnSearchProps('title', generateOnSearch('title'), search.title),
    //   render: (text, feedback) => (
    //     <UsersViewFeedbacksButton feedback={feedback} />
    //   ),
    // },
    {
      dataIndex: 'content',
      fixed: true,
      key: 'content',
      onCell: () => ({
        style: {
          maxWidth: 150,
          whiteSpace: 'nowrap',
        },
      }),
      render: (text, feedback) => (
        <div>
          {text}
          <UsersViewFeedbacksButton feedback={feedback} />
        </div>
      ),
      sorter: true,
      title: 'Content',
      ...getColumnSearchProps(
        'content',
        generateOnSearch('content'),
        search.content
      ),
    },
    {
      dataIndex: 'date',
      key: 'createdAt',
      sorter: true,
      title: 'Date',
    },
    {
      dataIndex: 'time',
      key: 'createdAt',
      title: 'Time',
    },
    // {
    //   dataIndex: 'trainer',
    //   key: 'trainer',
    //   title: 'Trainer',
    // },
    {
      key: 'delete',
      render: (text, feedback) => (
        <UsersDeleteFeedbacksButton feedback={feedback} />
      ),
      title: 'Delete',
    },
  ];

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <div className="flex justify-between">
          <h1 className="text-3xl">Feedbacks</h1>

          <Input.Search
            allowClear
            className=".-mt-10"
            onChange={e => setSearchAll(e.target.value)}
            onSearch={value =>
              setSearch({
                content: value,
                title: value,
              })
            }
            placeholder="Search feedback"
            style={{ height: '31px', margin: '12px', width: '16rem' }}
            value={searchAll}
          />
        </div>
        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={feedbacks}
          loading={loading}
          onChange={handleTableChange}
          onRow={rowIndex => ({
            onClick: () => <UsersDeleteFeedbacksButton feedback={feedbacks} />, // click row
          })}
          pagination={{
            current: Math.floor(skip / PAGE_SIZE) + 1,
            pageSize: PAGE_SIZE,
            total,
          }}
        />
      </CommonMainContainer>
    </LayoutDashboard>
  );
};

const INITIAL_SEARCH = { content: '' };
