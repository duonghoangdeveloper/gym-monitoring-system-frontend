import { useApolloClient } from '@apollo/react-hooks';
import { Chart, Line, Point } from 'bizcharts';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';

export const LineChart = ({ data }) => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [warningsSucceeded, setWarningsSucceeded] = useState([]);

  const [groupMonth, setGroupMonth] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');

  const [to, setTo] = useState('');

  const fetchWarningsData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                customer {
                  username
                }
                createdAt
                status
              }
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: skip, sort },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];

      setWarnings(
        fetchedWarningsData.map((warning, index) => ({
          key: warning._id,
          ...warning,
        }))
      );
    } catch (e) {
      // Do something
    }
  };
  const fetchWarningsSucceededData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                customer {
                  username
                }
                createdAt
                status
              }
              total
            }
          }
        `,
        variables: {
          query: {
            createdBetween: { from, to },
            search: { status: 'SUCCEEDED' },
          },
        },
      });

      const fetchedWarningsSucceededData = result?.data?.warnings?.data ?? [];

      setWarningsSucceeded(
        fetchedWarningsSucceededData.map((warning, index) => ({
          key: warning._id,
          ...warning,
        }))
      );
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchWarningsData();
    fetchWarningsSucceededData();
  }, []);
  const resultdata = Object.values(
    warnings.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const month = dateObj.toLocaleString('en-us', {
        // day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[month])
        r[month] = { month, numberOfRisk: 'Number of risk', value: 1 };
      else r[month].value++;
      return r;
    }, {})
  ).reverse();
  const resultdataSucceeded = Object.values(
    warningsSucceeded.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const month = dateObj.toLocaleString('en-us', {
        // day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[month])
        r[month] = { month, numberOfRisk: 'Number of trainer help', value: 1 };
      else r[month].value++;
      return r;
    }, {})
  ).reverse();
  const dataLineChart = [...resultdata, ...resultdataSucceeded];

  // console.log(warnings.forEach(p => p.createdAt));
  // console.log(warnings);
  return (
    <Chart
      autoFit
      data={dataLineChart}
      height={320}
      padding={[10, 20, 50, 40]}
      scale={{ value: { min: 0 } }}
    >
      <Line color="numberOfRisk" position="month*value" shape="smooth" />
      <Point color="numberOfRisk" position="month*value" />
    </Chart>
  );
};
