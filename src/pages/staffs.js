import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { LayoutDashboard } from '../components/layout-dashboard';
import { UsersCreateStaffButton } from '../components/users-create-staff-button';
import { UsersUpdateStaffButton } from '../components/users-update-staff-button';

export const Staffs = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [users, setStaffs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query {
              users(
                query: {
                  skip: 0
                  sort: { username: ascending }
                  filter: { role: [TRAINER, MANAGER, GYM_OWNER, SYSTEM_ADMIN] }
                }
              ) {
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

        const fetchedStaffs = result?.data?.users?.data ?? [];
        setStaffs(
          fetchedStaffs.map((user, index) => ({
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
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex justify-between">
          <h1 className="text-3xl">Staff Management</h1>
          <UsersCreateStaffButton />
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
