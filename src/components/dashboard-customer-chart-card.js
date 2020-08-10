import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import {
  ChartCard,
  Charts,
  Field,
  MiniArea,
  MiniBar,
} from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';

export const CustomerChartCard = () => {
  const client = useApolloClient();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const visitData = [];
  const beginDay = new Date().getTime();

  for (let i = 0; i < 50; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
        'YYYY-MM-DD'
      ),
      y: Math.floor(Math.random() * 100) + 10,
    });
  }
  const fectchUserData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query Users($query: UsersQueryInput) {
            users(query: $query) {
              data {
                _id

                username
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

      const fetchedUserssData = result?.data?.users?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.users?.total ?? 0;
      setUsers(
        fetchedUserssData.map((_payment, index) => ({
          no: skip + index + 1,
          ..._payment,
        }))
      );
      setTotal(fetchedPaymentsTotal);
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
  // console.log(payments.forEach(p => p._id));

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
      title="Total Customer"
      total={numeral(total).format('0,0')}
    >
      <MiniBar data={visitData} height={46} />
    </ChartCard>
  );
};
