import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { LayoutDashboard } from '../components/layout-dashboard';
import { UsersUpdateStaffButton } from '../components/users-update-staff-button';

export const Customers = () => {
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
                  skip: 0
                  sort: "username"
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

  const deleteCustomer = () => {
    console.log('This is delete function!!!');
  };

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex justify-between">
          <h1 className="text-3xl">Customer Management</h1>
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
    key: 'update',
    render: (text, user) => <UsersUpdateStaffButton user={user} />,
    title: 'Update',
  },
  {
    key: 'active',
    render: user => (
      <Switch unCheckedChildren={<CloseOutlined />} user={user} />
    ),
    title: 'Active',
  },
];
