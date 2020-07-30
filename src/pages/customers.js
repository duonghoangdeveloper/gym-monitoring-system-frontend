import { DeleteOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Input, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { PAGE_SIZE } from '../common/constants';
import { LayoutDashboard } from '../components/layout-dashboard';
import { UsersCreateCustomerButton } from '../components/users-create-customer-button';
import { UsersUpdateStaffButton } from '../components/users-update-staff-button';

export const Customers = () => {
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
              }
              total
            }
          }
        `,
        variables: {
          query: {
            filter: { role: 'CUSTOMER' },
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
          no: index + 1,
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
      key: 'update',
      render: (text, user) => (
        <UsersUpdateStaffButton onSuccess={fetchedCustomers} user={user} />
      ),
      title: 'Update',
    },
    {
      key: 'delete',
      render: (text, user) => (
        <a>
          <DeleteOutlined />
          &nbsp;&nbsp;Delete
        </a>
      ),
      title: 'Delete',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex items-center">
          <h1 className="text-3xl flex-1 mr-4">Customer Management</h1>
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
            placeholder="Search customer"
            style={{ width: '14rem' }}
            value={searchAll}
          />
          <UsersCreateCustomerButton
            className="ml-4"
            onSuccess={fetchedCustomers}
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
