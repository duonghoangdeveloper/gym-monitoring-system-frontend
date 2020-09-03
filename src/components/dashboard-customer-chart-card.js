import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, Field, MiniBar } from 'ant-design-pro/lib/Charts';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import { xorBy } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

export const CustomerChartCard = () => {
  const client = useApolloClient();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const visitData = [];
  const beginDay = new Date().getTime();

  const fectchUserData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query Users($query: UsersQueryInput) {
            users(query: $query) {
              data {
                _id
                createdAt
              }
              total
            }
          }
        `,
        variables: {
          limit: 100000000,
          query: { filter: { role: 'CUSTOMER' } },
          //  search,
        },
      });

      const fetchedUserssData = result?.data?.users?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.users?.total ?? 0;
      setUsers(
        fetchedUserssData.map(_payment => ({
          ..._payment,
        }))
      );
      setTotal(fetchedPaymentsTotal);
      setLoading(false);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fectchUserData();
  }, []);
  // const totalRevenue = payments.forEach(p => p.paymentPlan.price * p.total);
  // console.log(totalRevenue);
  // console.log(Object.keys(payments).forEach(ps => ps.Payment));
  // console.log(users.forEach(p => p._id));
  const resultdata = Object.values(
    users.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const x = dateObj.toLocaleString('en-us', {
        day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[x]) r[x] = { x, y: 1 };
      else r[x].y++;
      return r;
    }, {})
  ).reverse();
  return (
    <ChartCard
      action={
        <Tooltip title="Show all customer at gym center">
          <InfoCircleOutlined />
        </Tooltip>
      }
      contentHeight={46}
      footer={
        <Field label="Daily Customer" value={numeral(10).format('0,0')} />
      }
      loading={loading}
      // loading
      title="Total Customer"
      total={numeral(total).format('0,0')}
    >
      <MiniBar data={resultdata} height={46} />
    </ChartCard>
  );
};
