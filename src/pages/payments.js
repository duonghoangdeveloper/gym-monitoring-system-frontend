import { useApolloClient } from '@apollo/react-hooks';
import { Input, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
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
          query SignIn($query: PaymentsQueryInput) {
            payments(query: $query) {
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
          query: { search, skip, sort },
        },
      });

      const fetchedPaymentsData = result?.data?.payments?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.payments?.total ?? 0;
      setPayments(
        fetchedPaymentsData.map((_payment, index) => ({
          key: _payment._id,
          no: skip + index + 1,
          ..._payment,
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
      render: (text, _payment) => (
        <PaymentsUpdatePaymentButton
          _payment={_payment}
          onSuccess={updatedPayment =>
            setPayments(
              payments.map(currentPayment =>
                currentPayment._id === updatedPayment._id
                  ? {
                      ...currentPayment,
                      ...updatedPayment,
                    }
                  : currentPayment
              )
            )
          }
        />
      ),
      title: 'Update',
    },
    {
      key: 'delete',
      render: (text, _payment) => (
        <PaymentsDeletePaymentButton
          _payment={_payment}
          onSuccess={deletedPayment =>
            setPayments(payments =>
              payments.filter(
                currentPayment => currentPayment.key !== deletedPayment._id
              )
            )
          }
        />
      ),
      title: 'Delete',
    },
  ];

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <div className="flex items-center">
          <h1 className="text-3xl flex-1">Payment Management</h1>
          <Input.Search
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
          />
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
            current: Math.floor(skip / 10) + 1,
            pageSize: 10,
            total,
          }}
        />
      </div>
    </LayoutDashboard>
  );
};
