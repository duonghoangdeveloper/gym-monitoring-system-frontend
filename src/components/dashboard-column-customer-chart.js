import { useApolloClient } from '@apollo/react-hooks';
import { Spin } from 'antd';
import { Chart, Interval, Tooltip } from 'bizcharts';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const CustomerColumnChart = ({ data, text }) => {
  const client = useApolloClient();

  const [warnings, setWarnings] = useState([]);

  // const [total, setTotal] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [users, setUsers] = useState([]);

  const [spinning, setSpinning] = useState(true);
  const fectchUserData = async () => {
    setSpinning(true);

    try {
      const result = await client.query({
        query: gql`
          query Users($query: UsersQueryInput) {
            users(query: $query) {
              data {
                _id
                createdAt
              }
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
      setUsers(
        fetchedUserssData.map(user => ({
          ...user,
        }))
      );
      setSpinning(false);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fectchUserData();
  }, []);

  const resultdata = Object.values(
    users.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const month = dateObj.toLocaleString('en-us', {
        // day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[month]) r[month] = { month, users: 1 };
      else r[month].users++;
      return r;
    }, {})
  ).reverse();
  return (
    <div className="chartSpinLoader">
      <div className="flex justify-between ">
        <h6 className="text-sm">Customer registered report</h6>
      </div>
      <Spin spinning={spinning}>
        <Chart
          autoFit
          data={resultdata}
          height={300}
          interactions={['active-region']}
          padding={[30, 30, 30, 50]}
        >
          <Interval position="month*users" />
          <Tooltip shared />
        </Chart>
      </Spin>
    </div>
  );
};
