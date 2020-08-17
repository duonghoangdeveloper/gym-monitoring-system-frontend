import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Input, Switch, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { getColumnSearchProps } from '../common/antd';
import { PAGE_SIZE } from '../common/constants';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';
// import { PackagesCreatePackageButton } from '../components/packages-create-package-button';
import { PackagesDeletePackageButton } from '../components/packages-delete-package-button';
// import { PackagesUpdatePackageButton } from '../components/packages-update-package-button';
import { PaymentPlansCreatePaymentPlanButton } from '../components/payment-plans-create-payment-plan-button';
import { PaymentPlansUpdatePaymentPlanButton } from '../components/payment-plans-update-payment-plan-button';

export const PaymentPlans = () => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState({ name: '' });
  const [searchAll, setSearchAll] = useState('');

  const fetchPaymentPlansData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query SignIn($query: PaymentPlansQueryInput) {
            paymentPlans(query: $query) {
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

      const fetchedPaymentPlansData = result?.data?.paymentPlans?.data ?? [];
      const fetchedPaymentPlansTotal = result?.data?.paymentPlans?.total ?? 0;
      setPaymentPlans(
        fetchedPaymentPlansData.map((paymentPlan, index) => ({
          key: paymentPlan._id,
          no: skip + index + 1,
          ...paymentPlan,
        }))
      );
      setTotal(fetchedPaymentPlansTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentPlansData();
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
      render: (text, paymentPlan) => (
        <PaymentPlansUpdatePaymentPlanButton
          onSuccess={updatedPaymentPlan =>
            setPaymentPlans(
              paymentPlans.map(currentPaymentPlan =>
                currentPaymentPlan._id === updatedPaymentPlan._id
                  ? {
                      ...currentPaymentPlan,
                      ...updatedPaymentPlan,
                    }
                  : currentPaymentPlan
              )
            )
          }
          paymentPlan={paymentPlan}
        />
      ),
      title: 'Update',
    },
    {
      key: 'delete',
      render: (text, _package) => (
        <PackagesDeletePackageButton
          _package={_package}
          // onSuccess={fetchPackagesData}s
        />
      ),
      title: 'Delete',
    },
    {
      key: 'active',
      render: paymentPlan => (
        <Switch
          paymentPlan={paymentPlan}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
      title: 'Delete',
    },
  ];

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <div className="flex items-center">
          <h1 className="text-3xl flex-1 mr-4">Payment Plan Management</h1>
          <Input.Search
            allowClear
            onChange={e => setSearchAll(e.target.value)}
            onSearch={value =>
              setSearch({
                name: value,
              })
            }
            placeholder="Search payment plan"
            style={{ width: '14rem' }}
            value={searchAll}
          />
          <PaymentPlansCreatePaymentPlanButton
            className="ml-4"
            onSuccess={fetchPaymentPlansData}
          />
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={paymentPlans}
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
