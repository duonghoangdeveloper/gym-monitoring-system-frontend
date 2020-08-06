import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Input, Switch, Table, Text } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';
import { LayoutDashboard } from '../components/layout-dashboard';
import { PaymentsCreatePaymentButton } from '../components/payments-create-payment-button';
import { PaymentsDeletePaymentButton } from '../components/payments-delete-payment-button';
import { PaymentsUpdatePaymentButton } from '../components/payments-update-payment-button';

export const Payments = () => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState({ name: '' });
  const [searchAll, setSearchAll] = useState('');

  const fetchPaymentsData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query Payments($query: PaymentsQueryInput) {
            payments(query: $query) {
              data {
                _id
                creator {
                  username
                }
                createdAt
                customer {
                  username
                }
                package {
                  _id
                  name
                  price
                  period
                }
              }
              total
            }
          }
        `,
        variables: {
          query: { limit: PAGE_SIZE, skip, sort },
          //  search,
        },
      });

      const fetchedPaymentsData = result?.data?.payments?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.payments?.total ?? 0;
      setPayments(
        fetchedPaymentsData.map((_payment, index) => ({
          key: _payment._id,
          no: skip + index + 1,
          ..._payment,
          date: moment(_payment.createdAt).format(DATE_FORMAT),
          time: moment(_payment.createdAt).format(TIME_FORMAT),
        }))
      );
      setTotal(fetchedPaymentsTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentsData();
  }, [skip, sort]);
  // ,search
  const generateOnSearch = dataIndex => value => {
    setSearch({
      // ...search,
      [dataIndex]: value,
    });
    setSearchAll('');
  };

  // payments.forEach(p => {
  //   console.log(p.customer.username);
  // });
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
      dataIndex: 'customer',
      key: 'customer',
      render: customer => `${customer.username}`,
      sorter: true,
      title: 'Customer',
      // ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'package',
      key: 'package',
      render: _package => `${_package.name}`,
      sorter: true,
      title: 'Package',
      // ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'creator',
      key: 'creator',
      render: creator => `${creator.username}`,
      sorter: true,
      title: 'Creator',
      // ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      title: 'Date',
    },
    {
      dataIndex: 'time',
      key: 'time',
      sorter: true,
      title: 'Time',
    },
    // {
    //   dataIndex: 'period',
    //   key: 'period',
    //   sorter: true,
    //   title: 'Period',
    // },
    {
      key: 'update',
      render: (text, payment) => (
        <PaymentsUpdatePaymentButton
          onSuccess={fetchPaymentsData}
          payment={payment}
        />
      ),
      title: 'Update',
    },

    {
      key: 'delete',
      render: (text, payment) => (
        <PaymentsDeletePaymentButton
          onSuccess={fetchPaymentsData}
          payment={payment}
        />
      ),

      title: 'Delete',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex items-center">
          <h1 className="text-3xl flex-1">Payments Management</h1>

          {/* <Input.Search
            allowClear
            onChange={e => setSearchAll(e.target.value)}
            onSearch={value =>
              setSearch({
                name: value,
              })
            }
            placeholder="Search payment"
            style={{ width: '14rem' }}
            value={searchAll}
          /> */}

          <PaymentsCreatePaymentButton
            className="ml-4"
            onSuccess={fetchPaymentsData}
          />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={payments}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: Math.floor(skip / PAGE_SIZE) + 1,
            pageSize: PAGE_SIZE,
            total,
          }}
          // rowKey={e => e._id}
        />
      </div>
    </LayoutDashboard>
  );
};
