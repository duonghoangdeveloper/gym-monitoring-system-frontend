import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { LayoutDashboard } from '../../components/layout-dashboard';
import { UpdateUserButton } from '../../components/update-user-button';

export const Customer = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query {
              users(
                query: {
                  skip: 2
                  sort: { username: ascending }
                  filter: { role: [CUSTOMER] }
                }
              ) {
                data {
                  _id
                  username
                  displayName
                  email
                  phone
                  gender
                }
              }
            }
          `,
        });

        const fetchedUsers = result?.data?.users?.data ?? [];
        setUsers(
          fetchedUsers.map((user, index) => ({
            key: user._id,
            no: index + 1,
            ...user,
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
      <div className="bg-white shadow p-6">
        <div className="flex justify-between">
          <h1 className="text-3xl">Customer Management</h1>
          <Button icon={<PlusOutlined />}>Create Customer</Button>
        </div>

        <Table columns={columns} dataSource={users} loading={loading} />
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
    dataIndex: 'username',
    key: 'username',
    render: text => <a>{text}</a>,
    title: 'Username',
  },
  {
    dataIndex: 'displayName',
    key: 'displayName',
    title: 'Display Name',
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: 'Email',
  },
  {
    dataIndex: 'phone',
    key: 'phone',
    title: 'Phone',
  },
  {
    dataIndex: 'gender',
    key: 'gender',
    title: 'Gender',
  },

  {
    key: 'action',
    render: (text, user) => <UpdateUserButton user={user} />,
    title: 'Update',
  },
  {
    key: 'action',
    render: (text, record) => (
      <a className="whitespace-no-wrap">
        <DeleteOutlined />
        &nbsp;&nbsp;Delete
      </a>
    ),
    title: 'Delete',
  },
];
