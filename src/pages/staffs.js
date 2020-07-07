import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { LayoutDashboard } from '../components/layout-dashboard';
import { UsersCreateStaffButton } from '../components/users-create-staff-button';
import { UserEnableDisbleSwitch } from '../components/users-enable-disable-switch';
import { UsersUpdateStaffButton } from '../components/users-update-staff-button';

export const Staffs = ({ role, title }) => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [users, setStaffs] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query getUser($query: UsersQueryInput!) {
              users(query: $query) {
                data {
                  _id
                  username
                  displayName
                  email
                  phone
                  gender
                  isActive
                }
              }
            }
          `,
          variables: {
            query: { filter: { role }, limit: 10, skip, sort },
          },
        });

        const fetchedStaffsData = result?.data?.users?.data ?? [];
        const fetchedStaffsTotal = result?.data?.packages?.total ?? 0;
        setStaffs(
          fetchedStaffsData.map((user, index) => ({
            key: user._id,
            no: index + 1,
            ...user,
          }))
        );
        setTotal(fetchedStaffsTotal);
      } catch (e) {
        // Do something
      }
      setLoading(false);
    })();
  }, [skip, sort]);

  const handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);

    // Pagination
    setSkip((pagination.current - 1) * 10);

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
    {
      dataIndex: 'username',
      key: 'username',
      render: text => <a>{text}</a>,
      sorter: true,
      title: 'Username',
    },
    {
      dataIndex: 'displayName',
      key: 'displayName',
      sorter: true,
      title: 'Display Name',
    },
    {
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      title: 'Email',
    },
    {
      key: 'update',
      render: (text, user) => <UsersUpdateStaffButton user={user} />,
      title: 'Update',
    },
    {
      key: 'active',
      render: user => <UserEnableDisbleSwitch user={user} />,
      title: 'Active',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex justify-between">
          <h1 className="text-3xl"> {title} Management</h1>
          <UsersCreateStaffButton title={title} />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={users}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: Math.floor(skip / 10) + 1,
            pageSize: 10,
            total,
          }}
        />
      </div>
    </LayoutDashboard>
  );
};
