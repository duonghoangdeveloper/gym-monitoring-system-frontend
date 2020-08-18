import { useApolloClient } from '@apollo/react-hooks';
import { Table } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Warnings = () => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');

  const fetchWarningsData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                _id
                customer {
                  username
                }
                supporter {
                  username
                }
                content
                createdAt
                status
              }
              total
            }
          }
        `,
        variables: {
          query: {
            limit: PAGE_SIZE,
            skip,
            sort,
          },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.warnings?.total ?? 0;

      setWarnings(
        fetchedWarningsData.map((warning, index) => ({
          key: warning._id,
          no: skip + index + 1,
          ...warning,
          date: moment(warning.createdAt).format(DATE_FORMAT),
          time: moment(warning.createdAt).format(TIME_FORMAT),
        }))
      );
      setTotal(fetchedPaymentsTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchWarningsData();
  }, [skip, sort]);

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
      dataIndex: 'content',
      key: 'content',
      sorter: true,
      title: 'Content',
    },
    {
      dataIndex: 'customer',
      key: 'customer',
      render: customer => `${customer ? customer.username : 'N/A'}`,
      sorter: true,
      title: 'Customer',
      // ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'supporter',
      key: 'supporter',
      render: supporter => `${supporter ? supporter.username : 'N/A'}`,
      sorter: true,
      title: 'Supporter',
      // ...getColumnSearchProps('name', generateOnSearch('name'), search.name),
    },
    {
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      title: 'Status',
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
      title: 'Time',
    },
  ];
  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <div className="flex items-center">
          <h1 className="text-3xl flex-1 mr-4">Warning History</h1>
        </div>

        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={warnings}
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
