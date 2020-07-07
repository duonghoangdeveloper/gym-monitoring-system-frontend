import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Divider, Radio, Space, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
  const [search, setSearch] = useState({});

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
          query: { limit: 10, search, skip, sort },
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
      dataIndex: 'name',
      ellipsis: true,
      key: 'name',
      sorter: true,
      title: 'Name',
    },
    {
      dataIndex: 'price',
      ellipsis: true,
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
        <div className="flex justify-between">
          <h1 className="text-3xl">Package Management</h1>
          <PackagesCreatePackageButton onSuccess={fetchPackagesData} />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={packages}
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
