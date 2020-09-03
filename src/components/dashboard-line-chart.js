import { useApolloClient } from '@apollo/react-hooks';
import { Spin } from 'antd';
import { Chart, Line, Point } from 'bizcharts';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const LineChart = () => {
  const client = useApolloClient();
  const [spinning, setSpinning] = useState(true);

  const [warnings, setWarnings] = useState([]);
  const [warningsSucceeded, setWarningsSucceeded] = useState([]);

  // const [total, setTotal] = useState(0);
  // const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');

  const [to, setTo] = useState('');

  const fetchWarningsData = async () => {
    setSpinning(true);

    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                createdAt
                status
              }
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: 100000000 },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];

      setWarnings(
        fetchedWarningsData.map(warning => ({
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
            search: { status: 'ACCEPTED' },
          },
        },
      });

      const fetchedWarningsSucceededData = result?.data?.warnings?.data ?? [];

      setWarningsSucceeded(
        fetchedWarningsSucceededData.map(warning => ({
          key: warning._id,
          ...warning,
        }))
      );
      setSpinning(false);
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

  return (
    <div className="chartSpinLoader">
      <div className="flex justify-between">
        <h6 className="text-sm">Report of customer's risk</h6>
      </div>
      <Spin spinning={spinning}>
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
      </Spin>
    </div>
  );
};
