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

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: gql`
            query {
              packages(query: { skip: 0, sort: { name: ascending } }) {
                data {
                  _id
                  name
                  price
                  period
                }
              }
            }
          `,
        });

        const fetchedPackages = result?.data?.packages?.data ?? [];
        setPackages(
          fetchedPackages.map((_package, index) => ({
            key: _package._id,
            no: index + 1,
            ..._package,
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
          <h1 className="text-3xl">Package Management</h1>
          <PackagesCreatePackageButton />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={packages}
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
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
    title: 'Name',
  },
  {
    dataIndex: 'price',
    key: 'price',
    title: 'Price',
  },
  {
    dataIndex: 'period',
    key: 'period',
    title: 'Period',
  },
  {
    key: 'update',
    render: (text, _package) => (
      <PackagesUpdatePackageButton _package={_package} />
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
