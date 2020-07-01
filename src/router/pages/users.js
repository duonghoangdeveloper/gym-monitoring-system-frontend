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

export const Users = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query Users {
              users {
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
          <Button icon={<PlusOutlined />}>Create User</Button>
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
    dataIndex: 'role',
    key: 'role',
    title: 'Role',
  },

  {
    key: 'action',
    render: (text, record) => (
      <a>
        <EditOutlined />
        &nbsp;&nbsp;Update
      </a>
    ),
    title: 'Update',
  },
  {
    key: 'action',
    render: (text, record) => (
      <a>
        <DeleteOutlined />
        &nbsp;&nbsp;Delete
      </a>
    ),
    title: 'Delete',
  },
];

// const users = [
//   {
//     _id: '5efaafaa3eff6805e0de82c2',
//     displayName: null,
//     email: 'tung@gmail.com',
//     gender: 'MALE',
//     phone: '0909227738',
//     role: 'CUSTOMER',
//     username: 'tungov2',
//   },
//   {
//     _id: '5ef5c04da48fae197c0f8529',
//     displayName: null,
//     email: 'aa@dadxsaddasa.com',
//     gender: 'MALE',
//     phone: '0987678419',
//     role: 'CUSTOMER',
//     username: 'tienvipdinhcao',
//   },
//   {
//     _id: '5ef5c01aa48fae197c0f8526',
//     displayName: null,
//     email: 'aa@dadxsada.com',
//     gender: 'MALE',
//     phone: '0987678419',
//     role: 'CUSTOMER',
//     username: 'tiendinsahkount',
//   },
//   {
//     _id: '5ef5ad6ee1133509746af7f7',
//     displayName: null,
//     email: null,
//     gender: 'MALE',
//     phone: null,
//     role: 'CUSTOMER',
//     username: 'quoctrin',
//   },
//   {
//     _id: '5ef41cfa78701c2924d22bab',
//     displayName: null,
//     email: null,
//     gender: 'MALE',
//     phone: null,
//     role: 'CUSTOMER',
//     username: 'tungov',
//   },
//   {
//     _id: '5ed80cf7044a862d621fc48f',
//     displayName: 'trinnaq1234500000',
//     email: null,
//     gender: 'MALE',
//     phone: null,
//     role: 'SYSTEM_ADMIN',
//     username: 'trinnaqse63387',
//   },
// ].map((user, index) => ({ no: index + 1, ...user }))
