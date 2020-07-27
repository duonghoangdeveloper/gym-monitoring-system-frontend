import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Input, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { PAGE_SIZE } from '../common/constants';
import { LayoutDashboard } from '../components/layout-dashboard';
import { PackagesCreatePackageButton } from '../components/packages-create-package-button';
import { PackagesUpdatePackageButton } from '../components/packages-update-package-button';

export const Packages = () => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState({
    name: '',
  });
  const [searchAll, setSearchAll] = useState('');

  const fetchPackagesData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query SignIn($query: PackagesQueryInput) {
            packages(query: $query) {
              data {
                _id
                name
                price
                period
              }
              total
            }
          }
        `,
        variables: {
          query: { limit: PAGE_SIZE, search, skip, sort },
        },
      });

      const fetchedPackagesData = result?.data?.packages?.data ?? [];
      const fetchedPackagesTotal = result?.data?.packages?.total ?? 0;
      setPackages(
        fetchedPackagesData.map((_package, index) => ({
          key: _package._id,
          no: skip + index + 1,
          ..._package,
        }))
      );
      setTotal(fetchedPackagesTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackagesData();
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
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      title: 'Name',
      ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      title: 'Price',
    },
    {
      dataIndex: 'period',
      key: 'period',
      sorter: true,
      title: 'Period',
    },
    {
      key: 'update',
      render: (text, _package) => (
        <PackagesUpdatePackageButton
          _package={_package}
          onSuccess={updatedPackage =>
            setPackages(
              packages.map(currentPackage =>
                currentPackage._id === updatedPackage._id
                  ? {
                      ...currentPackage,
                      ...updatedPackage,
                    }
                  : currentPackage
              )
            )
          }
        />
      ),
      title: 'Update',
    },
    {
      key: 'active',
      render: _package => (
        <Switch _package={_package} unCheckedChildren={<CloseOutlined />} />
      ),
      title: 'Active',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex items-center">
          <h1 className="text-3xl flex-1">Package Management</h1>
          <Input.Search
            allowClear
            onChange={e => setSearchAll(e.target.value)}
            onSearch={value =>
              setSearch({
                name: value,
              })
            }
            placeholder="Search package"
            style={{ width: '14rem' }}
            value={searchAll}
          />
          <PackagesCreatePackageButton
            className="ml-4"
            onSuccess={fetchPackagesData}
          />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={packages}
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
