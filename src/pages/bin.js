import { useApolloClient } from '@apollo/react-hooks';
import { Input, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { PAGE_SIZE } from '../common/constants';
import { LayoutDashboard } from '../components/layout-dashboard';
import { UsersBackupButton } from '../components/users-backup-button';

export const Bin = () => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState(INIT_SEARCH);
  const [searchAll, setSearchAll] = useState('');

  const fetchedCustomers = async () => {
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
                role
              }
              total
            }
          }
        `,
        variables: {
          query: {
            isActive: false,
            limit: PAGE_SIZE,
            search,
            skip,
            sort,
          },
        },
      });

      const fetchedCustomersData = result?.data?.users?.data ?? [];
      const fetchedCustomersTotal = result?.data?.users?.total ?? 0;
      setUsers(
        fetchedCustomersData.map((user, index) => ({
          key: user._id,
          no: skip + index + 1,
          ...user,
        }))
      );
      setTotal(fetchedCustomersTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchedCustomers();
  }, [skip, sort, search]);

  const generateOnSearch = dataIndex => value => {
    setSearch({
      ...search,
      [dataIndex]: value,
    });
    setSearchAll('');
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);

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
    {
      dataIndex: 'username',
      key: 'username',
      render: text => <a>{text}</a>,
      sorter: true,
      title: 'Username',
      ...getColumnSearchProps(
        'username',
        generateOnSearch('username'),
        search.username
      ),
    },
    {
      dataIndex: 'displayName',
      key: 'displayName',
      title: 'Display Name',
      ...getColumnSearchProps(
        'displayName',
        generateOnSearch('displayName'),
        search.displayName
      ),
    },
    {
      dataIndex: 'email',
      key: 'email',
      title: 'Email',
      ...getColumnSearchProps('email', generateOnSearch('email'), search.email),
    },
    {
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      title: 'Role',
    },
    {
      key: 'Backup',
      render: (text, user) => (
        <UsersBackupButton onSuccess={fetchedCustomers} user={user} />
      ),
      title: 'Backup',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex items-center">
          <h1 className="text-3xl flex-1">Bin Management</h1>
          <Input.Search
            allowClear
            onChange={e => setSearchAll(e.target.value)}
            onSearch={value =>
              setSearch({
                displayName: value,
                email: value,
                username: value,
              })
            }
            placeholder="Search user"
            style={{ width: '14rem' }}
            value={searchAll}
          />
        </div>
        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={users}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: Math.floor(skip / PAGE_SIZE) + 1,
            pageSize: PAGE_SIZE,
            total,
          }}
        />
      </div>
    </LayoutDashboard>
  );
};

const INIT_SEARCH = {
  displayName: '',
  email: '',
  username: '',
};
