import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { CreateUserButton } from '../../components/create-user-button';
import { LayoutDashboard } from '../../components/layout-dashboard';
import { UpdateUserButton } from '../../components/update-user-button';

export const Users = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query {
              users(query: { skip: 0, sort: { username: ascending } }) {
                data {
                  _id
                  username
                  displayName
                  email
                  phone
                  gender
                  role
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
          <h1 className="text-3xl">User Management</h1>
          <CreateUserButton />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={users}
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
    dataIndex: 'username',
    key: 'username',
    render: text => <a>{text}</a>,
    title: 'Username',
  },
  {
    dataIndex: 'role',
    key: 'role',
    title: 'Role',
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
    render: user => (
      <Switch unCheckedChildren={<CloseOutlined />} user={user} />
    ),
    title: 'Active/Inactive',
  },
];
