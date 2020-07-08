import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { DATE_FORMAT, TIME_FORMAT } from '../common/constants';
import { UsersDeleteFeedbacksButton } from '../components/feedbacks-delete-feedbacks-button';
import { UsersViewFeedbacksButton } from '../components/feedbacks-view-feedbacks-button';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Feedbacks = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query {
              feedbacks(query: { skip: 0, sort: "createdAt" }) {
                data {
                  _id
                  title
                  content
                  createdAt
                }
              }
            }
          `,
        });

        const fetchedFeedbacks = result?.data?.feedbacks?.data ?? [];
        setFeedbacks(
          fetchedFeedbacks.map((feedback, index) => ({
            key: feedback._id,
            no: index + 1,
            ...feedback,
            date: moment(feedback.createdAt).format(DATE_FORMAT),
            time: moment(feedback.createdAt).format(TIME_FORMAT),
          }))
        );
      } catch (e) {
        // Do something
      }
      setLoading(false);
    })();
  }, []);

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex justify-between">
          <h1 className="text-3xl">Feedbacks</h1>
        </div>
        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={feedbacks}
          loading={loading}
        />
      </div>
    </LayoutDashboard>
  );
};

const columns = [
  {
    dataIndex: 'no',
    key: 'no',
    title: 'No',
  },
  {
    dataIndex: 'title',
    key: 'title',
    render: (text, feedback) => (
      <UsersViewFeedbacksButton feedback={feedback} />
    ),
    title: 'Title',
  },
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
    render: text => (
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
    ),
    title: 'Content',
  },
  {
    dataIndex: 'date',
    key: 'date',
    title: 'Date',
  },
  {
    dataIndex: 'time',
    key: 'time',
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
