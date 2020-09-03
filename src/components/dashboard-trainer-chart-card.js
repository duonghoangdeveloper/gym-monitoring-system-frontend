import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, MiniProgress } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const TrainerChartCard = () => {
  const client = useApolloClient();
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);

  const fectchTrainerData = async () => {
    setLoading(true);
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
          limit: 100000,
          query: { filter: { role: 'TRAINER' }, isOnline: true },
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
      setTotalOnline(fetchedPaymentsTotal);
      setLoading(false);
    } catch (e) {
      // Do something
    }
  };
  const fectchTrainerOnlineData = async () => {
    setLoading(true);
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
          limit: 100000,
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
      setLoading(false);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fectchTrainerData();
    fectchTrainerOnlineData();
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
            Total Trainer
            <Trend
              flag="up"
              style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
            >
              {total}
            </Trend>
          </span>
        </div>
      }
      loading={loading}
      // loading
      title="Tranier is working"
      total={totalOnline}
    >
      <MiniProgress
        percent={(totalOnline / total) * 100}
        strokeWidth={8}
        target={80}
      />
    </ChartCard>
  );
};
