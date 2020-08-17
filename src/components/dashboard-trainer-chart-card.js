import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, MiniProgress } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

export const TrainerChartCard = () => {
  const client = useApolloClient();
  // const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
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
              }
              total
            }
          }
        `,
        variables: {
          limit: 100000000,
          query: { filter: { role: 'TRAINER' } },
          //  search,
        },
      });

      // const fetchedUserssData = result?.data?.users?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.users?.total ?? 0;
      // setUsers(
      //   fetchedUserssData.map(_payment => ({
      //     ..._payment,
      //   }))
      // );
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
  // console.log(users.forEach(p => p._id));

  return (
    <ChartCard
      action={
        <Tooltip title="Show all Trainer is working in gym center">
          <InfoCircleOutlined />
        </Tooltip>
      }
      contentHeight={46}
      footer={
        <div>
          <span>
            Trainer
            <Trend
              flag="up"
              style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
            >
              {total}
            </Trend>
          </span>
        </div>
      }
      // loading
      title="Tranier working"
      total={total}
    >
      <MiniProgress percent={78} strokeWidth={8} target={80} />
    </ChartCard>
  );
};
