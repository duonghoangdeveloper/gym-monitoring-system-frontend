import { DeleteOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Input, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getColumnSearchProps } from '../common/antd';
import { PAGE_SIZE } from '../common/constants';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';
import { TrainerOnlineStatusSwitch } from '../components/trainer-online-status-switch';
import { UsersCreateStaffButton } from '../components/users-create-staff-button';
import { UsersUpdateStaffButton } from '../components/users-update-staff-button';

export const Staffs = () => {
  const { pathname } = useLocation();
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [staffs, setStaffs] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState(INIT_SEARCH);
  const [searchAll, setSearchAll] = useState('');
  const pageRole = generatePageRole(pathname);
  const role = useSelector(state => state?.user?.me?.role);

  const fetchUsersData = async () => {
    setLoading(true);
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
                isOnline
              }
              total
            }
          }
        `,
        variables: {
          query: {
            filter: { role: pageRole },
            limit: PAGE_SIZE,
            search,
            skip,
            sort,
          },
        },
      });
      const fetchedStaffsData = result?.data?.users?.data ?? [];
      const fetchedStaffsTotal = result?.data?.users?.total ?? 0;
      setStaffs(
        fetchedStaffsData.map((user, index) => ({
          key: user._id,
          no: skip + index + 1,
          ...user,
        }))
      );
      setTotal(fetchedStaffsTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsersData();
  }, [skip, sort, search]);

  const generateOnSearch = dataIndex => value => {
    setSearch({
      ...search,
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
      sorter: true,
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
      sorter: true,
      title: 'Email',
      ...getColumnSearchProps('email', generateOnSearch('email'), search.email),
    },
    ...(pageRole === 'TRAINER'
      ? [
          {
            key: 'online',
            render: user => (
              <TrainerOnlineStatusSwitch
                status={user.isOnline}
                type="online"
                user={user}
              />
            ),
            title: 'Online',
          },
        ]
      : []),
    {
      key: 'update',
      render: (text, user) => (
        <UsersUpdateStaffButton onSuccess={fetchUsersData} user={user} />
      ),
      title: 'Update',
    },
    ...(role === 'GYM_OWNER' || role === 'SYSTEM_ADMIN'
      ? [
          {
            key: 'delete',
            render: () => (
              <a>
                <DeleteOutlined />
                &nbsp;&nbsp;Delete
              </a>
            ),
            title: 'Delete',
          },
        ]
      : []),
  ];

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <div className="flex items-center">
          <h1 className="text-3xl flex-1 mr-4">
            {generatePageTitle(pathname)}
          </h1>
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
          <UsersCreateStaffButton
            className="ml-4"
            onSuccess={fetchUsersData}
            role={generatePageRole(pathname)}
          >
            {generateCreateButtonTitle(pathname)}
          </UsersCreateStaffButton>
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={staffs}
          loading={loading}
          onChange={handleTableChange}
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

const generatePageTitle = pathname => {
  switch (pathname) {
    case '/trainers':
      return 'Trainer Management';
    case '/managers':
      return 'Manager Management';
    case '/owners':
      return 'Gym Owner Management';
    case '/admins':
      return 'Admin Management';
    default:
      return null;
  }
};

const generateCreateButtonTitle = pathname => {
  switch (pathname) {
    case '/trainers':
      return 'Create Trainer';
    case '/managers':
      return 'Create Manager';
    case '/owners':
      return 'Create Gym Owner';
    case '/admins':
      return 'Create Admin';
    default:
      return null;
  }
};

const generatePageRole = pathname => {
  switch (pathname) {
    case '/trainers':
      return 'TRAINER';
    case '/managers':
      return 'MANAGER';
    case '/owners':
      return 'GYM_OWNER';
    case '/admins':
      return 'SYSTEM_ADMIN';
    default:
      return null;
  }
};

const INIT_SEARCH = {
  displayName: '',
  email: '',
  username: '',
};
